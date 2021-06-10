<!--  -->
<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="部门管理" name="DeptMana"><DeptMana></DeptMana></el-tab-pane>
      <el-tab-pane label="职位管理" name="PosMana"><PosMana></PosMana></el-tab-pane>
      <el-tab-pane label="职称管理" name="JobLevelMana"><JobLevelMana></JobLevelMana></el-tab-pane>
      <el-tab-pane label="奖惩规则" name="EcMana"><EcMana></EcMana></el-tab-pane>
      <el-tab-pane label="权限组" name="PermissMana"><PermissMana></PermissMana></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DeptMana from "../../components/sys/basic/DeptMana";
import EcMana from "../../components/sys/basic/EcMana";
import JobLevelMana from "../../components/sys/basic/JobLevelMana";
import PermissMana from "../../components/sys/basic/PermissMana";
import PosMana from "../../components/sys/basic/PosMana";

export default {
  name: "SysBasic",
  data() {
    return {
      activeName: "DeptMana",
    };
  },
  components: {
    DeptMana,
    EcMana,
    JobLevelMana,
    PermissMana,
    PosMana,
  },
};
</script>

<style>
</style>
