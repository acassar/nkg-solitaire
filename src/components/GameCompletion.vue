<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStateStore } from '@/stores/gameStateStore'
import { getCompletionStats } from '@/services/gameCompletionService'

const gameStore = useGameStateStore()
const { gameState } = storeToRefs(gameStore)

const completionStats = computed(() => getCompletionStats(gameState.value))
const gameStats = computed(() => gameStore.getStats())

const startNewGame = () => {
  gameStore.startNewGame()
}

const getSuitIcon = (suit: string | null) => {
  const suitIcons: Record<string, string> = {
    spades: '♠',
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣'
  }
  return suitIcons[suit || ''] || '?'
}

const getSuitColor = (suit: string | null) => {
  return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black'
}

const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<template>
  <div v-if="completionStats.isGameCompleted" class="game-completion-overlay">
    <div class="victory-modal">
      <h1>🎉 Félicitations ! 🎉</h1>
      <p>Vous avez gagné le solitaire !</p>
      
      <div class="stats">
        <h3>Statistiques Finales :</h3>
        
        <div class="final-stats">
          <div class="stat-row">
            <span class="stat-label">Score Final:</span>
            <span class="stat-value">{{ gameStats.score }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Mouvements:</span>
            <span class="stat-value">{{ gameStats.moves }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Temps:</span>
            <span class="stat-value">{{ formatTime(gameStats.timeElapsed) }}</span>
          </div>
        </div>
        
        <div class="foundation-stats">
          <h4>Fondations Complétées:</h4>
          <div class="foundation-grid">
            <div 
              v-for="(stat, index) in completionStats.foundationStats" 
              :key="index"
              class="foundation-stat"
            >
              <span 
                class="suit-icon" 
                :style="{ color: getSuitColor(stat.suit) }"
              >
                {{ getSuitIcon(stat.suit) }}
              </span>
              <span class="cards-count">{{ stat.cardsCount }}/13</span>
              <span v-if="stat.isComplete" class="complete-indicator">✓</span>
            </div>
          </div>
        </div>
      </div>

      <button @click="startNewGame" class="new-game-btn">
        Nouvelle Partie
      </button>
    </div>
  </div>

  <!-- Progress indicator -->
  <div v-else class="progress-indicator">
    <div class="progress-text">
      Progression: {{ completionStats.completedFoundations }}/4 fondations complétées
    </div>
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: `${(completionStats.completedFoundations / 4) * 100}%` }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.game-completion-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.victory-modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
}

.victory-modal h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.victory-modal p {
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-size: 1.2rem;
}

.stats {
  margin-bottom: 2rem;
}

.stats h3 {
  color: #34495e;
  margin-bottom: 1rem;
}

.final-stats {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.stat-row:last-child {
  margin-bottom: 0;
}

.stat-label {
  font-weight: 600;
  color: #2c3e50;
}

.stat-value {
  font-weight: bold;
  color: #3498db;
  font-size: 1.1rem;
}

.foundation-stats h4 {
  color: #34495e;
  margin-bottom: 1rem;
  text-align: center;
}

.foundation-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.foundation-stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.suit-icon {
  font-size: 1.5rem;
  font-weight: bold;
}

.cards-count {
  font-weight: bold;
  color: #2c3e50;
}

.complete-indicator {
  color: #27ae60;
  font-weight: bold;
  font-size: 1.2rem;
}

.new-game-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.new-game-btn:hover {
  background: #2980b9;
}

.progress-indicator {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 250px;
}

.progress-text {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  transition: width 0.3s ease;
}
</style>
