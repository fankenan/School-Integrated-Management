<template>
  <div class="module-container">
    <a-card class="module-header" :bordered="false">
      <div class="module-title">
        <IconSafe />
        <span>校园安全</span>
      </div>
      <p class="module-desc">校园安全保障与管理，包括安全排查、门禁管理、应急预案等</p>
    </a-card>

    <a-row :gutter="16" class="feature-grid">
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable>
          <div class="feature-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <IconSearch />
          </div>
          <div class="feature-info">
            <div class="feature-name">安全排查</div>
            <div class="feature-desc">校园安全隐患排查</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable>
          <div class="feature-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <IconLock />
          </div>
          <div class="feature-info">
            <div class="feature-name">门禁管理</div>
            <div class="feature-desc">门禁系统管理</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable>
          <div class="feature-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
            <IconFire />
          </div>
          <div class="feature-info">
            <div class="feature-name">消防安全</div>
            <div class="feature-desc">消防设施与演练</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable>
          <div class="feature-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
            <IconExclamation />
          </div>
          <div class="feature-info">
            <div class="feature-name">应急预案</div>
            <div class="feature-desc">突发事件应急预案</div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { IconSafe, IconSearch, IconLock, IconFire, IconExclamation } from '@arco-design/web-vue/es/icon'
</script>

<style scoped lang="scss">
.module-container {
  padding: 20px;

  .module-header {
    margin-bottom: 20px;

    .module-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 600;
      color: #1d2129;
    }

    .module-desc {
      color: #86909c;
      margin: 8px 0 0 0;
    }
  }

  .feature-grid {
    .feature-card {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      :deep(.arco-card-body) {
        padding: 20px;
      }

      .feature-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 24px;
        margin-bottom: 12px;
      }

      .feature-info {
        .feature-name {
          font-size: 16px;
          font-weight: 500;
          color: #1d2129;
          margin-bottom: 4px;
        }

        .feature-desc {
          font-size: 12px;
          color: #86909c;
        }
      }
    }
  }
}
</style>