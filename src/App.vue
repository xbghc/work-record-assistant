<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <nav class="app-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <h1 class="brand-title">工作记录编写助手</h1>
          <span class="brand-subtitle">Work Record Assistant</span>
        </div>
        <div class="nav-links">
          <RouterLink to="/" class="nav-link">
            <span class="nav-icon">📝</span>
            记录编写
          </RouterLink>
          <RouterLink to="/about" class="nav-link">
            <span class="nav-icon">ℹ️</span>
            关于
          </RouterLink>
        </div>
      </div>
    </nav>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* 全局重置和基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  overflow: hidden;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'PingFang SC',
    'Microsoft YaHei', sans-serif;
  background: #f8f9fa;
  color: #383e4e;
  line-height: 1.6;
}

#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 导航栏样式 */
.app-nav {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.nav-brand {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.brand-title {
  font-size: 20px;
  font-weight: 600;
  color: #383e4e;
  margin: 0;
}

.brand-subtitle {
  font-size: 12px;
  color: #6c7380;
  font-weight: 400;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  color: #6c7380;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: #f8f9fa;
  color: #383e4e;
}

.nav-link.router-link-active {
  background: #383e4e;
  color: white;
}

.nav-icon {
  font-size: 16px;
}

.app-main {
  flex: 1;
  overflow: hidden;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

/* 确保输入框在移动设备上的表现 */
input,
textarea,
select {
  font-family: inherit;
  font-size: inherit;
}

/* 移除默认的 focus outline，使用自定义样式 */
input:focus,
textarea:focus,
select:focus {
  outline: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
    height: 56px;
  }

  .brand-title {
    font-size: 18px;
  }

  .brand-subtitle {
    display: none;
  }

  .nav-links {
    gap: 4px;
  }

  .nav-link {
    padding: 6px 12px;
    font-size: 13px;
  }

  .nav-icon {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 12px;
  }

  .brand-title {
    font-size: 16px;
  }

  .nav-link {
    padding: 6px 8px;
    font-size: 12px;
  }

  .nav-link span:not(.nav-icon) {
    display: none;
  }
}

/* 打印样式优化 */
@media print {
  body {
    background: white !important;
  }

  #app {
    height: auto !important;
    overflow: visible !important;
  }

  .app-nav {
    display: none !important;
  }
}
</style>
