// composables/useDragAndDrop.ts
import { onBeforeUnmount, onMounted, reactive } from 'vue'
import { type DropZone, dropZoneState } from './state/dropZoneState'
import { useMouseListeners } from './useMouseListeners'

type DragState = {
  dragging: boolean
  element: HTMLElement | null | undefined
  lastZoneHovered: DropZone | null | undefined
  pointerStartX: number
  pointerStartY: number
  elementOriginalX: number
  elementOriginalY: number
  pointerId: number | null
}

interface UseDragAndDropOptions {
  dragEndCallback?: () => void
}

export function useDragAndDrop(options: UseDragAndDropOptions = {}) {
  const {
    registerPointerMoveListener,
    registerPointerUpListener,
    unregisterPointerMoveListener,
    unregisterPointerUpListener,
  } = useMouseListeners()

  const dragState = reactive<DragState>({
    dragging: false,
    element: null,
    lastZoneHovered: null,
    pointerStartX: 0,
    pointerStartY: 0,
    elementOriginalX: 0,
    elementOriginalY: 0,
    pointerId: null,
  })

  /** Register a drop zone */
  function registerDropZone(props: DropZone) {
    dropZoneState.zones.push(props)
  }

  /** Unregister a drop zone */
  function unregisterDropZone(id: string) {
    dropZoneState.zones = dropZoneState.zones.filter((z) => z.id !== id)
  }

  /** Starts a drag operation */
  function startDrag(e: PointerEvent, el: HTMLElement) {
    e.preventDefault()
    dragState.dragging = true
    dragState.element = el

    dragState.pointerId = e.pointerId
    el.setPointerCapture(dragState.pointerId)

    const style = getComputedStyle(el)
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

    el.style.zIndex = '1000'
  }

  function moveElement(x: number, y: number) {
    if (!dragState.element) return
    if (x === 0 && y === 0) dragState.element.style.transform = ''
    else dragState.element.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  function findZone() {
    const el = dragState.element
    if (!el) return

    // Find the zone touched from the center of the element
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const zone = dropZoneState.zones.find((z) => {
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
    if (!dragState.dragging || dragState.pointerId !== e.pointerId || !dragState.element) return

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

    const el = dragState.element
    if (!el) return

    const zone = findZone()

    if (zone) {
      zone.onDrop()
    } else {
      // Return the element to its original position if no drop zone found
      moveElement(dragState.elementOriginalX, dragState.elementOriginalY)
    }

    try {
      el.releasePointerCapture(dragState.pointerId!)
    } catch {}

    // Reset the element
    el.style.zIndex = ''
    dragState.dragging = false
    dragState.pointerId = null
    dragState.element = null

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
