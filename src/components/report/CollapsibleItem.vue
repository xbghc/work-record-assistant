<template>
  <div v-if="!item.collapsible" :class="cardClass">
    <h3 class="card-title">
      <slot name="title">{{ item.title || defaultTitle }}</slot>
    </h3>
    <div class="card-content">
      <slot name="content">{{ item.content || '暂无描述' }}</slot>
    </div>
  </div>
  
  <details v-else :class="cardClass">
    <summary class="collapsible-summary">
      <h3 class="card-title">
        <slot name="title">{{ item.title || defaultTitle }}</slot>
      </h3>
      <span class="collapse-indicator">▼</span>
    </summary>
    <div class="card-content collapsible-content">
      <slot name="content">{{ item.content || '暂无描述' }}</slot>
    </div>
  </details>
</template>

<script setup lang="ts">
import type { ReportItem, PlanItem } from '@/types/report'

interface Props {
  item: ReportItem | PlanItem
  cardClass?: string
  defaultTitle?: string
}

withDefaults(defineProps<Props>(), {
  cardClass: 'output-card',
  defaultTitle: '未命名项目'
})
</script>

<style scoped>
.collapsible-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  list-style: none;
  padding: 0;
  margin: 0;
}

.collapsible-summary::-webkit-details-marker {
  display: none;
}

.collapse-indicator {
  font-size: 14px;
  color: var(--primary-light);
  transition: transform 0.3s ease;
  flex-shrink: 0;
  margin-left: 10px;
}

details[open] .collapse-indicator {
  transform: rotate(180deg);
}

.collapsible-content {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
}

.card-title {
  font-size: 16px;
  color: var(--primary-dark);
  margin-bottom: 10px;
  font-weight: 500;
  margin-top: 0;
  flex-grow: 1;
}

.card-content {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>