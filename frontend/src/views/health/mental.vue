<template>
  <div class="module-container">
    <a-card :bordered="false"><template #title><IconHeart /> 心理健康</template>
      <div class="toolbar"><a-space><a-input-search v-model="query.keyword" placeholder="搜索学生姓名" allow-clear style="width:200px" @search="load" @clear="load" /><a-button type="primary" @click="openAdd"><IconPlus /> 新增评估</a-button></a-space></div>
      <a-table :data="list" :loading="loading" row-key="id" :pagination="{ current: query.page, pageSize, total: total, showTotal: true }" @page-change="p=>{query.page=p;load()}">
        <template #columns>
          <a-table-column title="学生" data-index="studentName" :width="100" />
          <a-table-column title="量表" data-index="scaleName" :width="120" />
          <a-table-column title="得分" data-index="score" :width="80" />
          <a-table-column title="状态" :width="90"><template #cell="{r}"><a-tag :color="r.status==='normal'?'green':r.status==='attention'?'orange':r.status==='warning'?'red':'darkred'">{{{normal:'正常',attention:'关注',warning:'预警',crisis:'危机'}[r.status]||r.status}}</a-tag></template></a-table-column>
          <a-table-column title="评估日期" data-index="evaluationDate" :width="110" />
          <a-table-column title="咨询师" :width="100"><template #cell="{r}">{{ r.counselorId || '-' }}</template></a-table-column>
          <a-table-column title="操作" :width="140"><template #cell="{r}"><a-space><a-button type="text" size="small" @click="openEdit(r)">编辑</a-button><a-popconfirm content="确认删除？" @ok="del(r.id)"><a-button type="text" size="small" status="danger">删除</a-button></a-popconfirm></a-space></template></a-table-column>
        </template>
      </a-table>
    </a-card>
    <a-drawer v-model:visible="drawer" :title="eid?'编辑':'新增'" :width="500" @ok="save" @cancel="drawer=false">
      <a-form :model="f">
        <a-row :gutter="16"><a-col :span="12"><a-form-item label="学生姓名"><a-input v-model="f.studentName" /></a-form-item></a-col><a-col :span="12"><a-form-item label="学生ID"><a-input v-model="f.studentId" /></a-form-item></a-col></a-row>
        <a-row :gutter="16"><a-col :span="12"><a-form-item label="量表名称"><a-input v-model="f.scaleName" /></a-form-item></a-col><a-col :span="12"><a-form-item label="得分"><a-input v-model="f.score" /></a-form-item></a-col></a-row>
        <a-form-item label="状态"><a-select v-model="f.status"><a-option value="normal">正常</a-option><a-option value="attention">关注</a-option><a-option value="warning">预警</a-option><a-option value="crisis">危机</a-option></a-select></a-form-item>
        <a-form-item label="评估日期"><a-input v-model="f.evaluationDate" placeholder="YYYY-MM-DD" /></a-form-item>
        <a-form-item label="结果"><a-textarea v-model="f.result" /></a-form-item>
        <a-form-item label="干预措施"><a-textarea v-model="f.intervention" /></a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'; import { Message } from '@arco-design/web-vue'; import { IconHeart, IconPlus } from '@arco-design/web-vue/es/icon'; import { http } from '@/utils/request';
const B='/api/v1/mental-records'; const query=reactive({keyword:'',page:1,pageSize:20}); const list=ref<any[]>([]); const loading=ref(false); const total=ref(0)
const drawer=ref(false); const eid=ref(''); const f=ref({studentId:'',studentName:'',scaleName:'',score:'',status:'normal',result:'',intervention:'',evaluationDate:''})
async function load(){loading.value=true;try{const r=await http.get<{list:any[],total:number}>(B,{params:query});list.value=r.list;total.value=r.total}finally{loading.value=false}}
function openAdd(){eid.value='';f.value={studentId:'',studentName:'',scaleName:'',score:'',status:'normal',result:'',intervention:'',evaluationDate:''};drawer.value=true}
function openEdit(r:any){eid.value=r.id;Object.assign(f.value,r);drawer.value=true}
async function save(){if(eid.value)await http.put(`${B}/${eid.value}`,f.value);else await http.post(B,f.value);Message.success('保存成功');drawer.value=false;load()}
async function del(id:string){await http.delete(`${B}/${id}`);Message.success('已删除');load()}
onMounted(load)
</script>
<style scoped lang="scss">@import "@/styles/variables.scss";.module-container{padding:20px}.toolbar{margin-bottom:16px;display:flex;justify-content:space-between}</style>
