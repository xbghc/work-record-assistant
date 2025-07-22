<template>
  <div class="home-container">
    <div class="main-layout">
      <!-- 左侧编辑器 -->
      <div class="editor-panel">
        <form @submit.prevent>
          <!-- 基本信息 -->
          <div class="form-section">
            <h2 class="section-header">基本信息</h2>
            <div class="form-group">
              <label class="form-label">报告标题</label>
              <input
                type="text"
                class="form-input"
                v-model="reportData.reportTitle"
                placeholder="请输入报告标题（如：工作周报、月度总结等）"
                required
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">姓名</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="reportData.name"
                  placeholder="请输入姓名"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">部门</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="reportData.department"
                  placeholder="请输入部门"
                  required
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">开始日期</label>
                <input type="date" class="form-input" v-model="reportData.startDate" required />
              </div>
              <div class="form-group">
                <label class="form-label">结束日期</label>
                <input type="date" class="form-input" v-model="reportData.endDate" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">完成Bug/需求单</label>
                <input
                  type="number"
                  class="form-input"
                  v-model.number="reportData.tasksCompleted"
                  placeholder="12"
                />
              </div>
              <div class="form-group">
                <label class="form-label">MR合并数</label>
                <input
                  type="number"
                  class="form-input"
                  v-model.number="reportData.commits"
                  placeholder="28"
                />
              </div>
            </div>
          </div>

          <!-- 本周工作 -->
          <div class="form-section">
            <h2 class="section-header">本周工作</h2>
            <div class="dynamic-section">
              <div
                v-for="(item, index) in reportData.outputs"
                :key="item.id"
                class="item-container"
              >
                <div class="item-header">
                  <span class="item-title">本周工作 {{ index + 1 }}</span>
                  <button type="button" class="btn-remove" @click="removeItem('outputs', index)">
                    删除
                  </button>
                </div>
                <div class="form-group">
                  <input
                    type="text"
                    class="form-input"
                    v-model="item.title"
                    placeholder="工作标题"
                  />
                </div>
                <div class="form-group">
                  <textarea
                    class="form-textarea"
                    v-model="item.content"
                    placeholder="详细描述（支持换行，每行将显示为一个列表项）"
                  ></textarea>
                </div>
              </div>
            </div>
            <button type="button" class="btn-add" @click="addItem('outputs')">
              + 添加本周工作
            </button>
          </div>

          <!-- 个人收获 -->
          <div class="form-section">
            <h2 class="section-header">个人收获</h2>
            <div class="dynamic-section">
              <div
                v-for="(item, index) in reportData.achievements"
                :key="item.id"
                class="item-container"
              >
                <div class="item-header">
                  <span class="item-title">个人收获 {{ index + 1 }}</span>
                  <button
                    type="button"
                    class="btn-remove"
                    @click="removeItem('achievements', index)"
                  >
                    删除
                  </button>
                </div>
                <div class="form-group">
                  <input
                    type="text"
                    class="form-input"
                    v-model="item.title"
                    placeholder="个人收获标题"
                  />
                </div>
                <div class="form-group">
                  <textarea
                    class="form-textarea"
                    v-model="item.content"
                    placeholder="详细描述"
                  ></textarea>
                </div>
              </div>
            </div>
            <button type="button" class="btn-add" @click="addItem('achievements')">
              + 添加个人收获
            </button>
          </div>

          <!-- 下周计划 -->
          <div class="form-section">
            <h2 class="section-header">下周计划</h2>
            <div class="dynamic-section">
              <div v-for="(item, index) in reportData.plans" :key="item.id" class="item-container">
                <div class="item-header">
                  <span class="item-title">计划 {{ index + 1 }}</span>
                  <button type="button" class="btn-remove" @click="removeItem('plans', index)">
                    删除
                  </button>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-input"
                      v-model="item.title"
                      placeholder="计划标题"
                    />
                  </div>
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-input"
                      v-model="item.time"
                      placeholder="时间安排（如：周一-周二）"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <textarea
                    class="form-textarea"
                    v-model="item.content"
                    placeholder="详细描述"
                  ></textarea>
                </div>
              </div>
            </div>
            <button type="button" class="btn-add" @click="addItem('plans')">+ 添加计划</button>
          </div>
        </form>
      </div>

      <!-- 右侧预览 -->
      <div class="preview-panel">
        <div class="preview-controls">
          <h3 class="preview-title">实时预览</h3>
          <div class="preview-buttons">
            <button class="btn-clear" @click="clearAllData" title="清除所有数据并重新开始">
              🗑️ 清除数据
            </button>
            <button class="btn-export" @click="exportReport">导出HTML</button>
          </div>
        </div>
        <div class="preview-content" ref="previewContentRef">
          <div v-if="!isFormStarted" style="text-align: center; color: #999; padding: 100px 20px">
            <p style="font-size: 18px; margin-bottom: 10px">请填写左侧表单</p>
            <p style="font-size: 14px">预览内容将实时显示在这里</p>
          </div>
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
              <div class="stat-item">
                本周工作: <span class="stat-value">{{ validOutputs.length }}</span>
              </div>
              <div class="stat-item">
                个人收获: <span class="stat-value">{{ validAchievements.length }}</span>
              </div>
            </div>

            <div class="report-section">
              <h2 class="report-section-title">
                <span style="color: var(--primary-light); font-size: 18px">01</span> 本周工作
              </h2>
              <div v-for="output in validOutputs" :key="output.id" class="output-card">
                <h3 class="card-title">{{ output.title || '未命名工作' }}</h3>
                <div class="card-content">
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
                </div>
              </div>
            </div>

            <div class="report-section">
              <h2 class="report-section-title">
                <span style="color: var(--primary-light); font-size: 18px">02</span> 个人收获
              </h2>
              <div
                style="
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                  gap: 15px;
                "
              >
                <div
                  v-for="(achievement, index) in validAchievements"
                  :key="achievement.id"
                  class="achievement-card"
                >
                  <h3 class="card-title">
                    {{ ['💡', '🤝', '📊', '🎯'][index % 4] }}
                    {{ achievement.title || '未命名个人收获' }}
                  </h3>
                  <div class="card-content">{{ achievement.content || '暂无描述' }}</div>
                </div>
              </div>
            </div>

            <div class="report-section">
              <h2 class="report-section-title">
                <span style="color: var(--primary-light); font-size: 18px">03</span> 下周计划
              </h2>
              <div v-for="plan in validPlans" :key="plan.id" class="plan-card">
                <div style="font-size: 13px; color: var(--primary-light); margin-bottom: 5px">
                  {{ plan.time || '待定' }}
                </div>
                <h3 class="card-title">{{ plan.title || '未命名计划' }}</h3>
                <div class="card-content">{{ plan.content || '暂无描述' }}</div>
              </div>
            </div>

            <div class="report-footer">
              {{ reportData.name || '姓名' }} · {{ reportData.department || '部门' }} ·
              {{ new Date().toLocaleDateString('zh-CN') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

// 定义数据类型接口
interface ReportItem {
  id: number
  title: string
  content: string
}

interface PlanItem extends ReportItem {
  time: string
}

interface ReportData {
  reportTitle: string
  name: string
  department: string
  startDate: string
  endDate: string
  tasksCompleted: number
  commits: number
  outputs: ReportItem[]
  achievements: ReportItem[]
  plans: PlanItem[]
}

// 本地存储相关常量和函数
const STORAGE_KEY = 'weekly-report-data'

// 保存数据到本地存储
const saveToLocalStorage = (data: ReportData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn('无法保存数据到本地存储:', error)
  }
}

// 从本地存储加载数据
const loadFromLocalStorage = (): ReportData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // 验证数据结构的完整性
      if (parsed && typeof parsed === 'object') {
        return parsed as ReportData
      }
    }
  } catch (error) {
    console.warn('无法从本地存储加载数据:', error)
  }
  return null
}

// 清除本地存储数据
const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('无法清除本地存储数据:', error)
  }
}

// DOM 引用
const previewContentRef = ref<HTMLElement | null>(null)

// 默认数据结构
const getDefaultReportData = (): ReportData => ({
  reportTitle: '工作周报',
  name: '',
  department: '',
  startDate: '',
  endDate: '',
  tasksCompleted: 0,
  commits: 0,
  outputs: [],
  achievements: [],
  plans: [],
})

// 响应式状态，用于存储所有表单数据
// 尝试从本地存储加载数据，如果没有则使用默认数据
const reportData = ref<ReportData>(loadFromLocalStorage() || getDefaultReportData())

// 初始化日期和默认项
onMounted(() => {
  // 检查是否有本地存储的数据
  const hasStoredData = loadFromLocalStorage() !== null

  // 只有在没有存储数据时才设置默认值
  if (!hasStoredData) {
    const today = new Date()
    const lastMonday = new Date(today)
    lastMonday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
    const lastFriday = new Date(lastMonday)
    lastFriday.setDate(lastMonday.getDate() + 4)

    reportData.value.startDate = lastMonday.toISOString().split('T')[0]
    reportData.value.endDate = lastFriday.toISOString().split('T')[0]

    // 添加默认空项，引导用户填写
    addItem('outputs')
    addItem('achievements')
    addItem('plans')
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

// 定义动态项类型
type ItemType = 'outputs' | 'achievements' | 'plans'

// 动态项的工厂函数
const createNewItem = (type: ItemType): ReportItem | PlanItem => {
  const baseItem: ReportItem = { id: Date.now(), title: '', content: '' }
  if (type === 'plans') {
    return { ...baseItem, time: '' } as PlanItem
  }
  return baseItem
}

// 添加项
const addItem = (type: ItemType): void => {
  const newItem = createNewItem(type)
  if (type === 'plans') {
    reportData.value[type].push(newItem as PlanItem)
  } else {
    reportData.value[type].push(newItem as ReportItem)
  }
}

// 删除项
const removeItem = (type: ItemType, index: number): void => {
  reportData.value[type].splice(index, 1)
}

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

// 计算属性，过滤掉完全为空的动态项，使预览更整洁
const validOutputs = computed((): ReportItem[] =>
  reportData.value.outputs.filter((item: ReportItem) => item.title || item.content),
)
const validAchievements = computed((): ReportItem[] =>
  reportData.value.achievements.filter((item: ReportItem) => item.title || item.content),
)
const validPlans = computed((): PlanItem[] =>
  reportData.value.plans.filter((item: PlanItem) => item.title || item.content || item.time),
)

// 计算属性，判断用户是否已开始填写表单
const isFormStarted = computed((): boolean => {
  return !!(
    reportData.value.reportTitle !== '工作周报' ||
    reportData.value.name ||
    reportData.value.department ||
    validOutputs.value.length > 0 ||
    validAchievements.value.length > 0 ||
    validPlans.value.length > 0
  )
})

// 导出报告为 HTML 文件
const exportReport = (): void => {
  if (!previewContentRef.value) return

  const reportHTML: string = previewContentRef.value.innerHTML

  // 提取预览所需的 CSS
  const styles: string = Array.from(document.styleSheets)
    .map((sheet: CSSStyleSheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule: CSSRule) => rule.cssText)
          .join('\n')
      } catch (e: unknown) {
        // 忽略由于跨域策略无法访问的样式表
        console.error(e)
        return ''
      }
    })
    .join('\n')

  const fullHTML: string = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportData.value.reportTitle || '报告'} - ${reportData.value.name || '姓名'}</title>
    <style>
        ${styles}
        /* 打印优化 */
        @media print {
            body { background: white; }
        }
    </style>
</head>
<body>
    ${reportHTML}
</body>
</html>`

  // 创建并触发下载
  const blob: Blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' })
  const link: HTMLAnchorElement = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${reportData.value.reportTitle || '报告'}_${reportData.value.name || '姓名'}_${new Date().toISOString().split('T')[0]}.html`
  link.click()
  URL.revokeObjectURL(link.href)
}

// 清除所有数据
const clearAllData = (): void => {
  if (confirm('确定要清除所有数据吗？此操作不可撤销。')) {
    // 清除本地存储
    clearLocalStorage()

    // 重置为默认数据
    const defaultData = getDefaultReportData()

    // 设置默认日期
    const today = new Date()
    const lastMonday = new Date(today)
    lastMonday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
    const lastFriday = new Date(lastMonday)
    lastFriday.setDate(lastMonday.getDate() + 4)

    defaultData.startDate = lastMonday.toISOString().split('T')[0]
    defaultData.endDate = lastFriday.toISOString().split('T')[0]

    // 添加默认空项
    defaultData.outputs = [createNewItem('outputs') as ReportItem]
    defaultData.achievements = [createNewItem('achievements') as ReportItem]
    defaultData.plans = [createNewItem('plans') as PlanItem]

    // 更新响应式数据
    reportData.value = defaultData
  }
}
</script>

<style>
/* CSS 变量定义 */
:root {
  --primary-dark: #383e4e;
  --primary-light: #b6bac5;
  --bg-light: #f8f9fa;
  --text-primary: #383e4e;
  --text-secondary: #6c7380;
  --border-color: #e5e7eb;
  --success: #4caf50;
  --danger: #f44336;
}

/* 主容器 - 适应导航栏布局 */
.home-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-light);
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  flex: 1;
  overflow: hidden;
}

/* 左侧编辑器 */
.editor-panel {
  background: white;
  padding: 30px;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.form-section {
  margin-bottom: 30px;
}

.section-header {
  font-size: 20px;
  color: var(--primary-dark);
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 5px;
  font-weight: 500;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-dark);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

/* 动态添加项 */
.dynamic-section {
  margin-bottom: 20px;
}

.item-container {
  margin-bottom: 15px;
  padding: 15px;
  background: var(--bg-light);
  border-radius: 4px;
  position: relative;
  border: 1px solid var(--border-color);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.item-title {
  font-weight: 500;
  color: var(--primary-dark);
}

.btn-remove {
  background: var(--danger);
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: opacity 0.3s;
}

.btn-remove:hover {
  opacity: 0.8;
}

.btn-add {
  background: var(--primary-dark);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
  width: 100%;
}

.btn-add:hover {
  background: #5a6275;
}

/* 右侧预览 */
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
}

.preview-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
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
  padding: 20px;
  flex-grow: 1;
}

/* 预览样式 */
.report-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
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

.report-section {
  padding: 30px 40px;
}

.report-section-title {
  font-size: 24px;
  color: var(--primary-dark);
  margin-bottom: 20px;
  font-weight: 300;
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
}

.card-content {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap; /* 保持换行 */
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

/* 滚动条样式 */
.editor-panel::-webkit-scrollbar,
.preview-panel::-webkit-scrollbar {
  width: 8px;
}

.editor-panel::-webkit-scrollbar-track,
.preview-panel::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.editor-panel::-webkit-scrollbar-thumb,
.preview-panel::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.editor-panel::-webkit-scrollbar-thumb:hover,
.preview-panel::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

/* 响应式 */
@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
    height: auto;
  }

  .editor-panel {
    height: auto;
    max-height: 60vh;
    margin-bottom: 20px;
  }

  .preview-panel {
    height: 70vh;
  }
}
</style>
