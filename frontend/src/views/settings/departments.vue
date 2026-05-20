<template>
  <div class="module-container">
    <a-card :bordered="false"><template #title><IconUserGroup /> 部门/年级管理</template>
      <div class="toolbar"><a-button type="primary" @click="openAdd(null)"><IconPlus /> 新增顶级部门</a-button></div>
      <a-table :data="treeList" :loading="loading" row-key="id" :pagination="false" :default-expand-all-rows="true">
        <template #columns>
          <a-table-column title="名称" data-index="name" :width="200"><template #cell="{ record }"><span :style="{ paddingLeft: (record._level||0)*24+'px' }">{{ record.name }}</span></template></a-table-column>
          <a-table-column title="代码" data-index="code" :width="120" />
          <a-table-column title="负责人" :width="100"><template #cell="{ record }">{{ record.leader || '-' }}</template></a-table-column>
          <a-table-column title="电话" :width="130"><template #cell="{ record }">{{ record.phone || '-' }}</template></a-table-column>
          <a-table-column title="排序" data-index="sort" :width="60" />
          <a-table-column title="操作" :width="200"><template #cell="{ record }"><a-space><a-button type="text" size="small" @click="openAdd(record)">添加子级</a-button><a-button type="text" size="small" @click="openEdit(record)">编辑</a-button><a-popconfirm content="确认删除？" @ok="del(record.id)"><a-button type="text" size="small" status="danger">删除</a-button></a-popconfirm></a-space></template></a-table-column>
        </template>
      </a-table>
    </a-card>

    <a-drawer v-model:visible="drawer" :title="editingId?'编辑部门':'新增部门'" :width="480" @ok="save" @cancel="drawer=false">
      <a-form :model="form">
        <a-form-item label="上级部门"><a-input :model-value="parentName" disabled /></a-form-item>
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="名称"><a-input v-model="form.name" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="代码"><a-input v-model="form.code" /></a-form-item></a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="负责人"><a-input v-model="form.leader" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="电话"><a-input v-model="form.phone" /></a-form-item></a-col>
        </a-row>
        <a-form-item label="描述"><a-textarea v-model="form.description" /></a-form-item>
        <a-form-item label="排序"><a-input-number v-model="form.sort" :min="0" /></a-form-item>
        <a-form-item label="状态"><a-radio-group v-model="form.status"><a-radio :value="1">正常</a-radio><a-radio :value="0">禁用</a-radio></a-radio-group></a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconUserGroup, IconPlus } from '@arco-design/web-vue/es/icon'
import { http } from '@/utils/request'
const BASE = '/api/v1/departments'
const list = ref<any[]>([]); const treeList = ref<any[]>([]); const loading = ref(false)
const drawer = ref(false); const editingId = ref(''); const parentName = ref('顶级')
const form = ref({ name: '', code: '', description: '', leader: '', phone: '', sort: 0, status: 1, parentId: '' as string })

function toTree(items: any[], parentId: string | null = null, level = 0): any[] {
  const result: any[] = []
  for (const item of items.filter(i => i.parent?.id === parentId || (!i.parent && !parentId))) {
    result.push({ ...item, _level: level, children: toTree(items, item.id, level + 1) })
  }
  return result
}

async function load() {
  loading.value = true
  try {
    const r = await http.get(BASE)
    list.value = r
    treeList.value = toTree(r)
  } finally { loading.value = false }
}

function openAdd(parent: any) {
  editingId.value = ''; parentName.value = parent ? parent.name : '顶级'
  form.value = { name: '', code: '', description: '', leader: '', phone: '', sort: 0, status: 1, parentId: parent ? parent.id : '' }
  drawer.value = true
}
function openEdit(r: any) {
  editingId.value = r.id; parentName.value = r.parent?.name || '顶级'
  form.value = { name: r.name, code: r.code, description: r.description, leader: r.leader, phone: r.phone, sort: r.sort, status: r.status, parentId: r.parent ? r.parent.id : '' }
  drawer.value = true
}
async function save() {
  if (!form.value.name || !form.value.code) { Message.warning('名称和代码必填'); return }
  const payload: any = { ...form.value }
  if (!payload.parentId) delete payload.parentId
  if (editingId.value) await http.put(`${BASE}/${editingId.value}`, payload)
  else await http.post(BASE, payload)
  Message.success(editingId.value?'更新成功':'创建成功'); drawer.value = false; load()
}
async function del(id: string) { await http.delete(`${BASE}/${id}`); Message.success('已删除'); load() }
onMounted(load)
</script>
<style scoped lang="scss">
@import "@/styles/variables.scss";
.module-container { padding: 20px; }
.toolbar { margin-bottom: 16px; }
</style>
