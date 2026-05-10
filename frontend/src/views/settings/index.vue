<template>
  <div class="settings-container">
    <a-card title="系统设置" :bordered="false">
      <a-tabs default-active-tab="basic">
        <a-tab-pane key="basic" title="基本设置">
          <a-form :model="form" layout="vertical" style="max-width: 500px">
            <a-form-item label="系统语言">
              <a-select v-model="form.language" placeholder="选择语言">
                <a-option value="zh-CN">简体中文</a-option>
                <a-option value="en">English</a-option>
              </a-select>
            </a-form-item>
            <a-form-item label="主题模式">
              <a-radio-group v-model="form.theme">
                <a-radio value="light">浅色</a-radio>
                <a-radio value="dark">深色</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleSave">保存设置</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="security" title="安全设置">
          <a-form :model="passwordForm" layout="vertical" style="max-width: 400px">
            <a-form-item label="当前密码">
              <a-input-password v-model="passwordForm.oldPassword" placeholder="请输入当前密码" />
            </a-form-item>
            <a-form-item label="新密码">
              <a-input-password v-model="passwordForm.newPassword" placeholder="请输入新密码" />
            </a-form-item>
            <a-form-item label="确认新密码">
              <a-input-password v-model="passwordForm.confirmPassword" placeholder="请再次输入新密码" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleChangePassword">修改密码</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Message } from '@arco-design/web-vue'

const form = reactive({ language: 'zh-CN', theme: 'light' })
const passwordForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })

const handleSave = () => Message.success('设置保存成功')
const handleChangePassword = () => Message.info('密码修改功能开发中')
</script>

<style scoped lang="scss">
.settings-container { padding: 20px; }
</style>