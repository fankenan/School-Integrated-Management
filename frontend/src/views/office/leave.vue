<template>
  <div class="module-container">
    <a-card :bordered="false"><template #title><IconSchedule /> 请假管理</template>
      <div class="toolbar"><a-space><a-select v-model="query.status" placeholder="状态" allow-clear style="width:120px" @change="load"><a-option value="pending">待审批</a-option><a-option value="approved">已通过</a-option><a-option value="rejected">已驳回</a-option></a-select><a-button type="primary" @click="openAdd"><IconPlus /> 新增请假</a-button></a-space></div>
      <a-table :data="list" :loading="loading" row-key="id" :pagination="{ current: query.page, pageSize, total: total, showTotal: true }" @page-change="p=>{query.page=p;load()}">
        <template #columns>
          <a-table-column title="学生" :width="100"><template #cell="{r}">{{ r.student?.name || r.studentId }}</template></a-table-column>
          <a-table-column title="类型" :width="80"><template #cell="{r}">{{ {sick:'病假',personal:'事假',family:'家庭'}[r.type]||r.type }}</template></a-table-column>
          <a-table-column title="原因" data-index="reason" :ellipsis="true" />
          <a-table-column title="开始" :width="140"><template #cell="{r}">{{ r.startTime?.substring(0,16) }}</template></a-table-column>
          <a-table-column title="结束" :width="140"><template #cell="{r}">{{ r.endTime?.substring(0,16) }}</template></a-table-column>
          <a-table-column title="状态" :width="80"><template #cell="{r}"><a-tag :color="r.status==='approved'?'green':r.status==='rejected'?'red':'orange'">{{ {pending:'待审批',approved:'已通过',rejected:'已驳回',cancelled:'已取消'}[r.status]||r.status }}</a-tag></template></a-table-column>
          <a-table-column title="操作" :width="140"><template #cell="{r}"><a-space><a-button type="text" size="small" @click="openEdit(r)">编辑</a-button><a-popconfirm content="确认删除？" @ok="del(r.id)"><a-button type="text" size="small" status="danger">删除</a-button></a-popconfirm></a-space></template></a-table-column>
        </template>
      </a-table>
    </a-card>
    <a-drawer v-model:visible="drawer" :title="eid?'编辑请假':'新增请假'" :width="480" @ok="save" @cancel="drawer=false">
      <a-form :model="f">
        <a-form-item label="学生ID"><a-input v-model="f.studentId" /></a-form-item>
        <a-row :gutter="16"><a-col :span="12"><a-form-item label="类型"><a-select v-model="f.type"><a-option value="sick">病假</a-option><a-option value="personal">事假</a-option><a-option value="family">家庭</a-option></a-select></a-form-item></a-col><a-col :span="12"><a-form-item label="状态"><a-select v-model="f.status"><a-option value="pending">待审批</a-option><a-option value="approved">已通过</a-option><a-option value="rejected">已驳回</a-option></a-select></a-form-item></a-col></a-row>
        <a-form-item label="原因"><a-textarea v-model="f.reason" /></a-form-item>
        <a-row :gutter="16"><a-col :span="12"><a-form-item label="开始时间"><a-input v-model="f.startTime" placeholder="YYYY-MM-DD HH:mm" /></a-form-item></a-col><a-col :span="12"><a-form-item label="结束时间"><a-input v-model="f.endTime" placeholder="YYYY-MM-DD HH:mm" /></a-form-item></a-col></a-row>
      </a-form>
    </a-drawer>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'; import { Message } from '@arco-design/web-vue'; import { IconSchedule, IconPlus } from '@arco-design/web-vue/es/icon'; import { http } from '@/utils/request';
const B='/api/v1/leaves'; const query=reactive({status:'',page:1,pageSize:20}); const list=ref<any[]>([]); const loading=ref(false); const total=ref(0)
const drawer=ref(false); const eid=ref(''); const f=ref({studentId:'',type:'sick',reason:'',startTime:'',endTime:'',status:'pending'})
async function load(){loading.value=true;try{const r=await http.get<{list:any[],total:number}>(B,{params:query});list.value=r.list;total.value=r.total}finally{loading.value=false}}
function openAdd(){eid.value='';f.value={studentId:'',type:'sick',reason:'',startTime:'',endTime:'',status:'pending'};drawer.value=true}
function openEdit(r:any){eid.value=r.id;Object.assign(f.value,r);drawer.value=true}
async function save(){if(eid.value)await http.put(`${B}/${eid.value}`,f.value);else await http.post(B,f.value);Message.success('保存成功');drawer.value=false;load()}
async function del(id:string){await http.delete(`${B}/${id}`);Message.success('已删除');load()}
onMounted(load)
</script>
<style scoped lang="scss">@import "@/styles/variables.scss";.module-container{padding:20px}.toolbar{margin-bottom:16px;display:flex;justify-content:space-between}</style>
