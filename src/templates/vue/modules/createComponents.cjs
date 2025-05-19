'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建公共组件
 */
async function createCommonComponents(componentsDir, options) {
  const isTS = options.language === 'TypeScript';
  const isElementPlus = options.uiFramework === 'Element Plus';
  
  // 创建一个基础按钮组件
  let buttonContent = '';
  
  if (isElementPlus) {
    if (isTS) {
      buttonContent = `<template>
  <el-button
    :type="type"
    :size="size"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </el-button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
type ButtonSize = 'large' | 'default' | 'small'

export default defineComponent({
  name: 'BaseButton',
  props: {
    type: {
      type: String as PropType<ButtonType>,
      default: 'primary'
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (e: MouseEvent) => {
      emit('click', e)
    }

    return {
      handleClick
    }
  }
})
</script>`;
    } else {
      buttonContent = `<template>
  <el-button
    :type="type"
    :size="size"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (e) => {
      emit('click', e)
    }

    return {
      handleClick
    }
  }
}
</script>`;
    }
  } else {
    if (isTS) {
      buttonContent = `<template>
  <button
    :class="['base-button', type, size]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
type ButtonSize = 'large' | 'medium' | 'small'

export default defineComponent({
  name: 'BaseButton',
  props: {
    type: {
      type: String as PropType<ButtonType>,
      default: 'primary'
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: 'medium'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (e: MouseEvent) => {
      emit('click', e)
    }

    return {
      handleClick
    }
  }
})
</script>

<style scoped>
.base-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: .1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}

.base-button.primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

.base-button.success {
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
}

.base-button.warning {
  color: #fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
}

.base-button.danger {
  color: #fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}

.base-button.info {
  color: #fff;
  background-color: #909399;
  border-color: #909399;
}

.base-button.text {
  border-color: transparent;
  color: #409eff;
  background: transparent;
  padding-left: 0;
  padding-right: 0;
}

.base-button.large {
  padding: 12px 22px;
  font-size: 16px;
}

.base-button.medium {
  padding: 10px 20px;
  font-size: 14px;
}

.base-button.small {
  padding: 8px 16px;
  font-size: 12px;
}

.base-button:disabled {
  color: #c0c4cc;
  cursor: not-allowed;
  background-image: none;
  background-color: #fff;
  border-color: #ebeef5;
}
</style>`;
    } else {
      buttonContent = `<template>
  <button
    :class="['base-button', type, size]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'medium'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (e) => {
      emit('click', e)
    }

    return {
      handleClick
    }
  }
}
</script>

<style scoped>
.base-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: .1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}

.base-button.primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

.base-button.success {
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
}

.base-button.warning {
  color: #fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
}

.base-button.danger {
  color: #fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}

.base-button.info {
  color: #fff;
  background-color: #909399;
  border-color: #909399;
}

.base-button.text {
  border-color: transparent;
  color: #409eff;
  background: transparent;
  padding-left: 0;
  padding-right: 0;
}

.base-button.large {
  padding: 12px 22px;
  font-size: 16px;
}

.base-button.medium {
  padding: 10px 20px;
  font-size: 14px;
}

.base-button.small {
  padding: 8px 16px;
  font-size: 12px;
}

.base-button:disabled {
  color: #c0c4cc;
  cursor: not-allowed;
  background-image: none;
  background-color: #fff;
  border-color: #ebeef5;
}
</style>`;
    }
  }
  
  // 保存按钮组件
  await fs.writeFile(
    path.join(componentsDir, 'BaseButton.vue'),
    buttonContent,
    'utf-8'
  );
  
  // 创建卡片组件(简化版)
  let cardContent = `<template>
  <div class="base-card">
    <div v-if="title" class="base-card__header">
      <slot name="header">{{ title }}</slot>
    </div>
    <div class="base-card__body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.base-card {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.base-card__header {
  padding: 18px 20px;
  border-bottom: 1px solid #ebeef5;
}

.base-card__body {
  padding: 20px;
}
</style>`;
  
  // 保存卡片组件
  await fs.writeFile(
    path.join(componentsDir, 'BaseCard.vue'),
    cardContent,
    'utf-8'
  );
}

module.exports = {
  createCommonComponents
}; 