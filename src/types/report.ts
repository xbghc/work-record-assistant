export interface ReportItem {
  id: number
  title: string
  content: string
}

export interface PlanItem extends ReportItem {
  time: string
}

export interface CollapsibleConfig {
  outputs: boolean
  achievements: boolean
  plans: boolean
}

export interface ReportData {
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
  collapsible: CollapsibleConfig
}

export type ItemType = 'outputs' | 'achievements' | 'plans'
