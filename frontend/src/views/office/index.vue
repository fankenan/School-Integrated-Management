<template>
  <div class="office-container">
    <a-card class="module-header" :bordered="false">
      <div class="module-title">
        <IconApps />
        <span>办公管理</span>
      </div>
      <p class="module-desc">处理日常办公事务，包括公文流转、请假审批、通知公告等</p>
    </a-card>

    <a-row :gutter="16" class="feature-grid">
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable @click="navigateTo('/office/documents')">
          <div class="feature-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <IconFile />
          </div>
          <div class="feature-info">
            <div class="feature-name">公文处理</div>
            <div class="feature-desc">公文起草、审批、发布</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable>
          <div class="feature-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <IconSchedule />
          </div>
          <div class="feature-info">
            <div class="feature-name">请假审批</div>
            <div class="feature-desc">教职工请假申请与审批</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable>
          <div class="feature-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
            <IconMessage />
          </div>
          <div class="feature-info">
            <div class="feature-name">通知公告</div>
            <div class="feature-desc">学校通知发布与管理</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable>
          <div class="feature-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
            <IconHistory />
          </div>
          <div class="feature-info">
            <div class="feature-name">考勤管理</div>
            <div class="feature-desc">教职工日常考勤记录</div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-card class="content-card" :bordered="false">
      <router-view />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { IconApps, IconFile, IconSchedule, IconMessage, IconHistory } from '@arco-design/web-vue/es/icon'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped lang="scss">
.office-container {
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
    margin-bottom: 20px;

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

  .content-card {
    min-height: 400px;

    :deep(.arco-card-body) {
      padding: 20px;
    }
  }
}
</style>