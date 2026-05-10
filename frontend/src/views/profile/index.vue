<template>
  <div class="profile-container">
    <a-card class="profile-header" :bordered="false">
      <div class="profile-avatar">
        <a-avatar :size="80" :style="{ backgroundColor: '#165dff' }">
          {{ userStore.userInfo?.realName?.charAt(0) || 'U' }}
        </a-avatar>
        <div class="profile-name">
          <h2>{{ userStore.userInfo?.realName || '未知用户' }}</h2>
          <p>{{ userStore.userInfo?.username }}</p>
        </div>
      </div>
    </a-card>

    <a-row :gutter="16" class="profile-content">
      <a-col :span="16">
        <a-card title="基本信息" :bordered="false">
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="用户名">{{ userStore.userInfo?.username }}</a-descriptions-item>
            <a-descriptions-item label="姓名">{{ userStore.userInfo?.realName }}</a-descriptions-item>
            <a-descriptions-item label="邮箱">{{ userStore.userInfo?.email || '-' }}</a-descriptions-item>
            <a-descriptions-item label="手机号">{{ userStore.userInfo?.phone || '-' }}</a-descriptions-item>
            <a-descriptions-item label="部门">{{ userStore.userInfo?.departmentName || '-' }}</a-descriptions-item>
            <a-descriptions-item label="角色">{{ userStore.userInfo?.roles?.map(r => r.name).join(', ') || '-' }}</a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="账户安全" :bordered="false">
          <a-list>
            <a-list-item>
              <a-list-item-meta title="账户密码">
                <template #description>建议定期修改密码</template>
              </a-list-item-meta>
              <template #actions>
                <a-button type="text" size="small" @click="handleChangePassword">
                  <template #icon><IconEdit /></template>
                  修改
                </a-button>
              </template>
            </a-list-item>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { Message } from '@arco-design/web-vue'
import { IconEdit } from '@arco-design/web-vue/es/icon'

const userStore = useUserStore()

const handleChangePassword = () => {
  Message.info('密码修改功能开发中')
}
</script>

<style scoped lang="scss">
.profile-container {
  padding: 20px;

  .profile-header {
    margin-bottom: 20px;

    .profile-avatar {
      display: flex;
      align-items: center;
      gap: 20px;

      .profile-name {
        h2 { font-size: 20px; font-weight: 600; color: #1d2129; margin-bottom: 4px; }
        p { color: #86909c; margin: 0; }
      }
    }
  }
}
</style>