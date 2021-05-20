<template>
  <div class="digital-map">
    <!-- 地图 -->
    <div class="svg-map" id="svgContent">
      <svg
        width="1920"
        height="1080"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        id="svg01"
      >
        <!-- 土层 -->
        <polygon v-for="(items, index) in polygonArr" :key="index" :points="items.polygonPath" :style="items.style"/>
        <!-- 水位线 -->
        <polyline :points="waterLineStr" style="fill:none;stroke:#1B6AB9;stroke-width:0.003;" stroke-dasharray="0.01 0.0025 0.0025 0.0025"/>
      </svg>
      <div class="section-preliminary-division" id="preliminaryDivision">
        <div style="display: flex">
          <div class="section-preliminary-name" :style="'width:' + item.width + 'px'" v-for="(item, index) in preliminaryDivision" :key="index + 'p'">{{item.sectionName}}</div>
        </div>
        <div style="display: flex">
          <div class="section-preliminary-model" :style="'width:' + item.width + 'px'" v-for="(item, index) in preliminaryDivision" :key="index + 'pr'">{{item.sectionModel}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import OpenSeadragon from "openseadragon";
import { svgOverlay } from "../../assets/js/openseadragon-svg-overlay";
import huaifu from '../../assets/json/huaifu.json'
import liuxiandong from '../../assets/json/liuxiandong.json'
import shiyaling from '../../assets/json/shiyaling.json'
import mapConfigure from '../../assets/json/digitalMap.json'
export default {
  data () {
    return {
      showLoading: false, // 加载动画
      viewer: null, // OpenSeadragon对象
      svgNS: 'http://www.w3.org/2000/svg',
      xlinkNS: 'http://www.w3.org/1999/xlink',
      polygonArr: [], // 新算法土层的数据
      pointsArr: [], // 新数据转换的土层数据
      xValueArr: [], // 新数据转换的里程数据
      originalPoint: [], // 新数据土层原始数据
      layerThickness: [], // 当前土层厚度
      tunnelPath: '', // 隧道路径
      tunnelPathArr: { // 隧道数据
        top: [],
        bottom: [],
        center: []
      },
      waterLineArr: [], // 水位线原始数据
      waterLineStr: '', // 水位线数据点
      scale: { // 深圳
        width: 1713,
        height: 600,
      },
      colorArr: [
        [255, 255, 150],
        [255, 125, 200],
        [255, 0, 200],
        [142, 142, 250],
        [200, 28, 50],
        [153, 0, 50],
        [127, 96, 250],
        [102, 0, 100],
        [120, 63, 0],
        [91, 15, 250]
      ],
      excelHightWidth: {
        heightNum: 235,
        widthNum: 30043
      },
      mapData: huaifu,
      pathStr: 'M0.0002 0.4086',
      totalRing: 882,
      tbmNum: 755, // 盾构机编号
      preliminaryDivision: [], // 区段初步划分数据
    }
  },
  methods: {
    // 初始化svg
    initMap () {
      if (this.viewer) {
        this.viewer.destroy()
        this.viewer = null
      }
      this.overlay = {}
      // 加载SVG功能
      svgOverlay(OpenSeadragon); // SVG添加功能到OpenSeadragon Viewer中
      this.viewer = OpenSeadragon({ // 创建 OpenSeadragon 对象
        id: 'svgContent',
        prefixUrl: '../../assets/images/mapImages',
        showNavigationControl: true, // 展示基础控件
        navigationControlAnchor: OpenSeadragon.ControlAnchor.TOP_LEFT, // 控件位置
        showNavigator: false, // 不展示导航图
        navigatorPosition: 'BOTTOM_RIGHT', // 导航所在位置 若为ABSOLUTE，可根据需求指定位置navigatorTop，navigatorLeft，  且会忽略下边两个属性若为其他，则会根据下边的属性或者导航的宽高确定导航的大小
        navigatorSizeRatio: 0.125, // 导航的大小与整体视图的比例 ，  如果设置了导航的宽高  则忽略此属性
        minZoomLevel: 1,  // 最小缩放等级
        maxZoomLevel: 256,  // 最大缩放等级
        defaultZoomLevel: 1, // 初始化放大倍率，默认为0，自动适应元素
        debugMode: false, // 关闭debug
        visibilityRatio: 1.0, // 0-1之间，0代表图片可完全拖出显示框，1代表图片一点也不可以拖出
        constrainDuringPan: false,
        zoomPerClick: 1, //点击一下  放大倍率 设置为1   则代禁用单击事件  同gestureSettingsMouse.clickToZoom
        tileSources: {
          type: 'image',
          url: require('../../assets/images/numberMap.png'),
          buildPyramid: false,
        },
      });
      this.overlay = this.viewer.svgOverlay().node();
      document.querySelector('[title="Zoom in"]').remove();
      document.querySelector('[title="Zoom out"]').remove();
      document.querySelector('[title="Go home"]').remove();
      document.querySelector('[title="Toggle full page"]').remove();
      let svg = document.getElementById("svg01");
      this.overlay.append(svg);
    },
    // 生成土层新算法
    newOriginalData () {
      let data = JSON.parse(JSON.stringify(this.mapData))[0].data
      let pointsArr = [] // 土层数组
      let originalPoint = [] // 土层原始数据
      let heightNum = this.excelHightWidth.heightNum
      let widthNum = this.excelHightWidth.widthNum
      // 处理钻孔桩里程数据
      let xValueArr = []
      for (let key in data[0]) {
        if (key !== 'codeNum') {
          xValueArr.push(this.dataPoint(+(data[0][key] - widthNum) / this.scale.width, 4))
        }
      }
      this.xValueArr = xValueArr
      // 拿取原始数据
      for (let i = 4; i < data.length; i++) {
        let obj = data[i]
        let point = []
        for (let key in obj) {
          if (key !== 'codeNum') {
            point.push(+obj[key])
          }
        }
        originalPoint.push(point)
      }
      this.originalPoint = originalPoint
      // 处理土层数据
      for (let i = 4; i < data.length; i++) {
        let innerObj = data[i]
        let pointArr = []
        for (let key in innerObj) {
          if (key !== 'codeNum') {
            pointArr.push(this.dataPoint(+(heightNum - innerObj[key]) / this.scale.height, 4))
          }
        }
        pointsArr.push(pointArr)
      }
      this.pointsArr = pointsArr
      this.encapsulatePolygons(data)
      this.$nextTick(e => {
        this.getTunnelData()
      })
      this.getWaterLine(data)
    },
    // 封装多边形
    encapsulatePolygons (data) {
      let polygon = []
      // 封装多边形
      for (let i = 0; i < this.pointsArr.length - 1; i++) {
        let topArr = this.pointsArr[i]
        let bottomArr = this.pointsArr[i + 1]
        let pointStr = ``
        // 顶面
        for (let j = 0; j < this.xValueArr.length; j++) {
          pointStr += `${this.xValueArr[j]},${topArr[j]} `
        }
        // 底面
        for (let j = this.xValueArr.length - 1; j > -1; j--) {
          pointStr += `${this.xValueArr[j]},${bottomArr[j]} `
        }
        polygon.push(pointStr)
      }
      let polygonArr = []
      
      for (let i = 0; i < polygon.length; i++) {
        let j = {
          polygonPath: polygon[i],
          name: data[i+5].codeNum,
          color: '',
          style: ''
        }
        polygonArr.push(j)
      }
      // 给每个土层加颜色
      let obj = {}
      let index = 0
      for (let i = 0; i < polygonArr.length; i++) {
        let num = parseInt(polygonArr[i].name / 100)
        if (!obj[num]) {
          obj[num] = this.colorArr[index]
          index ++
        }
      }
      for (let key in obj) {
        let k = 0
        for (let i = 0; i < polygonArr.length; i++) {
          if (parseInt(key) === parseInt(polygonArr[i].name / 100)) {
            polygonArr[i].color = `rgb(${obj[key][0]}, ${obj[key][1]}, ${obj[key][2] - k})`
            polygonArr[i].style = `fill: ${polygonArr[i].color}; stroke: #000; stroke-width:0.0006`
            k += 50
          }
        }
      }
      this.polygonArr = polygonArr
    },
    // 获取隧道数据
    getTunnelData () {
      let arr = JSON.parse(JSON.stringify(this.mapData))[0].data
      let heightNum = this.excelHightWidth.heightNum
      let tunnelStr = ''
      let topTunnel = [] // 隧道顶部数据
      let bottomTunnel = [] // 隧道底部数据
      let topArr = []
      let bottomArr = []
      let centerArr = []
      for (let key in arr[2]) {
        if (key !== 'codeNum') {
          topTunnel.push(+arr[2][key])
        }
      }
      for (let key in arr[3]) {
        if (key !== 'codeNum') {
          bottomTunnel.push(+arr[3][key])
        }
      }
      for (let i = 0; i < topTunnel.length; i++) {
        tunnelStr += ` ${this.xValueArr[i]},${this.dataPoint((heightNum - topTunnel[i]) / this.scale.height, 5)}`
        let numm1 = this.dataPoint((heightNum - topTunnel[i]) / this.scale.height, 4)
        let numm2 = this.dataPoint((heightNum - bottomTunnel[i]) / this.scale.height, 4)
        topArr.push(numm1)
        bottomArr.push(numm2)
        centerArr.push(this.dataPoint((numm1 + numm2) / 2, 4))
      }
      for (let i = bottomTunnel.length - 1; i >= 0; i--) {
        tunnelStr += ` ${this.xValueArr[i]},${this.dataPoint((heightNum - bottomTunnel[i]) / this.scale.height, 5)}`
      }
      this.tunnelPathArr.top = topArr
      this.tunnelPathArr.bottom = bottomArr
      this.tunnelPathArr.center = centerArr
      this.tunnelPath = tunnelStr
      this.addTunnelPath();
    },
    // 生成隧道
    addTunnelPath () {
      let levelArr = this.xValueArr
      let tunnelCenterPathArr = this.tunnelPathArr.center
      // console.log('levelArr', levelArr)
      // console.log('tunnelCenterPathArr',tunnelCenterPathArr)
      let pathStr = this.pathStr // 深圳隧道
      for (let i = 1; i <= levelArr.length - 1; i++) {
        pathStr += `  L${levelArr[i]} ${tunnelCenterPathArr[i]}`
      }
      // 创建path命名空间的SVG元素节点
      let newSvg = (document.createElementNS('http://www.w3.org/2000/svg', 'path'))
      // 给newSvg添加新的属性 类似于键值对
      newSvg.setAttributeNS(null, 'd', pathStr)
      // newSvg.setAttributeNS(null, 'stroke', 'rgba(106,211,119,.5)')
      newSvg.setAttributeNS(null, 'fill', 'none')
      newSvg.setAttributeNS(null, 'stroke-width', `0.015px`)
      // 返回指定 ID 的元素
      let svg01 = document.getElementById('svg01')
      // 向节点的子节点列表的末尾添加新的子节点
      svg01.appendChild(newSvg)
      // 给出指定路径上某长度上的点坐标
      let PrePnt = newSvg.getPointAtLength(0)
      // 获取路径总长度
      let length = newSvg.getTotalLength()

      let height = 0.015
      let totalRing = this.totalRing // 该隧道总环数
      let ringInterval = 1
      let ringWidth = (1 / totalRing) * length * ringInterval // 每一环的宽度
      for (let i = ringInterval; i <= totalRing; i += ringInterval) { // 微分思想
        // 创建rect命名空间的SVG元素节点
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        let Pnt = newSvg.getPointAtLength(length * (i / totalRing))
        let deg = this.getDeg(PrePnt.x, PrePnt.y, Pnt.x, Pnt.y)
        // 给rect添加属性
        rect.setAttributeNS(null, 'data-type', 'ring' + i)
        rect.setAttributeNS(null, 'x', (deg[1] - ringWidth / 2))
        rect.setAttributeNS(null, 'y', (deg[2] - height / 2))
        rect.setAttributeNS(null, 'stroke', '#000')
        rect.setAttributeNS(null, 'stroke-width', '0.0001px')
        rect.setAttributeNS(null, 'height', height)
        rect.setAttributeNS(null, 'width', ringWidth)
        rect.setAttributeNS(null, 'fill', 'rgba(106,211,119,.8)')
        rect.setAttribute('transform', 'rotate(' + deg[0] + ' ' + deg[1] + ' ' + deg[2] + ')')
        rect.onmouseover = e => {
          rect.setAttributeNS(null, 'fill', 'rgb(255, 0, 255)')
        }
        rect.onmouseout = e => {
          rect.setAttributeNS(null, 'fill', 'rgba(106,211,119,.8)')
        }
        rect.onclick = e => {
          this.checkedRing = i
          this.checkedRingModal = true
          this.showRingInfo(i)
        }
        PrePnt = Pnt // 更新初始位置坐标，继续累加s
        svg01.appendChild(rect)
        this.overlay.append(rect)
      }
      this.addSection()
    },
    // 生成区段划分
    addSection() {
      let preliminaryDivision = document.getElementById('preliminaryDivision');
      preliminaryDivision.style.opacity = 1;
      preliminaryDivision.style.zIndex = 100;
      preliminaryDivision.style.display = 'block';
      this.viewer.addOverlay({
        location: new OpenSeadragon.Point(
          0,
          0
        ),
        placement: OpenSeadragon.Placement.TOP_LEFT,
        checkResize: true,
        element: preliminaryDivision
      });
      this.viewer.updateOverlay(
        preliminaryDivision,
        new OpenSeadragon.Point(0, 0),
        OpenSeadragon.Placement.TOP_LEFT
      );
    },
    // 获取角度
    getDeg (x0, y0, x1, y1) {
      let x = (x0 + x1) / 2 // 中间点的x坐标
      let y = (y0 + y1) / 2 // 中间点的y坐标

      let xX = x1 - x0
      let yY = y0 - y1
      // Math.asin返回的值是 -PI/2 到 PI/2 之间的弧度值
      let degrees = Math.abs(Math.asin(yY / Math.sqrt(yY * yY + xX * xX)) * 180 / Math.PI) // 角度 = 弧度*180/PI
      let MyAngle
      if (xX >= 0 && yY >= 0) MyAngle = 270 + (90 - degrees)
      if (xX >= 0 && yY <= 0) MyAngle = degrees
      if (xX <= 0 && yY <= 0) MyAngle = 90 + (90 - degrees)
      if (xX <= 0 && yY >= 0) MyAngle = 180 + degrees
      return [MyAngle, x, y]
    },
    // 水位线
    getWaterLine (data) {
      let waterLine = [] // 水位线数组
      let heightNum = this.excelHightWidth.heightNum
      for (let key in data[1]) {
        if (key !== 'codeNum') waterLine.push(+data[1][key])
      }
      let waterLineStr = ``
      let waterLineArr = [] // 水位线原始数据
      for (let i = 0; i < waterLine.length; i++) {
        waterLineStr += ` ${this.xValueArr[i]},${this.dataPoint((heightNum - waterLine[i]) / this.scale.height, 5)}`
        waterLineArr.push(this.dataPoint((heightNum - waterLine[i]) / this.scale.height, 4))
      }
      this.waterLineArr = waterLineArr
      this.waterLineStr = waterLineStr
    },
    // 保留小数
    dataPoint (data, num) {
      return +parseFloat(data.toFixed(num))
    },
  },
  mounted () {
    this.initMap()
    let overallLength = 1712.13
    this.preliminaryDivision = [
      {
        sectionName: 'sss',
        sectionMileage: 42.484,
        sectionModel: 'sss',
        width: (42.484 / 1712.13) * 1920
      },
      {
        sectionName: 'sss',
        sectionMileage: 48.504,
        sectionModel: 'sss',
        width: (48.504 / 1712.13) * 1920
      },
      {
        sectionName: 'sss',
        sectionMileage: 123.496,
        sectionModel: 'sss',
        width: (123.496 / 1712.13) * 1920
      },
      {
        sectionName: 'sss',
        sectionMileage: 84.796,
        sectionModel: 'sss',
        width: (84.796 / 1712.13) * 1920
      },
      {
        sectionName: 'sss',
        sectionMileage: 664.264,
        sectionModel: 'sss',
        width: (664.264 / 1712.13) * 1920
      }
    ]
    console.log('preliminaryDivision',this.preliminaryDivision)
  },
  computed: {
    ...mapState(["tunnelId"]),
  },
  watch: {
    tunnelId: {
      handler(id) {
        let data = JSON.parse(JSON.stringify(mapConfigure))
        console.log('sid', id)
        if (id === 'dsds21a234545s4d4s21d545d4s') {
          this.mapData = huaifu,
          this.scale = data.huaifu.scale,
          this.colorArr = data.huaifu.colorArr,
          this.excelHightWidth = data.huaifu.excelHightWidth,
          this.pathStr = data.huaifu.pathStr,
          this.totalRing = data.huaifu.totalRing,
          this.tbmNum = data.huaifu.tbmNum
        }
        if (id === 'hjhj2j1hj1h45h21h2j21hj2j12') {
          this.mapData = liuxiandong
          this.scale = data.liuxiandong.scale,
          this.colorArr = data.liuxiandong.colorArr,
          this.excelHightWidth = data.liuxiandong.excelHightWidth,
          this.pathStr = data.liuxiandong.pathStr,
          this.totalRing = data.liuxiandong.totalRing,
          this.tbmNum = data.liuxiandong.tbmNum
        }
        if (id === 'erer21e15r0d1r2d1r5e4r41e21') {
          this.mapData = shiyaling
          this.scale = data.shiyaling.scale,
          this.colorArr = data.shiyaling.colorArr,
          this.excelHightWidth = data.shiyaling.excelHightWidth,
          this.pathStr = data.shiyaling.pathStr,
          this.totalRing = data.shiyaling.totalRing,
          this.tbmNum = data.shiyaling.tbmNum
        }
        let rect = document.getElementsByTagName('rect')
        for(let i = rect.length-1 ; i >=0 ; i-- ) {
          rect[i].parentNode.removeChild(rect[i]);
        }
        this.newOriginalData()
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
.digital-map {
  width: 100%;
  height: calc(100vh - 62px);
  .svg-map {
    width: 1920px;
    height: calc(100vh - 62px);
    margin: auto;
    position: relative;
    #svg01 {
      top: 0;
      left: 0;
      position: absolute;
    }
    .section-preliminary-division {
      position: absolute;
      opacity: 0;
      top: 0;
      left: 0;
      width: 1920px;
      height: 74px;
      .section-preliminary-name {
        height: 37px;
        background: linear-gradient(0deg, rgba(255, 196, 255, 0.2) 0%,rgba(255, 196, 255, 0) 100%);
        border: 1px solid rgba(255, 196, 255, 1);
        // border-image:linear-gradient(0deg, rgba(255, 196, 255, 1) 0%, rgba(255, 196, 255, 0.5) 50%, transparent 100%);
        border-top: none;
        border-left: none;
        line-height: 37px;
        text-align: center;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFC4FF;
      }
      .section-preliminary-model {
        height: 37px;
        line-height: 37px;
        text-align: center;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }
}
</style>