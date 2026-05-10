<template>
  <div class="dashboard">
    <a-card class="welcome-card" :bordered="false">
      <div class="welcome-content">
        <a-avatar :size="64" :style="{ backgroundColor: '#165dff' }">
          {{ userStore.userInfo?.realName?.charAt(0) }}
        </a-avatar>
        <div class="welcome-text">
          <h2>欢迎回来，{{ userStore.userInfo?.realName }}</h2>
          <p>今天是 {{ currentDate }}，欢迎使用学校综合业务服务平台</p>
        </div>
      </div>
    </a-card>

    <a-row :gutter="16" class="stats-row">
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              <IconUser :size="32" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.studentCount }}</div>
              <div class="stat-label">学生总数</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
              <IconBook :size="32" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.teacherCount }}</div>
              <div class="stat-label">教师总数</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
              <IconHome :size="32" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.classCount }}</div>
              <div class="stat-label">班级总数</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
              <IconNotification :size="32" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.noticeCount }}</div>
              <div class="stat-label">待处理通知</div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" class="content-row">
      <a-col :span="16">
        <a-card class="card" :bordered="false">
          <template #title>
            <div class="card-title">
              <IconApps />
              <span>快捷入口</span>
            </div>
          </template>

          <div class="quick-links">
            <div
              v-for="link in quickLinks"
              :key="link.name"
              class="quick-link"
              @click="router.push(link.path)"
            >
              <div class="quick-link-icon">
                <component :is="getIcon(link.icon)" :size="32" />
              </div>
              <div class="quick-link-info">
                <div class="quick-link-name">{{ link.name }}</div>
                <div class="quick-link-desc">{{ link.desc }}</div>
              </div>
              <IconRight />
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :span="8">
        <a-card class="card" :bordered="false">
          <template #title>
            <div class="card-title">
              <IconNotification />
              <span>最新通知</span>
              <a-badge :count="recentNotices.length" :max-count="99" />
            </div>
          </template>

          <div class="notice-list">
            <div
              v-for="item in recentNotices"
              :key="item.id"
              class="notice-item"
            >
              <div class="notice-content">
                <div class="notice-title">{{ item.title }}</div>
                <div class="notice-time">{{ item.time }}</div>
              </div>
              <IconRight />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  IconUser,
  IconBook,
  IconHome,
  IconNotification,
  IconApps,
  IconRight,
  IconCalendar,
  IconDashboard,
  IconLock,
  IconTool,
} from '@arco-design/web-vue/es/icon'
import dayjs from 'dayjs'

const router = useRouter()
const userStore = useUserStore()

const currentDate = computed(() => dayjs().format('YYYY年MM月DD日'))

// 模拟统计数据
const stats = ref({
  studentCount: 1256,
  teacherCount: 86,
  classCount: 32,
  noticeCount: 5,
})

// 快捷入口
const quickLinks = [
  { name: '公文处理', desc: '处理公文流转', icon: 'FileText', path: '/office/documents' },
  { name: '课程安排', desc: '查看课程表', icon: 'Calendar', path: '/teaching/schedule' },
  { name: '班级管理', desc: '管理班级信息', icon: 'Home', path: '/teaching/classes' },
  { name: '安全排查', desc: '安全检查记录', icon: 'Lock', path: '/safety/inspection' },
  { name: '维修申请', desc: '设施维修请求', icon: 'Tool', path: '/logistics/repair' },
  { name: '学生管理', desc: '学生档案管理', icon: 'User', path: '/personnel/students' },
]

// 最新通知
const recentNotices = ref([
  { id: 1, title: '关于开展全校安全大检查的通知', time: '2025-05-09 08:30' },
  { id: 2, title: '本周五下午召开全校教职工大会', time: '2025-05-08 16:20' },
  { id: 3, title: '关于食堂用餐时间调整的通知', time: '2025-05-08 09:15' },
  { id: 4, title: '2025年春季学期教学安排通知', time: '2025-05-07 14:00' },
  { id: 5, title: '关于加强校园卫生管理的通知', time: '2025-05-06 10:30' },
])

// 获取图标组件
const getIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'icon-user': IconUser,
    'icon-book': IconBook,
    'icon-home': IconHome,
    'icon-notification': IconNotification,
    'icon-apps': IconApps,
    'icon-calendar': IconCalendar,
    'icon-dashboard': IconDashboard,
    'icon-lock': IconLock,
    'icon-tool': IconTool,
  }
  const key = `icon-${iconName.toLowerCase()}`
  return iconMap[key] || IconApps
}

onMounted(() => {
  // 这里可以加载实际的统计数据
})
</script>

<style scoped lang="scss">
.dashboard {
  padding: 20px;

  .welcome-card {
    margin-bottom: 20px;

    .welcome-content {
      display: flex;
      align-items: center;
      gap: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 32px;
      border-radius: 12px;

      .welcome-text {
        color: #ffffff;
        flex: 1;

        h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        p {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
        }
      }
    }
  }

  .stats-row {
    margin-bottom: 20px;

    .stat-card {
      :deep(.arco-card-body) {
        padding: 20px;
      }

      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;

        .stat-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .stat-info {
          flex: 1;

          .stat-value {
            font-size: 32px;
            font-weight: 600;
            color: #1d2129;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 14px;
            color: #86909c;
          }
        }
      }
    }
  }

  .content-row {
    .card {
      :deep(.arco-card-body) {
        padding: 20px;
      }

      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        color: #1d2129;
      }

      .quick-links {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;

        .quick-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background-color: #f7f8fa;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid transparent;

          &:hover {
            background-color: #e8f3ff;
            border-color: #165dff;
            transform: translateX(4px);
          }

          .quick-link-icon {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #165dff;
          }

          .quick-link-info {
            flex: 1;

            .quick-link-name {
              font-size: 14px;
              font-weight: 500;
              color: #1d2129;
              margin-bottom: 4px;
            }

            .quick-link-desc {
              font-size: 12px;
              color: #86909c;
            }
          }

          .arco-icon {
            color: #86909c;
            font-size: 14px;
          }
        }
      }

      .notice-list {
        .notice-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s;

          &:hover {
            background-color: #f7f8fa;
          }

          .notice-content {
            flex: 1;
            margin-right: 12px;

            .notice-title {
              font-size: 14px;
              color: #1d2129;
              margin-bottom: 4px;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .notice-time {
              font-size: 12px;
              color: #86909c;
            }
          }

          .arco-icon {
            color: #c9cdd4;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>