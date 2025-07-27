/**
 * 周报样式配置 - 统一管理所有版本的样式
 * 确保预览面板、现代版本导出、Outlook版本导出的视觉一致性
 */

// 颜色配置
export const REPORT_COLORS = {
  primaryDark: '#383e4e',
  primaryLight: '#b6bac5',
  bgLight: '#f8f9fa',
  textPrimary: '#383e4e',
  textSecondary: '#6c7380',
  borderColor: '#e5e7eb',
  white: '#ffffff',
} as const

// 字体配置
export const REPORT_FONTS = {
  family: {
    modern: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
    outlook: 'Arial, sans-serif',
  },
  size: {
    title: '32px',
    sectionTitle: '24px',
    itemTitle: '16px',
    content: '14px',
    meta: '14px',
    stats: '13px',
    statsValue: '16px',
    footer: '13px',
  },
  weight: {
    light: '300',
    normal: '400',
    medium: '500',
    bold: '600',
  },
  lineHeight: '1.6',
} as const

// 尺寸配置
export const REPORT_DIMENSIONS = {
  container: {
    maxWidth: '800px',
    borderRadius: '8px',
  },
  padding: {
    header: '40px',
    section: '30px 40px',
    stats: '15px 40px',
    card: '20px',
    footer: '20px 40px',
  },
  margin: {
    titleBottom: '10px',
    cardBottom: '15px',
    sectionBottom: '20px',
  },
  gap: {
    stats: '30px',
    grid: '15px',
  },
  border: {
    width: '3px',
    radius: '4px',
  },
} as const

// 阴影配置
export const REPORT_SHADOWS = {
  container: '0 4px 6px rgba(0, 0, 0, 0.1)',
  card: '0 2px 4px rgba(0, 0, 0, 0.05)',
} as const

// 预览面板样式生成器
export const generatePreviewStyles = () => ({
  container: {
    maxWidth: REPORT_DIMENSIONS.container.maxWidth,
    borderRadius: REPORT_DIMENSIONS.container.borderRadius,
    boxShadow: REPORT_SHADOWS.container,
    background: REPORT_COLORS.white,
  },
  header: {
    background: REPORT_COLORS.primaryDark,
    color: REPORT_COLORS.white,
    padding: REPORT_DIMENSIONS.padding.header,
    fontSize: REPORT_FONTS.size.title,
    fontWeight: REPORT_FONTS.weight.light,
  },
  stats: {
    background: REPORT_COLORS.bgLight,
    padding: REPORT_DIMENSIONS.padding.stats,
    gap: REPORT_DIMENSIONS.gap.stats,
    borderBottom: `1px solid ${REPORT_COLORS.borderColor}`,
  },
})

// 现代版本导出样式生成器
export const generateModernExportStyles = () => {
  const colors = REPORT_COLORS
  const fonts = REPORT_FONTS
  const dimensions = REPORT_DIMENSIONS

  return {
    colors,
    containerStyle: `max-width: ${dimensions.container.maxWidth}; margin: 0 auto; background: ${colors.white}; border-radius: ${dimensions.container.borderRadius}; overflow: hidden;`,
    headerStyle: `background: ${colors.primaryDark}; color: ${colors.white}; padding: ${dimensions.padding.header};`,
    titleStyle: `font-size: ${fonts.size.title}; font-weight: ${fonts.weight.light}; margin-bottom: ${dimensions.margin.titleBottom}; margin-top: 0;`,
    metaStyle: `color: ${colors.primaryLight}; font-size: ${fonts.size.meta};`,
    statsStyle: `background: ${colors.bgLight}; padding: ${dimensions.padding.stats}; display: flex; flex-wrap: wrap; gap: ${dimensions.gap.stats}; border-bottom: 1px solid ${colors.borderColor};`,
    sectionStyle: `padding: ${dimensions.padding.section};`,
    sectionTitleStyle: `font-size: ${fonts.size.sectionTitle}; color: ${colors.primaryDark}; margin-bottom: ${dimensions.margin.sectionBottom}; font-weight: ${fonts.weight.light}; margin-top: 0;`,
    cardStyle: `background: ${colors.bgLight}; padding: ${dimensions.padding.card}; margin-bottom: ${dimensions.margin.cardBottom}; border-left: ${dimensions.border.width} solid ${colors.primaryDark}; border-radius: ${dimensions.border.radius};`,
    footerStyle: `background: ${colors.primaryDark}; color: ${colors.primaryLight}; padding: ${dimensions.padding.footer}; text-align: center; font-size: ${fonts.size.footer};`,
  }
}

// Outlook版本样式生成器
export const generateOutlookStyles = () => {
  const colors = REPORT_COLORS
  const fonts = REPORT_FONTS
  const dimensions = REPORT_DIMENSIONS

  return {
    colors,
    // Table样式
    outerTableStyle: `width: 100%; border-collapse: collapse; margin: 0; padding: 0; font-family: ${fonts.family.outlook};`,
    innerTableStyle: `width: ${dimensions.container.maxWidth}; border-collapse: collapse; margin: 0; padding: 0; font-family: ${fonts.family.outlook};`,
    centerCellStyle: `text-align: center; vertical-align: top; padding: 20px;`,
    contentWrapperStyle: `text-align: left;`,
    
    // 内容样式
    headerStyle: `background-color: ${colors.primaryDark}; color: ${colors.white}; padding: ${dimensions.padding.header}; text-align: left;`,
    titleStyle: `font-size: ${fonts.size.title}; font-weight: normal; margin-bottom: 8px; margin-top: 0; text-align: left;`,
    metaStyle: `color: ${colors.primaryLight}; font-size: ${fonts.size.meta};`,
    
    sectionHeaderStyle: `background-color: ${colors.bgLight}; padding: 20px; font-size: 18px; font-weight: bold; color: ${colors.primaryDark}; border-bottom: ${dimensions.border.width} solid ${colors.primaryDark}; text-align: left;`,
    contentStyle: `background-color: ${colors.white}; padding: 20px; color: ${colors.textSecondary}; line-height: ${fonts.lineHeight}; text-align: left;`,
    
    cellStyle: `padding: 15px; vertical-align: top; border: 0;`,
    itemTitleStyle: `font-size: ${fonts.size.itemTitle}; font-weight: bold; color: ${colors.primaryDark}; margin-bottom: 8px; text-align: left;`,
    itemContentStyle: `font-size: ${fonts.size.content}; color: ${colors.textSecondary}; line-height: ${fonts.lineHeight}; text-align: left;`,
    
    footerStyle: `background-color: ${colors.primaryDark}; color: ${colors.primaryLight}; padding: ${dimensions.padding.footer}; text-align: center; font-size: ${fonts.size.footer};`,
  }
}

// 响应式断点
export const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1200px',
} as const

// 导出类型定义
export type ReportColors = typeof REPORT_COLORS
export type ReportFonts = typeof REPORT_FONTS
export type ReportDimensions = typeof REPORT_DIMENSIONS
