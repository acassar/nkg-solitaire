<script setup lang="ts">
import { useSettingsStore } from '@/stores/settingsStore'
import { ref } from 'vue'

const settings = useSettingsStore()
const isOpen = ref(false)
</script>

<template>
  <div class="options-container">
    <button @click="isOpen = !isOpen" class="options-btn" :class="{ active: isOpen }">
      ⚙
    </button>

    <div v-if="isOpen" class="options-modal" @click.self="isOpen = false">
      <div class="options-content">
        <h2>Options</h2>

        <div class="options-section">
          <h3>Statistiques</h3>
          <p class="section-desc">Choisissez les informations à afficher pendant la partie.</p>

          <label class="toggle-row">
            <span class="toggle-label">Score</span>
            <input type="checkbox" v-model="settings.showScore" class="toggle-input" />
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>

          <label class="toggle-row">
            <span class="toggle-label">Temps</span>
            <input type="checkbox" v-model="settings.showTime" class="toggle-input" />
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>

          <label class="toggle-row">
            <span class="toggle-label">Mouvements</span>
            <input type="checkbox" v-model="settings.showMoves" class="toggle-input" />
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>

        <button @click="isOpen = false" class="close-btn">Fermer</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.options-container {
  position: relative;
}

.options-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.options-btn:hover {
  background: linear-gradient(135deg, #2980b9, #1f618d);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

.options-btn.active {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.options-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.options-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.options-content h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.8rem;
}

.options-section h3 {
  color: #34495e;
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
}

.section-desc {
  color: #7f8c8d;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #ecf0f1;
  cursor: pointer;
  user-select: none;
}

.toggle-row:last-of-type {
  border-bottom: none;
}

.toggle-label {
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 500;
}

.toggle-input {
  display: none;
}

.toggle-track {
  width: 44px;
  height: 24px;
  background: #ccc;
  border-radius: 12px;
  position: relative;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.toggle-input:checked + .toggle-track {
  background: #3498db;
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked + .toggle-track .toggle-thumb {
  transform: translateX(20px);
}

.close-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 1.5rem;
}

.close-btn:hover {
  background: #c0392b;
}

@media (max-width: 640px) {
  .options-btn {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .options-content {
    padding: 1.5rem;
  }

  .options-content h2 {
    font-size: 1.4rem;
  }
}
</style>
