<template>
  <div class="module-container">
    <a-card :bordered="false">
      <template #title><IconUser /> 教师账号管理</template>
      <div class="toolbar">
        <a-space>
          <a-input-search v-model="keyword" placeholder="搜索姓名/工号" allow-clear style="width:240px" @search="search" @clear="search" />
          <a-button type="primary" @click="showCreate = true"><IconPlus /> 创建账号</a-button>
        </a-space>
      </div>
      <a-table :data="list" :loading="loading" :pagination="{ current: page, pageSize, total, showTotal: true }" @page-change="onPage" row-key="id">
        <template #columns>
          <a-table-column title="工号" data-index="teacherNo" :width="100" />
          <a-table-column title="姓名" data-index="name" :width="100" />
          <a-table-column title="手机号" data-index="phone" :width="130" />
          <a-table-column title="职称" data-index="title" :width="100" />
          <a-table-column title="部门" :width="120"><template #cell="{ record }">{{ record.department?.name || '-' }}</template></a-table-column>
          <a-table-column title="账号状态" :width="100">
            <template #cell="{ record }"><a-tag :color="record.userId ? 'green' : 'gray'">{{ record.userId ? '已创建' : '未创建' }}</a-tag></template>
          </a-table-column>
          <a-table-column title="操作" :width="200">
            <template #cell="{ record }">
              <a-space>
                <a-button v-if="!record.userId" type="text" size="small" @click="openCreateAccount(record)">创建账号</a-button>
                <a-button v-else type="text" size="small" status="warning" @click="openResetPwd(record)">重置密码</a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <!-- 创建账号弹窗 -->
    <a-modal v-model:visible="showCreate" title="为教师创建账号" @ok="handleCreateAccount" @cancel="showCreate = false">
      <a-form :model="form">
        <a-form-item label="选择教师"><a-select v-model="form.teacherId" placeholder="搜索教师" allow-search :filter-option="false" @search="searchTeachers"><a-option v-for="t in teacherOpts" :key="t.id" :value="t.id">{{ t.name }} ({{ t.teacherNo }})</a-option></a-select></a-form-item>
        <a-form-item label="用户名"><a-input v-model="form.username" placeholder="登录用户名" /></a-form-item>
        <a-form-item label="密码"><a-input-password v-model="form.password" placeholder="至少6位" /></a-form-item>
        <a-form-item label="角色"><a-select v-model="form.roleCode" placeholder="选择角色"><a-option v-for="r in roles" :key="r.code" :value="r.code">{{ r.name }}</a-option></a-select></a-form-item>
      </a-form>
    </a-modal>

    <!-- 重置密码弹窗 -->
    <a-modal v-model:visible="showReset" title="重置密码" @ok="handleResetPwd" @cancel="showReset = false">
      <a-form><a-form-item label="新密码"><a-input-password v-model="resetPwd" placeholder="至少6位" /></a-form-item></a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconUser, IconPlus } from '@arco-design/web-vue/es/icon'
import { getTeacherAccounts, createTeacherAccount, resetPassword, getAllRoles } from '@/api/accounts'

const keyword = ref('')
const list = ref<any[]>([])
const loading = ref(false)
const page = ref(1); const pageSize = 20; const total = ref(0)

const showCreate = ref(false); const showReset = ref(false)
const form = ref({ teacherId: '', username: '', password: '', roleCode: 'teacher' })
const resetPwd = ref(''); const resetUserId = ref('')
const teacherOpts = ref<any[]>([]); const roles = ref<any[]>([])

async function load() {
  loading.value = true
  try {
    const r = await getTeacherAccounts({ keyword: keyword.value, page: page.value, pageSize })
    list.value = r.list; total.value = r.total
  } finally { loading.value = false }
}

function search() { page.value = 1; load() }
function onPage(p: number) { page.value = p; load() }

async function searchTeachers(kw: string) {
  if (!kw) return
  const r = await getTeacherAccounts({ keyword: kw, pageSize: 50 })
  teacherOpts.value = r.list.filter((t: any) => !t.userId)
}

async function openCreateAccount(record: any) {
  form.value = { teacherId: record.id, username: '', password: '', roleCode: 'teacher' }
  if (!roles.value.length) roles.value = await getAllRoles()
  showCreate.value = true
}

async function handleCreateAccount() {
  if (!form.value.username || !form.value.password) { Message.warning('请填写完整'); return }
  await createTeacherAccount(form.value.teacherId, { username: form.value.username, password: form.value.password, roleCode: form.value.roleCode })
  Message.success('账号创建成功')
  showCreate.value = false; load()
}

function openResetPwd(record: any) {
  resetUserId.value = record.userId || record.user?.id
  resetPwd.value = ''
  showReset.value = true
}

async function handleResetPwd() {
  if (!resetPwd.value) { Message.warning('请输入新密码'); return }
  await resetPassword(resetUserId.value, resetPwd.value)
  Message.success('密码重置成功'); showReset.value = false
}

onMounted(() => load())
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
.module-container { padding: 20px; }
.toolbar { margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
</style>
