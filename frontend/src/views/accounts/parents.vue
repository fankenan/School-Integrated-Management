<template>
  <div class="module-container">
    <a-card :bordered="false">
      <template #title><IconUserGroup /> 家长账号管理</template>
      <div class="toolbar">
        <a-space>
          <a-input-search v-model="keyword" placeholder="搜索姓名/手机号" allow-clear style="width:240px" @search="search" @clear="search" />
          <a-button type="primary" @click="openCreate"><IconPlus /> 新增家长</a-button>
        </a-space>
      </div>
      <a-table :data="list" :loading="loading" :pagination="{ current: page, pageSize, total, showTotal: true }" @page-change="onPage" row-key="id">
        <template #columns>
          <a-table-column title="姓名" data-index="name" :width="100" />
          <a-table-column title="手机号" data-index="phone" :width="130" />
          <a-table-column title="关系" :width="80"><template #cell="{ record }">{{ { father: '父亲', mother: '母亲', guardian: '监护人', other: '其他' }[record.relation] || record.relation }}</template></a-table-column>
          <a-table-column title="绑定学生" :width="200"><template #cell="{ record }"><a-tag v-for="s in record.students" :key="s.id" style="margin-right:4px">{{ s.name }}</a-tag><span v-if="!record.students?.length" style="color:#ccc">未绑定</span></template></a-table-column>
          <a-table-column title="账号状态" :width="100"><template #cell="{ record }"><a-tag :color="record.userId ? 'green' : 'gray'">{{ record.userId ? '已创建' : '未创建' }}</a-tag></template></a-table-column>
          <a-table-column title="操作" :width="240">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="openBind(record)">绑定学生</a-button>
                <a-button v-if="!record.userId" type="text" size="small" @click="openCreateAccount(record)">创建账号</a-button>
                <a-button v-else type="text" size="small" status="warning" @click="openResetPwd(record)">重置密码</a-button>
                <a-popconfirm content="确定删除该家长？" @ok="handleDelete(record.id)"><a-button type="text" size="small" status="danger">删除</a-button></a-popconfirm>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑家长 -->
    <a-drawer v-model:visible="drawerVisible" :title="editingId ? '编辑家长' : '新增家长'" :width="480" @ok="handleSave" @cancel="drawerVisible = false">
      <a-form :model="pForm">
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="姓名"><a-input v-model="pForm.name" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="性别"><a-radio-group v-model="pForm.gender"><a-radio value="M">男</a-radio><a-radio value="F">女</a-radio></a-radio-group></a-form-item></a-col>
        </a-row>
        <a-form-item label="手机号"><a-input v-model="pForm.phone" /></a-form-item>
        <a-form-item label="邮箱"><a-input v-model="pForm.email" /></a-form-item>
        <a-form-item label="关系"><a-select v-model="pForm.relation"><a-option value="father">父亲</a-option><a-option value="mother">母亲</a-option><a-option value="guardian">监护人</a-option><a-option value="other">其他</a-option></a-select></a-form-item>
      </a-form>
    </a-drawer>

    <!-- 创建账号弹窗 -->
    <a-modal v-model:visible="showAccount" title="为家长创建账号" @ok="handleCreateAccount" @cancel="showAccount = false">
      <a-form><a-form-item label="用户名"><a-input v-model="acctForm.username" placeholder="登录用户名" /></a-form-item>
      <a-form-item label="密码"><a-input-password v-model="acctForm.password" placeholder="至少6位" /></a-form-item></a-form>
    </a-modal>

    <!-- 绑定学生弹窗 -->
    <a-modal v-model:visible="showBind" title="绑定学生" @ok="handleBind" @cancel="showBind = false">
      <a-form><a-form-item label="选择学生"><a-select v-model="bindStudentId" placeholder="请选择"><a-option v-for="s in studentOpts" :key="s.id" :value="s.id">{{ s.name }} ({{ s.studentNo }})</a-option></a-select></a-form-item></a-form>
    </a-modal>

    <!-- 重置密码 -->
    <a-modal v-model:visible="showReset" title="重置密码" @ok="handleResetPwd" @cancel="showReset = false">
      <a-form><a-form-item label="新密码"><a-input-password v-model="resetPwd" /></a-form-item></a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconUserGroup, IconPlus } from '@arco-design/web-vue/es/icon'
import { getParentList, createParent, updateParent, deleteParent, createParentAccount, bindStudent as apiBindStudent } from '@/api/accounts'
import { resetPassword } from '@/api/accounts'
import { getStudentList } from '@/api/personnel'

const keyword = ref(''); const list = ref<any[]>([]); const loading = ref(false)
const page = ref(1); const pageSize = 20; const total = ref(0)

const drawerVisible = ref(false); const editingId = ref('')
const pForm = ref({ name: '', gender: 'M', phone: '', email: '', relation: 'guardian' })

const showAccount = ref(false); const acctForm = ref({ username: '', password: '' }); const acctParentId = ref('')
const showBind = ref(false); const bindStudentId = ref(''); const bindParentId = ref(''); const studentOpts = ref<any[]>([])
const showReset = ref(false); const resetPwd = ref(''); const resetUserId = ref('')

async function load() { loading.value = true; try { const r = await getParentList({ keyword: keyword.value, page: page.value, pageSize }); list.value = r.list; total.value = r.total } finally { loading.value = false } }
function search() { page.value = 1; load() }
function onPage(p: number) { page.value = p; load() }

function openCreate() { editingId.value = ''; pForm.value = { name: '', gender: 'M', phone: '', email: '', relation: 'guardian' }; drawerVisible.value = true }
function openEdit(record: any) { editingId.value = record.id; pForm.value = { name: record.name, gender: record.gender, phone: record.phone, email: record.email, relation: record.relation }; drawerVisible.value = true }

async function handleSave() {
  if (!pForm.value.name || !pForm.value.phone) { Message.warning('姓名和手机号必填'); return }
  if (editingId.value) await updateParent(editingId.value, pForm.value)
  else await createParent(pForm.value)
  Message.success(editingId.value ? '更新成功' : '创建成功'); drawerVisible.value = false; load()
}

async function handleDelete(id: string) { await deleteParent(id); Message.success('已删除'); load() }

function openCreateAccount(record: any) { acctParentId.value = record.id; acctForm.value = { username: '', password: '' }; showAccount.value = true }
async function handleCreateAccount() {
  if (!acctForm.value.username || !acctForm.value.password) { Message.warning('请填写完整'); return }
  await createParentAccount(acctParentId.value, acctForm.value); Message.success('账号创建成功'); showAccount.value = false; load()
}

async function openBind(record: any) { bindParentId.value = record.id; bindStudentId.value = ''; const r = await getStudentList({ pageSize: 200 }); studentOpts.value = r.list; showBind.value = true }
async function handleBind() { if (!bindStudentId.value) return; await apiBindStudent(bindParentId.value, bindStudentId.value); Message.success('绑定成功'); showBind.value = false; load() }

function openResetPwd(record: any) { resetUserId.value = record.userId || record.user?.id; resetPwd.value = ''; showReset.value = true }
async function handleResetPwd() { if (!resetPwd.value) { Message.warning('请输入新密码'); return }; await resetPassword(resetUserId.value, resetPwd.value); Message.success('密码重置成功'); showReset.value = false }

onMounted(() => load())
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
.module-container { padding: 20px; }
.toolbar { margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
</style>
