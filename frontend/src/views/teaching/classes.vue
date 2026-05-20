<template>
  <div class="module-container">
    <a-card :bordered="false"><template #title><IconHome /> 班级管理</template>
      <div class="toolbar"><a-space><a-input-search v-model="keyword" placeholder="搜索班级名称" allow-clear style="width:200px" @search="load" @clear="load" /><a-select v-model="gradeFilter" placeholder="年级筛选" allow-clear style="width:120px" @change="load"><a-option v-for="d in gradeOpts" :key="d.id" :value="d.name">{{ d.name }}</a-option></a-select><a-button type="primary" @click="openAdd"><IconPlus /> 新增班级</a-button></a-space></div>
      <a-table :data="list" :loading="loading" row-key="id" :pagination="{ current: page, pageSize, total, showTotal: true }" @page-change="onPage">
        <template #columns>
          <a-table-column title="班级名称" data-index="name" :width="150" />
          <a-table-column title="年级" data-index="grade" :width="100" />
          <a-table-column title="班主任" data-index="headTeacher" :width="100" />
          <a-table-column title="学生人数" data-index="studentCount" :width="80" />
          <a-table-column title="教室" data-index="classroom" :width="100" />
          <a-table-column title="操作" :width="140"><template #cell="{ record }"><a-space><a-button type="text" size="small" @click="openEdit(record)">编辑</a-button><a-popconfirm content="确认删除？" @ok="del(record.id)"><a-button type="text" size="small" status="danger">删除</a-button></a-popconfirm></a-space></template></a-table-column>
        </template>
      </a-table>
    </a-card>

    <a-drawer v-model:visible="drawer" :title="editingId?'编辑班级':'新增班级'" :width="480" @ok="save" @cancel="drawer=false">
      <a-form :model="form">
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="班级名称"><a-input v-model="form.name" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="年级"><a-select v-model="form.grade" allow-create><a-option v-for="d in gradeOpts" :key="d.id" :value="d.name">{{ d.name }}</a-option></a-select></a-form-item></a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="班主任"><a-input v-model="form.headTeacher" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="教室"><a-input v-model="form.classroom" /></a-form-item></a-col>
        </a-row>
        <a-form-item label="学校"><a-select v-model="form.schoolId" placeholder="选择学校"><a-option v-for="s in schoolOpts" :key="s.id" :value="s.id">{{ s.name }}</a-option></a-select></a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconHome, IconPlus } from '@arco-design/web-vue/es/icon'
import { http } from '@/utils/request'

const keyword = ref(''); const gradeFilter = ref(''); const list = ref<any[]>([]); const loading = ref(false)
const page = ref(1); const pageSize = 20; const total = ref(0)
const drawer = ref(false); const editingId = ref('')
const form = ref({ name: '', grade: '', headTeacher: '', classroom: '', schoolId: '' })
const gradeOpts = ref<any[]>([]); const schoolOpts = ref<any[]>([])

async function load() {
  loading.value = true
  try {
    const params: any = { page: page.value, pageSize }
    if (keyword.value) params.keyword = keyword.value
    if (gradeFilter.value) params.grade = gradeFilter.value
    const r = await http.get<{list:any[],total:number}>('/api/v1/classes', { params })
    list.value = r.list; total.value = r.total
  } finally { loading.value = false }
}
function onPage(p: number) { page.value = p; load() }

async function loadOptions() {
  try { const r = await http.get('/api/v1/departments') as any[]; gradeOpts.value = r.filter((d:any) => d.name && (d.name.includes('年级') || d.name.includes('级'))) } catch {}
  try { schoolOpts.value = await http.get('/api/v1/schools/all') as any[] } catch {}
}

function openAdd() { editingId.value = ''; form.value = { name: '', grade: '', headTeacher: '', classroom: '', schoolId: '' }; drawer.value = true }
function openEdit(r: any) { editingId.value = r.id; Object.assign(form.value, r); drawer.value = true }
async function save() {
  if (!form.value.name) { Message.warning('班级名称必填'); return }
  if (editingId.value) await http.put(`/api/v1/classes/${editingId.value}`, form.value)
  else await http.post('/api/v1/classes', form.value)
  Message.success(editingId.value?'更新成功':'创建成功'); drawer.value = false; load()
}
async function del(id: string) { await http.delete(`/api/v1/classes/${id}`); Message.success('已删除'); load() }
onMounted(() => { load(); loadOptions() })
</script>
<style scoped lang="scss">
@import "@/styles/variables.scss";
.module-container { padding: 20px; }
.toolbar { margin-bottom: 16px; display: flex; justify-content: space-between; }
</style>
