<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <h3>公文处理</h3>
          <el-button type="primary" @click="handleCreate">新建公文</el-button>
        </div>
      </template>
      
      <el-empty description="公文处理模块开发中..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
const handleCreate = () => {
  console.log('新建公文')
}
</script>

<style scoped lang="scss">
.page-container {
  .page-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        font-size: 16px;
        color: #303133;
      }
    }
  }
}
</style>