<template>
  <div class="default-layout">
    <!-- 侧边栏 -->
    <a-layout-sider
      :width="isCollapse ? 64 : 240"
      :collapsed="isCollapse"
      :collapsible="false"
      class="sidebar"
    >
      <div class="sidebar-header">
        <template v-if="!isCollapse">
          <div class="logo">
            <icon-school class="logo-icon" />
            <span class="logo-text">学校管理平台</span>
          </div>
        </template>
        <div v-else class="logo-collapsed">
          <icon-school />
        </div>
      </div>

      <a-menu
        :default-selected-keys="[activeMenu]"
        :collapsed="isCollapse"
        :auto-open-selected="true"
        :style="{ width: isCollapse ? '64px' : '240px' }"
        class="sidebar-menu"
      >
        <template v-for="route in menuRoutes" :key="route.path">
          <!-- 没有子菜单的路由 -->
          <a-menu-item v-if="!route.children || route.children.length === 0" :key="route.path">
            <template #icon>
              <component :is="getIcon(route.meta?.icon)" />
            </template>
            {{ route.meta?.title }}
          </a-menu-item>

          <!-- 有子菜单的路由 -->
          <a-sub-menu v-else :key="route.path">
            <template #icon>
              <component :is="getIcon(route.meta?.icon)" />
            </template>
            <template #title>{{ route.meta?.title }}</template>

            <a-menu-item
              v-for="child in route.children"
              :key="route.path + '/' + child.path"
            >
              <template #icon>
                <component :is="getIcon(child.meta?.icon)" />
              </template>
              {{ child.meta?.title }}
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>

    <!-- 主体内容 -->
    <a-layout class="main-layout">
      <!-- 顶部导航 -->
      <a-layout-header class="header">
        <div class="header-left">
          <a-button type="text" @click="toggleCollapse">
            <template #icon>
              <component :is="isCollapse ? 'icon-menu-unfold' : 'icon-menu-fold'" />
            </template>
          </a-button>

          <a-breadcrumb>
            <a-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
              {{ item.meta?.title }}
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <div class="header-right">
          <a-space :size="16">
            <a-button type="text" shape="circle">
              <template #icon>
                <icon-notification />
              </template>
            </a-button>

            <a-dropdown trigger="click" @select="handleCommand">
              <div class="user-info">
                <a-avatar :size="32" :style="{ backgroundColor: '#165dff' }">
                  {{ userStore.userInfo?.realName?.charAt(0) }}
                </a-avatar>
                <span class="user-name">{{ userStore.userInfo?.realName }}</span>
                <icon-down />
              </div>
              <template #content>
                <a-doption value="profile">
                  <icon-user />
                  <span>个人中心</span>
                </a-doption>
                <a-doption value="settings">
                  <icon-settings />
                  <span>系统设置</span>
                </a-doption>
                <a-doption value="logout">
                  <icon-export />
                  <span>退出登录</span>
                </a-doption>
              </template>
            </a-dropdown>
          </a-space>
        </div>
      </a-layout-header>

      <!-- 页面内容 -->
      <a-layout-content class="main-content">
        <div class="content-wrapper">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Modal, Message } from '@arco-design/web-vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isCollapse = ref(false)

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 菜单路由（从路由中过滤出需要显示在侧边栏的路由）
const menuRoutes = computed(() => {
  const routes = router.getRoutes()
  return routes
    .filter(
      (r) =>
        r.path !== '/' &&
        r.path !== '/login' &&
        r.meta?.title &&
        !r.meta?.ignoreAuth &&
        r.children?.length > 0
    )
    .sort(() => 0)
})

// 面包屑
const breadcrumbs = computed(() => {
  const matched = route.matched.filter((item) => item.meta?.title)
  return matched
})

// 获取图标组件
const getIcon = (iconName?: string) => {
  if (!iconName) return 'icon-apps'
  return `icon-${iconName.toLowerCase()}`
}

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 处理下拉菜单命令
const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      try {
        await Modal.confirm({
          title: '确认退出',
          content: '确定要退出登录吗？',
          okText: '确定',
          cancelText: '取消',
        })
        await userStore.logout()
        Message.success('退出登录成功')
        router.push('/login')
      } catch {
        // 用户取消操作
      }
      break
  }
}
</script>

<style scoped lang="scss">
.default-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #f2f3f5;

  .sidebar {
    background-color: #ffffff;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
    z-index: 100;

    .sidebar-header {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ffffff;
      border-bottom: 1px solid #e5e6eb;
      padding: 0 16px;

      .logo {
        display: flex;
        align-items: center;
        gap: 12px;

        .logo-icon {
          font-size: 24px;
          color: #165dff;
        }

        .logo-text {
          font-size: 16px;
          font-weight: 600;
          color: #1d2129;
          white-space: nowrap;
        }
      }

      .logo-collapsed {
        .arco-icon {
          font-size: 24px;
          color: #165dff;
        }
      }
    }

    .sidebar-menu {
      border-right: none;
      background-color: #ffffff;
      height: calc(100vh - 60px);
      overflow-y: auto;

      :deep(.arco-menu-item) {
        margin: 4px 12px;
        border-radius: 6px;

        &:hover {
          background-color: #f2f3f5;
        }

        &.arco-menu-selected {
          background-color: #e8f3ff;
          color: #165dff;

          &::before {
            background-color: #165dff;
          }
        }
      }

      :deep(.arco-menu-inline-header) {
        margin: 4px 12px;
        border-radius: 6px;

        &:hover {
          background-color: #f2f3f5;
        }
      }
    }
  }

  .main-layout {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .header {
      background-color: #ffffff;
      border-bottom: 1px solid #e5e6eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      height: 60px;

      .header-left {
        display: flex;
        align-items: center;
        gap: 16px;

        :deep(.arco-btn) {
          color: #4e5969;

          &:hover {
            color: #165dff;
          }
        }

        :deep(.arco-breadcrumb) {
          .arco-breadcrumb-item {
            color: #4e5969;
          }

          .arco-breadcrumb-item-link {
            color: #86909c;

            &:hover {
              color: #165dff;
            }
          }
        }
      }

      .header-right {
        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: background-color 0.3s;

          &:hover {
            background-color: #f2f3f5;
          }

          .user-name {
            font-size: 14px;
            color: #1d2129;
            font-weight: 500;
          }

          .arco-icon {
            color: #86909c;
            font-size: 12px;
          }
        }
      }
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;

      .content-wrapper {
        min-height: 100%;
      }
    }
  }
}

// 页面切换动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>