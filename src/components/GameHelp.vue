<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const toggleHelp = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="help-container">
    <button @click="toggleHelp" class="help-btn" :class="{ active: isOpen }">
      ?
    </button>
    
    <div v-if="isOpen" class="help-modal">
      <div class="help-content">
        <h2>Règles du Solitaire</h2>
        
        <div class="help-section">
          <h3>🎯 Objectif</h3>
          <p>Placez toutes les cartes dans les 4 fondations, organisées par couleur de l'As au Roi.</p>
        </div>
        
        <div class="help-section">
          <h3>📋 Règles de Base</h3>
          <ul>
            <li><strong>Tableau :</strong> Construisez des séquences décroissantes en alternant les couleurs (rouge/noir)</li>
            <li><strong>Fondations :</strong> Construisez des séquences croissantes de l'As au Roi, par couleur</li>
            <li><strong>Stock :</strong> Cliquez pour piocher des cartes</li>
            <li><strong>Roi :</strong> Seul un Roi peut être placé sur un tableau vide</li>
          </ul>
        </div>
        
        <div class="help-section">
          <h3>🎮 Contrôles</h3>
          <ul>
            <li><strong>Glisser-Déposer :</strong> Faites glisser les cartes pour les déplacer</li>
            <li><strong>Nouvelle Partie :</strong> Bouton en haut à droite</li>
          </ul>
        </div>

        <div class="help-section">
          <h3>🏆 Score</h3>
          <ul>
            <li>+100 points : Carte placée sur une fondation</li>
            <li>-15 points : Recyclage de la pile de défausse</li>
          </ul>
        </div>
        
        <button @click="toggleHelp" class="close-btn">
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.help-container {
  position: relative;
}

.help-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-btn:hover {
  background: linear-gradient(135deg, #2980b9, #1f618d);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

.help-btn.active {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.help-modal {
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

.help-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.help-content h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.8rem;
}

.help-section {
  margin-bottom: 1.5rem;
}

.help-section h3 {
  color: #34495e;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.help-section p {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.help-section ul {
  color: #7f8c8d;
  line-height: 1.6;
  padding-left: 1.5rem;
}

.help-section li {
  margin-bottom: 0.5rem;
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
  margin-top: 1rem;
}

.close-btn:hover {
  background: #c0392b;
}

@media (max-width: 768px) {
  .help-content {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .help-content h2 {
    font-size: 1.5rem;
  }
}
</style>

