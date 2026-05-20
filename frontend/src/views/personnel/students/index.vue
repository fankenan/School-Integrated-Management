<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <a-card class="search-card" :bordered="false">
      <a-form :model="query" layout="inline" @submit.prevent="handleSearch">
        <a-form-item><a-input v-model="query.keyword" placeholder="学号/姓名搜索" allow-clear style="width:220px" /></a-form-item>
        <a-form-item><a-select v-model="query.status" placeholder="状态筛选" allow-clear style="width:130px"><a-option value="studying">在读</a-option><a-option value="suspended">休学</a-option><a-option value="graduated">毕业</a-option></a-select></a-form-item>
        <a-form-item><a-button type="primary" html-type="submit"><IconSearch />搜索</a-button></a-form-item>
        <a-form-item><a-button @click="handleReset"><IconRefresh />重置</a-button></a-form-item>
      </a-form>
    </a-card>

    <!-- 操作栏 + 表格 -->
    <a-card class="table-card" :bordered="false">
      <div class="table-toolbar">
        <a-space><a-button type="primary" @click="openAdd"><IconPlus />新增学生</a-button></a-space>
      </div>
      <a-table :columns="columns" :data="data" :loading="loading" :pagination="pagination" @page-change="onPageChange" row-key="id">
        <template #status="{ record }"><a-tag :color="statusColor(record.status)">{{ statusText(record.status) }}</a-tag></template>
        <template #gender="{ record }">{{ record.gender === 'M' ? '男' : '女' }}</template>
        <template #actions="{ record }">
          <a-space><a-button type="text" size="small" @click="openEdit(record)"><IconEdit />编辑</a-button><a-popconfirm content="确认删除？" @ok="handleDelete(record.id)"><a-button type="text" status="danger" size="small"><IconDelete />删除</a-button></a-popconfirm></a-space>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑抽屉 -->
    <a-drawer :visible="drawerVisible" :title="editingId ? '编辑学生' : '新增学生'" width="640" @cancel="drawerVisible = false" @ok="handleSubmit" unmount-on-close>
      <a-form :model="form" layout="vertical" ref="formRef">
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="学号" required><a-input v-model="form.studentNo" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="姓名" required><a-input v-model="form.name" /></a-form-item></a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="性别"><a-radio-group v-model="form.gender"><a-radio value="M">男</a-radio><a-radio value="F">女</a-radio></a-radio-group></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="出生日期"><a-input v-model="form.birthday" placeholder="YYYY-MM-DD" /></a-form-item></a-col>
        </a-row>
        <a-form-item label="身份证号"><a-input v-model="form.idCard" /></a-form-item>
        <a-form-item label="家庭住址"><a-input v-model="form.address" /></a-form-item>
        <a-form-item label="联系电话"><a-input v-model="form.phone" /></a-form-item>
        <a-row :gutter="16">
          <a-col :span="8"><a-form-item label="监护人"><a-input v-model="form.guardianName" /></a-form-item></a-col>
          <a-col :span="8"><a-form-item label="监护人电话"><a-input v-model="form.guardianPhone" /></a-form-item></a-col>
          <a-col :span="8"><a-form-item label="关系"><a-input v-model="form.guardianRelation" /></a-form-item></a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="入学日期"><a-input v-model="form.enrollmentDate" placeholder="YYYY-MM-DD" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="班级"><a-select v-model="form.classId" placeholder="选择班级" allow-search :loading="classLoading"><a-option v-for="c in classOpts" :key="c.id" :value="c.id">{{ c.name }} ({{ c.grade }})</a-option></a-select></a-form-item></a-col>
        </a-row>
      </a-form>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconSearch, IconRefresh, IconPlus, IconEdit, IconDelete } from '@arco-design/web-vue/es/icon'
import { http } from '@/utils/request'
import { getStudentList, createStudent, updateStudent, deleteStudent, StudentItem } from '@/api/personnel'

const query = reactive({ keyword: '', status: '', page: 1, pageSize: 10 })
const data = ref<StudentItem[]>([])
const loading = ref(false)
const classOpts = ref<any[]>([])
const classLoading = ref(false)
const pagination = reactive({ current: 1, pageSize: 10, total: 0 })
const drawerVisible = ref(false)
const editingId = ref('')
const form = reactive<Partial<StudentItem>>({ studentNo: '', name: '', gender: 'M', birthday: '', idCard: '', address: '', phone: '', guardianName: '', guardianPhone: '', guardianRelation: '', enrollmentDate: '', classId: '' })

const columns = [
  { title: '学号', dataIndex: 'studentNo', width: 110 },
  { title: '姓名', dataIndex: 'name', width: 90 },
  { title: '性别', slotName: 'gender', width: 60 },
  { title: '监护人', dataIndex: 'guardianName', width: 90 },
  { title: '监护人电话', dataIndex: 'guardianPhone', width: 120 },
  { title: '入学日期', dataIndex: 'enrollmentDate', width: 110 },
  { title: '状态', slotName: 'status', width: 80 },
  { title: '操作', slotName: 'actions', width: 140, fixed: 'right' },
]

const statusColor = (s: string) => s === 'studying' ? 'green' : s === 'suspended' ? 'orange' : 'gray'
const statusText = (s: string) => s === 'studying' ? '在读' : s === 'suspended' ? '休学' : s === 'graduated' ? '毕业' : '转出'

async function fetchData() {
  loading.value = true
  try {
    const res = await getStudentList(query)
    data.value = res.list
    pagination.total = res.total
  } finally { loading.value = false }
}

function handleSearch() { query.page = 1; fetchData() }
function handleReset() { query.keyword = ''; query.status = ''; query.page = 1; fetchData() }
function onPageChange(p: number) { query.page = p; pagination.current = p; fetchData() }
function openAdd() { editingId.value = ''; Object.assign(form, { studentNo: '', name: '', gender: 'M', birthday: '', idCard: '', address: '', phone: '', guardianName: '', guardianPhone: '', guardianRelation: '', enrollmentDate: '', classId: '' }); drawerVisible.value = true }
function openEdit(r: StudentItem) { editingId.value = r.id; Object.assign(form, r); drawerVisible.value = true }

async function handleSubmit() {
  try {
    if (editingId.value) { await updateStudent(editingId.value, form); Message.success('更新成功') }
    else { await createStudent(form); Message.success('新增成功') }
    drawerVisible.value = false
    fetchData()
  } catch { /* handled by interceptor */ }
}

async function handleDelete(id: string) { await deleteStudent(id); Message.success('删除成功'); fetchData() }

onMounted(fetchData)
</script>

<style scoped lang="scss">
.page-container { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.table-toolbar { margin-bottom: 16px; }
</style>