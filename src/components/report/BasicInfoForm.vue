<template>
  <div class="form-section">
    <h2 class="section-header">基本信息</h2>
    <div class="form-group">
      <label class="form-label">报告标题</label>
      <input
        type="text"
        class="form-input"
        :value="modelValue.reportTitle"
        @input="updateField('reportTitle', ($event.target as HTMLInputElement).value)"
        placeholder="请输入报告标题（如：工作记录、周报总结、项目汇报等）"
        required
      />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">姓名</label>
        <input
          type="text"
          class="form-input"
          :value="modelValue.name"
          @input="updateField('name', ($event.target as HTMLInputElement).value)"
          placeholder="请输入姓名"
          required
        />
      </div>
      <div class="form-group">
        <label class="form-label">部门</label>
        <input
          type="text"
          class="form-input"
          :value="modelValue.department"
          @input="updateField('department', ($event.target as HTMLInputElement).value)"
          placeholder="请输入部门"
          required
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">开始日期</label>
        <input
          type="date"
          class="form-input"
          :value="modelValue.startDate"
          @input="updateField('startDate', ($event.target as HTMLInputElement).value)"
          required
        />
      </div>
      <div class="form-group">
        <label class="form-label">结束日期</label>
        <input
          type="date"
          class="form-input"
          :value="modelValue.endDate"
          @input="updateField('endDate', ($event.target as HTMLInputElement).value)"
          required
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">完成Bug/需求单</label>
        <input
          type="number"
          class="form-input"
          :value="modelValue.tasksCompleted"
          @input="updateField('tasksCompleted', Number(($event.target as HTMLInputElement).value))"
          placeholder="12"
        />
      </div>
      <div class="form-group">
        <label class="form-label">MR合并数</label>
        <input
          type="number"
          class="form-input"
          :value="modelValue.commits"
          @input="updateField('commits', Number(($event.target as HTMLInputElement).value))"
          placeholder="28"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ReportData } from '@/types/report'

interface Props {
  modelValue: ReportData
}

interface Emits {
  (e: 'update:modelValue', value: ReportData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateField = (field: keyof ReportData, value: string | number) => {
  const updatedData = { ...props.modelValue }
  ;(updatedData[field] as string | number) = value
  emit('update:modelValue', updatedData)
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

.form-group {
  margin-bottom: 15px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 5px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-dark);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
</style>
