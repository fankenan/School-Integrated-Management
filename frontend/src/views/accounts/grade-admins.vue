<template>
  <div class="module-container">
    <a-card :bordered="false">
      <template #title><IconSafe /> 年级管理员管理</template>
      <div class="toolbar">
        <a-button type="primary" @click="showCreate = true"><IconPlus /> 添加年级管理员</a-button>
      </div>
      <a-table :data="list" :loading="loading" :pagination="{ current: page, pageSize, total, showTotal: true }" @page-change="onPage" row-key="id">
        <template #columns>
          <a-table-column title="姓名" data-index="realName"><template #cell="{ record }">{{ record.user?.realName || '-' }}</template></a-table-column>
          <a-table-column title="用户名"><template #cell="{ record }">{{ record.user?.username || '-' }}</template></a-table-column>
          <a-table-column title="年级" data-index="gradeName" :width="120" />
          <a-table-column title="年级代码" data-index="gradeLevel" :width="120"><template #cell="{ record }">{{ { grade_7: '初一', grade_8: '初二', grade_9: '初三', grade_10: '高一', grade_11: '高二', grade_12: '高三' }[record.gradeLevel] || record.gradeLevel }}</template></a-table-column>
          <a-table-column title="手机号"><template #cell="{ record }">{{ record.user?.phone || '-' }}</template></a-table-column>
          <a-table-column title="操作" :width="100">
            <template #cell="{ record }"><a-popconfirm content="确定删除该年级管理员？" @ok="handleDelete(record.id)"><a-button type="text" size="small" status="danger">删除</a-button></a-popconfirm></template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:visible="showCreate" title="添加年级管理员" @ok="handleCreate" @cancel="showCreate = false">
      <a-form :model="form">
        <a-form-item label="真实姓名"><a-input v-model="form.realName" /></a-form-item>
        <a-form-item label="用户名"><a-input v-model="form.username" /></a-form-item>
        <a-form-item label="密码"><a-input-password v-model="form.password" /></a-form-item>
        <a-form-item label="手机号"><a-input v-model="form.phone" /></a-form-item>
        <a-form-item label="年级"><a-select v-model="form.gradeLevel">
          <a-option value="grade_7">初一</a-option><a-option value="grade_8">初二</a-option><a-option value="grade_9">初三</a-option>
          <a-option value="grade_10">高一</a-option><a-option value="grade_11">高二</a-option><a-option value="grade_12">高三</a-option>
        </a-select></a-form-item>
        <a-form-item label="年级名称"><a-input v-model="form.gradeName" placeholder="如：2024级初一年级" /></a-form-item>
        <a-form-item label="学校ID"><a-input v-model="form.schoolId" placeholder="UUID" /></a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconSafe, IconPlus } from '@arco-design/web-vue/es/icon'
import { getGradeAdminList, createGradeAdmin, deleteGradeAdmin } from '@/api/accounts'

const list = ref<any[]>([]); const loading = ref(false)
const page = ref(1); const pageSize = 20; const total = ref(0)

const showCreate = ref(false)
const form = ref({ realName: '', username: '', password: '', phone: '', gradeLevel: 'grade_7', gradeName: '', schoolId: '' })

async function load() { loading.value = true; try { const r = await getGradeAdminList({ page: page.value, pageSize }); list.value = r.list; total.value = r.total } finally { loading.value = false } }
function onPage(p: number) { page.value = p; load() }

async function handleCreate() {
  const f = form.value
  if (!f.realName || !f.username || !f.password || !f.gradeName || !f.schoolId) { Message.warning('请填写完整'); return }
  await createGradeAdmin({ realName: f.realName, username: f.username, password: f.password, phone: f.phone, gradeLevel: f.gradeLevel, gradeName: f.gradeName, schoolId: f.schoolId })
  Message.success('年级管理员创建成功'); showCreate.value = false
  form.value = { realName: '', username: '', password: '', phone: '', gradeLevel: 'grade_7', gradeName: '', schoolId: '' }
  load()
}

async function handleDelete(id: string) { await deleteGradeAdmin(id); Message.success('已删除'); load() }

onMounted(() => load())
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
.module-container { padding: 20px; }
.toolbar { margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
</style>
