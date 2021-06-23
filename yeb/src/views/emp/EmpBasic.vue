<!-- 基本资料 -->
<template>
  <div>
      <div>
          <div style="display: flex;justify-content: space-between">
              <div>
                  <el-input style="width:300px;margin-right:10px" prefix-icon="el-icon-search" 
                            v-model="empName" @keydown.enter.native="initEmps" clearable @clear="initEmps"
                            :disabled="showAdvanceSearchVisible" placeholder="请输入员工名进行搜索..." >
                  </el-input>
                  <el-button type="primary" icon="el-icon-search" :disabled="showAdvanceSearchVisible"
                       @click="initEmps">搜索</el-button>
                  <el-button type="primary" @click="showAdvanceSearchVisible = !showAdvanceSearchVisible">
                    <i :class="showAdvanceSearchVisible?'fa fa-angle-double-up':'fa fa-angle-double-down'"
                       aria-hidden="true">高级搜索</i>
                  </el-button>
              </div>
              <div>
                  <el-upload class="import"
                      :headers="headers"
                      action="/employee/basic/import"
                      :show-file-list="false"
                      :before-upload="beforeUpload"
                      :on-success="onSuccess"
                      :on-error="onError"
                      :disabled="importDataDisabled">
                      <el-button type="success" :icon="importDataBtnIcon" @click="importEmpData" :disabled="importDataDisabled">
                          {{importDataBtnText}}
                      </el-button>  
                  </el-upload>
                  <el-button type="success" icon="el-icon-download" @click="exportEmpData">
                      导出数据
                  </el-button> 
                  <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">添加员工</el-button> 
              </div>
          </div>
      </div>
      <transition name="slide-fade">
        <div v-show="showAdvanceSearchVisible" style="border:1px solid #409eff;border-radius:5px;box-sizing:border-box;padding:5px;margin:10px 0px">
            <el-row>
              <el-col :span="5"> 
                  政治面貌:
                  <el-select size="mini" style="width:130px" v-model="searchValue.politicId" placeholder="政治面貌">
                    <el-option v-for="item in politicsStatus" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
              </el-col>
              <el-col :span="4">
                  民族:
                  <el-select size="mini" style="width:130px" v-model="searchValue.nationId" placeholder="民族">
                        <el-option v-for="item in nations" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                  </el-select>
              </el-col>
              <el-col :span="4">
                  职位:
                  <el-select size="mini" style="width:130px" v-model="searchValue.posId" placeholder="职位">
                        <el-option v-for="item in positions" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                  </el-select>
              </el-col>
              <el-col :span="4">
                职称:
                <el-select size="mini" style="width:130px" v-model="searchValue.jobLevelId" placeholder="职称">
                    <el-option v-for="item in jobLevels" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>   
              </el-col>
              <el-col :span="7">
                聘用形式:
                <el-radio-group v-model="searchValue.engageForm" >
                        <el-radio label="劳动合同">劳动合同</el-radio>
                        <el-radio label="劳务合同">劳务合同</el-radio>
                      </el-radio-group>  
              </el-col> 
            </el-row>
            <el-row style="margin-top:10px">
              <el-col :span="5" >
                所属部门:
                <el-popover v-model="visibles2" placement="bottom" title="请选择部门" width="200" trigger="manual">
                    <el-tree :data="allDeps" :props="defaultProps" default-expand-all @node-click="searchHandleNodeClick">
                    </el-tree>    
                    <div slot="reference" @click="showDepView2" 
                    style="width:130px;height:24px;display:inline-flex;border:1px solid #dedede;
                    border-radius:5px;cursor:pointer;align-items:center;font-size:13px;padding-left:8px;box-sizing:border-box;" >
                        {{inputDeptName}}
                    </div>    
                </el-popover>
              </el-col>
              <el-col :span="10">
                入职日期:
                <el-date-picker v-model="searchValue.beginDateScope" size="mini" type="daterange" value-format="yyyy-MM-dd" 
                  unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-col>
              <el-col :span="5" offset="4">
                <el-button size="mini" @click="clearSearchValue">取消</el-button>
                <el-button size="mini" icon="el-icon-search" type="primary"  @click="initEmps('advance')">搜索</el-button>
              </el-col>
            </el-row>
        </div>
      </transition>
      <div style="margin-top:10px">
          <el-table :data="emps" stripe border style="width: 100%"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column fixed="left" prop="name" label="姓名" align="left" width="90"></el-table-column>
            <el-table-column prop="workId" label="工号" align="left" width="85"></el-table-column>
            <el-table-column prop="gender" label="性别" width="50"></el-table-column>
            <el-table-column prop="birthday" label="出生日期" align="left" width="95"></el-table-column>
            <el-table-column prop="idCard" label="身份证号码" align="left" width="150"></el-table-column>
            <el-table-column prop="wedlock" label="婚姻状况" width="70"></el-table-column>
            <el-table-column prop="nation.name" label="民族" width="50"></el-table-column>
            <el-table-column prop="nativePlace" label="籍贯" width="80"></el-table-column>
            <el-table-column prop="politicsStatus.name" label="政治面貌" width="80"></el-table-column>
            <el-table-column prop="email" label="电子邮件" align="left" width="150"></el-table-column>
            <el-table-column prop="phone" label="电话号码" align="left" width="100"></el-table-column>
            <el-table-column prop="address" label="联系地址" align="left" width="250"></el-table-column>
            <el-table-column prop="department.name" label="所属部门" width="100"></el-table-column>
            <el-table-column prop="position.name" label="职位" width="100"></el-table-column>
            <el-table-column prop="jobLevel.name" label="职称" width="100"></el-table-column>
            <el-table-column prop="engageForm" label="聘用形式" align="left" width="100"></el-table-column>
            <el-table-column prop="tiptopDegree" label="最高学历" align="left" width="80"></el-table-column>
            <el-table-column prop="specialty" label="所属专业" align="left" width="150"></el-table-column>
            <el-table-column prop="school" label="毕业学校" align="left" width="150"></el-table-column>
            <el-table-column prop="workState" label="在职状态" align="left" width="70"></el-table-column>
            <el-table-column prop="beginDate" label="入职日期" align="left" width="95"></el-table-column>
            <el-table-column prop="conversionTime" label="转正日期" align="left" width="95"></el-table-column>
            <el-table-column prop="beginContract" label="合同起始日期" align="left" width="95"></el-table-column>
            <el-table-column prop="endContract" label="合同截止日期" align="left" width="95"></el-table-column>
            <el-table-column label="合同期限" align="left" width="50">
                <template slot-scope="scope">
                   <el-tag>{{scope.row.contractTerm}}</el-tag>年
                </template>
            </el-table-column>
            <el-table-column prop="notWorkDate" label="离职日期" align="left" width="95"></el-table-column>
            <el-table-column prop="workAge" label="工龄" align="left" width="50"></el-table-column>
            <el-table-column prop="salaryId" label="工资套账ID"></el-table-column>
            <el-table-column fixed="right" label="操作" width="200px">
              <template slot-scope="scope">
                <el-button style="padding:3px" size="mini" type="info" @click="showEditEmpView(scope.row)">编辑</el-button>
                <el-button style="padding:3px" size="mini" type="primary">查看高级资料</el-button>
                <el-button style="padding:3px" size="mini" type="danger" @click="deleteEmp(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content:flex-end">
            <el-pagination background 
              @current-change="currentChange"
              @size-change="sizeChange" 
              layout="sizes, prev, pager, next, jumper, ->, total"  :total="total">
            </el-pagination>
          </div>  
      </div>
      <el-dialog
          :title="title" 
          :visible.sync="dialogVisible"
          width="80%">
          <div>
            <el-form ref="empForm" :model="emp" :rules="rules">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="姓名:" prop="name">
                    <el-input size="mini" style="width:150px" prefix-icon="el-icon-edit" 
                              v-model="emp.name" placeholder="请输入员工姓名..."></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="性别:" prop="gender">
                    <el-radio-group v-model="emp.gender" style="margin-top:8px">
                      <el-radio label="男">男</el-radio>
                      <el-radio label="女">女</el-radio>
                    </el-radio-group>  
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="出生日期:" prop="birthday">
                      <el-date-picker
                        v-model="emp.birthday"
                        type="date"
                        size="mini"
                        style="width:150px"
                        value-format="yyyy-MM-dd"
                        placeholder="出生日期">
                      </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="政治面貌:" prop="politicId">
                    <el-select size="mini" style="width:200px" v-model="emp.politicId" placeholder="政治面貌">
                      <el-option v-for="item in politicsStatus" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="6">
                  <el-form-item label="民族:" prop="nationId">
                    <el-select size="mini" style="width:150px" v-model="emp.nationId" placeholder="民族">
                      <el-option v-for="item in nations" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="籍贯:" prop="nativePlace">
                    <el-input size="mini" style="width:120px" prefix-icon="el-icon-edit" 
                              v-model="emp.nativePlace" placeholder="请输入籍贯..."></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="电子邮箱:" prop="email">
                    <el-input size="mini" style="width:150px" prefix-icon="el-icon-message" 
                              v-model="emp.email" placeholder="请输入电子邮箱..."></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="联系地址:" prop="address">
                    <el-input size="mini" style="width:200px" prefix-icon="el-icon-edit" 
                              v-model="emp.address" placeholder="请输入联系地址..."></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="6">
                  <el-form-item label="职位:" prop="posId">
                    <el-select size="mini" style="width:150px" v-model="emp.posId" placeholder="职位">
                      <el-option v-for="item in positions" 
                                :key="item.id"  :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="职称:" prop="jobLevelId">
                    <el-select size="mini" style="width:150px" v-model="emp.jobLevelId" placeholder="职称">
                      <el-option v-for="item in jobLevels" 
                                :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="所属部门:" prop="departmentId">
                    <el-popover
                            placement="bottom"
                            title="请选择部门"
                            width="200"
                            trigger="manual"
                            v-model="visibles">
                        <el-tree :data="allDeps"
                                 :props="defaultProps" 
                                 default-expand-all
                                 @node-click="handleNodeClick">
                        </el-tree>    
                        <div class="dep-container" slot="reference" @click="showDepView">
                          {{inputDeptName}}
                        </div>    
                    </el-popover>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="电话号码:" prop="phone">
                    <el-input size="mini" style="width:200px" prefix-icon="el-icon-edit" 
                              v-model="emp.phone" placeholder="请输入电话号码..."></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="6">
                  <el-form-item label="工号:" prop="workId">
                    <el-input size="mini" style="width:150px" prefix-icon="el-icon-edit" disabled
                              v-model="emp.workId" placeholder="请输入工号..."></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="学历:" prop="tiptopDegree">
                    <el-select size="mini" style="width:150px" v-model="emp.tiptopDegree" placeholder="学历">
                      <el-option v-for="item in tiptopDegrees" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="毕业院校:" prop="school">
                    <el-input size="mini" style="width:150px" prefix-icon="el-icon-edit" 
                              v-model="emp.school" placeholder="请输入学校..."></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="专业名称:" prop="specialty">
                    <el-input size="mini" style="width:200px" prefix-icon="el-icon-edit" 
                              v-model="emp.specialty" placeholder="请输入专业名称..."></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="6">
                  <el-form-item label="入职日期:" prop="beginDate">
                      <el-date-picker
                        v-model="emp.beginDate"
                        type="date"
                        size="mini"
                        style="width:130px"
                        value-format="yyyy-MM-dd"
                        placeholder="入职日期">
                      </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="转正日期:" prop="conversionTime">
                      <el-date-picker
                        v-model="emp.conversionTime"
                        type="date"
                        size="mini"
                        style="width:130px"
                        value-format="yyyy-MM-dd"
                        placeholder="转正日期">
                      </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="合同起始日期:" prop="beginContract">
                      <el-date-picker
                        v-model="emp.beginContract"
                        type="date"
                        size="mini"
                        style="width:140px"
                        value-format="yyyy-MM-dd"
                        placeholder="合同起始日期">
                      </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="合同截止日期:" prop="endContract">
                      <el-date-picker
                        v-model="emp.endContract"
                        type="date"
                        size="mini"
                        style="width:170px"
                        value-format="yyyy-MM-dd"
                        placeholder="合同截止日期">
                      </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item label="身份证号码:" prop="idCard">
                    <el-input size="mini" style="width:200px" prefix-icon="el-icon-edit" 
                              v-model="emp.idCard" placeholder="请输入身份证号码..."></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="聘用形式:" prop="engageForm">
                    <el-radio-group v-model="emp.engageForm" style="margin-top:8px">
                      <el-radio label="劳动合同">劳动合同</el-radio>
                      <el-radio label="劳务合同">劳务合同</el-radio>
                    </el-radio-group>  
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="婚姻状况:" prop="wedlock">
                    <el-radio-group v-model="emp.wedlock" style="margin-top:8px">
                      <el-radio label="未婚">未婚</el-radio>
                      <el-radio label="已婚">已婚</el-radio>
                      <el-radio label="离异">离异</el-radio>
                    </el-radio-group>  
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="doAddOrEditEmp">确 定</el-button>
          </span>
      </el-dialog>
  </div>
</template>

<script>
    export default {
          name: 'EmpBasic',
          data(){
            return{
              headers:{
                Authorization: window.sessionStorage.getItem('tokenStr')
              },
              showAdvanceSearchVisible:false,
              searchValue: {
                 politicId: null,
                 nationId: null,
                 jobLevelId: null,
                 posId: null,
                 engageForm: '',
                 departmentId: null,
                 beginDateScope: null
              },
              importDataBtnText:'导入数据',
              importDataBtnIcon: 'el-icon-upload2',
              importDataDisabled: false,
              emps: [],
              loading: false,
              total: 0,
              currentPage: 1,
              size: 10,
              empName : '',
              dialogVisible: false,
              nations: [],
              politicsStatus: [],
              jobLevels: [],
              positions: [],
              tiptopDegrees:['博士','硕士','本科','大专','高中','初中','小学','其他'],
              allDeps: [],
              visibles:false,
              visibles2: false,
              inputDeptName: '',
              defaultProps:{
                children: 'children',
                label: 'name'
              },
              title:'',
              emp:{
                  id: null,
                  name: '',
                  gender: '',
                  birthday: '',
                  idCard: '',
                  wedlock: '',
                  nationId: null,
                  nativePlace: '',
                  politicId: null,
                  email: '',
                  phone: '',
                  address: '',
                  departmentId: null,
                  jobLevelId: null,
                  posId: null,
                  engageForm: '',
                  tiptopDegree: '',
                  specialty: '',
                  school: '',
                  beginDate: '',
                  workState: '在职',
                  workId: '',
                  contractTerm: null,
                  conversionTime: '',
                  notWorkDate: null,
                  beginContract: '',
                  endContract: '',
                  workAge: null,
                  salaryId: null                  
              },
              rules: {
                name: [{required: true, message:'请输入员工姓名', trigger: 'blur'}],
                gender: [{required: true, message:'请输入员工性别', trigger: 'blur'}],
                birthday: [{required: true, message:'请输入出生日期', trigger: 'blur'}],
                idCard: [
                  {required: true, message:'请输入身份证号码', trigger: 'blur'},
                  {pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, 
                    message:'身份证号码格式不正确', trigger: 'blur'}
                ],
                wedlock: [{required: true, message:'请输入婚姻状况', trigger: 'blur'}],
                nationId: [{required: true, message:'请选择民族', trigger: 'blur'}],
                nativePlace: [{required: true, message:'请输入籍贯', trigger: 'blur'}],
                politicId: [{required: true, message:'请选择政治面貌', trigger: 'blur'}],
                email: [
                  {required: true, message:'请输入电子邮件', trigger: 'blur'},
                  {type:'email', message: '邮箱地址格式不正确', trigger:'blur'}
                ],
                phone: [{required: true, message:'请输入电话号码', trigger: 'blur'}],
                address: [{required: true, message:'请输入员工地址', trigger: 'blur'}],
                departmentId: [{required: true, message:'请选择部门名称', trigger: 'blur'}],
                jobLevelId: [{required: true, message:'请输入职称', trigger: 'blur'}],
                posId: [{required: true, message:'请输入职位', trigger: 'blur'}],
                engageForm: [{required: true, message:'请输入聘用形式', trigger: 'blur'}],
                tiptopDegree: [{required: true, message:'请输入学历', trigger: 'blur'}],
                specialty: [{required: true, message:'请输入专业', trigger: 'blur'}],
                school: [{required: true, message:'请输入毕业院校', trigger: 'blur'}],
                beginDate: [{required: true, message:'请输入入职日期', trigger: 'blur'}],
                workState: [{required: true, message:'请输入工作状态', trigger: 'blur'}],
                workId: [{required: true, message:'请输入工号', trigger: 'blur'}],
                contractTerm: [{required: true, message:'请输入合同期限', trigger: 'blur'}],
                conversionTime: [{required: true, message:'请输入转正日期', trigger: 'blur'}],
                notWorkDate: [{required: true, message:'请输入离职日期', trigger: 'blur'}],
                beginContract: [{required: true, message:'请输入合同起始日期', trigger: 'blur'}],
                endContract: [{required: true, message:'请输入合同截止日期', trigger: 'blur'}],
                workAge: [{required: true, message:'请输入工龄', trigger: 'blur'}]
              }
              
            }
          },
          mounted(){
            this.initEmps();
            this.initData();
            this.initPositions();
          },
          methods:{
            initEmps(type){
              this.loading = true;
              let url = '/employee/basic/?currentPage=' + this.currentPage + '&size=' + this.size;
              if(type && type== 'advance'){
                if(this.searchValue.politicId){
                  url += '&politicId=' + this.searchValue.politicId;
                }
                if(this.searchValue.nationId){
                  url += '&nationId=' + this.searchValue.nationId;
                }
                if(this.searchValue.jobLevelId){
                  url += '&jobLevelId=' + this.searchValue.jobLevelId;
                }
                if(this.searchValue.posId){
                  url += '&posId=' + this.searchValue.posId;
                }
                if(this.searchValue.engageForm){
                  url += '&engageForm=' + this.searchValue.engageForm;
                }
                if(this.searchValue.departmentId){
                  url += '&departmentId=' + this.searchValue.departmentId;
                }
                if(this.searchValue.beginDateScope){
                  url += '&beginDateScope=' + this.searchValue.beginDateScope;
                }
              } else {
                url += '&name=' + this.empName;
              }
              this.getRequest(url).then(resp=>{
                this.loading = false;
                if(resp){
                  this.emps = resp.data;
                  this.total = resp.total;
                }
              });
            },
            clearSearchValue(){
              this.searchValue.politicId = null;
              this.searchValue.nationId = null;
              this.searchValue.jobLevelId = null;
              this.searchValue.posId = null;
              this.searchValue.engageForm = '';
              this.searchValue.departmentId = null;
              this.inputDeptName = '';
              this.searchValue.beginDateScope = null;
            },
            initData(){
                // 初始化 民族、政治面貌、职称
                if(!window.sessionStorage.getItem('nations')){
                  this.getRequest('/employee/basic/nations').then(resp=>{
                    if(resp){
                      this.nations = resp;
                      window.sessionStorage.setItem('nations',JSON.stringify(resp));
                    }
                  });
                } else {
                  this.nations = JSON.parse(window.sessionStorage.getItem('nations'));
                }

                if(!window.sessionStorage.getItem('politicsStatus')){
                  this.getRequest('/employee/basic/politicsStatus').then(resp=>{
                    if(resp){
                      this.politicsStatus = resp;
                      window.sessionStorage.setItem('politicsStatus',JSON.stringify(resp));
                    }
                  });
                } else {
                  this.politicsStatus = JSON.parse(window.sessionStorage.getItem('politicsStatus'));
                }

                if(!window.sessionStorage.getItem('jobLevels')){
                  this.getRequest('/employee/basic/jobLevels').then(resp=>{
                    if(resp){
                      this.jobLevels = resp;
                      window.sessionStorage.setItem('jobLevels',JSON.stringify(resp));
                    }
                  });
                } else {
                  this.jobLevels = JSON.parse(window.sessionStorage.getItem('jobLevels'));
                }

                if(!window.sessionStorage.getItem('allDeps')){
                  this.getRequest('/employee/basic/deps').then(resp=>{
                    if(resp){
                      this.allDeps = resp;
                      window.sessionStorage.setItem('allDeps',JSON.stringify(resp));
                    }
                  });
                } else {
                  this.allDeps = JSON.parse(window.sessionStorage.getItem('allDeps'));
                }
            },
            initPositions(){
               this.getRequest('/employee/basic/positions').then(resp=>{
                 if(resp){
                   this.positions = resp;
                 }
               }); 
            },
            currentChange(currentPage){
              this.currentPage = currentPage;
              this.initEmps();
            },
            sizeChange(size){
              this.size = size;
              this.initEmps();
            },
            getMaxWorkID(){
              this.getRequest('/employee/basic/maxWorkID').then(resp=>{
                if(resp){
                  this.emp.workId = resp.obj;
                }
              });
            },
            showDepView(){
              this.visibles = !this.visibles;
            },
            handleNodeClick(data){
              this.inputDeptName = data.name;
              this.emp.departmentId = data.id;
              this.visibles = !this.visibles;
            },
            searchHandleNodeClick(data){
              this.inputDeptName = data.name;
              this.searchValue.departmentId = data.id;
              this.visibles2 = !this.visibles2;
            },
            showDepView2(){
              this.visibles2 = !this.visibles2; 
            },
            showAddEmpView(){
              this.title = "添加员工";
              this.emp = {
                  id: null,
                  name: '',
                  gender: '',
                  birthday: '',
                  idCard: '',
                  wedlock: '',
                  nationId: null,
                  nativePlace: '',
                  politicId: null,
                  email: '',
                  phone: '',
                  address: '',
                  departmentId: null,
                  jobLevelId: null,
                  posId: null,
                  engageForm: '',
                  tiptopDegree: '',
                  specialty: '',
                  school: '',
                  beginDate: '',
                  workState: '在职',
                  workId: '',
                  contractTerm: null,
                  conversionTime: '',
                  notWorkDate: null,
                  beginContract: '',
                  endContract: '',
                  workAge: null,
                  salaryId: null                  
              };
              this.inputDeptName = '';
              this.getMaxWorkID();
              this.initPositions();
              this.dialogVisible = true;
            },
            doAddOrEditEmp(){
              if(this.emp.id){
                  this.$refs['empForm'].validate((valid) => {
                        if (valid) {
                            this.putRequest('/employee/basic/', this.emp).then(resp=>{
                                if(resp){
                                  this.dialogVisible = false;
                                  this.initEmps();
                                }
                            });
                        }
                  });
              } else {
                this.$refs['empForm'].validate((valid) => {
                  if (valid) {
                    this.postRequest('/employee/basic/', this.emp).then(resp=>{
                        if(resp){
                          this.dialogVisible = false;
                          this.initEmps();
                        }
                    });
                  }
                });
              }
            },
            deleteEmp(data){
              this.$confirm('此操作将永久删除 [' + data.name +'] , 是否继续?', '提示', 
                    {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      this.deleteRequest('/employee/basic/'+ data.id).then(resp=>{
                          if(resp){
                              this.initEmps();
                          }
                      });
                    }).catch(() => {
                      this.$message({type: 'info',message: '已取消删除'});          
                    });
            },
            showEditEmpView(data){
              this.title = "编辑员工信息";
              this.emp = data;
              this.inputDeptName = data.department.name;
              this.initPositions();
              this.dialogVisible = true;

            },
            exportEmpData(){
              this.downloadRequest('/employee/basic/export');
            },
            beforeUpload(){
              this.importDataBtnIcon = 'el-icon-loading';
              this.importDataBtnText = '正在导入...';
              this.importDataDisabled = true;
            },
            onSuccess(){
              this.importDataBtnIcon = 'el-icon-upload2';
              this.importDataBtnText = '导入数据';
              this.importDataDisabled = false;
              this.initEmps();
            },
            onError(){
              this.importDataBtnIcon = 'el-icon-upload2';
              this.importDataBtnText = '导入数据';
               this.importDataDisabled = false;
            }


          }
    }
</script>

<style>
  .dep-container{
    width: 150px;
    height: 24px;
    display: inline-flex;
    border: 1px solid #dedede;
    border-radius: 5px;
    cursor:pointer;
    align-items: center;
    font-size: 13px;
    padding-left: 8px;
    box-sizing: border-box;
  }
  .import{
    display: inline-flex;
    margin-right: 8px;
  }
</style>
