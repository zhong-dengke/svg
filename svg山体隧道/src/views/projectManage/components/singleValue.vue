<template>
  <div class="section-parameter">
    <div class="upload">
      <div class="lable">参数文件</div>
      <div class="wrapper">
        <div class="icon"></div>
        点击上传文件
        <input
          type="file"
          @change="importLayerFile"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        />
        <div class="file-name">
          <span class="icon-file"></span>
          {{ fileName || "文件名" }}
        </div>
      </div>
    </div>
    <div class="table">
      <table class="section-params-table">
        <thead>
          <tr >
            <td colspan="15">各区段单值参数</td>
          </tr>
          <tr>
            <td colspan="1">区段</td>
            <td colspan="1">土压场地占用</td>
            <td colspan="1">泥水场地占用</td>
            <td colspan="1">土压地表沉降</td>
            <td colspan="1">泥水地表沉降</td>
            <td colspan="1">土压掘进效率</td>
            <td colspan="1">泥水掘进效率</td>
            <td colspan="1">敞开式掘进效率</td>
            <td colspan="1">单护盾掘进效率</td>
            <td colspan="1">双护盾掘进效率</td>
            <td colspan="1">土压建设成本</td>
            <td colspan="1">泥水建设成本</td>
            <td colspan="1">敞开式建设成本</td>
            <td colspan="1">单护盾建设成本</td>
            <td colspan="1">双护盾建设成本</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in allSingleParams" :key="index">
            <td>{{ item.sectionName }}</td>
            <td>{{ item.earthPressureSiteOccupation }}</td>
            <td>{{ item.muddyWaterSiteOccupation }}</td>
            <td>{{ item.earthPressureSurfaceSubsidence }}</td>
            <td>{{ item.muddyWaterSurfaceSubsidence }}</td>
            <td>{{ item.earthPressureDrivingEfficiency }}</td>
            <td>{{ item.muddyWaterDrivingEfficiency }}</td>
            <td>{{ item.openStyleDrivingEfficiency }}</td>
            <td>{{ item.singleShieldDrivingEfficiency }}</td>
            <td>{{ item.doubleShieldDrivingEfficiency }}</td>
            <td>{{ item.earthPressureConstructionCost }}</td>
            <td>{{ item.muddyWaterConstructionCost }}</td>
            <td>{{ item.openStyleConstructionCost }}</td>
            <td>{{ item.singleShieldConstructionCost }}</td>
            <td>{{ item.doubleShieldConstructionCost }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="button">
      <Button class="save" @click="save">保存</Button>
      <Button ghost class="remove" @click="remove">删除</Button>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
export default {
  data() {
    return {
      fileName: "",
      allSingleParams: [] // 所有区段不同模式单值参数: value
    };
  },
  methods: {
    /**
     * 上传土层参数文件并解析
     */
    importLayerFile(event) {
      let that = this;
      if (!event.target.files) {
        return;
      }
      // 拿取文件对象
      let file = event.target.files[0];
      // 用FileReader来读取
      let reader = new FileReader();
      this.fileName = file.name;
      reader.onload = function(e) {
        let data = e.currentTarget.result;
        let wb = XLSX.read(data, { type: "binary" });
        let outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        that.allSingleParams = outdata;
        // that.showSectionParams = true
        // that.importSingleFileState = true
        // that.analysisLayerParams(outdata)
      };
      reader.readAsBinaryString(file);
    },
    save() {
      console.log("save");
    },
    remove() {
      console.log("remove");
    }
  }
};
</script>

<style lang="less" scoped>
.section-parameter {
  flex: 1;
  border: 1px solid #83b6ff;
  box-shadow: inset 0px 0px 15px 10px rgba(131, 182, 255, 0.2);
  padding: 10px;
  position: relative;
  .upload {
    height: 32px;
    display: flex;
    align-items: center;
    .lable {
      color: #83b6ff;
      margin-right: 10px;
    }
    .wrapper {
      width: 443px;
      height: 32px;
      line-height: 32px;
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
        margin-top: 10px;
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
      background: url("../../../assets/images/icon-upload.png") no-repeat center;
    }
  }
  .table {
    margin-top: 50px;
    .section-params-table {
      width: 100%;
      border-collapse: collapse;
      color: #83b6ff;
      font-size: 16px;
      tr {
        width: 100%;
        table-layout: fixed;
        td {
          height: 40px;
          text-align: center;
          display: table-cell;
          vertical-align: middle;
          border: 1px solid #45699c;
          // width: 100px;
        }
      }
      tbody tr td {
        color: #fff;
      }
    }
    .section-params-table thead tr {
      background: #203a5d;
    }
  }
  .button {
    text-align: right;
    margin-top: 20px;
    position: absolute;
    bottom: 10px;
    right: 10px;
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