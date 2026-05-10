<template>
  <div class="module-container">
    <a-card class="module-header" :bordered="false">
      <div class="module-title">
        <IconHeart />
        <span>德育管理</span>
      </div>
      <p class="module-desc">学生思想品德教育与管理，包括学生评价、班主任工作、心理健康等</p>
    </a-card>

    <a-row :gutter="16" class="feature-grid">
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable>
          <div class="feature-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <IconStar />
          </div>
          <div class="feature-info">
            <div class="feature-name">学生评价</div>
            <div class="feature-desc">学生综合素质评价</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable>
          <div class="feature-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <IconUser />
          </div>
          <div class="feature-info">
            <div class="feature-name">班主任工作</div>
            <div class="feature-desc">班主任日常管理</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable>
          <div class="feature-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
            <IconHeart />
          </div>
          <div class="feature-info">
            <div class="feature-name">心理健康</div>
            <div class="feature-desc">学生心理健康档案</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable>
          <div class="feature-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
            <IconTool />
          </div>
          <div class="feature-info">
            <div class="feature-name">奖惩管理</div>
            <div class="feature-desc">学生奖惩记录</div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { IconHeart, IconStar, IconUser, IconTool } from '@arco-design/web-vue/es/icon'
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