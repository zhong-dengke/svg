<template>
  <div class="home">
    <div id="map" style="height: calc(100vh - 62px)" />
  </div>
</template>

<script>
import BMap from "BMap";
import BMapLib from "BMapLib";
import projects from "@/assets/js/projects";
import custom_map_config from '@/assets/json/custom_map_config.json';
export default {
  name: "Home",
  components: {},
    data() {
    return {
      map: "",
      mapZoom: 13,
      minMapZoom:12,
      center: {
        lng: 114.06664536036504,
        lat: 22.573040712032228
      },
      path: [
        new BMap.Point(104.06246843605139, 30.70222230386016),
        new BMap.Point(104.07641013756626, 30.691415823228127),
        new BMap.Point(104.09020811019951, 30.688061839372477),
        new BMap.Point(104.10386235395117, 30.67961424747836),
        new BMap.Point(104.10903659368866, 30.66681720886365),
        new BMap.Point(104.09696336763454, 30.645567859486555),
        new BMap.Point(104.10386235395117, 30.613144973561358)
      ],
      geoProvince: {
        // 各个省会经纬度
        黑龙江省: [127.9688, 45.368],
        内蒙古自治区: [110.3467, 41.4899],
        吉林省: [125.8154, 44.2584],
        北京市: [116.4551, 40.2539],
        辽宁省: [123.1238, 42.1216],
        河北省: [114.4995, 38.1006],
        天津市: [117.4219, 39.4189],
        山西省: [112.3352, 37.9413],
        陕西省: [109.1162, 34.2004],
        甘肃省: [103.5901, 36.3043],
        宁夏回族自治区: [106.3586, 38.1775],
        青海省: [101.4038, 36.8207],
        新疆维吾尔自治区: [87.9236, 43.5883],
        西藏自治区: [91.11, 29.97],
        四川省: [103.9526, 30.7617],
        重庆市: [108.384366, 30.439702],
        山东省: [117.1582, 36.8701],
        河南省: [113.4668, 34.6234],
        江苏省: [118.8062, 31.9208],
        安徽省: [117.29, 32.0581],
        湖北省: [114.3896, 30.6628],
        浙江省: [119.5313, 29.8773],
        福建省: [119.4543, 25.9222],
        江西省: [116.0046, 28.6633],
        湖南省: [113.0823, 28.2568],
        贵州省: [106.6992, 26.7682],
        云南省: [102.9199, 25.4663],
        广东省: [113.12244, 23.009505],
        广西壮族自治区: [108.479, 23.1152],
        海南省: [110.3893, 19.8516],
        上海市: [121.4648, 31.2891]
      },
      mainColor: ["#124AF1", "#F5A623", "#26BBF2", "#37BC8F", "#2A84EF"],
 
    };
  },
  created() {
    this.$nextTick(() => {
      this.initMap();
    });
  },
  methods: {
    // 初始化
    initMap() {
      // 创建Map实例
      this.map = new BMap.Map("map");

      // 初始化地图,设置中心点坐标和地图级别
      this.map.centerAndZoom(
        new BMap.Point(this.center.lng, this.center.lat),
        this.mapZoom
      );
      // this.map.disableDragging()
      // 启用滚轮放大缩小，默认禁用
      this.map.enableScrollWheelZoom();
      this.map.setMinZoom(this.minMapZoom)
      // 启用地图惯性拖拽，默认禁用
      this.map.enableInertialDragging();
      var b = new BMap.Bounds(
        new BMap.Point(113.77516318858366, 22.32024589684819),
        new BMap.Point(114.2994861484744, 22.760330263374435)
      );
      try {
        BMapLib.AreaRestriction.setBounds(this.map, b);
      } catch (e) {
        alert(e);
      }
      this.map.addEventListener("click", data => {
        // point包含了经纬度
        console.log(data.point);
      });
      this.map.setMapStyleV2({
        styleId: "0ca180c0990d58a67bf443687c5250fb"
        // styleJson:custom_map_config,
        // style : "midnight"
      });

      this.addMarker();
      let sy = new BMap.Symbol(7, {
        scale: 0.6,
        strokeWeight: 1,
        strokeColor: "#fff", //设置线宽
        // rotation: 0, //顺时针旋转30度
        fillColor: "rgba(0,0,0,0)",
        fillOpacity: 0.8
      });
      let icon = new BMap.IconSequence(sy, "10", "30");
      var polyline = new BMap.Polyline(this.path, {
        strokeWeight: 7,
        strokeColor: "#2dc4bb",
        enableMassClear: false
        // icons: [icon]
      });
      this.map.addOverlay(polyline);

      // // 添加图片
      // var myIcon = new BMap.Icon(
      //   require("../assets/images/shandian.svg"),
      //   new BMap.Size(50, 50),
      //   {
      //     imageSize: "contain"
      //   }
      // );
      // // 创建点
      // let ponit = new BMap.Point(104.06321402962467, 30.70221454102254);
      // // 创建标记
      // let marker = new BMap.Marker(ponit, {
      //   icon: myIcon,
      //   enableMassClear: false
      // });
      // marker.enableDragging();

      // marker.addEventListener("dragend", function(e) {
      //   console.log(e.point);
      // });
      // // 在地图上添加点标记
      // this.map.addOverlay(marker);
      // marker.setAnimation(2);


      this.initPro();
      this.map.addEventListener("zoomend", e => {
        let zoom = e.target.getZoom();
        console.log(zoom);
        this.map.clearOverlays();
        if (zoom <= 6) {
          this.addMarker();
        } else if (zoom >= 7) {
          this.initPro();
        }
      });
    },
    // 创建一个自定义图片的标记
    addMarker() {
      let obj = this.getWordCntMap(projects);

      for (const key in obj) {
        let marker = new BMap.Label(
          '<div class="mapIcon" style=""><span class="mapIcon_title">' +
            key +
            "   " +
            '</span><span class="mapIcon_num">' +
            obj[key] +
            "</span></div>",
          {
            offset: new BMap.Size(-30.5, -30),
            position: new BMap.Point(
              this.geoProvince[key][0],
              this.geoProvince[key][1]
            )
          }
        );
        marker.setStyle({
          color: "#2dc4bb",
          border: 0,
          padding: "10px",
          background: "rgb(62, 175, 124,.3)"
        });
        this.map.addOverlay(marker);
      }
    },
    initPro() {
      // let color =this.mainColor
      projects.forEach(element => {
        let marker = new BMap.Marker(new BMap.Point(element.lng, element.lat));
        // ,{
        //   icon:new BMap.Symbol('m43.75,145.74l0,0c0,-51.64 41.86,-93.5 93.5,-93.5l0,0c24.8,0 48.58,9.85 66.11,27.38c17.53,17.53 27.38,41.32 27.38,66.11l0,0c0,51.64 -41.86,93.5 -93.5,93.5l0,0c-51.64,0 -93.5,-41.86 -93.5,-93.5zm46.75,0l0,0c0,25.82 20.93,46.75 46.75,46.75c25.82,0 46.75,-20.93 46.75,-46.75c0,-25.82 -20.93,-46.75 -46.75,-46.75l0,0c-25.82,0 -46.75,20.93 -46.75,46.75z', {
        //     scale: 0.1,
        //     strokeWeight: 1,
        //     rotation: 0, //顺时针旋转30度
        //     fillColor: "#FFAAB8",
        //     fillOpacity: 0.8
        //   })
        // }
        let label = new BMap.Label(
          '<div class="mapIcon" style=""><span class="mapIcon_title">' +
            element.abbreviation +
            "</span></div>",
          {
            offset: new BMap.Size(50, 0),
            position: new BMap.Point(element.lng, element.lat)
          }
        );
        label.setStyle({
          color: "#fff",
          border: '1px solid #FFED9B',
          padding: "10px 15px",
          background: "rgba(0, 0, 0, 0.5)"
        });
        marker.setLabel(label);
        marker.setIcon(
          new BMap.Icon(
            require("../assets/images/icon-dw.png"),
            // '<div > sad</div>',
            new BMap.Size(40, 40)
          )
        );
        marker.addEventListener("click", () =>{
          this.$router.push({name:'digitalMap'})
        });
        this.map.addOverlay(marker);
      });
    },
    getWordCntMap(arr) {
      let arrData = arr;
      let obj = {};
      for (let i = 0; i < arrData.length; i++) {
        if (arrData[i].lat) {
          var item = arrData[i].province; // a为计算的属性,可换成b,c
          obj[item] = obj[item] + 1 || 1;
        }
      }
      return obj;
    },
  },
  mounted() {
    setTimeout(() => {
      console.log(this.map);
    }, 0);
  }
};
</script>
<style lang="less" >
.anchorBL{
  display: none;
}
</style>
