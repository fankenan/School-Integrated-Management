<template>
  <div class="module-container">
    <a-card class="module-header" :bordered="false">
      <div class="module-title">
        <IconSafe />
        <span>校园卫生</span>
      </div>
      <p class="module-desc">校园卫生健康管理，包括学生体检、疾病防控、健康教育等</p>
    </a-card>

    <a-row :gutter="16" class="feature-grid">
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable>
          <div class="feature-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <IconFile />
          </div>
          <div class="feature-info">
            <div class="feature-name">学生体检</div>
            <div class="feature-desc">学生健康体检记录</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable>
          <div class="feature-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <IconExclamation />
          </div>
          <div class="feature-info">
            <div class="feature-name">疾病防控</div>
            <div class="feature-desc">传染病防控管理</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable>
          <div class="feature-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
            <IconBook />
          </div>
          <div class="feature-info">
            <div class="feature-name">健康教育</div>
            <div class="feature-desc">健康知识宣传教育</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable>
          <div class="feature-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
            <IconClock />
          </div>
          <div class="feature-info">
            <div class="feature-name">晨午检</div>
            <div class="feature-desc">学生晨午检记录</div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { IconSafe, IconFile, IconExclamation, IconBook, IconClock } from '@arco-design/web-vue/es/icon'
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