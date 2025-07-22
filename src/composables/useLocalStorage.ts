import type { ReportData, ReportItem, PlanItem, ItemType } from '@/types/report'

const STORAGE_KEY = 'weekly-report-data'

// 默认数据结构
export const getDefaultReportData = (): ReportData => ({
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
  collapsible: {
    outputs: false,
    achievements: false,
    plans: false,
  },
})

// 动态项的工厂函数
export const createNewItem = (type: ItemType): ReportItem | PlanItem => {
  const baseItem: ReportItem = { id: Date.now(), title: '', content: '' }
  if (type === 'plans') {
    return { ...baseItem, time: '' } as PlanItem
  }
  return baseItem
}

export const useLocalStorage = () => {
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
          // 确保所有必需的属性都存在，特别是新添加的 collapsible 属性
          const defaultData = getDefaultReportData()
          const mergedData = {
            ...defaultData,
            ...parsed,
            // 确保 collapsible 属性存在且完整
            collapsible: {
              ...defaultData.collapsible,
              ...(parsed.collapsible || {}),
            },
          }
          return mergedData as ReportData
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

  // 初始化默认数据（用于首次加载或清除数据后）
  const initializeDefaultData = (): ReportData => {
    const defaultData = getDefaultReportData()

    // 设置默认日期
    const today = new Date()
    const lastMonday = new Date(today)
    lastMonday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
    const lastFriday = new Date(lastMonday)
    lastFriday.setDate(lastMonday.getDate() + 4)

    defaultData.startDate = lastMonday.toISOString().split('T')[0]
    defaultData.endDate = lastFriday.toISOString().split('T')[0]

    // 添加默认空项，引导用户填写
    defaultData.outputs = [createNewItem('outputs') as ReportItem]
    defaultData.achievements = [createNewItem('achievements') as ReportItem]
    defaultData.plans = [createNewItem('plans') as PlanItem]

    return defaultData
  }

  return {
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage,
    initializeDefaultData,
  }
}
