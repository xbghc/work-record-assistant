<template>
  <div class="about-container">
    <div class="about-content">
      <div class="about-header">
        <h1 class="about-title">关于周报生成器</h1>
        <p class="about-subtitle">一个简单高效的工作周报生成工具</p>
      </div>

      <div class="about-sections">
        <div class="about-section">
          <h2 class="section-title">✨ 功能特点</h2>
          <ul class="feature-list">
            <li>📝 简洁直观的表单设计</li>
            <li>🏷️ 自定义报告标题（支持周报、月报等）</li>
            <li>💾 自动保存到本地，刷新页面不丢失数据</li>
            <li>👀 实时预览功能</li>
            <li>📊 自动统计工作数据</li>
            <li>📄 一键导出 HTML 格式</li>
            <li>🗑️ 一键清除所有数据重新开始</li>
            <li>📱 响应式设计，支持移动设备</li>
            <li>🎨 专业的报告样式</li>
          </ul>
        </div>

        <div class="about-section">
          <h2 class="section-title">🚀 技术栈</h2>
          <div class="tech-stack">
            <span class="tech-item">Vue 3</span>
            <span class="tech-item">TypeScript</span>
            <span class="tech-item">Composition API</span>
            <span class="tech-item">CSS Grid</span>
            <span class="tech-item">Responsive Design</span>
          </div>
        </div>

        <div class="about-section">
          <h2 class="section-title">📋 使用说明</h2>
          <ol class="usage-list">
            <li>自定义报告标题（如：工作周报、月度总结、项目汇报等）</li>
            <li>填写基本信息（姓名、部门、日期范围）</li>
            <li>添加本周工作、个人收获和下周计划</li>
            <li>右侧实时预览报告效果</li>
            <li>点击"导出HTML"保存报告</li>
            <li>数据会自动保存，下次打开自动恢复</li>
            <li>如需重新开始，点击"清除数据"按钮</li>
          </ol>
        </div>

        <div class="about-section">
          <h2 class="section-title">🔮 未来计划</h2>
          <ul class="future-list">
            <li>📄 支持更多导出格式（PDF、Word）</li>
            <li>🎨 自定义主题和样式</li>
            <li>📚 历史记录和版本管理</li>
            <li>📊 数据统计和分析</li>
            <li>👥 团队协作功能</li>
            <li>🔄 数据导入导出（JSON格式）</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  height: 100%;
  overflow-y: auto;
  background: #f8f9fa;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.about-header {
  text-align: center;
  margin-bottom: 40px;
}

.about-title {
  font-size: 32px;
  color: #383e4e;
  font-weight: 300;
  margin-bottom: 12px;
}

.about-subtitle {
  font-size: 16px;
  color: #6c7380;
  margin: 0;
}

.about-sections {
  display: grid;
  gap: 30px;
}

.about-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 20px;
  color: #383e4e;
  margin-bottom: 20px;
  font-weight: 500;
}

.feature-list,
.usage-list,
.future-list {
  margin: 0;
  padding-left: 20px;
}

.feature-list li,
.future-list li {
  margin-bottom: 8px;
  color: #6c7380;
  line-height: 1.6;
}

.usage-list li {
  margin-bottom: 12px;
  color: #6c7380;
  line-height: 1.6;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tech-item {
  background: #383e4e;
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about-content {
    padding: 20px 16px;
  }

  .about-title {
    font-size: 24px;
  }

  .about-section {
    padding: 20px;
  }

  .section-title {
    font-size: 18px;
  }
}
</style>
