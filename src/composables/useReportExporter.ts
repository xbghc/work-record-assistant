import { computed, type ComputedRef } from 'vue'
import type { ReportData, ReportItem, PlanItem } from '@/types/report'

export const useReportExporter = (
  reportData: ReportData,
  formattedDateRange: ComputedRef<string>,
) => {
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

  // 导出报告为 HTML 文件
  const exportReport = (): void => {
    const data = reportData
    const outputs = validOutputs.value
    const achievements = validAchievements.value
    const plans = validPlans.value

    // 基础样式变量
    const colors = {
      primaryDark: '#383e4e',
      primaryLight: '#b6bac5',
      bgLight: '#f8f9fa',
      textSecondary: '#6c7380',
      borderColor: '#e5e7eb',
    }

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

        <!-- 本周工作 -->
        ${
          outputs.length > 0
            ? `
          <div style="padding: 30px 40px;">
            <h2 style="font-size: 24px; color: ${colors.primaryDark}; margin-bottom: 20px; font-weight: 300; margin-top: 0;">
              <span style="color: ${colors.primaryLight}; font-size: 18px;">01</span> 本周工作
              <span style="font-size: 18px; color: ${colors.primaryLight}; font-weight: 400; margin-left: 8px;">(${outputs.length})</span>
            </h2>
            ${outputs
              .map(
                (output) => `
              <div style="background: ${colors.bgLight}; padding: 20px; margin-bottom: 15px; border-left: 3px solid ${colors.primaryDark}; border-radius: 4px;">
                <h3 style="font-size: 16px; color: ${colors.primaryDark}; margin-bottom: 10px; font-weight: 500; margin-top: 0;">
                  ${output.title || '未命名工作'}
                </h3>
                <div style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6;">
                  ${
                    output.content
                      ? output.content.includes('\n')
                        ? `<ul style="margin: 0; padding-left: 20px;">${output.content
                            .split('\n')
                            .filter((l) => l.trim())
                            .map((line) => `<li style="margin-bottom: 5px;">${line}</li>`)
                            .join('')}</ul>`
                        : output.content
                      : '暂无描述'
                  }
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        `
            : ''
        }

        <!-- 个人收获 -->
        ${
          achievements.length > 0
            ? `
          <div style="padding: 30px 40px;">
            <h2 style="font-size: 24px; color: ${colors.primaryDark}; margin-bottom: 20px; font-weight: 300; margin-top: 0;">
              <span style="color: ${colors.primaryLight}; font-size: 18px;">02</span> 个人收获
              <span style="font-size: 18px; color: ${colors.primaryLight}; font-weight: 400; margin-left: 8px;">(${achievements.length})</span>
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
              ${achievements
                .map((achievement, index) => {
                  const icons = ['💡', '🤝', '📊', '🎯']
                  return `
                  <div style="background: ${colors.bgLight}; padding: 20px; margin-bottom: 15px; border-left: 3px solid ${colors.primaryDark}; border-radius: 4px;">
                    <h3 style="font-size: 16px; color: ${colors.primaryDark}; margin-bottom: 10px; font-weight: 500; margin-top: 0;">
                      ${icons[index % 4]} ${achievement.title || '未命名个人收获'}
                    </h3>
                    <div style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6;">
                      ${achievement.content || '暂无描述'}
                    </div>
                  </div>
                `
                })
                .join('')}
            </div>
          </div>
        `
            : ''
        }

        <!-- 下周计划 -->
        ${
          plans.length > 0
            ? `
          <div style="padding: 30px 40px;">
            <h2 style="font-size: 24px; color: ${colors.primaryDark}; margin-bottom: 20px; font-weight: 300; margin-top: 0;">
              <span style="color: ${colors.primaryLight}; font-size: 18px;">03</span> 下周计划
            </h2>
            ${plans
              .map(
                (plan) => `
              <div style="background: ${colors.bgLight}; padding: 20px; margin-bottom: 15px; border-left: 3px solid ${colors.primaryDark}; border-radius: 4px;">
                <div style="font-size: 13px; color: ${colors.primaryLight}; margin-bottom: 5px;">
                  ${plan.time || '待定'}
                </div>
                <h3 style="font-size: 16px; color: ${colors.primaryDark}; margin-bottom: 10px; font-weight: 500; margin-top: 0;">
                  ${plan.title || '未命名计划'}
                </h3>
                <div style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6;">
                  ${plan.content || '暂无描述'}
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        `
            : ''
        }

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
