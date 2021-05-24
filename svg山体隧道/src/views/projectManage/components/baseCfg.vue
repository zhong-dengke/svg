<template>
  <div class="base-cfg">
    <Form class="form" :label-width="90">
      <Row>
        <Col span="8">
          <FormItem label="项目名">
            <Input placeholder="请输入内容" v-model="formData.projectName"></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="盾构机编号">
            <Input
              placeholder="请输入内容"
              v-model="formData.tbmNum"
            ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="总环数">
            <Input
              placeholder="请输入内容"
              type="number"
              v-model="formData.totalRing"
            ></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="隧道起点">
            <Input
              placeholder="请输入内容"
              v-model="formData.pathStr"
            ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem class="double-input" label="地图比例">
            <Input
              placeholder="请输入内容"
              type="number"
              v-model="formData.mapRatio[0]"
            >
              <span slot="prepend"> 宽</span>
            </Input>

            <Input
              placeholder="请输入内容"
              type="number"
              v-model="formData.mapRatio[1]"
              ><span slot="prepend"> 高</span></Input
            >
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem class="double-input" label="地图位置">
            <Input
              placeholder="请输入内容"
              type="number"
              v-model="formData.position[0]"
            >
              <span slot="prepend"> 宽</span>
            </Input>

            <Input
              placeholder="请输入内容"
              type="number"
              v-model="formData.position[1]"
              ><span slot="prepend"> 高</span></Input
            >
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="隧道经度">
            <Input placeholder="请输入内容" type="number" v-model="lng"></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="隧道纬度">
            <Input placeholder="请输入内容" type="number" v-model="lat"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem class="upload" label="地图数据">
            <div class="wrapper">
              <div class="icon"></div>
              点击上传文件
              <input
                type="file"
                @change="importBaseDataFile"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              />
              <div class="file-name">
                <span class="icon-file"></span>
                {{ fileName || "文件名" }}
              </div>
            </div>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div id="map-minor" style="height: 657px"></div>
    <div class="button">
      <Button class="save" @click="save">保存</Button>
      <Button ghost class="remove" @click="remove">删除</Button>
    </div>
  </div>
</template>

<script>
import BMap from "BMap";
import BMapLib from "BMapLib";
import XLSX from "xlsx";
export default {
  data() {
    return {
      map: "",
      mapZoom: 12,
      minMapZoom: 12,
      lng: "",
      lat: "",
      center: {
        lng: 114.06664536036504,
        lat: 22.573040712032228
      },
      formData: {
        mapRatio: [],
        position: [],
         baseMapData: ""
      },
      fileName: "",
    };
  },
  methods: {
    // 初始化
    initMap() {
      // 创建Map实例
      this.map = new BMap.Map("map-minor");

      // 初始化地图, 设置中心点坐标和地图级别
      this.map.centerAndZoom(
        new BMap.Point(this.center.lng, this.center.lat),
        this.mapZoom
      );
      // this.map.disableDragging()
      // 启用滚轮放大缩小，默认禁用
      this.map.enableScrollWheelZoom();
      this.map.setMinZoom(this.minMapZoom);
      // 启用地图惯性拖拽，默认禁用
      // this.map.enableInertialDragging();
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
      // 添加图片
      var myIcon = new BMap.Icon(
        require("../../../assets/images/icon-dw-red.png"),
        new BMap.Size(40, 40),
        {
          imageSize: "contain"
        }
      );
      // 创建点
      let ponit = new BMap.Point(114.06664536036503, 22.551947799046843);
      // 创建标记
      let marker = new BMap.Marker(ponit, {
        icon: myIcon,
        enableMassClear: false
      });
      marker.enableDragging();

      marker.addEventListener("dragend", e => {
        let point = e.point;
        this.lng = point.lng;
        this.lat = point.lat;
      });
      // 在地图上添加点标记
      this.map.addOverlay(marker);
      // marker.setAnimation(2);
    },
    save() {
      console.log("save");
    },
    remove() {
      console.log("remove");
    },
    importBaseDataFile(event) {
      let that = this;
      if (!event.target.files) {
        return;
      }
      // 拿取文件对象
      let file = event.target.files[0];
      this.fileName = file.name;
      // 用FileReader来读取
      let reader = new FileReader();
      reader.onload = function(e) {
        let data = e.currentTarget.result;
        let wb = XLSX.read(data, { type: "binary" });
        let outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        console.log(outdata);
        that.formData.baseMapData = outdata;
      };
      reader.readAsBinaryString(file);
    }
  },
  created() {
    this.$nextTick(() => {
      this.initMap();
    });
  }
};
</script>

<style lang="less" scoped>
.base-cfg {
  flex: 1;
  border: 1px solid #83b6ff;
  box-shadow: inset 0px 0px 15px 10px rgba(131, 182, 255, 0.2);
  padding: 10px;
  .form {
    height: 257px;
    margin-bottom: 10px;
    .upload {
      .wrapper {
        width: 443px;
        height: 32px;
        border: 1px solid #45699c;
        border-radius: 4px;
        color: #fff;
        position: relative;
        text-align: left;
        padding-left: 35px;
        input[type="file"] {
          width: 100%;
          opacity: 0;
          position: absolute;
          left: 0;
        }
        .file-name {
          margin-top: 16px;
          margin-left: -24px;
          line-height: 32px;
          .icon-file {
            width: 14px;
            height: 14px;
            display: inline-block;
            vertical-align: -2px;
            background: url("../../../assets/images/icon-folder.png") no-repeat;
          }
        }
      }
      .icon {
        width: 32px;
        height: 100%;
        text-align: center;
        position: absolute;
        left: 0;
        top: 0;
        background: url("../../../assets/images/icon-upload.png") no-repeat
          center;
      }
    }
  }
  .button {
    text-align: right;
    margin-top: 20px;
    button {
      width: 84px;
      height: 36px;
    }
    .save {
      background: #83b6ff;
      border: none;
      color: #fff;
      margin-right: 10px;
    }
    .remove {
      border: 1px solid #45699c;
    }
  }
}
</style>
<style lang="less">
.base-cfg {
  .ivu-form .ivu-form-item-label {
    color: #83b6ff;
  }
  #file-upload-button {
    display: none;
  }
  .ivu-input {
    border: 1px solid #45699c;
  }
  .ivu-form-item-content {
    width: 443px;
  }
  .double-input {
    .ivu-form-item-content {
      display: flex;
      > div:first-child {
        margin-right: 10px;
      }
    }
  }
  .ivu-input-group-prepend {
    background: #203a5d;
    color: #fff;
    border-color: #45699c;
  }
}
</style>