<template>
  <div class="module-container">
    <a-card :bordered="false"><template #title><IconHome /> 学校信息管理</template>
      <div class="toolbar"><a-space><a-input-search v-model="keyword" placeholder="搜索学校名称" allow-clear style="width:240px" @search="load" @clear="load" /><a-button type="primary" @click="openAdd"><IconPlus /> 新增学校</a-button></a-space></div>
      <a-table :data="list" :loading="loading" row-key="id" :pagination="false">
        <template #columns>
          <a-table-column title="名称" data-index="name" :width="180" />
          <a-table-column title="代码" data-index="code" :width="100" />
          <a-table-column title="类型" :width="100"><template #cell="{ record }">{{ record.type || '-' }}</template></a-table-column>
          <a-table-column title="地区" data-index="region" :width="100" />
          <a-table-column title="地址" data-index="address" :ellipsis="true" />
          <a-table-column title="电话" data-index="phone" :width="130" />
          <a-table-column title="校长" data-index="principal" :width="100" />
          <a-table-column title="状态" :width="80"><template #cell="{ record }"><a-tag :color="record.status===1?'green':'gray'">{{ record.status===1?'正常':'禁用' }}</a-tag></template></a-table-column>
          <a-table-column title="操作" :width="140"><template #cell="{ record }"><a-space><a-button type="text" size="small" @click="openEdit(record)">编辑</a-button><a-popconfirm content="确认删除？" @ok="del(record.id)"><a-button type="text" size="small" status="danger">删除</a-button></a-popconfirm></a-space></template></a-table-column>
        </template>
      </a-table>
    </a-card>

    <a-drawer v-model:visible="drawer" :title="editingId?'编辑学校':'新增学校'" :width="500" @ok="save" @cancel="drawer=false">
      <a-form :model="form">
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="学校名称"><a-input v-model="form.name" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="学校代码"><a-input v-model="form.code" /></a-form-item></a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="类型"><a-select v-model="form.type"><a-option value="primary">小学</a-option><a-option value="middle">初中</a-option><a-option value="high">高中</a-option><a-option value="combined">九年一贯制</a-option></a-select></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="地区"><a-input v-model="form.region" /></a-form-item></a-col>
        </a-row>
        <a-form-item label="地址"><a-input v-model="form.address" /></a-form-item>
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="电话"><a-input v-model="form.phone" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="校长"><a-input v-model="form.principal" /></a-form-item></a-col>
        </a-row>
        <a-form-item label="状态"><a-radio-group v-model="form.status"><a-radio :value="1">正常</a-radio><a-radio :value="0">禁用</a-radio></a-radio-group></a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconHome, IconPlus } from '@arco-design/web-vue/es/icon'
import { http } from '@/utils/request'
const BASE = '/api/v1/schools'
const keyword = ref(''); const list = ref<any[]>([]); const loading = ref(false)
const drawer = ref(false); const editingId = ref('')
const form = ref({ name: '', code: '', type: '', region: '', address: '', phone: '', principal: '', status: 1 })

async function load() { loading.value = true; try { const r = await http.get<{list:any[],total:number}>(BASE, { params: { keyword: keyword.value } }); list.value = r.list } finally { loading.value = false } }
function openAdd() { editingId.value = ''; form.value = { name: '', code: '', type: '', region: '', address: '', phone: '', principal: '', status: 1 }; drawer.value = true }
function openEdit(r: any) { editingId.value = r.id; Object.assign(form.value, r); drawer.value = true }
async function save() {
  if (!form.value.name || !form.value.code) { Message.warning('名称和代码必填'); return }
  if (editingId.value) await http.put(`${BASE}/${editingId.value}`, form.value)
  else await http.post(BASE, form.value)
  Message.success(editingId.value?'更新成功':'创建成功'); drawer.value = false; load()
}
async function del(id: string) { await http.delete(`${BASE}/${id}`); Message.success('已删除'); load() }
onMounted(load)
</script>
<style scoped lang="scss">
@import "@/styles/variables.scss";
.module-container { padding: 20px; }
.toolbar { margin-bottom: 16px; display: flex; justify-content: space-between; }
</style>
