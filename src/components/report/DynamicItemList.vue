<template>
  <div class="form-section">
    <h2 class="section-header">{{ title }}</h2>
    <div class="dynamic-section">
      <div v-for="(item, index) in items" :key="item.id" class="item-container">
        <div class="item-header">
          <span class="item-title">
            <span class="item-icon">{{ icon }}</span>
            {{ itemLabel }} {{ index + 1 }}
          </span>
          <button type="button" class="btn-remove" @click="removeItem(index)">删除</button>
        </div>

        <!-- 计划项的特殊布局：标题和时间在同一行 -->
        <div v-if="type === 'plans'" class="form-row">
          <div class="form-group">
            <input
              type="text"
              class="form-input"
              :value="item.title"
              @input="updateItem(index, 'title', ($event.target as HTMLInputElement).value)"
              placeholder="计划标题"
            />
          </div>
          <div class="form-group">
            <input
              type="text"
              class="form-input"
              :value="(item as PlanItem).time || ''"
              @input="updateItem(index, 'time', ($event.target as HTMLInputElement).value)"
              placeholder="时间安排（如：周一-周二）"
            />
          </div>
        </div>

        <!-- 其他项的标题 -->
        <div v-else class="form-group">
          <input
            type="text"
            class="form-input"
            :value="item.title"
            @input="updateItem(index, 'title', ($event.target as HTMLInputElement).value)"
            :placeholder="titlePlaceholder"
          />
        </div>

        <!-- 通用的内容区域 -->
        <div class="form-group">
          <textarea
            class="form-textarea"
            :value="item.content"
            @input="updateItem(index, 'content', ($event.target as HTMLInputElement).value)"
            :placeholder="contentPlaceholder"
          ></textarea>
        </div>
      </div>
    </div>
    <button type="button" class="btn-add" @click="addItem">+ {{ addButtonText }}</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ReportItem, PlanItem, ItemType } from '@/types/report'
import { createNewItem } from '@/composables/useLocalStorage'

interface Props {
  type: ItemType
  items: (ReportItem | PlanItem)[]
}

interface Emits {
  (e: 'update:items', items: (ReportItem | PlanItem)[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 根据类型配置不同的显示内容
const config = computed(() => {
  switch (props.type) {
    case 'outputs':
      return {
        title: '本周工作',
        icon: '📋',
        itemLabel: '工作项',
        titlePlaceholder: '工作标题',
        contentPlaceholder: '详细描述（支持换行，每行将显示为一个列表项）',
        addButtonText: '添加本周工作',
      }
    case 'achievements':
      return {
        title: '个人收获',
        icon: '💡',
        itemLabel: '收获',
        titlePlaceholder: '个人收获标题',
        contentPlaceholder: '详细描述',
        addButtonText: '添加个人收获',
      }
    case 'plans':
      return {
        title: '下周计划',
        icon: '🎯',
        itemLabel: '计划',
        titlePlaceholder: '计划标题',
        contentPlaceholder: '详细描述',
        addButtonText: '添加计划',
      }
    default:
      return {
        title: '',
        icon: '',
        itemLabel: '',
        titlePlaceholder: '',
        contentPlaceholder: '',
        addButtonText: '',
      }
  }
})

const title = computed(() => config.value.title)
const icon = computed(() => config.value.icon)
const itemLabel = computed(() => config.value.itemLabel)
const titlePlaceholder = computed(() => config.value.titlePlaceholder)
const contentPlaceholder = computed(() => config.value.contentPlaceholder)
const addButtonText = computed(() => config.value.addButtonText)

const addItem = () => {
  const newItem = createNewItem(props.type)
  const updatedItems = [...props.items, newItem]
  emit('update:items', updatedItems)
}

const removeItem = (index: number) => {
  const updatedItems = [...props.items]
  updatedItems.splice(index, 1)
  emit('update:items', updatedItems)
}

const updateItem = (index: number, field: string, value: string) => {
  const updatedItems = [...props.items]
  const item = updatedItems[index]
  if (field === 'title' || field === 'content') {
    item[field] = value
  } else if (field === 'time' && 'time' in item) {
    ;(item as PlanItem).time = value
  }
  emit('update:items', updatedItems)
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

.dynamic-section {
  margin-bottom: 20px;
}

.item-container {
  margin-bottom: 15px;
  padding: 15px;
  background: var(--bg-light);
  border-radius: 4px;
  position: relative;
  border: 1px solid var(--border-color);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.item-title {
  font-weight: 500;
  color: var(--primary-dark);
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-icon {
  font-size: 16px;
  display: inline-flex;
  align-items: center;
}

.btn-remove {
  background: var(--danger);
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: opacity 0.3s;
}

.btn-remove:hover {
  opacity: 0.8;
}

.btn-add {
  background: var(--primary-dark);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
  width: 100%;
}

.btn-add:hover {
  background: #5a6275;
}

.form-group {
  margin-bottom: 15px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-dark);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
</style>
