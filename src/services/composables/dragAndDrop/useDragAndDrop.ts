// composables/useDragAndDrop.ts
import { onBeforeUnmount, onMounted, reactive, type Ref } from 'vue'
import { type DropZone, useDropZones } from './useDropZones'
import { useMouseListeners } from './useMouseListeners'

type DragState = {
  dragging: boolean
  pendingDrag: boolean
  elements: HTMLElement[]
  lastZoneHovered: DropZone | null | undefined
  pointerStartX: number
  pointerStartY: number
  elementOriginalX: number
  elementOriginalY: number
  pointerId: number | null
}

interface UseDragAndDropOptions {
  dragEndCallback?: () => void
  allowFreeDrag?: Ref<boolean>
  allowDropOnZone?: Ref<boolean>
}

export function useDragAndDrop(options: UseDragAndDropOptions = {}) {
  const {
    registerPointerMoveListener,
    registerPointerUpListener,
    unregisterPointerMoveListener,
    unregisterPointerUpListener,
  } = useMouseListeners()

  const { sortedZones: zones, addZone, removeZone } = useDropZones()

  const dragState = reactive<DragState>({
    dragging: false,
    pendingDrag: false,
    elements: [],
    lastZoneHovered: null,
    pointerStartX: 0,
    pointerStartY: 0,
    elementOriginalX: 0,
    elementOriginalY: 0,
    pointerId: null,
  })

  function registerDropZone(props: DropZone) {
    addZone(props)
  }

  function unregisterDropZone(id: string) {
    removeZone(id)
  }

  /**
   * Records a pending drag. The drag only activates once the pointer moves
   * more than 5px, so a double-click (no movement) never starts a drag.
   */
  function startDrag(e: PointerEvent, el: HTMLElement | HTMLElement[]) {
    if (dragState.dragging || dragState.pendingDrag) return

    dragState.pendingDrag = true
    dragState.elements = Array.isArray(el) ? el : [el]
    dragState.pointerId = e.pointerId
    dragState.pointerStartX = e.clientX
    dragState.pointerStartY = e.clientY

    const style = getComputedStyle(dragState.elements[0])
    const matrixMatch = style.transform.match(/matrix.*\((.+)\)/)
    if (matrixMatch) {
      const vals = matrixMatch[1].split(',').map((v) => parseFloat(v))
      dragState.elementOriginalX = vals.length >= 6 ? vals[4] : 0
      dragState.elementOriginalY = vals.length >= 6 ? vals[5] : 0
    } else {
      dragState.elementOriginalX = 0
      dragState.elementOriginalY = 0
    }
  }

  /** Transitions from pending to active drag once the movement threshold is exceeded. */
  function activateDrag() {
    dragState.pendingDrag = false
    dragState.dragging = true

    dragState.elements.forEach((el) => el.setPointerCapture(dragState.pointerId!))

    dragState.elements.forEach((el, index) => {
      ;(el as HTMLElement & { __originalParent?: Node | null }).__originalParent = el.parentNode
      ;(el as HTMLElement & { __originalNextSibling?: Node | null }).__originalNextSibling =
        el.nextSibling

      el.style.position = 'absolute'
      el.style.left = `${dragState.pointerStartX - el.clientWidth / 2}px`
      el.style.top = `${dragState.pointerStartY - (el.clientHeight - index * 50) / 2}px`
      el.style.zIndex = '99999'

      document.body.appendChild(el)
    })
  }

  function moveElement(x: number, y: number) {
    if (!dragState.elements?.length) return
    const transformValue = x === 0 && y === 0 ? '' : `translate3d(${x}px, ${y}px, 0)`
    dragState.elements.forEach((el) => {
      el.style.transform = transformValue
    })
  }

  function findZone() {
    const el = dragState.elements[0] as HTMLElement
    if (!el) return

    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    return zones.value.find((z) => {
      const zr = z.el.getBoundingClientRect()
      return centerX >= zr.left && centerX <= zr.right && centerY >= zr.top && centerY <= zr.bottom
    })
  }

  function handleHovering() {
    const zone = findZone()
    if (zone && zone.onHover) {
      zone.onHover()
      if (dragState.lastZoneHovered !== zone) dragState.lastZoneHovered?.onStopHovering?.()
      dragState.lastZoneHovered = zone
    } else {
      dragState.lastZoneHovered?.onStopHovering?.()
      dragState.lastZoneHovered = null
    }
  }

  function onPointerMove(e: PointerEvent) {
    if (dragState.pointerId !== e.pointerId) return

    if (dragState.pendingDrag) {
      const dx = e.clientX - dragState.pointerStartX
      const dy = e.clientY - dragState.pointerStartY
      if (Math.sqrt(dx * dx + dy * dy) > 5) {
        activateDrag()
        // Fall through: move element to current pointer position immediately
      } else {
        return
      }
    }

    if (!dragState.dragging || !dragState.elements) return

    const pointerDeltaX = e.clientX - dragState.pointerStartX
    const pointerDeltaY = e.clientY - dragState.pointerStartY
    moveElement(
      dragState.elementOriginalX + pointerDeltaX,
      dragState.elementOriginalY + pointerDeltaY,
    )
    handleHovering()
  }

  function onPointerUp(e: PointerEvent) {
    if (dragState.pointerId !== e.pointerId) return

    if (dragState.pendingDrag) {
      // Pointer released without enough movement — was a click, not a drag
      dragState.pendingDrag = false
      dragState.pointerId = null
      dragState.elements = []
      options.dragEndCallback?.()
      return
    }

    if (!dragState.dragging) return

    const { elements } = dragState
    if (!elements?.length) return

    const zone = findZone()

    if (zone) {
      zone.onDrop()
      if (!options.allowDropOnZone?.value) {
        moveElement(dragState.elementOriginalX, dragState.elementOriginalY)
      }
    } else if (!options.allowFreeDrag?.value) {
      moveElement(dragState.elementOriginalX, dragState.elementOriginalY)
    }

    dragState.lastZoneHovered?.onStopHovering?.()
    dragState.lastZoneHovered = null

    try {
      elements.forEach((el) => el.releasePointerCapture(dragState.pointerId!))
    } catch {}

    elements.forEach((el) => (el.style.zIndex = ''))
    dragState.dragging = false
    dragState.pointerId = null
    dragState.elements = []

    elements.forEach((el) => {
      el.style.position = ''
      el.style.left = ''
      el.style.top = ''
      el.style.zIndex = ''
      el.style.transform = ''

      const originalParent = (el as HTMLElement & { __originalParent?: Node | null })
        .__originalParent
      const originalNextSibling = (
        el as HTMLElement & { __originalNextSibling?: Node | null }
      ).__originalNextSibling
      if (originalParent) {
        originalParent.insertBefore(el, originalNextSibling ?? null)
      }
    })

    options.dragEndCallback?.()
  }

  onMounted(() => {
    registerPointerMoveListener(onPointerMove)
    registerPointerUpListener(onPointerUp)
  })

  onBeforeUnmount(() => {
    unregisterPointerMoveListener(onPointerMove)
    unregisterPointerUpListener(onPointerUp)
  })

  return {
    startDrag,
    registerDropZone,
    unregisterDropZone,
  }
}
