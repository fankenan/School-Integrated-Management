<template>
  <div class="module-container">
    <a-card :bordered="false"><template #title><IconFile /> 成绩管理</template>
      <div class="toolbar"><a-space><a-input-search v-model="query.keyword" placeholder="搜索学生姓名" allow-clear style="width:200px" @search="load" @clear="load" /><a-select v-model="query.subject" placeholder="科目" allow-clear style="width:120px" @change="load"><a-option value="语文">语文</a-option><a-option value="数学">数学</a-option><a-option value="英语">英语</a-option><a-option value="物理">物理</a-option><a-option value="化学">化学</a-option></a-select><a-button type="primary" @click="openAdd"><IconPlus /> 录入成绩</a-button></a-space></div>
      <a-table :data="list" :loading="loading" row-key="id" :pagination="{ current: query.page, pageSize, total: total, showTotal: true }" @page-change="p=>{query.page=p;load()}">
        <template #columns>
          <a-table-column title="学生" :width="100"><template #cell="{r}">{{ r.student?.name || r.studentId }}</template></a-table-column>
          <a-table-column title="科目" data-index="subject" :width="80" />
          <a-table-column title="分数" data-index="score" :width="80" />
          <a-table-column title="类型" :width="80"><template #cell="{r}">{{{exam:'考试',quiz:'测验',homework:'作业',final:'期末'}[r.type]||r.type}}</template></a-table-column>
          <a-table-column title="考试名称" data-index="examName" :width="120" />
          <a-table-column title="学期" data-index="semester" :width="100" />
          <a-table-column title="班级" :width="120"><template #cell="{r}">{{ r.class?.name || '-' }}</template></a-table-column>
          <a-table-column title="操作" :width="140"><template #cell="{r}"><a-space><a-button type="text" size="small" @click="openEdit(r)">编辑</a-button><a-popconfirm content="确认删除？" @ok="del(r.id)"><a-button type="text" size="small" status="danger">删除</a-button></a-popconfirm></a-space></template></a-table-column>
        </template>
      </a-table>
    </a-card>
    <a-drawer v-model:visible="drawer" :title="eid?'编辑成绩':'录入成绩'" :width="480" @ok="save" @cancel="drawer=false">
      <a-form :model="f">
        <a-form-item label="学生ID"><a-input v-model="f.studentId" /></a-form-item>
        <a-row :gutter="16"><a-col :span="8"><a-form-item label="科目"><a-input v-model="f.subject" /></a-form-item></a-col><a-col :span="8"><a-form-item label="分数"><a-input v-model="f.score" /></a-form-item></a-col><a-col :span="8"><a-form-item label="类型"><a-select v-model="f.type"><a-option value="exam">考试</a-option><a-option value="quiz">测验</a-option><a-option value="homework">作业</a-option><a-option value="final">期末</a-option></a-select></a-form-item></a-col></a-row>
        <a-row :gutter="16"><a-col :span="12"><a-form-item label="考试名称"><a-input v-model="f.examName" /></a-form-item></a-col><a-col :span="12"><a-form-item label="学期"><a-input v-model="f.semester" /></a-form-item></a-col></a-row>
        <a-form-item label="班级ID"><a-input v-model="f.classId" /></a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'; import { Message } from '@arco-design/web-vue'; import { IconFile, IconPlus } from '@arco-design/web-vue/es/icon'; import { http } from '@/utils/request';
const B='/api/v1/grades'; const query=reactive({keyword:'',subject:'',page:1,pageSize:20}); const list=ref<any[]>([]); const loading=ref(false); const total=ref(0)
const drawer=ref(false); const eid=ref(''); const f=ref({studentId:'',subject:'',score:'',type:'exam',examName:'',semester:'',classId:'',schoolYear:''})
async function load(){loading.value=true;try{const r=await http.get<{list:any[],total:number}>(B,{params:query});list.value=r.list;total.value=r.total}finally{loading.value=false}}
function openAdd(){eid.value='';f.value={studentId:'',subject:'',score:'',type:'exam',examName:'',semester:'',classId:'',schoolYear:''};drawer.value=true}
function openEdit(r:any){eid.value=r.id;Object.assign(f.value,r);drawer.value=true}
async function save(){if(eid.value)await http.put(`${B}/${eid.value}`,f.value);else await http.post(B,f.value);Message.success('保存成功');drawer.value=false;load()}
async function del(id:string){await http.delete(`${B}/${id}`);Message.success('已删除');load()}
onMounted(load)
</script>
<style scoped lang="scss">@import "@/styles/variables.scss";.module-container{padding:20px}.toolbar{margin-bottom:16px;display:flex;justify-content:space-between}</style>
