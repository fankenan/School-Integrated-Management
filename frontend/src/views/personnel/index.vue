<template>
  <div class="module-container">
    <a-card class="module-header" :bordered="false">
      <div class="module-title">
        <IconUserGroup />
        <span>人员管理</span>
      </div>
      <p class="module-desc">学校人员信息管理，包括学生、教师、职工等人员档案管理</p>
    </a-card>

    <a-row :gutter="16" class="feature-grid">
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable @click="router.push('/personnel/students')">
          <div class="feature-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)"><IconUser /></div>
          <div class="feature-info"><div class="feature-name">学生管理</div><div class="feature-desc">学生档案CRUD、学籍异动</div></div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable @click="router.push('/personnel/teachers')">
          <div class="feature-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"><IconUserGroup /></div>
          <div class="feature-info"><div class="feature-name">教师管理</div><div class="feature-desc">教师信息、职称、任教科目</div></div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable @click="router.push('/personnel/staff')">
          <div class="feature-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"><IconIdcard /></div>
          <div class="feature-info"><div class="feature-name">职工管理</div><div class="feature-desc">后勤/行政人员信息</div></div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="feature-card" :bordered="false" hoverable @click="router.push('/settings/departments')">
          <div class="feature-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"><IconUserGroup /></div>
          <div class="feature-info"><div class="feature-name">组织管理</div><div class="feature-desc">部门/年级/班级架构</div></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconUser, IconUserGroup, IconIdcard } from '@arco-design/web-vue/es/icon'

const router = useRouter()
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