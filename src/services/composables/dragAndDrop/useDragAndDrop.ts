// composables/useDragAndDrop.ts
import { onBeforeUnmount, onMounted, reactive, type Ref } from 'vue'
import { type DropZone, useDropZones } from './useDropZones'
import { useMouseListeners } from './useMouseListeners'

type DragState = {
  dragging: boolean
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

// TODO: add a callback to handle the drag start
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
    elements: [],
    lastZoneHovered: null,
    pointerStartX: 0,
    pointerStartY: 0,
    elementOriginalX: 0,
    elementOriginalY: 0,
    pointerId: null,
  })

  /** Register a drop zone */
  function registerDropZone(props: DropZone) {
    addZone(props)
  }

  /** Unregister a drop zone */
  function unregisterDropZone(id: string) {
    removeZone(id)
  }

  /** Starts a drag operation */
  function startDrag(e: PointerEvent, el: HTMLElement | HTMLElement[]) {
    e.preventDefault()
    dragState.dragging = true
    dragState.elements = Array.isArray(el) ? el : [el]

    dragState.pointerId = e.pointerId
    dragState.elements.forEach((el) => el.setPointerCapture(dragState.pointerId!))

    const style = getComputedStyle(dragState.elements[0])
    const matrixMatch = style.transform.match(/matrix.*\((.+)\)/)

    // Get the original position of the element
    if (matrixMatch) {
      const vals = matrixMatch[1].split(',').map((v) => parseFloat(v))
      dragState.elementOriginalX = vals.length >= 6 ? vals[4] : 0
      dragState.elementOriginalY = vals.length >= 6 ? vals[5] : 0
    } else {
      dragState.elementOriginalX = 0
      dragState.elementOriginalY = 0
    }

    // Store the pointer position when drag starts
    dragState.pointerStartX = e.clientX
    dragState.pointerStartY = e.clientY

    dragState.elements.forEach((el, index) => {
      // Save parent and next sibling to allow re-insertion/reset position later
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

  // Find the zone touched from the center of the first element
  function findZone() {
    const el = dragState.elements[0] as HTMLElement
    if (!el) return

    // Find the zone touched from the center of the element
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const zone = zones.value.find((z) => {
      const zr = z.el.getBoundingClientRect()
      return centerX >= zr.left && centerX <= zr.right && centerY >= zr.top && centerY <= zr.bottom
    })
    return zone
  }

  /**
   * Handle the hovering of the element
   * If the element is hovering over a zone, call the onHover callback
   * If the element is not hovering over a zone, call the onStopHovering callback
   */
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

  /**
   * Handle the movement of the element
   */
  function onPointerMove(e: PointerEvent) {
    // If the element is not being dragged, return
    if (!dragState.dragging || dragState.pointerId !== e.pointerId || !dragState.elements) return

    // Calculate how much the pointer has moved since drag started
    const pointerDeltaX = e.clientX - dragState.pointerStartX
    const pointerDeltaY = e.clientY - dragState.pointerStartY

    // New element position = original position + pointer movement
    const newElementX = dragState.elementOriginalX + pointerDeltaX
    const newElementY = dragState.elementOriginalY + pointerDeltaY

    moveElement(newElementX, newElementY)

    handleHovering()
  }

  /**
   * Handle drag's end
   */
  function onPointerUp(e: PointerEvent) {
    // If dragging is not in progress or the pointer id does not match, return
    if (!dragState.dragging || dragState.pointerId !== e.pointerId) return

    const { elements } = dragState
    if (!elements?.length) return

    const zone = findZone()

    if (zone) {
      zone.onDrop()
      if (!options.allowDropOnZone?.value) {
        moveElement(dragState.elementOriginalX, dragState.elementOriginalY)
      }
    } else if (!options.allowFreeDrag?.value) {
      // Return the element to its original position if no drop zone found
      moveElement(dragState.elementOriginalX, dragState.elementOriginalY)
    }

    handleHovering()

    // Release the pointer capture
    try {
      elements.forEach((el) => el.releasePointerCapture(dragState.pointerId!))
    } catch {}

    // Reset the element
    elements.forEach((el) => (el.style.zIndex = ''))
    dragState.dragging = false
    dragState.pointerId = null
    dragState.elements = []
    // Restore original position and parent
    elements.forEach((el) => {
      el.style.position = ''
      el.style.left = ''
      el.style.top = ''
      el.style.zIndex = ''
      el.style.transform = ''

      const originalParent = (el as HTMLElement & { __originalParent?: Node | null })
        .__originalParent
      const originalNextSibling = (el as HTMLElement & { __originalNextSibling?: Node | null })
        .__originalNextSibling
      if (originalParent) {
        originalParent.insertBefore(el, originalNextSibling ?? null)
      }
    })

    // Call the unique callback passed as parameter
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
