<template>
  <div class="preview-panel">
    <div class="preview-controls">
      <h3 class="preview-title">实时预览</h3>

      <div class="preview-buttons">
        <button class="btn-clear" @click="$emit('clear-data')" title="清除所有数据并重新开始">
          🗑️ 清除数据
        </button>
        <div class="export-controls">
          <select v-model="selectedFormat" class="format-select">
            <option value="pdf">打印PDF</option>
            <option value="browser-html">浏览器HTML (完整文档)</option>
            <option value="email-html">邮件HTML (内联样式)</option>
          </select>
          <button class="btn-export" @click="handleExport">
            {{ getExportButtonText() }}
          </button>
        </div>
      </div>
    </div>
    <div class="preview-content" ref="previewContentRef">
      <div v-if="!isFormStarted" style="text-align: center; color: #999; padding: 100px 20px">
        <p style="font-size: 18px; margin-bottom: 10px">请填写左侧表单</p>
        <p style="font-size: 14px">预览内容将实时显示在这里</p>
      </div>

      <!-- 现代预览 -->
      <div v-else class="report-container">
        <div class="report-header">
          <h1 class="report-title">{{ reportData.reportTitle || '报告标题' }}</h1>
          <div class="report-meta">
            {{ reportData.name || '姓名' }} · {{ reportData.department || '部门' }} ·
            {{ formattedDateRange }}
          </div>
        </div>

        <div class="report-stats">
          <div class="stat-item">
            Bug/需求单: <span class="stat-value">{{ reportData.tasksCompleted }}</span>
          </div>
          <div class="stat-item">
            MR合并: <span class="stat-value">{{ reportData.commits }}</span>
          </div>
        </div>

        <ReportSection
          section-number="01"
          title="本周工作"
          :collapsible="reportData.collapsible.outputs"
          :item-count="validOutputs.length"
        >
          <CollapsibleItem
            v-for="output in validOutputs"
            :key="output.id"
            :item="output"
            card-class="output-card"
            default-title="未命名工作"
          >
            <template #content>
              <ul
                v-if="
                  output.content &&
                  output.content.split('\n').filter((line) => line.trim()).length > 1
                "
                style="margin: 0; padding-left: 20px"
              >
                <li
                  v-for="(line, i) in output.content.split('\n').filter((l) => l.trim())"
                  :key="i"
                  style="margin-bottom: 5px"
                >
                  {{ line }}
                </li>
              </ul>
              <p v-else>{{ output.content || '暂无描述' }}</p>
            </template>
          </CollapsibleItem>
        </ReportSection>

        <ReportSection
          section-number="02"
          title="个人收获"
          :collapsible="reportData.collapsible.achievements"
          :item-count="validAchievements.length"
        >
          <CollapsibleItem
            v-for="achievement in validAchievements"
            :key="achievement.id"
            :item="achievement"
            card-class="achievement-card"
            default-title="未命名个人收获"
          >
            <template #title>💡 {{ achievement.title || '未命名个人收获' }}</template>
            <template #content>
              <ul
                v-if="
                  achievement.content &&
                  achievement.content.split('\n').filter((line) => line.trim()).length > 1
                "
                style="margin: 0; padding-left: 20px"
              >
                <li
                  v-for="(line, i) in achievement.content.split('\n').filter((l) => l.trim())"
                  :key="i"
                  style="margin-bottom: 5px"
                >
                  {{ line }}
                </li>
              </ul>
              <p v-else>{{ achievement.content || '暂无描述' }}</p>
            </template>
          </CollapsibleItem>
        </ReportSection>

        <ReportSection
          section-number="03"
          title="下周计划"
          :collapsible="reportData.collapsible.plans"
        >
          <CollapsibleItem
            v-for="plan in validPlans"
            :key="plan.id"
            :item="plan"
            card-class="plan-card"
            default-title="未命名计划"
          >
            <template #title>
              <div>
                <div style="font-size: 13px; color: var(--primary-light); margin-bottom: 5px">
                  {{ (plan as any).time || '待定' }}
                </div>
                {{ plan.title || '未命名计划' }}
              </div>
            </template>
          </CollapsibleItem>
        </ReportSection>

        <div class="report-footer">
          {{ reportData.name || '姓名' }} · {{ reportData.department || '部门' }} ·
          {{ new Date().toLocaleDateString('zh-CN') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ReportData, ReportItem, PlanItem } from '@/types/report'
import { usePDFGenerator } from '@/composables/usePDFGenerator'
import ReportSection from './ReportSection.vue'
import CollapsibleItem from './CollapsibleItem.vue'

interface Props {
  reportData: ReportData
  formattedDateRange: string
}

interface Emits {
  (e: 'clear-data'): void
  (e: 'export-report', format: 'web' | 'outlook'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const previewContentRef = ref<HTMLElement | null>(null)
const selectedFormat = ref<'pdf' | 'browser-html' | 'email-html'>('pdf')

// 获取PDF生成函数
const formattedDateRangeComputed = computed(() => props.formattedDateRange)
const reportDataRef = computed(() => props.reportData)
const { generatePDF, downloadBrowserHTML, downloadEmailHTML } = usePDFGenerator(
  reportDataRef,
  formattedDateRangeComputed,
)

// 处理导出
const handleExport = async () => {
  try {
    switch (selectedFormat.value) {
      case 'pdf':
        await generatePDF()
        break
      case 'browser-html':
        downloadBrowserHTML()
        break
      case 'email-html':
        downloadEmailHTML()
        break
      default:
        await generatePDF()
    }
  } catch (error) {
    console.error('导出失败:', error)
    alert('导出失败，请重试')
  }
}

// 获取导出按钮文字
const getExportButtonText = () => {
  switch (selectedFormat.value) {
    case 'pdf':
      return '打印PDF'
    case 'browser-html':
      return '下载浏览器版'
    case 'email-html':
      return '下载邮件版'
    default:
      return '打印PDF'
  }
}

// 计算属性，过滤掉完全为空的动态项，使预览更整洁
const validOutputs = computed((): ReportItem[] =>
  props.reportData.outputs.filter((item: ReportItem) => item.title || item.content),
)
const validAchievements = computed((): ReportItem[] =>
  props.reportData.achievements.filter((item: ReportItem) => item.title || item.content),
)
const validPlans = computed((): PlanItem[] =>
  props.reportData.plans.filter((item: PlanItem) => item.title || item.content || item.time),
)

// 计算属性，判断用户是否已开始填写表单
const isFormStarted = computed((): boolean => {
  return !!(
    props.reportData.reportTitle !== '工作周报' ||
    props.reportData.name ||
    props.reportData.department ||
    validOutputs.value.length > 0 ||
    validAchievements.value.length > 0 ||
    validPlans.value.length > 0
  )
})
</script>

<style scoped>
.preview-panel {
  background: white;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.preview-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-light);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  flex-shrink: 0;
}

.preview-title {
  font-size: 18px;
  color: var(--primary-dark);
  margin: 0;
}

.preview-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.export-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.format-select {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  color: var(--primary-dark);
  cursor: pointer;
  outline: none;
  transition: border-color 0.3s;
}

.format-select:hover,
.format-select:focus {
  border-color: var(--primary-dark);
}

.btn-export {
  background: var(--success);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-export:hover {
  background: #45a049;
}

.btn-clear {
  background: var(--danger);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-clear:hover {
  background: #d32f2f;
}

.preview-content {
  padding: 30px;
  flex-grow: 1;
  overflow-y: auto;
}

.report-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.report-header {
  background: var(--primary-dark);
  color: white;
  padding: 40px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.report-title {
  font-size: 32px;
  font-weight: 300;
  margin-bottom: 10px;
  margin-top: 0;
}

.report-meta {
  color: var(--primary-light);
  font-size: 14px;
}

.report-stats {
  background: var(--bg-light);
  padding: 15px 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  border-bottom: 1px solid var(--border-color);
}

.stat-item {
  font-size: 13px;
  color: var(--text-secondary);
}

.stat-value {
  font-weight: 600;
  color: var(--primary-dark);
  font-size: 16px;
}

.output-card,
.achievement-card,
.plan-card {
  background: var(--bg-light);
  padding: 20px;
  margin-bottom: 15px;
  border-left: 3px solid var(--primary-dark);
  border-radius: 4px;
}

.card-title {
  font-size: 16px;
  color: var(--primary-dark);
  margin-bottom: 10px;
  font-weight: 500;
  margin-top: 0;
}

.card-content {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.report-footer {
  background: var(--primary-dark);
  color: var(--primary-light);
  padding: 20px 40px;
  text-align: center;
  font-size: 13px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .preview-content {
    padding: 25px;
  }

  .report-container {
    max-width: 100%;
  }

  .preview-mode-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .mode-selector {
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .preview-content {
    padding: 20px;
  }

  .preview-controls {
    padding: 15px;
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .preview-buttons {
    justify-content: center;
  }

  .export-controls {
    justify-content: center;
  }

  .report-header {
    padding: 30px 20px;
  }

  .report-title {
    font-size: 28px;
  }

  .report-stats {
    padding: 15px 20px;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .preview-content {
    padding: 15px;
  }

  .report-header {
    padding: 25px 15px;
  }

  .report-title {
    font-size: 24px;
  }

  .report-stats {
    padding: 15px;
    flex-direction: column;
    gap: 10px;
  }

  .preview-controls {
    padding: 12px;
  }

  .format-select,
  .btn-export,
  .btn-clear {
    font-size: 13px;
    padding: 6px 12px;
  }
}
</style>
