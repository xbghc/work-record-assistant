<template>
  <div class="home-container">
    <div class="main-layout">
      <!-- 左侧编辑器 -->
      <div class="editor-panel">
        <form @submit.prevent>
          <!-- 基本信息 -->
          <BasicInfoForm v-model="reportData" />

          <!-- 折叠配置 -->
          <CollapsibleConfig v-model="reportData.collapsible" />

          <!-- 本周工作 -->
          <DynamicItemList
            type="outputs"
            :items="reportData.outputs"
            @update:items="updateItems('outputs', $event)"
          />

          <!-- 个人收获 -->
          <DynamicItemList
            type="achievements"
            :items="reportData.achievements"
            @update:items="updateItems('achievements', $event)"
          />

          <!-- 下周计划 -->
          <DynamicItemList
            type="plans"
            :items="reportData.plans"
            @update:items="updateItems('plans', $event)"
          />
        </form>
      </div>

      <!-- 右侧预览 -->
      <ReportPreview
        :report-data="reportData"
        :formatted-date-range="formattedDateRange"
        @clear-data="clearAllData"
        @export-report="exportReport"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import type { ReportData, ReportItem, PlanItem, ItemType } from '@/types/report'
import { useLocalStorage, getDefaultReportData } from '@/composables/useLocalStorage'
import { useReportExporter } from '@/composables/useReportExporter'
import BasicInfoForm from '@/components/report/BasicInfoForm.vue'
import CollapsibleConfig from '@/components/report/CollapsibleConfig.vue'
import DynamicItemList from '@/components/report/DynamicItemList.vue'
import ReportPreview from '@/components/report/ReportPreview.vue'

// 本地存储相关逻辑
const { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage, initializeDefaultData } =
  useLocalStorage()

// 响应式状态，用于存储所有表单数据
// 尝试从本地存储加载数据，如果没有则使用默认数据
const reportData = ref<ReportData>(loadFromLocalStorage() || getDefaultReportData())

// 初始化数据和默认项
onMounted(() => {
  // 检查是否有本地存储的数据
  const hasStoredData = loadFromLocalStorage() !== null

  // 只有在没有存储数据时才设置默认值
  if (!hasStoredData) {
    reportData.value = initializeDefaultData()
  }
})

// 监听数据变化，自动保存到本地存储
watch(
  reportData,
  (newData) => {
    saveToLocalStorage(newData)
  },
  { deep: true }, // 深度监听，确保嵌套对象的变化也能被捕获
)

// 计算属性，用于格式化日期范围
const formattedDateRange = computed((): string => {
  const { startDate, endDate } = reportData.value
  if (!startDate || !endDate) return '请选择日期范围'

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
})

// 报告导出功能
const { exportReport } = useReportExporter(reportData.value, formattedDateRange)

// 更新动态项列表
const updateItems = (type: ItemType, items: (ReportItem | PlanItem)[]) => {
  if (type === 'plans') {
    reportData.value[type] = items as PlanItem[]
  } else {
    reportData.value[type] = items as ReportItem[]
  }
}

// 清除所有数据
const clearAllData = (): void => {
  if (confirm('确定要清除所有数据吗？此操作不可撤销。')) {
    // 清除本地存储
    clearLocalStorage()

    // 重置为默认数据
    reportData.value = initializeDefaultData()
  }
}
</script>

<style scoped>
/* 主容器 - 适应导航栏布局 */
.home-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-light);
  align-items: center;
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  flex: 1;
  overflow: hidden;
  width: 100%;
  max-width: 1400px;
  padding: 20px;
  box-sizing: border-box;
}

/* 左侧编辑器 */
.editor-panel {
  background: white;
  padding: 30px;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* 滚动条样式 */
.editor-panel::-webkit-scrollbar {
  width: 8px;
}

.editor-panel::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.editor-panel::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.editor-panel::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-layout {
    max-width: 100%;
    padding: 15px;
    gap: 15px;
  }
}

@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
    height: auto;
    padding: 10px;
    gap: 20px;
  }

  .editor-panel {
    height: auto;
    max-height: 60vh;
  }
}

@media (max-width: 768px) {
  .home-container {
    align-items: stretch;
  }

  .main-layout {
    padding: 10px;
    gap: 15px;
  }
}
</style>
