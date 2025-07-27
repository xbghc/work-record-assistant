import { computed, type ComputedRef, type Ref } from 'vue'
import type { ReportData, ReportItem, PlanItem } from '@/types/report'

export function usePDFGenerator(
  reportData: Ref<ReportData>,
  formattedDateRange: ComputedRef<string>,
) {
  // 计算属性，过滤掉完全为空的动态项
  const validOutputs = computed((): ReportItem[] =>
    reportData.value.outputs.filter((item: ReportItem) => item.title || item.content),
  )

  const validAchievements = computed((): ReportItem[] =>
    reportData.value.achievements.filter((item: ReportItem) => item.title || item.content),
  )

  const validPlans = computed((): PlanItem[] =>
    reportData.value.plans.filter((item: PlanItem) => item.title || item.content || item.time),
  )

  // 生成PDF内容的HTML
  const generatePDFHTML = (): string => {
    const data = reportData.value
    const outputs = validOutputs.value
    const achievements = validAchievements.value
    const plans = validPlans.value

    // 生成工作项目HTML
    const generateItemsHTML = (
      items: (ReportItem | PlanItem)[],
      type: 'outputs' | 'achievements' | 'plans',
    ): string => {
      if (items.length === 0) return '<p style="color: #999; font-style: italic;">暂无内容</p>'

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
            contentHTML = lines.map((line) => `• ${line}`).join('\n')
          }

          return `
            <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid #383e4e; border-radius: 4px;">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #383e4e;">${titleContent}</h4>
              <div style="font-size: 12px; color: #6c7380; line-height: 1.5; white-space: pre-line;">${contentHTML}</div>
            </div>
          `
        })
        .join('')
    }

    // PDF专用的HTML结构
    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.reportTitle || '工作周报'}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
            font-size: 12px;
          }

          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }

          .header {
            background: #383e4e;
            color: #fff;
            padding: 30px;
            margin-bottom: 20px;
            border-radius: 8px;
          }

          .header h1 {
            font-size: 24px;
            font-weight: 300;
            margin-bottom: 8px;
          }

          .header .meta {
            color: #b6bac5;
            font-size: 12px;
          }

          .stats {
            background: #f8f9fa;
            padding: 15px 30px;
            margin-bottom: 20px;
            border-radius: 6px;
            display: flex;
            gap: 30px;
            border: 1px solid #e5e7eb;
          }

          .stat-item {
            font-size: 11px;
          }

          .stat-value {
            font-weight: bold;
            color: #383e4e;
            font-size: 14px;
          }

          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }

          .section-title {
            background: #f8f9fa;
            padding: 15px 20px;
            font-size: 16px;
            font-weight: bold;
            color: #383e4e;
            border-bottom: 3px solid #383e4e;
            margin-bottom: 15px;
          }

          .section-content {
            padding: 0 10px;
          }

          .footer {
            background: #383e4e;
            color: #b6bac5;
            padding: 15px;
            text-align: center;
            font-size: 10px;
            margin-top: 30px;
            border-radius: 6px;
          }

          @media print {
            body {
              font-size: 11px;
            }

            .container {
              padding: 10px;
            }

            .header {
              padding: 20px;
            }

            .stats {
              padding: 10px 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- 报告头部 -->
          <div class="header">
            <h1>${data.reportTitle || '工作周报'}</h1>
            <div class="meta">${data.name || '姓名'} · ${data.department || '部门'} · ${formattedDateRange.value}</div>
          </div>

          <!-- 统计区域 -->
          <div class="stats">
            <div class="stat-item">
              <span>Bug/需求单: </span>
              <span class="stat-value">${data.tasksCompleted}</span>
            </div>
            <div class="stat-item">
              <span>MR合并: </span>
              <span class="stat-value">${data.commits}</span>
            </div>
          </div>

          <!-- 本周工作 -->
          ${
            outputs.length > 0
              ? `
          <div class="section">
            <div class="section-title">01 本周工作 (${outputs.length})</div>
            <div class="section-content">
              ${generateItemsHTML(outputs, 'outputs')}
            </div>
          </div>
          `
              : ''
          }

          <!-- 个人收获 -->
          ${
            achievements.length > 0
              ? `
          <div class="section">
            <div class="section-title">02 个人收获 (${achievements.length})</div>
            <div class="section-content">
              ${generateItemsHTML(achievements, 'achievements')}
            </div>
          </div>
          `
              : ''
          }

          <!-- 下周计划 -->
          ${
            plans.length > 0
              ? `
          <div class="section">
            <div class="section-title">03 下周计划</div>
            <div class="section-content">
              ${generateItemsHTML(plans, 'plans')}
            </div>
          </div>
          `
              : ''
          }

          <!-- 报告底部 -->
          <div class="footer">
            ${data.name || '姓名'} · ${data.department || '部门'} · ${new Date().toLocaleDateString('zh-CN')}
          </div>
        </div>
      </body>
      </html>
    `
  }

  // 生成并下载PDF
  const generatePDF = async (): Promise<void> => {
    try {
      const htmlContent = generatePDFHTML()

      // 创建一个新窗口来打印PDF
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('无法打开打印窗口，请检查浏览器弹窗设置')
      }

      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // 等待内容加载完成
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          // 打印完成后关闭窗口
          printWindow.onafterprint = () => {
            printWindow.close()
          }
        }, 500)
      }
    } catch (error) {
      console.error('PDF生成失败:', error)
      alert('PDF生成失败，请重试')
    }
  }

  // 生成邮件兼容的HTML（使用内联样式）
  const generateEmailCompatibleHTML = (): string => {
    const data = reportData.value
    const outputs = validOutputs.value
    const achievements = validAchievements.value
    const plans = validPlans.value

    // 生成工作项目HTML（内联样式）
    const generateInlineItemsHTML = (
      items: (ReportItem | PlanItem)[],
      type: 'outputs' | 'achievements' | 'plans',
    ): string => {
      if (items.length === 0)
        return '<p style="color: #999; font-style: italic; margin: 10px 0;">暂无内容</p>'

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
            <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-left: 4px solid #383e4e; border-radius: 4px;">
              <div style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #383e4e;">${titleContent}</div>
              <div style="font-size: 12px; color: #6c7380; line-height: 1.5;">${contentHTML}</div>
            </div>
          `
        })
        .join('')
    }

    // 邮件兼容的HTML结构（完全内联样式）
    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.reportTitle || '工作周报'}</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background: #fff; font-size: 12px;">
        <div style="max-width: 800px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- 报告头部 -->
          <div style="background: #383e4e; color: #fff; padding: 30px; text-align: left;">
            <h1 style="font-size: 24px; font-weight: 300; margin: 0 0 8px 0;">${data.reportTitle || '工作周报'}</h1>
            <div style="color: #b6bac5; font-size: 12px;">${data.name || '姓名'} · ${data.department || '部门'} · ${formattedDateRange.value}</div>
          </div>

          <!-- 统计区域 -->
          <div style="background: #f8f9fa; padding: 15px 30px; border-bottom: 1px solid #e5e7eb;">
            <div style="display: inline-block; margin-right: 30px;">
              <span style="font-size: 11px; color: #6c7380;">Bug/需求单: </span>
              <span style="font-weight: bold; color: #383e4e; font-size: 14px;">${data.tasksCompleted}</span>
            </div>
            <div style="display: inline-block;">
              <span style="font-size: 11px; color: #6c7380;">MR合并: </span>
              <span style="font-weight: bold; color: #383e4e; font-size: 14px;">${data.commits}</span>
            </div>
          </div>

          <!-- 本周工作 -->
          ${
            outputs.length > 0
              ? `
          <div style="margin-bottom: 25px;">
            <div style="background: #f8f9fa; padding: 15px 20px; font-size: 16px; font-weight: bold; color: #383e4e; border-bottom: 3px solid #383e4e;">01 本周工作 (${outputs.length})</div>
            <div style="padding: 15px 20px;">
              ${generateInlineItemsHTML(outputs, 'outputs')}
            </div>
          </div>
          `
              : ''
          }

          <!-- 个人收获 -->
          ${
            achievements.length > 0
              ? `
          <div style="margin-bottom: 25px;">
            <div style="background: #f8f9fa; padding: 15px 20px; font-size: 16px; font-weight: bold; color: #383e4e; border-bottom: 3px solid #383e4e;">02 个人收获 (${achievements.length})</div>
            <div style="padding: 15px 20px;">
              ${generateInlineItemsHTML(achievements, 'achievements')}
            </div>
          </div>
          `
              : ''
          }

          <!-- 下周计划 -->
          ${
            plans.length > 0
              ? `
          <div style="margin-bottom: 25px;">
            <div style="background: #f8f9fa; padding: 15px 20px; font-size: 16px; font-weight: bold; color: #383e4e; border-bottom: 3px solid #383e4e;">03 下周计划</div>
            <div style="padding: 15px 20px;">
              ${generateInlineItemsHTML(plans, 'plans')}
            </div>
          </div>
          `
              : ''
          }

          <!-- 报告底部 -->
          <div style="background: #383e4e; color: #b6bac5; padding: 15px; text-align: center; font-size: 10px;">
            ${data.name || '姓名'} · ${data.department || '部门'} · ${new Date().toLocaleDateString('zh-CN')}
          </div>
        </div>
      </body>
      </html>
    `
  }

  // 下载浏览器版HTML文件
  const downloadBrowserHTML = (): void => {
    try {
      const htmlContent = generatePDFHTML()
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `${reportData.value.reportTitle || '工作周报'}_浏览器版_${new Date().toISOString().split('T')[0]}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('浏览器版HTML下载失败:', error)
      alert('浏览器版HTML下载失败，请重试')
    }
  }

  // 下载邮件兼容版HTML文件
  const downloadEmailHTML = (): void => {
    try {
      const htmlContent = generateEmailCompatibleHTML()
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `${reportData.value.reportTitle || '工作周报'}_邮件版_${new Date().toISOString().split('T')[0]}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('邮件版HTML下载失败:', error)
      alert('邮件版HTML下载失败，请重试')
    }
  }

  return {
    validOutputs,
    validAchievements,
    validPlans,
    generatePDF,
    downloadBrowserHTML,
    downloadEmailHTML,
    generatePDFHTML,
    generateEmailCompatibleHTML,
  }
}
