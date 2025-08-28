import { reactive } from 'vue'

export type DropZone = {
  id: string
  el: HTMLElement
  onDrop: () => void
  onHover?: () => void
  onStopHovering?: () => void
}

export const dropZoneState = reactive<{
  zones: DropZone[]
}>({
  zones: [],
})
