<template>
  <div class="module-container">
    <a-card :bordered="false"><template #title><IconTool /> 维修管理</template>
      <div class="toolbar"><a-space><a-input-search v-model="query.keyword" placeholder="搜索描述" allow-clear style="width:200px" @search="load" @clear="load" /><a-select v-model="query.status" placeholder="状态" allow-clear style="width:120px" @change="load"><a-option value="pending">待处理</a-option><a-option value="assigned">已派单</a-option><a-option value="in_progress">维修中</a-option><a-option value="completed">已完成</a-option></a-select><a-button type="primary" @click="openAdd"><IconPlus /> 新增报修</a-button></a-space></div>
      <a-table :data="list" :loading="loading" row-key="id" :pagination="{ current: query.page, pageSize, total, showTotal: true }" @page-change="p=>{query.page=p;load()}">
        <template #columns>
          <a-table-column title="报修人" data-index="reporter" :width="100" />
          <a-table-column title="位置" data-index="location" :width="120" />
          <a-table-column title="描述" data-index="description" :ellipsis="true" />
          <a-table-column title="紧急程度" :width="90"><template #cell="{ record }"><a-tag :color="record.urgency==='urgent'?'red':record.urgency==='normal'?'blue':'gray'">{{ {urgent:'紧急',normal:'普通',low:'低'}[record.urgency]||record.urgency }}</a-tag></template></a-table-column>
          <a-table-column title="状态" :width="90"><template #cell="{ record }"><a-tag :color="record.status==='completed'?'green':record.status==='in_progress'?'blue':record.status==='assigned'?'orange':'gray'">{{ {pending:'待处理',assigned:'已派单',in_progress:'维修中',completed:'已完成',cancelled:'已取消'}[record.status]||record.status }}</a-tag></template></a-table-column>
          <a-table-column title="维修人" data-index="repairPerson" :width="100" />
          <a-table-column title="操作" :width="150"><template #cell="{ record }"><a-space><a-button type="text" size="small" @click="openEdit(record)">编辑</a-button><a-popconfirm content="确认删除？" @ok="del(record.id)"><a-button type="text" size="small" status="danger">删除</a-button></a-popconfirm></a-space></template></a-table-column>
        </template>
      </a-table>
    </a-card>

    <a-drawer v-model:visible="drawer" :title="editingId?'编辑维修':'新增报修'" :width="480" @ok="save" @cancel="drawer=false">
      <a-form :model="form">
        <a-row :gutter="16"><a-col :span="12"><a-form-item label="报修人"><a-input v-model="form.reporter" /></a-form-item></a-col><a-col :span="12"><a-form-item label="位置"><a-input v-model="form.location" /></a-form-item></a-col></a-row>
        <a-form-item label="描述"><a-textarea v-model="form.description" /></a-form-item>
        <a-row :gutter="16"><a-col :span="12"><a-form-item label="紧急程度"><a-select v-model="form.urgency"><a-option value="urgent">紧急</a-option><a-option value="normal">普通</a-option><a-option value="low">低</a-option></a-select></a-form-item></a-col><a-col :span="12"><a-form-item label="状态"><a-select v-model="form.status"><a-option value="pending">待处理</a-option><a-option value="assigned">已派单</a-option><a-option value="in_progress">维修中</a-option><a-option value="completed">已完成</a-option></a-select></a-form-item></a-col></a-row>
        <a-form-item label="维修人"><a-input v-model="form.repairPerson" /></a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconTool, IconPlus } from '@arco-design/web-vue/es/icon'
import { http } from '@/utils/request'
const BASE = '/api/v1/repairs'
const query = reactive({ keyword: '', status: '', page: 1, pageSize: 20 })
const list = ref<any[]>([]); const loading = ref(false); const total = ref(0)
const drawer = ref(false); const editingId = ref('')
const form = ref({ reporter: '', location: '', description: '', urgency: 'normal', status: 'pending', repairPerson: '' })

async function load() { loading.value = true; try { const r = await http.get<{list:any[],total:number}>(BASE, { params: query }); list.value = r.list; total.value = r.total } finally { loading.value = false } }
function openAdd() { editingId.value = ''; form.value = { reporter: '', location: '', description: '', urgency: 'normal', status: 'pending', repairPerson: '' }; drawer.value = true }
function openEdit(r: any) { editingId.value = r.id; Object.assign(form.value, r); drawer.value = true }
async function save() { if (!form.value.reporter || !form.value.description) { Message.warning('报修人和描述必填'); return }; if (editingId.value) await http.put(`${BASE}/${editingId.value}`, form.value); else await http.post(BASE, form.value); Message.success('保存成功'); drawer.value = false; load() }
async function del(id: string) { await http.delete(`${BASE}/${id}`); Message.success('已删除'); load() }
onMounted(load)
</script>
<style scoped lang="scss">@import "@/styles/variables.scss";.module-container{padding:20px}.toolbar{margin-bottom:16px;display:flex;justify-content:space-between}</style>
