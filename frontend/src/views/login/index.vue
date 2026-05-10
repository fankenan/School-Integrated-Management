<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>学校综合业务服务平台</h1>
        <p>School Integrated Management System</p>
      </div>

      <a-form ref="loginFormRef" :model="loginForm" :rules="loginRules" layout="vertical" class="login-form" @submit="handleLogin">
        <a-form-item field="username">
          <a-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            allow-clear
            size="large"
          >
            <template #prefix>
              <IconUser />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item field="password">
          <a-input-password
            v-model="loginForm.password"
            placeholder="请输入密码"
            allow-clear
            size="large"
          >
            <template #prefix>
              <IconLock />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" :loading="loading" size="large" long html-type="submit">
            {{ loading ? '登录中...' : '登 录' }}
          </a-button>
        </a-form-item>
      </a-form>

      <div class="login-footer">
        <p>&copy; 2025 学校综合业务服务平台 All Rights Reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import type { FormInstance } from '@arco-design/web-vue'
import { IconUser, IconLock } from '@arco-design/web-vue/es/icon'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名' },
    { minLength: 3, maxLength: 20, message: '用户名长度在 3 到 20 个字符' },
  ],
  password: [
    { required: true, message: '请输入密码' },
    { minLength: 6, message: '密码至少 6 个字符' },
  ],
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loading.value = true
    await userStore.login(loginForm)
    Message.success('登录成功')

    // 跳转到原来页面或首页
    const redirect = (route.query.redirect as string) || '/'
    await router.push(redirect)
  } catch (error: any) {
    console.error('Login error:', error)
    if (error.errorFields) {
      // 表单验证失败
      return
    }
    Message.error(error.message || '登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;

  // 添加背景纹理
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.08"><path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/></g></g></svg>');
  }

  .login-card {
    width: 420px;
    padding: 40px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    position: relative;
    z-index: 1;

    .login-header {
      text-align: center;
      margin-bottom: 32px;

      h1 {
        font-size: 24px;
        font-weight: 600;
        color: #1d2129;
        margin-bottom: 8px;
      }

      p {
        font-size: 14px;
        color: #86909c;
        margin: 0;
      }
    }

    .login-form {
      :deep(.arco-form-item) {
        margin-bottom: 24px;
      }

      :deep(.arco-input) {
        border-radius: 8px;
        border-color: #e5e6eb;

        &:hover,
        &.arco-input-focus {
          border-color: #165dff;
        }
      }

      :deep(.arco-btn-primary) {
        border-radius: 8px;
        height: 44px;
        font-size: 16px;
        font-weight: 500;

        &:hover {
          background-color: #0e42d2;
        }
      }
    }

    .login-footer {
      text-align: center;
      margin-top: 32px;
      color: #86909c;
      font-size: 13px;
    }
  }
}
</style>