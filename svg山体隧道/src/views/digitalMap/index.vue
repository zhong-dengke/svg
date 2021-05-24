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
    </div>
    <!-- 每一环鼠标移上去的效果 -->
    <div id="ring-overlay-altPP">
      <p>第{{ currentRingInfo.ring }}环</p>
    </div>
    <!-- 初步划分区段 -->
    <div class="section-preliminary-division">
      <div style="display: flex">
        <div class="section-preliminary-name" :style="'width:' + item.width + 'px'" v-for="(item, index) in preliminaryDivision" :key="index + 'p'">{{item.sectionName}}</div>
      </div>
      <div style="display: flex">
        <div class="section-preliminary-model" :style="'width:' + item.width + 'px'" v-for="(item, index) in preliminaryDivision" :key="index + 'pr'">{{item.sectionModel}}</div>
      </div>
    </div>
    <!-- 最终划分区段 -->
    <div class="section-final-division">
      <div style="display: flex">
        <div class="section-final-name" :style="'width:' + item.width + 'px'" v-for="(item, index) in preliminaryDivision" :key="index + 'p'">{{item.sectionName}}</div>
      </div>
      <div style="display: flex">
        <div class="section-final-model" :style="'width:' + item.width + 'px'" v-for="(item, index) in preliminaryDivision" :key="index + 'pr'">{{item.sectionModel}}</div>
      </div>
    </div>
    <!-- 查看按钮 -->
    <div class="buttons">
      <div class="check-button" @click="showFintnessParams = true">查看区段适应度</div>
      <div class="check-button" @click="showConstructionResult = true">查看区段下限长度</div>
      <div class="check-button" @click="showFinalPlanTable = true">查看最终掘进方案</div>
    </div>
    <!-- 区段土层适应度表格展示框 -->
    <div class="show-fintness-params" v-if="showFintnessParams" :style="showFintnessStyle" @mousedown="beginDragFintnessParams">
      <button @click="showFintnessParams = false"></button>
      <table class="section-fintness-table">
        <thead>
          <tr style="font-size: 16px;font-weight: 700">
            <td colspan="7">各区段对应模式适应度</td>
          </tr>
          <tr>
            <td colspan="1">区段</td>
            <td colspan="1">土压式适应度</td>
            <td colspan="1">泥水式适应度</td>
            <td colspan="1">敞开式适应度</td>
            <td colspan="1">单护盾式适应度</td>
            <td colspan="1">双护盾适应度</td>
            <td colspan="1">确定选型</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in fitnessArr" :key="index">
            <td>{{ item.sectionName }}</td>
            <td>{{ item.earthPressureFitness || '/' }}</td>
            <td>{{ item.muddyWaterFitness || '/' }}</td>
            <td>{{ item.openStyleFitness || '/' }}</td>
            <td>{{ item.singleShieldFitness || '/' }}</td>
            <td>{{ item.doubleShieldsFitness || '/' }}</td>
            <td>{{ item.sectionMode }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 区段下限长度计算结果 -->
    <div class="show-construction-result" v-if="showConstructionResult" :style="showResultStyle" @mousedown="beginDragConstructionResult">
      <button @click="showConstructionResult = false"></button>
      <table class="construction-result-table">
        <thead>
          <tr style="font-size: 16px;font-weight: 700">
            <td colspan="5">地层比例及下限长度计算结果</td>
          </tr>
          <tr>
            <td colspan="3">计算参数</td>
            <td colspan="1">考虑工期</td>
            <td colspan="1">考虑造价</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="3">微风化岩层/中风化岩层地层比例</td>
            <td colspan="1">2.0</td>
            <td colspan="1">2.0</td>
          </tr>
          <tr>
            <td colspan="2" rowspan="2">土压式→敞开式下限长度/m</td>
            <td colspan="1" rowspan="1">转换1次</td>
            <td colspan="1" rowspan="1">90</td>
            <td colspan="1" rowspan="1">60</td>
          </tr>
          <tr>
            <td colspan="1" rowspan="1">转换2次</td>
            <td colspan="1" rowspan="1">180</td>
            <td colspan="1" rowspan="1">120</td>
          </tr>
          <tr>
            <td colspan="2" rowspan="2">敞开式→土压式下限长度/m</td>
            <td colspan="1" rowspan="1">转换1次</td>
            <td colspan="1" rowspan="1">28</td>
            <td colspan="1" rowspan="1">56</td>
          </tr>
          <tr>
            <td colspan="1" rowspan="1">转换2次</td>
            <td colspan="1" rowspan="1">30</td>
            <td colspan="1" rowspan="1">60</td>
          </tr>
          <tr>
            <td colspan="3">微风化岩层/强风化岩层地层比例</td>
            <td colspan="1">2.5</td>
            <td colspan="1">3.0</td>
          </tr>
          <tr>
            <td colspan="2" rowspan="2">土压式→敞开式下限长度/m</td>
            <td colspan="1" rowspan="1">转换1次</td>
            <td colspan="1" rowspan="1">90</td>
            <td colspan="1" rowspan="1">60</td>
          </tr>
          <tr>
            <td colspan="1" rowspan="1">转换2次</td>
            <td colspan="1" rowspan="1">180</td>
            <td colspan="1" rowspan="1">120</td>
          </tr>
          <tr>
            <td colspan="2" rowspan="2">敞开式→土压式下限长度/m</td>
            <td colspan="1" rowspan="1">转换1次</td>
            <td colspan="1" rowspan="1">27</td>
            <td colspan="1" rowspan="1">54</td>
          </tr>
          <tr>
            <td colspan="1" rowspan="1">转换2次</td>
            <td colspan="1" rowspan="1">20</td>
            <td colspan="1" rowspan="1">40</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 最终方案列表 -->
    <div class="show-final-plan" v-if="showFinalPlanTable" :style="showPlanStyle" @mousedown="beginDragFinalPlan">
      <button @click="showFinalPlanTable = false"></button>
      <table class="show-final-plan-table">
        <thead>
          <tr>
            <td colspan="3" style="font-size: 16px;font-weight: 700">最终掘进方案</td>
          </tr>
          <tr>
            <td colspan="1">区段</td>
            <td colspan="1">掘进模式</td>
            <td colspan="1">掘进长度/m</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in afterSectionShieldMode" :key="index">
            <td>{{ item.sectionNum }}</td>
            <td>{{ item.shieldMode }}</td>
            <td>{{ item.intervalLength }}</td>
          </tr>
        </tbody>
      </table>
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
      polygonArr: [], // 算法土层的数据
      pointsArr: [], // 数据转换的土层数据
      xValueArr: [], // 数据转换的里程数据
      originalPoint: [], // 数据土层原始数据
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
      showFintnessParams: false, // 适应度列表
      showFintnessStyle: '', // 适应度信息框位置
      beginDragFintnessParams_left: 900, // 信息框图例位置
      beginDragFintnessParams_top: 450, // 信息框图例位置
      fitnessArr: [], // 适应度选型列表
      showConstructionResult: false, // 下限长度计算结果
      showResultStyle: '', // 长度下限结果信息框
      beginDragConstructionResult_left: 100, // 信息框图例位置
      beginDragConstructionResult_top: 500, // 信息框图例位置
      afterSectionShieldMode: [], // 校正后盾构模式
      showFinalPlanTable: false, // 最终方案列表
      showPlanStyle: '', // 最终方案列表信息框位置
      beginDragFinalPlan_left: 500, // 信息框图例位置
      beginDragFinalPlan_top: 500, // 信息框图例位置
      ringOverlayAlt: { // 鼠标移入每一环显示的信息
        style: {
          opacity: 0,
          display: '',
          top: '',
          left: '',
          pointerEvents: ''
        }
      },
      currentRingInfo: { // 鼠标移入某环显示的详细信息
        ring: 0,
      },
      earthPressureWeight: { // 土压各指标层权重
        siteOccupation: 0.048, // 场地占用
        surfaceSubsidence: 0.095, // 地表沉降
        permeabilityCoefficient: 0.308, // 渗透系数
        fineContent: 0.169, // 细粒含量
        undergroundWaterPressure: 0.093, // 地下水压
        drivingEfficiency: 0.095, // 掘进效率
        constructionCost: 0.048, // 建设成本
      },
      muddyWaterWeight: { // 泥水各指标层权重
        siteOccupation: 0.095, // 场地占用
        surfaceSubsidence: 0.048, // 地表沉降
        permeabilityCoefficient: 0.308, // 渗透系数
        fineContent: 0.169, // 细粒含量
        undergroundWaterPressure: 0.093, // 地下水压
        drivingEfficiency: 0.095, // 掘进效率
        constructionCost: 0.048, // 建设成本
      },
      TBMOpenStyleWeight: { // TBM敞开式权重
        compressiveStrength: 0.199, // 抗压强度
        faultFracture: 0.059, // 断层破碎
        completeness: 0.112, // 完整程度
        rockburstDegree: 0.112, // 岩爆程度
        deformationOfSurroundingRock: 0.059, // 围岩变形
        drivingEfficiency: 0.297, // 掘进效率
        constructionCost: 0.163, // 建设成本
      },
      TBMSingleShieldWeight: { // TBM单护盾权重
        compressiveStrength: 0.207, // 抗压强度
        faultFracture: 0.110, // 断层破碎
        completeness: 0.110, // 完整程度
        rockburstDegree: 0.048, // 岩爆程度
        deformationOfSurroundingRock: 0.066, // 围岩变形
        drivingEfficiency: 0.297, // 掘进效率
        constructionCost: 0.163, // 建设成本
      },
      TBMDoubleShieldsWeight: { // TBM双护盾权重
        compressiveStrength: 0.220, // 抗压强度
        faultFracture: 0.075, // 断层破碎
        completeness: 0.075, // 完整程度
        rockburstDegree: 0.047, // 岩爆程度
        deformationOfSurroundingRock: 0.123, // 围岩变形
        drivingEfficiency: 0.297, // 掘进效率
        constructionCost: 0.163, // 建设成本
      },
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
          url: require('../../assets/images/numberMap1.png'),
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
            polygonArr[i].style = `fill: ${polygonArr[i].color};`
            // polygonArr[i].style = `fill: ${polygonArr[i].color}; stroke: #000; stroke-width:0.0006`
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
        rect.setAttributeNS(null, 'fill', 'rgba(131, 182, 255, 0.7)')
        rect.setAttribute('transform', 'rotate(' + deg[0] + ' ' + deg[1] + ' ' + deg[2] + ')')
        rect.onmouseover = e => {
          rect.setAttributeNS(null, 'fill', 'rgb(255, 0, 255)')
          this.currentRingInfo.ring = i;
          this.currentRingInfo.ring = i;
          this.ringOverlayAlt.style.opacity = 1;
          this.ringOverlayAlt.style.display = 'block';
          this.ringOverlayAlt.style.left = `${e.layerX - 100}px`;
          this.ringOverlayAlt.style.top = `${e.layerY - 100}px`;
          this.ringOverlayAlt.style.pointerEvents = 'none';
        }
        rect.onmouseout = e => {
          rect.setAttributeNS(null, 'fill', 'rgba(131, 182, 255, 0.7)')
          this.ringOverlayAlt.style.opacity = 0;
          this.ringOverlayAlt.style.top = -100 + 'px';
          this.ringOverlayAlt.style.left = 100 + 'px';
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
    // 拖动适应度信息框
    beginDragFintnessParams (e) {
      let startX = e.clientX
      let startY = e.clientY
      document.onmousemove = e => {
        e.preventDefault()
        let dragStyleLeft = this.beginDragFintnessParams_left
        let dragStyleTop = this.beginDragFintnessParams_top
        let distX = dragStyleLeft + (e.clientX - startX)
        let distY = dragStyleTop + (e.clientY - startY)
        if (distX < 0) {
          distX = 0
        } else if (distX > 1200) {
          distX = 1200
        }
        if (distY < 0) {
          distY = 0
        } else if (distY > 900) {
          distY = 900
        }
        this.showFintnessStyle = `left:${distX}px;top:${distY}px`
        this.beginDragFintnessParams_left = distX
        this.beginDragFintnessParams_top = distY
        startX = e.clientX
        startY = e.clientY
      }
      document.onmouseup = () => {
        document.onmousemove = null
      }
    },
    // 拖动长度下限计算结果框
    beginDragConstructionResult(e) {
      let startX = e.clientX
      let startY = e.clientY
      document.onmousemove = e => {
        e.preventDefault()
        let dragStyleLeft = this.beginDragConstructionResult_left
        let dragStyleTop = this.beginDragConstructionResult_top
        let distX = dragStyleLeft + (e.clientX - startX)
        let distY = dragStyleTop + (e.clientY - startY)
        if (distX < 0) {
          distX = 0
        } else if (distX > 1100) {
          distX = 1100
        }
        if (distY < 0) {
          distY = 0
        } else if (distY > 650) {
          distY = 650
        }
        this.showResultStyle = `left:${distX}px;top:${distY}px`
        this.beginDragConstructionResult_left = distX
        this.beginDragConstructionResult_top = distY
        startX = e.clientX
        startY = e.clientY
      }
      document.onmouseup = () => {
        document.onmousemove = null
      }
    },
    // 拖动最终方案列表
    beginDragFinalPlan (e) {
      let startX = e.clientX
      let startY = e.clientY
      document.onmousemove = e => {
        e.preventDefault()
        let dragStyleLeft = this.beginDragFinalPlan_left
        let dragStyleTop = this.beginDragFinalPlan_top
        let distX = dragStyleLeft + (e.clientX - startX)
        let distY = dragStyleTop + (e.clientY - startY)
        if (distX < 0) {
          distX = 0
        } else if (distX > 1600) {
          distX = 1600
        }
        if (distY < 0) {
          distY = 0
        } else if (distY > 900) {
          distY = 900
        }
        this.showPlanStyle = `left:${distX}px;top:${distY}px`
        this.beginDragFinalPlan_left = distX
        this.beginDragFinalPlan_top = distY
        startX = e.clientX
        startY = e.clientY
      }
      document.onmouseup = () => {
        document.onmousemove = null
      }
    },
    // 时间戳转换为时间
    timestampToTime (timestamp) {
      let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '/';	    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
      let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
      let h = (date.getHours() < 10 ? '0' + date.getHours(): date.getHours() ) + ':';
      let m = (date.getMinutes() < 10 ? '0' + date.getMinutes(): date.getMinutes()) + ':';
      let s = (date.getSeconds() < 10 ? '0' + date.getSeconds(): date.getSeconds());
      let fullDate = Y + M + D + h + m + s;
      return fullDate;
    },
    /**
     * 泥水模式渗透系数，细粒含量，地下水压的隶属度函数
     * @param permeability 泥水渗透系数
     * @param fine 泥水细粒含量
     * @param pressure 泥水地下水压
     */
    muddyWaterMembership (data) {
      let permeabilityCoefficient = 0 // eslint-disable-line no-unused-vars
      let fineContent = 0 // eslint-disable-line no-unused-vars
      let undergroundWaterPressure = 0 // eslint-disable-line no-unused-vars
      // 判断渗透系数隶属度函数
      if (data.permeabilityCoefficient < Math.pow(10, -7)) {
        permeabilityCoefficient = 0
      }
      if (data.permeabilityCoefficient >= Math.pow(10, -7) && data.permeabilityCoefficient < Math.pow(10, -4)) {
        permeabilityCoefficient = (data.permeabilityCoefficient - Math.pow(10, -7)) / (Math.pow(10, -4) - Math.pow(10, -7))
      }
      if (data.permeabilityCoefficient > Math.pow(10, -4)) {
        permeabilityCoefficient = 1
      }
      // 判断细粒含量隶属度函数
      if (data.fineContent < 0.4) {
        fineContent = 1
      }
      if (data.fineContent > 0.4 && data.fineContent < 0.6) {
        fineContent = (0.6 - data.fineContent) / (0.6 - 0.4)
      }
      if (data.fineContent > 0.6) {
        fineContent = 0
      }
      // 判断地下水压隶属度函数
      if (data.undergroundWaterPressure < 0.3) {
        undergroundWaterPressure = data.undergroundWaterPressure / 0.3
      }
      if (data.undergroundWaterPressure >= 0.3) {
        undergroundWaterPressure = 1
      }
      return [permeabilityCoefficient, fineContent, undergroundWaterPressure]
    },
    /**
     * 土压模式渗透系数，细粒含量，地下水压的隶属度函数
     * @param permeability 土压渗透系数
     * @param fine 土压细粒含量
     * @param pressure 土压地下水压
     */
    earthPressureMembership (data) {
      let permeabilityCoefficient = 0 // eslint-disable-line no-unused-vars
      let fineContent = 0 // eslint-disable-line no-unused-vars
      let undergroundWaterPressure = 0 // eslint-disable-line no-unused-vars
      // 判断渗透系数隶属度函数
      if (data.permeabilityCoefficient < Math.pow(10, -7)) {
        permeabilityCoefficient = 1
      }
      if (data.permeabilityCoefficient >= Math.pow(10, -7) && data.permeabilityCoefficient < Math.pow(10, -4)) {
        permeabilityCoefficient = (Math.pow(10, -4) - data.permeabilityCoefficient) / (Math.pow(10, -4) - Math.pow(10, -7))
      }
      if (data.permeabilityCoefficient > Math.pow(10, -4)) {
        permeabilityCoefficient = 0
      }
      // 判断细粒含量隶属度函数
      if (data.fineContent < 0.4) {
        fineContent = data.fineContent / 0.4
      }
      if (data.fineContent >= 0.4) {
        fineContent = 1
      }
      // 判断地下水压隶属度函数
      if (data.undergroundWaterPressure < 0.3) {
        undergroundWaterPressure = 1
      }
      if (data.undergroundWaterPressure > 0.3 && data.undergroundWaterPressure < 0.4) {
        undergroundWaterPressure = (0.4 - data.undergroundWaterPressure) / (0.4 - 0.3)
      }
      if (data.undergroundWaterPressure >= 0.4) {
        undergroundWaterPressure = 0
      }
      return [permeabilityCoefficient, fineContent, undergroundWaterPressure]
    },
    /**
     * tbm双盾构抗压强度，断层破碎，完整程度，岩爆程度，围岩变形的隶属度函数
     * @param compressive 双盾构抗压强度
     * @param fault 双盾构断层破碎
     * @param complete 双盾构完整程度
     * @param rockburst 双盾构岩爆程度
     * @param deformation 双盾构围岩变形
     */
    tbmDoubleShieldsMembership (data) {
      let compressiveStrength = 0 // eslint-disable-line no-unused-vars
      let faultFracture = 0 // eslint-disable-line no-unused-vars
      let completeness = 0 // eslint-disable-line no-unused-vars
      let rockburstDegree = 0 // eslint-disable-line no-unused-vars
      let deformationOfSurroundingRock = 0 // eslint-disable-line no-unused-vars
      // 判断抗压强度隶属度函数
      if (data.uniaxialCompressiveStrength < 10 || data.uniaxialCompressiveStrength >= 140) {
        compressiveStrength = 0
      }
      if (data.uniaxialCompressiveStrength >= 10 && data.uniaxialCompressiveStrength < 30) {
        compressiveStrength = (data.uniaxialCompressiveStrength - 10) / (30 - 10)
      }
      if (data.uniaxialCompressiveStrength >= 30 && data.uniaxialCompressiveStrength < 100) {
        compressiveStrength = 1
      }
      if (data.uniaxialCompressiveStrength >= 100 && data.uniaxialCompressiveStrength < 140) {
        compressiveStrength = (140 - data.uniaxialCompressiveStrength) / (140 - 100)
      }
      // 判断断层破碎隶属度函数
      if (data.faultFracture < 5) {
        faultFracture = 1
      }
      if (data.faultFracture >= 5 && data.faultFracture < 30) {
        faultFracture = (30 - data.faultFracture) / (30 - 5)
      }
      if (data.faultFracture >= 30) {
        faultFracture = 0
      }
      // 判断完整程度隶属度函数
      if (data.completeness < 0.35 || data.completeness >= 0.85) {
        completeness = 0
      }
      if (data.completeness >= 0.35 && data.completeness < 0.45) {
        completeness = (data.completeness - 0.35) / (0.45 - 0.35)
      }
      if (data.completeness >= 0.45 && data.completeness < 0.75) {
        completeness = 1
      }
      if (data.completeness >= 0.75 && data.completeness < 0.85) {
        completeness = (0.85 - data.completeness) / (0.85 - 0.75)
      }
      // 判断岩爆程度隶属度函数
      if (data.rockburstDegree < 0.3) {
        rockburstDegree = 1
      }
      if (data.rockburstDegree >= 0.3 && data.rockburstDegree < 0.55) {
        rockburstDegree = (0.55 - data.rockburstDegree) / (0.55 - 0.3)
      }
      if (data.rockburstDegree >= 0.55) {
        rockburstDegree = 0
      }
      // 判断围岩变形隶属度函数
      if (data.deformationOfSurroundingRock < 0.5) {
        deformationOfSurroundingRock = 0
      }
      if (data.deformationOfSurroundingRock >= 0.5 && data.deformationOfSurroundingRock < 1) {
        deformationOfSurroundingRock = (data.deformationOfSurroundingRock - 0.25) / (1 - 0.25)
      }
      if (data.deformationOfSurroundingRock >= 1) {
        deformationOfSurroundingRock = 1
      }
      return [compressiveStrength, faultFracture, completeness, rockburstDegree, deformationOfSurroundingRock]
    },
    /**
     * tbm单盾构抗压强度，断层破碎，完整程度，岩爆程度，围岩变形的隶属度函数
     * @param compressive 单盾构抗压强度
     * @param fault 单盾构断层破碎
     * @param complete 单盾构完整程度
     * @param rockburst 单盾构岩爆程度
     * @param deformation 单盾构围岩变形
     */
    tbmSingleShieldMembership (data) {
      let compressiveStrength = 0 // eslint-disable-line no-unused-vars
      let faultFracture = 0 // eslint-disable-line no-unused-vars
      let completeness = 0 // eslint-disable-line no-unused-vars
      let rockburstDegree = 0 // eslint-disable-line no-unused-vars
      let deformationOfSurroundingRock = 0 // eslint-disable-line no-unused-vars
      // 判断抗压强度隶属度函数
      if (data.uniaxialCompressiveStrength < 5 || data.uniaxialCompressiveStrength >= 120) {
        compressiveStrength = 0
      }
      if (data.uniaxialCompressiveStrength >= 5 && data.uniaxialCompressiveStrength < 10) {
        compressiveStrength = (data.uniaxialCompressiveStrength - 5) / (10 - 5)
      }
      if (data.uniaxialCompressiveStrength >= 10 && data.uniaxialCompressiveStrength < 60) {
        compressiveStrength = 1
      }
      if (data.uniaxialCompressiveStrength >= 60 && data.uniaxialCompressiveStrength < 120) {
        compressiveStrength = (120 - data.uniaxialCompressiveStrength) / (120 - 60)
      }
      // 判断断层破碎隶属度函数
      if (data.faultFracture < 2) {
        faultFracture = 1
      }
      if (data.faultFracture >= 2 && data.faultFracture < 15) {
        faultFracture = (15 - data.faultFracture) / (15 - 2)
      }
      if (data.faultFracture >= 15) {
        faultFracture = 0
      }
      // 判断完整程度隶属度函数
      if (data.completeness < 0.15 || data.completeness >= 0.85) {
        completeness = 0
      }
      if (data.completeness >= 0.15 && data.completeness < 0.45) {
        completeness = (data.completeness - 0.15) / (0.45 - 0.15)
      }
      if (data.completeness >= 0.45 && data.completeness < 0.75) {
        completeness = 1
      }
      if (data.completeness >= 0.75 && data.completeness < 0.85) {
        completeness = (0.85 - data.completeness) / (0.85 - 0.75)
      }
      // 判断岩爆程度隶属度函数
      if (data.rockburstDegree < 0.3) {
        rockburstDegree = 1
      }
      if (data.rockburstDegree >= 0.3 && data.rockburstDegree < 0.55) {
        rockburstDegree = (0.55 - data.rockburstDegree) / (0.55 - 0.3)
      }
      if (data.rockburstDegree >= 0.55) {
        rockburstDegree = 0
      }
      // 判断围岩变形隶属度函数
      if (data.deformationOfSurroundingRock < 0.5) {
        deformationOfSurroundingRock = 0
      }
      if (data.deformationOfSurroundingRock >= 0.5 && data.deformationOfSurroundingRock < 1) {
        deformationOfSurroundingRock = (data.deformationOfSurroundingRock - 0.25) / (1 - 0.25)
      }
      if (data.deformationOfSurroundingRock >= 1) {
        deformationOfSurroundingRock = 1
      }
      return [compressiveStrength, faultFracture, completeness, rockburstDegree, deformationOfSurroundingRock]
    },
    /**
     * tbm敞开式抗压强度，断层破碎，完整程度，岩爆程度，围岩变形的隶属度函数
     * @param compressive 敞开式抗压强度
     * @param fault 敞开式断层破碎
     * @param complete 敞开式完整程度
     * @param rockburst 敞开式岩爆程度
     * @param deformation 敞开式围岩变形
     */
    tbmOpenStyleMembership (data) {
      let compressiveStrength = 0 // eslint-disable-line no-unused-vars
      let faultFracture = 0 // eslint-disable-line no-unused-vars
      let completeness = 0 // eslint-disable-line no-unused-vars
      let rockburstDegree = 0 // eslint-disable-line no-unused-vars
      let deformationOfSurroundingRock = 0 // eslint-disable-line no-unused-vars
      // 判断抗压强度隶属度函数
      if (data.uniaxialCompressiveStrength < 30 || data.uniaxialCompressiveStrength >= 250) {
        compressiveStrength = 0
      }
      if (data.uniaxialCompressiveStrength >= 30 && data.uniaxialCompressiveStrength < 50) {
        compressiveStrength = (data.uniaxialCompressiveStrength - 30) / (50 - 30)
      }
      if (data.uniaxialCompressiveStrength >= 50 && data.uniaxialCompressiveStrength < 150) {
        compressiveStrength = 1
      }
      if (data.uniaxialCompressiveStrength >= 150 && data.uniaxialCompressiveStrength < 250) {
        compressiveStrength = (250 - data.uniaxialCompressiveStrength) / (250 - 150)
      }
      // 判断断层破碎隶属度函数
      if (data.faultFracture < 5) {
        faultFracture = 1
      }
      if (data.faultFracture >= 5 && data.faultFracture < 40) {
        faultFracture = (40 - data.faultFracture) / (40 - 5)
      }
      if (data.faultFracture >= 40) {
        faultFracture = 0
      }
      // 判断完整程度隶属度函数
      if (data.completeness < 0.35 || data.completeness >= 0.85) {
        completeness = 0
      }
      if (data.completeness >= 0.35 && data.completeness < 0.55) {
        completeness = (data.completeness - 0.35) / (0.55 - 0.35)
      }
      if (data.completeness >= 0.55 && data.completeness < 0.75) {
        completeness = 1
      }
      if (data.completeness >= 0.75 && data.completeness < 0.85) {
        completeness = (0.85 - data.completeness) / (0.85 - 0.75)
      }
      // 判断岩爆程度隶属度函数
      if (data.rockburstDegree < 0.2) {
        rockburstDegree = 1
      }
      if (data.rockburstDegree >= 0.2 && data.rockburstDegree < 0.55) {
        rockburstDegree = (0.55 - data.rockburstDegree) / (0.55 - 0.2)
      }
      if (data.rockburstDegree >= 0.55) {
        rockburstDegree = 0
      }
      // 判断围岩变形隶属度函数
      if (data.deformationOfSurroundingRock < 0.25) {
        deformationOfSurroundingRock = 0
      }
      if (data.deformationOfSurroundingRock >= 0.25 && data.deformationOfSurroundingRock < 1) {
        deformationOfSurroundingRock = (data.deformationOfSurroundingRock - 0.25) / (1 - 0.25)
      }
      if (data.deformationOfSurroundingRock >= 1) {
        deformationOfSurroundingRock = 1
      }
      return [compressiveStrength, faultFracture, completeness, rockburstDegree, deformationOfSurroundingRock]
    },
  },
  mounted () {
    this.initMap()
    this.ringOverlayAlt = document.getElementById('ring-overlay-altPP');
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
      },
      {
        sectionName: 'sss',
        sectionMileage: 447.716,
        sectionModel: 'sss',
        width: (447.716 / 1712.13) * 1920
      },
      {
        sectionName: 'sss',
        sectionMileage: 40.936,
        sectionModel: 'sss',
        width: (40.936 / 1712.13) * 1920
      },
      {
        sectionName: 'sss',
        sectionMileage: 128.656,
        sectionModel: 'sss',
        width: (128.656 / 1712.13) * 1920
      },
      {
        sectionName: 'sss',
        sectionMileage: 106.296,
        sectionModel: 'sss',
        width: (106.296 / 1712.13) * 1920
      }
    ]
    this.fitnessArr = [
      {
        sectionName :'sss',
        earthPressureFitness: 'sss',
        muddyWaterFitness: 'sss',
        openStyleFitness: 'sss',
        singleShieldFitness: 'sss',
        doubleShieldsFitness: 'sss',
        sectionMode: 'sss'
      }
    ]
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
  position: relative;
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
  }
  #ring-overlay-altPP {
    position: absolute;
    width: 200px;
    height: 100px;
    z-index: 2000;
    background: url('../../assets/images/artBoardKuang.png');
    background-size: 100% 100%;
    opacity: 0;
    color: #fff;
    font-size: 0.18rem;
    p {
      position: absolute;
      top: -3px;
      left: 70px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      text-align: center;
      font-weight: 400;
    }
  }
  .section-preliminary-division {
    position: absolute;
    // opacity: 0;
    top: 0;
    left: 0;
    width: 1920px;
    height: 74px;
    .section-preliminary-name {
      height: 37px;
      background: linear-gradient(0deg, rgba(131, 182, 255, 0.2) 0%,rgba(131, 182, 255, 0) 100%);
      border: 1px solid rgba(131, 182, 255, 1);
      border-image: -webkit-linear-gradient(0deg, rgba(131, 182, 255, 1), rgba(131, 182, 255, 0.1))10 1; /* 控制边框颜色渐变 */
      border-image: -moz-linear-gradient(0deg,rgba(131, 182, 255, 1), rgba(131, 182, 255, 0.1))10 1;
      border-image: linear-gradient(0deg,rgba(131, 182, 255, 1), rgba(131, 182, 255, 0.1))10 1; /* 标准的必须写在最后 */
      border-top: none;
      border-left: none;
      line-height: 37px;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #83B6FF;
    }
    .section-preliminary-name:nth-child(1) {
      border: 1px solid rgba(131, 182, 255, 1);
      border-image: -webkit-linear-gradient(0deg, rgba(131, 182, 255, 1), rgba(131, 182, 255, 0.1))10 1; /* 控制边框颜色渐变 */
      border-image: -moz-linear-gradient(0deg,rgba(131, 182, 255, 1), rgba(131, 182, 255, 0.1))10 1;
      border-image: linear-gradient(0deg,rgba(131, 182, 255, 1), rgba(131, 182, 255, 0.1))10 1; /* 标准的必须写在最后 */
      border-top: none;
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
  .section-final-division {
    position: absolute;
    top: 74px;
    left: 0;
    width: 1920px;
    height: 74px;
    .section-final-name {
      height: 37px;
      background: linear-gradient(0deg, rgba(255, 196, 255, 0.2) 0%,rgba(255, 196, 255, 0) 100%);
      border: 1px solid rgba(255, 196, 255, 1);
      border-image: -webkit-linear-gradient(0deg, rgba(255, 196, 255, 1), rgba(255, 196, 255, 0.1))10 1; /* 控制边框颜色渐变 */
      border-image: -moz-linear-gradient(0deg,rgba(255, 196, 255, 1), rgba(255, 196, 255, 0.1))10 1;
      border-image: linear-gradient(0deg,rgba(255, 196, 255, 1), rgba(255, 196, 255, 0.1))10 1; /* 标准的必须写在最后 */
      border-top: none;
      border-left: none;
      line-height: 37px;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFC4FF;
    }
    .section-final-name:nth-child(1) {
      border: 1px solid rgba(255, 196, 255, 1);
      border-image: -webkit-linear-gradient(0deg, rgba(255, 196, 255, 1), rgba(255, 196, 255, 0.1))10 1; /* 控制边框颜色渐变 */
      border-image: -moz-linear-gradient(0deg,rgba(255, 196, 255, 1), rgba(255, 196, 255, 0.1))10 1;
      border-image: linear-gradient(0deg,rgba(255, 196, 255, 1), rgba(255, 196, 255, 0.1))10 1; /* 标准的必须写在最后 */
      border-top: none;
    }
    .section-final-model {
      height: 37px;
      line-height: 37px;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .buttons {
    position: absolute;
    display: flex;
    top: 150px;
    right: 10px;
    width: 450px;
    height: 37px;
    .check-button {
      width: 142px;
      height: 37px;
      border-radius: 4px;
      border: 1px solid #45699C;
      margin-right: 10px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 34px;
      cursor: pointer;
    }
    .check-button:hover {
      background: #83B6FF;
    }
  }
  .show-fintness-params {
    width: 702px;
    background: #2B4364;
    position: absolute;
    border: 1px solid #FFED9B;
    top: 450px;
    left: 900px;
    cursor: pointer;
    button {
      position: absolute;
      width: 12px;
      height: 12px;
      color: #000;
      background-color: #fff;
      background: url('../../assets/images/close.png');
      right: 1px;
      top: 1px;
      border: none;
      outline: none;
    }
    .section-fintness-table {
      width: 700px;
      border-collapse:collapse;
      font-size: 14px;
      tr {
        width: 100%;
        table-layout:fixed;
        height: 30px;
        td {
          height: 30px;
          text-align: center;
          display: table-cell;
          vertical-align: middle;
          border: 1px solid #45699C;
          width: 100px;
        }
      }
      thead tr {
        color: #83B6FF;
        background: #203A5D;
      }
      tbody tr {
        color: #FFFFFF;
      }
    }
  }
  .show-construction-result {
    width: 802px;
    background: #2B4364;
    border: 1px solid #FFED9B;
    position: absolute;
    top: 500px;
    left: 100px;
    cursor: pointer;
    button{
      position: absolute;
      width: 12px;
      height: 12px;
      color: #000;
      background-color: #fff;
      background: url('../../assets/images/close.png');
      right: 1px;
      top: 1px;
      border: none;
      outline: none;
    }
    .construction-result-table {
      width: 800px;
      border-collapse:collapse;
      font-size: 14px;
      tr {
        width: 100%;
        table-layout:fixed;
        height: 30px;
        td {
          height: 30px;
          text-align: center;
          display: table-cell;
          vertical-align: middle;
          border: 1px solid #45699C;
        }
      }
      thead tr {
        color: #83B6FF;
        background: #203A5D;
      }
      tbody tr {
        color: #FFFFFF;
      }
    }
  }
  .show-final-plan {
    width: 302px;
    background: #2B4364;
    border: 1px solid #FFED9B;
    position: absolute;
    top: 500px;
    left: 500px;
    cursor: pointer;
    button{
      position: absolute;
      width: 12px;
      height: 12px;
      color: #000;
      background-color: #fff;
      background: url('../../assets/images/close.png');
      right: 1px;
      top: 1px;
      border: none;
      outline: none;
    }
    .show-final-plan-table {
      width: 300px;
      border-collapse:collapse;
      font-size: 14px;
      tr {
        width: 100%;
        table-layout:fixed;
        height: 30px;
        td {
          height: 30px;
          text-align: center;
          display: table-cell;
          vertical-align: middle;
          border: 1px solid #45699C;
          width: 100px;
        }
      }
      thead tr {
        color: #83B6FF;
        background: #203A5D;
      }
      tbody tr {
        color: #FFFFFF;
      }
    }
  }
}
</style>