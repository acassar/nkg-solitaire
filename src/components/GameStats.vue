<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStateStore } from '@/stores/gameStateStore'

const gameStore = useGameStateStore()
const { gameState } = storeToRefs(gameStore)

const stats = computed(() => gameStore.getStats())

const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="game-stats">
    <div class="stat-item">
      <span class="stat-label">Score:</span>
      <span class="stat-value">{{ stats.score }}</span>
    </div>
    
    <div class="stat-item">
      <span class="stat-label">Mouvements:</span>
      <span class="stat-value">{{ stats.moves }}</span>
    </div>
    
    <div class="stat-item">
      <span class="stat-label">Temps:</span>
      <span class="stat-value">{{ formatTime(stats.timeElapsed) }}</span>
    </div>
    
    <div class="stat-item">
      <span class="stat-label">Fondations:</span>
      <span class="stat-value">{{ stats.completedFoundations }}/4</span>
    </div>
  </div>
</template>

<style scoped>
.game-stats {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.25rem;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .game-stats {
    gap: 1rem;
    padding: 0.5rem 1rem;
  }
  
  .stat-value {
    font-size: 1rem;
  }
}
</style>

