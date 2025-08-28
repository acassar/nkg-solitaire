import { reactive } from 'vue'

const listeners = reactive({
  pointerMove: new Set<(e: PointerEvent) => void>(),
  pointerUp: new Set<(e: PointerEvent) => void>(),
  pointerDown: new Set<(e: PointerEvent) => void>(),
})

const onPointerMove = (e: PointerEvent) => {
  e.preventDefault()
  listeners.pointerMove.forEach((callback) => callback(e))
}

const onPointerUp = (e: PointerEvent) => {
  e.preventDefault()
  console.log('listeners', listeners)
  listeners.pointerUp.forEach((callback) => callback(e))
}

const onPointerDown = (e: PointerEvent) => {
  e.preventDefault()
  listeners.pointerDown.forEach((callback) => callback(e))
}

window.addEventListener('pointermove', onPointerMove)
window.addEventListener('pointerup', onPointerUp)
window.addEventListener('pointerdown', onPointerDown)

export const useMouseListeners = () => {
  function registerPointerMoveListener(callback: (e: PointerEvent) => void) {
    listeners.pointerMove.add(callback)
  }
  function registerPointerUpListener(callback: (e: PointerEvent) => void) {
    listeners.pointerUp.add(callback)
  }
  function unregisterPointerMoveListener(callback: (e: PointerEvent) => void) {
    listeners.pointerMove.delete(callback)
  }
  function unregisterPointerUpListener(callback: (e: PointerEvent) => void) {
    listeners.pointerUp.delete(callback)
  }
  function registerPointerDownListener(callback: (e: PointerEvent) => void) {
    listeners.pointerDown.add(callback)
  }
  function unregisterPointerDownListener(callback: (e: PointerEvent) => void) {
    listeners.pointerDown.delete(callback)
  }

  return {
    registerPointerMoveListener,
    registerPointerUpListener,
    unregisterPointerMoveListener,
    unregisterPointerUpListener,
    registerPointerDownListener,
    unregisterPointerDownListener,
  }
}
