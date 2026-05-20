<template>
  <div class="page-container">
    <a-card class="search-card" :bordered="false">
      <a-form :model="query" layout="inline" @submit.prevent="handleSearch">
        <a-form-item><a-input v-model="query.keyword" placeholder="工号/姓名搜索" allow-clear style="width:220px" /></a-form-item>
        <a-form-item><a-select v-model="query.position" placeholder="岗位筛选" allow-clear style="width:140px"><a-option value="保安">保安</a-option><a-option value="保洁">保洁</a-option><a-option value="厨师">厨师</a-option><a-option value="文员">文员</a-option></a-select></a-form-item>
        <a-form-item><a-button type="primary" html-type="submit"><IconSearch />搜索</a-button></a-form-item>
        <a-form-item><a-button @click="handleReset"><IconRefresh />重置</a-button></a-form-item>
      </a-form>
    </a-card>

    <a-card class="table-card" :bordered="false">
      <div class="table-toolbar"><a-button type="primary" @click="openAdd"><IconPlus />新增职工</a-button></div>
      <a-table :columns="columns" :data="data" :loading="loading" :pagination="pagination" @page-change="onPageChange" row-key="id">
        <template #gender="{ record }">{{ record.gender === 'M' ? '男' : '女' }}</template>
        <template #status="{ record }"><a-tag :color="record.status === 'active' ? 'green' : record.status === 'leave' ? 'orange' : 'gray'">{{ record.status === 'active' ? '在职' : record.status === 'leave' ? '休假' : '离职' }}</a-tag></template>
        <template #actions="{ record }">
          <a-space><a-button type="text" size="small" @click="openEdit(record)"><IconEdit />编辑</a-button><a-popconfirm content="确认删除？" @ok="handleDelete(record.id)"><a-button type="text" status="danger" size="small"><IconDelete />删除</a-button></a-popconfirm></a-space>
        </template>
      </a-table>
    </a-card>

    <a-drawer :visible="drawerVisible" :title="editingId ? '编辑职工' : '新增职工'" width="560" @cancel="drawerVisible = false" @ok="handleSubmit">
      <a-form :model="form" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="工号" required><a-input v-model="form.staffNo" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="姓名" required><a-input v-model="form.name" /></a-form-item></a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="性别"><a-radio-group v-model="form.gender"><a-radio value="M">男</a-radio><a-radio value="F">女</a-radio></a-radio-group></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="岗位"><a-select v-model="form.position" allow-clear><a-option>保安</a-option><a-option>保洁</a-option><a-option>厨师</a-option><a-option>水电工</a-option><a-option>文员</a-option><a-option>司机</a-option></a-select></a-form-item></a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="手机号"><a-input v-model="form.phone" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="入职日期"><a-input v-model="form.hireDate" placeholder="YYYY-MM-DD" /></a-form-item></a-col>
        </a-row>
        <a-form-item label="所属部门"><a-select v-model="form.departmentIds" placeholder="选择部门（可多选）" multiple allow-search :loading="deptLoading"><a-option v-for="d in deptOpts" :key="d.id" :value="d.id">{{ d.name }}</a-option></a-select></a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconSearch, IconRefresh, IconPlus, IconEdit, IconDelete } from '@arco-design/web-vue/es/icon'
import { http } from '@/utils/request'
import { getStaffList, createStaff, updateStaff, deleteStaff, StaffItem } from '@/api/personnel'

const query = reactive({ keyword: '', position: '', page: 1, pageSize: 10 })
const data = ref<StaffItem[]>([])
const loading = ref(false)
const deptOpts = ref<any[]>([])
const deptLoading = ref(false)
const pagination = reactive({ current: 1, pageSize: 10, total: 0 })
const drawerVisible = ref(false)
const editingId = ref('')
const form = reactive<Partial<StaffItem>>({ staffNo: '', name: '', gender: 'M', position: '', phone: '', hireDate: '', departmentIds: [] as string[] })

const columns = [
  { title: '工号', dataIndex: 'staffNo', width: 100 },
  { title: '姓名', dataIndex: 'name', width: 80 },
  { title: '性别', slotName: 'gender', width: 60 },
  { title: '岗位', dataIndex: 'position', width: 100 },
  { title: '手机号', dataIndex: 'phone', width: 120 },
  { title: '入职日期', dataIndex: 'hireDate', width: 110 },
  { title: '状态', slotName: 'status', width: 80 },
  { title: '操作', slotName: 'actions', width: 140, fixed: 'right' },
]

async function fetchData() {
  loading.value = true
  try { const res = await getStaffList(query); data.value = res.list; pagination.total = res.total }
  finally { loading.value = false }
}

function handleSearch() { query.page = 1; fetchData() }
function handleReset() { Object.assign(query, { keyword: '', position: '', page: 1, pageSize: 10 }); fetchData() }
function onPageChange(p: number) { query.page = p; pagination.current = p; fetchData() }
function openAdd() { editingId.value = ''; Object.assign(form, { staffNo: '', name: '', gender: 'M', position: '', phone: '', hireDate: '', departmentIds: [] as string[] }); drawerVisible.value = true }
function openEdit(r: StaffItem) { editingId.value = r.id; Object.assign(form, { ...r, departmentIds: r.departmentId ? [r.departmentId] : [] }); drawerVisible.value = true }
async function handleSubmit() {
  if (editingId.value) { await updateStaff(editingId.value, form); Message.success('更新成功') }
  else { await createStaff(form); Message.success('新增成功') }
  drawerVisible.value = false; fetchData()
}
async function handleDelete(id: string) { await deleteStaff(id); Message.success('删除成功'); fetchData() }

async function loadDeptOpts() { deptLoading.value = true; try { deptOpts.value = await http.get('/api/v1/departments') as any[] } catch {} finally { deptLoading.value = false } }
onMounted(() => { fetchData(); loadDeptOpts() })
</script>

<style scoped lang="scss">
.page-container { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.table-toolbar { margin-bottom: 16px; }
</style>