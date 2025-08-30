import { reactive, computed } from 'vue'

export type DropZone = {
  id: string
  el: HTMLElement
  onDrop: () => void
  onHover?: () => void
  onStopHovering?: () => void
}

const state = reactive<{
  zones: DropZone[]
}>({
  zones: [],
})

export function useDropZones() {
  // Computed value that sorts zones by z-index (highest first)
  const sortedZones = computed(() => {
    return [...state.zones].sort((a, b) => {
      const zIndexA = parseInt(getComputedStyle(a.el).zIndex) || 0
      const zIndexB = parseInt(getComputedStyle(b.el).zIndex) || 0
      return zIndexB - zIndexA // Sort in descending order (highest first)
    })
  })

  // Helper functions for managing zones
  const addZone = (zone: DropZone) => {
    state.zones.push(zone)
  }

  const removeZone = (id: string) => {
    const index = state.zones.findIndex((zone) => zone.id === id)
    if (index !== -1) {
      state.zones.splice(index, 1)
    }
  }

  const getZone = (id: string) => {
    return state.zones.find((zone) => zone.id === id)
  }

  return {
    zones: state.zones,
    sortedZones,
    addZone,
    removeZone,
    getZone,
  }
}
