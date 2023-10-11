<template>
  <div class="editor" ref="el"></div>
</template>

<script setup>
import { ref, onMounted, watchEffect, inject } from 'vue'
import { debounce } from '@/utils'
import CodeMirror from './codemirror.js'

const props = defineProps({
  mode: {
    default: 'json',
    type: String
  },
  value: {
    default: '',
    type: String
  },
  readonly: {
    default: false,
    type: Boolean
  }
})

const emit = defineEmits(['update:value'])

const el = ref()
const needAutoResize = inject('autoresize')

onMounted(() => {
  const addonOptions = {
    autoCloseBrackets: true,
    autoCloseTags: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
  }

  const editor = CodeMirror(el.value, {
    value: '',
    mode: props.mode,
    readOnly: props.readonly,
    tabSize: 2,
    lineWrapping: true,
    lineNumbers: true,
    ...addonOptions
  })

  editor.on('change', () => {
    emit('update:value', editor.getValue())
  })

  watchEffect(() => {
    const cur = editor.getValue()
    if (props.value !== cur) {
      editor.setValue(props.value)
    }
  })

  watchEffect(() => {
    editor.setOption('mode', props.mode)
  })

  setTimeout(() => {
    editor.refresh()
  }, 50)

  if (needAutoResize) {
    window.addEventListener(
      'resize',
      debounce(() => {
        editor.refresh()
      })
    )
  }
})
</script>

<style>
.editor {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.CodeMirror {
  line-height: 1.5;
  height: 100%;
}
</style>
