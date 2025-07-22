<template>
  <div class="form-section">
    <h2 class="section-header">内容折叠配置</h2>
    <div class="collapsible-config">
      <div class="config-description">
        <p class="config-hint">启用折叠功能后，对应章节在预览和导出的报告中将显示展开/收起按钮</p>
      </div>

      <div class="config-controls">
        <div class="config-item">
          <label class="config-label">
            <input
              type="checkbox"
              :checked="modelValue.outputs"
              @change="updateConfig('outputs', ($event.target as HTMLInputElement).checked)"
              class="config-checkbox"
            />
            <span class="config-text">📋 本周工作可折叠</span>
          </label>
        </div>

        <div class="config-item">
          <label class="config-label">
            <input
              type="checkbox"
              :checked="modelValue.achievements"
              @change="updateConfig('achievements', ($event.target as HTMLInputElement).checked)"
              class="config-checkbox"
            />
            <span class="config-text">💡 个人收获可折叠</span>
          </label>
        </div>

        <div class="config-item">
          <label class="config-label">
            <input
              type="checkbox"
              :checked="modelValue.plans"
              @change="updateConfig('plans', ($event.target as HTMLInputElement).checked)"
              class="config-checkbox"
            />
            <span class="config-text">🎯 下周计划可折叠</span>
          </label>
        </div>
      </div>

      <div class="config-actions">
        <button type="button" class="btn-config" @click="setAllCollapsible(true)">
          全部启用折叠
        </button>
        <button type="button" class="btn-config" @click="setAllCollapsible(false)">
          全部禁用折叠
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CollapsibleConfig } from '@/types/report'

interface Props {
  modelValue: CollapsibleConfig
}

interface Emits {
  (e: 'update:modelValue', value: CollapsibleConfig): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateConfig = (field: keyof CollapsibleConfig, value: boolean) => {
  const updatedConfig = { ...props.modelValue }
  updatedConfig[field] = value
  emit('update:modelValue', updatedConfig)
}

const setAllCollapsible = (enabled: boolean) => {
  const updatedConfig: CollapsibleConfig = {
    outputs: enabled,
    achievements: enabled,
    plans: enabled,
  }
  emit('update:modelValue', updatedConfig)
}
</script>

<style scoped>
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

.collapsible-config {
  background: var(--bg-light);
  padding: 20px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.config-description {
  margin-bottom: 20px;
}

.config-hint {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.config-controls {
  margin-bottom: 20px;
}

.config-item {
  margin-bottom: 12px;
}

.config-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
}

.config-checkbox {
  margin-right: 10px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.config-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.config-actions {
  display: flex;
  gap: 10px;
}

.btn-config {
  background: var(--primary-light);
  color: var(--primary-dark);
  border: 1px solid var(--border-color);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
  flex: 1;
}

.btn-config:hover {
  background: var(--primary-dark);
  color: white;
}
</style>
