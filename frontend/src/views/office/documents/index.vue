<template>
  <div class="module-container">
    <a-card :bordered="false"><template #title><IconFile /> 公文处理</template>
      <div class="toolbar"><a-space><a-input-search v-model="query.keyword" placeholder="搜索标题" allow-clear style="width:200px" @search="load" @clear="load" /><a-select v-model="query.status" placeholder="状态" allow-clear style="width:120px" @change="load"><a-option value="draft">草稿</a-option><a-option value="pending">待审批</a-option><a-option value="approved">已通过</a-option></a-select><a-button type="primary" @click="openAdd"><IconPlus /> 新建公文</a-button></a-space></div>
      <a-table :data="list" :loading="loading" row-key="id" :pagination="{ current: query.page, pageSize, total: total, showTotal: true }" @page-change="p=>{query.page=p;load()}">
        <template #columns>
          <a-table-column title="标题" data-index="title" :ellipsis="true" />
          <a-table-column title="类型" data-index="type" :width="80" />
          <a-table-column title="紧急程度" :width="90"><template #cell="{r}"><a-tag :color="r.urgency==='urgent'?'red':'blue'">{{ r.urgency==='urgent'?'紧急':'普通' }}</a-tag></template></a-table-column>
          <a-table-column title="状态" :width="80"><template #cell="{r}"><a-tag :color="r.status==='approved'?'green':r.status==='draft'?'gray':'orange'">{{ {draft:'草稿',pending:'待审批',approved:'已通过',rejected:'已驳回',archived:'已归档'}[r.status]||r.status }}</a-tag></template></a-table-column>
          <a-table-column title="创建时间" :width="160"><template #cell="{r}">{{ r.createdAt?.substring(0,16) }}</template></a-table-column>
          <a-table-column title="操作" :width="140"><template #cell="{r}"><a-space><a-button type="text" size="small" @click="openEdit(r)">编辑</a-button><a-popconfirm content="确认删除？" @ok="del(r.id)"><a-button type="text" size="small" status="danger">删除</a-button></a-popconfirm></a-space></template></a-table-column>
        </template>
      </a-table>
    </a-card>
    <a-drawer v-model:visible="drawer" :title="eid?'编辑公文':'新建公文'" :width="600" @ok="save" @cancel="drawer=false">
      <a-form :model="f">
        <a-form-item label="标题" required><a-input v-model="f.title" /></a-form-item>
        <a-row :gutter="16"><a-col :span="8"><a-form-item label="类型"><a-input v-model="f.type" placeholder="通知/公告/报告" /></a-form-item></a-col><a-col :span="8"><a-form-item label="紧急程度"><a-select v-model="f.urgency"><a-option value="normal">普通</a-option><a-option value="urgent">紧急</a-option></a-select></a-form-item></a-col><a-col :span="8"><a-form-item label="状态"><a-select v-model="f.status"><a-option value="draft">草稿</a-option><a-option value="pending">待审批</a-option><a-option value="approved">已通过</a-option></a-select></a-form-item></a-col></a-row>
        <a-form-item label="内容"><a-textarea v-model="f.content" :auto-size="{minRows:4}" /></a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'; import { Message } from '@arco-design/web-vue'; import { IconFile, IconPlus } from '@arco-design/web-vue/es/icon'; import { http } from '@/utils/request';
const B='/api/v1/documents'; const query=reactive({keyword:'',status:'',page:1,pageSize:20}); const list=ref<any[]>([]); const loading=ref(false); const total=ref(0)
const drawer=ref(false); const eid=ref(''); const f=ref({title:'',content:'',type:'通知',urgency:'normal',status:'draft'})
async function load(){loading.value=true;try{const r=await http.get<{list:any[],total:number}>(B,{params:query});list.value=r.list;total.value=r.total}finally{loading.value=false}}
function openAdd(){eid.value='';f.value={title:'',content:'',type:'通知',urgency:'normal',status:'draft'};drawer.value=true}
function openEdit(r:any){eid.value=r.id;Object.assign(f.value,r);drawer.value=true}
async function save(){if(!f.value.title){Message.warning('标题必填');return};if(eid.value)await http.put(`${B}/${eid.value}`,f.value);else await http.post(B,f.value);Message.success('保存成功');drawer.value=false;load()}
async function del(id:string){await http.delete(`${B}/${id}`);Message.success('已删除');load()}
onMounted(load)
</script>
<style scoped lang="scss">@import "@/styles/variables.scss";.module-container{padding:20px}.toolbar{margin-bottom:16px;display:flex;justify-content:space-between}</style>
