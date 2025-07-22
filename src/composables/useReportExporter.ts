import { computed, type ComputedRef } from 'vue'
import type { ReportData, ReportItem, PlanItem } from '@/types/report'

export const useReportExporter = (
  reportData: ReportData,
  formattedDateRange: ComputedRef<string>,
) => {
  // 基础样式变量
  const colors = {
    primaryDark: '#383e4e',
    primaryLight: '#b6bac5',
    bgLight: '#f8f9fa',
    textSecondary: '#6c7380',
    borderColor: '#e5e7eb',
  }

  // 计算属性，过滤掉完全为空的动态项
  const validOutputs = computed((): ReportItem[] =>
    reportData.outputs.filter((item: ReportItem) => item.title || item.content),
  )

  const validAchievements = computed((): ReportItem[] =>
    reportData.achievements.filter((item: ReportItem) => item.title || item.content),
  )

  const validPlans = computed((): PlanItem[] =>
    reportData.plans.filter((item: PlanItem) => item.title || item.content || item.time),
  )

  // 生成邮件兼容的折叠HTML结构
  const generateCollapsibleSection = (
    sectionNumber: string,
    title: string,
    content: string,
    isCollapsible: boolean,
    itemCount?: number
  ): string => {
    const countText = itemCount !== undefined ? ` (${itemCount})` : ''
    const sectionTitle = `<span style="color: ${colors.primaryLight}; font-size: 18px;">${sectionNumber}</span> ${title}${countText}`
    
    if (!isCollapsible) {
      return `
        <div style="padding: 30px 40px;">
          <h2 style="font-size: 24px; color: ${colors.primaryDark}; margin-bottom: 20px; font-weight: 300; margin-top: 0;">
            ${sectionTitle}
          </h2>
          ${content}
        </div>
      `
    }

    // 使用 details/summary 实现邮件兼容的折叠
    return `
      <div style="padding: 30px 40px;">
        <details style="border: none; outline: none;" open>
          <summary style="
            font-size: 24px; 
            color: ${colors.primaryDark}; 
            margin-bottom: 20px; 
            font-weight: 300; 
            cursor: pointer; 
            list-style: none; 
            display: flex; 
            align-items: center; 
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid ${colors.borderColor};
          ">
            <span>${sectionTitle}</span>
            <span style="
              font-size: 16px; 
              color: ${colors.primaryLight}; 
              transition: transform 0.3s ease;
            ">▼</span>
          </summary>
          <div style="margin-top: 20px;">
            ${content}
          </div>
        </details>
      </div>
    `
  }

  // 导出报告为 HTML 文件
  const exportReport = (): void => {
    const data = reportData
    const outputs = validOutputs.value
    const achievements = validAchievements.value
    const plans = validPlans.value


    // 生成单个Item的HTML（网页版本，支持折叠）
    const generateWebItemHTML = (
      item: ReportItem | PlanItem, 
      titleContent: string,
      contentHTML: string
    ): string => {
      const cardBaseStyle = `background: ${colors.bgLight}; padding: 20px; margin-bottom: 15px; border-left: 3px solid ${colors.primaryDark}; border-radius: 4px;`
      
      if (!item.collapsible) {
        return `
          <div style="${cardBaseStyle}">
            <h3 style="font-size: 16px; color: ${colors.primaryDark}; margin-bottom: 10px; font-weight: 500; margin-top: 0;">
              ${titleContent}
            </h3>
            <div style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6;">
              ${contentHTML}
            </div>
          </div>
        `
      }

      return `
        <details style="${cardBaseStyle} border: none; outline: none;">
          <summary style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            list-style: none;
            padding: 0;
            margin: 0;
            margin-bottom: 10px;
          ">
            <h3 style="font-size: 16px; color: ${colors.primaryDark}; margin: 0; font-weight: 500; flex-grow: 1;">
              ${titleContent}
            </h3>
            <span style="font-size: 14px; color: ${colors.primaryLight}; margin-left: 10px;">▼</span>
          </summary>
          <div style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6; margin-top: 10px; padding-top: 10px; border-top: 1px solid ${colors.borderColor};">
            ${contentHTML}
          </div>
        </details>
      `
    }

    // 生成各个章节的内容
    const outputsContent = outputs.length > 0 ? outputs
      .map((output) => {
        const contentHTML = output.content
          ? output.content.includes('\n')
            ? `<ul style="margin: 0; padding-left: 20px;">${output.content
                .split('\n')
                .filter((l) => l.trim())
                .map((line) => `<li style="margin-bottom: 5px;">${line}</li>`)
                .join('')}</ul>`
            : output.content
          : '暂无描述'
        
        return generateWebItemHTML(
          output,
          output.title || '未命名工作',
          contentHTML
        )
      })
      .join('') : ''

    const achievementsContent = achievements.length > 0 ? `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
        ${achievements
          .map((achievement, index) => {
            const icons = ['💡', '🤝', '📊', '🎯']
            const titleContent = `${icons[index % 4]} ${achievement.title || '未命名个人收获'}`
            const contentHTML = achievement.content || '暂无描述'
            
            return generateWebItemHTML(
              achievement,
              titleContent,
              contentHTML
            )
          })
          .join('')}
      </div>
    ` : ''

    const plansContent = plans.length > 0 ? plans
      .map((plan) => {
        const titleContent = `
          <div style="font-size: 13px; color: ${colors.primaryLight}; margin-bottom: 5px;">
            ${(plan as PlanItem).time || '待定'}
          </div>
          ${plan.title || '未命名计划'}
        `
        const contentHTML = plan.content || '暂无描述'
        
        return generateWebItemHTML(
          plan,
          titleContent,
          contentHTML
        )
      })
      .join('') : ''

    // 生成完整的内联样式HTML
    const reportHTML = `
      <div style="max-width: 800px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: visible;">
        <!-- 报告头部 -->
        <div style="background: ${colors.primaryDark}; color: white; padding: 40px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
          <h1 style="font-size: 32px; font-weight: 300; margin-bottom: 10px; margin-top: 0;">
            ${data.reportTitle || '报告标题'}
          </h1>
          <div style="color: ${colors.primaryLight}; font-size: 14px;">
            ${data.name || '姓名'} · ${data.department || '部门'} · ${formattedDateRange.value}
          </div>
        </div>

        <!-- 统计区域 -->
        <div style="background: ${colors.bgLight}; padding: 15px 40px; display: flex; flex-wrap: wrap; gap: 30px; border-bottom: 1px solid ${colors.borderColor};">
          <div style="font-size: 13px; color: ${colors.textSecondary};">
            Bug/需求单: <span style="font-weight: 600; color: ${colors.primaryDark}; font-size: 16px;">${data.tasksCompleted}</span>
          </div>
          <div style="font-size: 13px; color: ${colors.textSecondary};">
            MR合并: <span style="font-weight: 600; color: ${colors.primaryDark}; font-size: 16px;">${data.commits}</span>
          </div>
        </div>

        <!-- 使用折叠功能的各个章节 -->
        ${outputs.length > 0 ? generateCollapsibleSection('01', '本周工作', outputsContent, data.collapsible.outputs, outputs.length) : ''}
        ${achievements.length > 0 ? generateCollapsibleSection('02', '个人收获', achievementsContent, data.collapsible.achievements, achievements.length) : ''}
        ${plans.length > 0 ? generateCollapsibleSection('03', '下周计划', plansContent, data.collapsible.plans) : ''}

        <!-- 报告底部 -->
        <div style="background: ${colors.primaryDark}; color: ${colors.primaryLight}; padding: 20px 40px; text-align: center; font-size: 13px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
          ${data.name || '姓名'} · ${data.department || '部门'} · ${new Date().toISOString().split('T')[0]}
        </div>
      </div>
    `

    const fullHTML: string = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportData.reportTitle || '报告'} - ${reportData.name || '姓名'}</title>
</head>
<body style="margin: 0; padding: 20px; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif; background: #f8f9fa; line-height: 1.6; color: #383e4e;">
    ${reportHTML}
</body>
</html>`

    // 创建并触发下载
    const blob: Blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' })
    const link: HTMLAnchorElement = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${reportData.reportTitle || '报告'}_${reportData.name || '姓名'}_${new Date().toISOString().split('T')[0]}.html`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return {
    validOutputs,
    validAchievements,
    validPlans,
    exportReport,
  }
}
