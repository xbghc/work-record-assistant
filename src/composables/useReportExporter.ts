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

  // 生成Outlook兼容的HTML结构
  const generateOutlookCompatibleHTML = (): string => {
    const data = reportData
    const outputs = validOutputs.value
    const achievements = validAchievements.value
    const plans = validPlans.value

    // Outlook兼容的表格样式
    const outerTableStyle =
      'width: 100%; border-collapse: collapse; margin: 0; padding: 0; font-family: Arial, sans-serif;'
    const innerTableStyle =
      'width: 800px; border-collapse: collapse; margin: 0; padding: 0; font-family: Arial, sans-serif;'
    const cellStyle = 'padding: 15px; vertical-align: top; border: 0;'
    const centerCellStyle = 'text-align: center; vertical-align: top; padding: 20px;'
    const contentWrapperStyle = 'text-align: left;' // 重置内容为左对齐
    const headerStyle =
      'background-color: #383e4e; color: #ffffff; padding: 30px; text-align: left;'
    const sectionHeaderStyle =
      'background-color: #f8f9fa; padding: 20px; font-size: 18px; font-weight: bold; color: #383e4e; border-bottom: 3px solid #383e4e; text-align: left;'
    const contentStyle =
      'background-color: #ffffff; padding: 20px; color: #6c7380; line-height: 1.6; text-align: left;'
    const footerStyle =
      'background-color: #383e4e; color: #b6bac5; padding: 20px; text-align: center; font-size: 13px;'

    // 生成工作项目HTML（表格布局）
    const generateOutlookItemsHTML = (
      items: (ReportItem | PlanItem)[],
      type: 'outputs' | 'achievements' | 'plans',
    ): string => {
      if (items.length === 0) return ''

      return items
        .map((item, index) => {
          let titleContent = ''
          let contentHTML = item.content || '暂无描述'

          if (type === 'achievements') {
            const icons = ['💡', '🤝', '📊', '🎯']
            titleContent = `${icons[index % 4]} ${item.title || '未命名个人收获'}`
          } else if (type === 'plans') {
            const planItem = item as PlanItem
            titleContent = `${planItem.time || '待定'} - ${item.title || '未命名计划'}`
          } else {
            titleContent = item.title || '未命名工作'
          }

          // 处理多行内容
          if (contentHTML.includes('\n')) {
            const lines = contentHTML.split('\n').filter((l) => l.trim())
            contentHTML = lines.map((line) => `• ${line}`).join('<br/>')
          }

          return `
          <table style="${innerTableStyle}" cellpadding="0" cellspacing="0">
            <tr>
              <td style="${cellStyle} background-color: #f8f9fa; border-left: 3px solid #383e4e; text-align: left;">
                <table style="${innerTableStyle}" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 0; margin: 0; text-align: left;">
                      <div style="font-size: 16px; font-weight: bold; color: #383e4e; margin-bottom: 8px; text-align: left;">${titleContent}</div>
                      <div style="font-size: 14px; color: #6c7380; line-height: 1.6; text-align: left;">${contentHTML}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr><td style="height: 10px; line-height: 1px; font-size: 1px;">&nbsp;</td></tr>
          </table>
        `
        })
        .join('')
    }

    // 生成统计信息
    const statsHTML = `
      <table style="${innerTableStyle}" cellpadding="0" cellspacing="0">
        <tr>
          <td style="${cellStyle} background-color: #f8f9fa; border-bottom: 1px solid #e5e7eb; text-align: left;">
            <table style="${innerTableStyle}" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 0; width: 50%; text-align: left;">
                  <span style="font-size: 13px; color: #6c7380;">Bug/需求单: </span>
                  <span style="font-weight: bold; color: #383e4e; font-size: 16px;">${data.tasksCompleted}</span>
                </td>
                <td style="padding: 0; width: 50%; text-align: left;">
                  <span style="font-size: 13px; color: #6c7380;">MR合并: </span>
                  <span style="font-weight: bold; color: #383e4e; font-size: 16px;">${data.commits}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `

    // 生成各个章节
    const outputsHTML =
      outputs.length > 0
        ? `
      <table style="${innerTableStyle}" cellpadding="0" cellspacing="0">
        <tr><td style="${sectionHeaderStyle}">01 本周工作 (${outputs.length})</td></tr>
        <tr><td style="${contentStyle}">${generateOutlookItemsHTML(outputs, 'outputs')}</td></tr>
      </table>
    `
        : ''

    const achievementsHTML =
      achievements.length > 0
        ? `
      <table style="${innerTableStyle}" cellpadding="0" cellspacing="0">
        <tr><td style="${sectionHeaderStyle}">02 个人收获 (${achievements.length})</td></tr>
        <tr><td style="${contentStyle}">${generateOutlookItemsHTML(achievements, 'achievements')}</td></tr>
      </table>
    `
        : ''

    const plansHTML =
      plans.length > 0
        ? `
      <table style="${innerTableStyle}" cellpadding="0" cellspacing="0">
        <tr><td style="${sectionHeaderStyle}">03 下周计划</td></tr>
        <tr><td style="${contentStyle}">${generateOutlookItemsHTML(plans, 'plans')}</td></tr>
      </table>
    `
        : ''

    // 完整的Outlook兼容HTML - 使用嵌套table实现居中和宽度控制
    return `
      <!-- 外层table用于居中 -->
      <table style="${outerTableStyle} background-color: #ffffff;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="${centerCellStyle}">
            <!-- 内层table控制宽度 -->
            <table style="${innerTableStyle} background-color: #ffffff; border: 2px solid #e5e7eb;" cellpadding="0" cellspacing="0">
              <!-- 内容wrapper重置文字对齐 -->
              <tr>
                <td style="${contentWrapperStyle}">
                  <table style="${innerTableStyle}" cellpadding="0" cellspacing="0">
                    <!-- 报告头部 -->
                    <tr>
                      <td style="${headerStyle}">
                        <div style="font-size: 28px; font-weight: normal; margin-bottom: 8px; margin-top: 0;">${data.reportTitle || '报告标题'}</div>
                        <div style="color: #b6bac5; font-size: 14px;">${data.name || '姓名'} · ${data.department || '部门'} · ${formattedDateRange.value}</div>
                      </td>
                    </tr>

                    <!-- 统计区域 -->
                    <tr><td>${statsHTML}</td></tr>

                    <!-- 各个章节 -->
                    ${outputsHTML ? `<tr><td>${outputsHTML}</td></tr>` : ''}
                    ${achievementsHTML ? `<tr><td>${achievementsHTML}</td></tr>` : ''}
                    ${plansHTML ? `<tr><td>${plansHTML}</td></tr>` : ''}

                    <!-- 报告底部 -->
                    <tr>
                      <td style="${footerStyle}">
                        ${data.name || '姓名'} · ${data.department || '部门'} · ${new Date().toISOString().split('T')[0]}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
  }

  // 生成Web版本的折叠HTML结构
  const generateWebHTML = (): string => {
    const data = reportData
    const outputs = validOutputs.value
    const achievements = validAchievements.value
    const plans = validPlans.value

    // 生成邮件兼容的折叠HTML结构
    const generateCollapsibleSection = (
      sectionNumber: string,
      title: string,
      content: string,
      isCollapsible: boolean,
      itemCount?: number,
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

    // 生成单个Item的HTML（网页版本，支持折叠）
    const generateWebItemHTML = (
      item: ReportItem | PlanItem,
      titleContent: string,
      contentHTML: string,
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
    const outputsContent =
      outputs.length > 0
        ? outputs
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

              return generateWebItemHTML(output, output.title || '未命名工作', contentHTML)
            })
            .join('')
        : ''

    const achievementsContent =
      achievements.length > 0
        ? `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
        ${achievements
          .map((achievement, index) => {
            const icons = ['💡', '🤝', '📊', '🎯']
            const titleContent = `${icons[index % 4]} ${achievement.title || '未命名个人收获'}`
            const contentHTML = achievement.content || '暂无描述'

            return generateWebItemHTML(achievement, titleContent, contentHTML)
          })
          .join('')}
      </div>
    `
        : ''

    const plansContent =
      plans.length > 0
        ? plans
            .map((plan) => {
              const titleContent = `
          <div style="font-size: 13px; color: ${colors.primaryLight}; margin-bottom: 5px;">
            ${(plan as PlanItem).time || '待定'}
          </div>
          ${plan.title || '未命名计划'}
        `
              const contentHTML = plan.content || '暂无描述'

              return generateWebItemHTML(plan, titleContent, contentHTML)
            })
            .join('')
        : ''

    // 生成完整的内联样式HTML
    return `
        <!-- 报告头部 -->
        <div style="background: ${colors.primaryDark}; color: white; padding: 40px;">
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
        <div style="background: ${colors.primaryDark}; color: ${colors.primaryLight}; padding: 20px 40px; text-align: center; font-size: 13px;">
          ${data.name || '姓名'} · ${data.department || '部门'} · ${new Date().toISOString().split('T')[0]}
        </div>
    `
  }

  // 导出报告为 HTML 文件
  const exportReport = (format: 'web' | 'outlook' = 'web'): void => {
    const data = reportData

    let reportHTML: string
    let filenameSuffix: string

    if (format === 'outlook') {
      reportHTML = generateOutlookCompatibleHTML()
      filenameSuffix = '_Outlook兼容'
    } else {
      reportHTML = generateWebHTML()
      filenameSuffix = ''
    }

    const fullHTML: string = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.reportTitle || '报告'} - ${data.name || '姓名'}</title>
</head>
<body style="margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; background-color: #ffffff; line-height: 1.6; color: #383e4e; min-height: 100vh;">
    <!-- 邮件外层背景容器 - 强制白色背景确保在深色模式下可见 -->
    <div style="background-color: #ffffff; padding: 20px; min-height: 100vh; width: 100%; border: 1px solid #e5e7eb;">
        <!-- 邮件内容容器 -->
        <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border: 2px solid #e5e7eb; overflow: hidden;">
            ${reportHTML}
        </div>

        <!-- 邮件底部间距 -->
        <div style="height: 40px; background-color: #ffffff;"></div>
    </div>
</body>
</html>`

    // 创建并触发下载
    const blob: Blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' })
    const link: HTMLAnchorElement = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${data.reportTitle || '报告'}_${data.name || '姓名'}_${new Date().toISOString().split('T')[0]}${filenameSuffix}.html`
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
