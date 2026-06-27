import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'nkg-solitaire-settings'

function loadSettings(): Record<string, boolean> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export const useSettingsStore = defineStore('settings', () => {
  const saved = loadSettings()

  const showScore = ref<boolean>(saved?.showScore ?? false)
  const showTime = ref<boolean>(saved?.showTime ?? false)
  const showMoves = ref<boolean>(saved?.showMoves ?? false)

  watch([showScore, showTime, showMoves], () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        showScore: showScore.value,
        showTime: showTime.value,
        showMoves: showMoves.value,
      }),
    )
  })

  return { showScore, showTime, showMoves }
})
