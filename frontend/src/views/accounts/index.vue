<template>
  <div class="module-container">
    <a-card class="module-header" :bordered="false">
      <div class="module-title"><IconUserGroup /><span>账号管理</span></div>
      <p class="module-desc">管理系统内所有用户账号，包括教师、家长、职工及年级管理员的账号创建和权限分配</p>
    </a-card>

    <a-row :gutter="16" class="stats-row">
      <a-col :span="6" v-for="s in stats" :key="s.label">
        <a-card class="stat-card" :bordered="false" hoverable @click="router.push(s.path)">
          <div class="stat-icon" :style="{ background: s.color }"><component :is="s.icon" :size="36" /></div>
          <div class="stat-info">
            <div class="stat-value">{{ s.count }}</div>
            <div class="stat-label">{{ s.label }}</div>
            <div class="stat-desc">{{ s.desc }}</div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IconUser, IconUserGroup, IconIdcard, IconSafe } from '@arco-design/web-vue/es/icon'
import { getTeacherAccounts, getParentAccounts, getStaffAccounts, getGradeAdminList } from '@/api/accounts'

const router = useRouter()

const stats = ref([
  { label: '教师账号', count: 0, desc: '教师/班主任', icon: IconUser, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', path: '/accounts/teachers' },
  { label: '家长账号', count: 0, desc: '已绑定学生', icon: IconUserGroup, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', path: '/accounts/parents' },
  { label: '职工账号', count: 0, desc: '后勤/行政人员', icon: IconIdcard, color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', path: '/accounts/staff' },
  { label: '年级管理员', count: 0, desc: '年级级权限', icon: IconSafe, color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', path: '/accounts/grade-admins' },
])

onMounted(async () => {
  try {
    const [t, p, s, g] = await Promise.all([
      getTeacherAccounts({ pageSize: 1 }),
      getParentAccounts({ pageSize: 1 }),
      getStaffAccounts({ pageSize: 1 }),
      getGradeAdminList({ pageSize: 1 }),
    ])
    stats.value[0].count = t.total
    stats.value[1].count = p.total
    stats.value[2].count = s.total
    stats.value[3].count = g.total
  } catch { /* ignore */ }
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
.module-container { padding: 20px; }
.module-header { margin-bottom: 20px;
  .module-title { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 600; color: #1d2129; }
  .module-desc { margin-top: 8px; color: #86909c; font-size: 14px; }
}
.stats-row { margin-bottom: 20px;
  .stat-card { cursor: pointer;
    :deep(.arco-card-body) { display: flex; align-items: center; gap: 16px; padding: 24px; }
    .stat-icon { width: 64px; height: 64px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
    .stat-info {
      .stat-value { font-size: 28px; font-weight: 600; color: #1d2129; }
      .stat-label { font-size: 15px; font-weight: 500; color: #4e5969; margin: 2px 0; }
      .stat-desc { font-size: 12px; color: #86909c; }
    }
    &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: all 0.3s; }
  }
}
</style>
