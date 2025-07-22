<template>
  <div class="report-section">
    <h2 class="report-section-title" :class="{ 'collapsible-title': collapsible }">
      <span style="color: var(--primary-light); font-size: 18px">{{ sectionNumber }}</span>
      {{ title }}
      <span v-if="itemCount !== undefined" class="section-count">({{ itemCount }})</span>
      <button
        v-if="collapsible"
        class="collapse-btn"
        @click="toggleCollapsed"
        :class="{ collapsed: isCollapsed }"
      >
        ▼
      </button>
    </h2>
    <div v-show="!collapsible || !isCollapsed" class="section-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  sectionNumber: string
  title: string
  collapsible?: boolean
  itemCount?: number
  initialCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsible: false,
  initialCollapsed: false,
})

const isCollapsed = ref(props.initialCollapsed)

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
.report-section {
  padding: 30px 40px;
}

.report-section-title {
  font-size: 24px;
  color: var(--primary-dark);
  margin-bottom: 20px;
  font-weight: 300;
  margin-top: 0;
}

.section-count {
  font-size: 18px;
  color: var(--primary-light);
  font-weight: 400;
  margin-left: 8px;
}

.collapsible-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.collapse-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: var(--primary-light);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  transform: rotate(0deg);
  margin-left: 10px;
}

.collapse-btn:hover {
  background: var(--bg-light);
  color: var(--primary-dark);
}

.collapse-btn.collapsed {
  transform: rotate(-90deg);
}

.section-content {
  overflow: hidden;
  transition: all 0.3s ease;
}
</style>
