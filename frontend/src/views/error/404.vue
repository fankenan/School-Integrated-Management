<template>
  <div class="error-page">
    <a-result status="404" title="404" sub-title="抱歉，您访问的页面不存在">
      <template #extra>
        <a-button type="primary" @click="goHome">返回首页</a-button>
      </template>
    </a-result>
    <div class="error-description">请检查您输入的网址是否正确，或者联系管理员</div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.error-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f2f3f5;

  :deep(.arco-result) {
    .arco-result-icon {
      .arco-icon {
        font-size: 120px;
        color: #165dff;
      }
    }

    .arco-result-title {
      font-size: 24px;
      font-weight: 600;
      color: #1d2129;
    }

    .arco-result-subtitle {
      font-size: 14px;
      color: #86909c;
    }
  }

  .error-description {
    margin-top: 16px;
    font-size: 14px;
    color: #86909c;
    text-align: center;
  }
}
</style>