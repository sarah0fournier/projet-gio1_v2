<template>
  <div class="container-fluid" id="mainContainer">

    <div class="row align-items-start">

      <!-- Left: menu and drop-down menu -->
      <div class="col-3 border overflow-y-auto" id="menu">
          
          <!-- Logo -->
          <div class="w3-center">
              <h1 style="font-size: 30px;">Restriction drone - CH</h1>
              <h5 style="font-size: 15px;">Projet GIO1 - HES-SO MDT</h5>
          </div>
          <!-- End Logo -->

          <!-- Champ de saisie de recherche -->
          <div class="mt-2 greyBackground border border-dark p-1">
            <ViewSearch  @box-search="handleSearchResult" />
          </div>
          <!-- End Champ de saisie de recherche -->

          <!-- Formulaire -->
          <div class="mt-2 greyBackground border border-dark p-1">
              <h3 class="mx-2">Formulaire</h3>
              <form class="mx-2 my-1 pr-2" id="myForm">
                  
                  <!-- Hauteur de vol -->
                  <div style="display: flex; align-items: center;">
                       <label for="heightMachine" style="display: inline-block;">Hauteur de vol (en mètres) : </label>
                      <input type="text" id="heightMachine" name="heightMachine" required style="display: inline-block; width: 150px; margin-left: 5px;">

                      <!-- Information supplementaire -->
                      <button id="myButton" @mouseover="showTooltip()" @mouseout="hideTooltip()" style="margin-left: 5px;">?</button>
                      <div id="tooltip" style="display: none; position: absolute; z-index: 999; background-color: white;">Hauteur relative la plus petite</div>

                    </div><br>

                  <!-- Poid du drone -->
                  <label for="weightMachine" style="display: inline-block;">Poids du drone :</label>
                  <select id="weightMachine" name="weightMachine">
                      <option value="" disabled selected>Choisir une option</option>
                      <option value="250_inf">Moins que 250 gramme </option>
                      <option value="250_plus"> Plus que 250 gramme </option>
                  </select><br><br>

                  <!-- Bouton pour démarrer le dessin du polygone -->
                  <label for="DrawingButton" style="display: inline-block;">Dessiner la zone de vol :</label>
                  
                  <!-- Ajouter avec bouton vue icone dessin -->
                  <ViewButton buttonImage="/img/pentagon-svgrepo-com.png" buttonId="drawBtn" @bouton-click="startDraw"/>
                  <br><br>

                  <!-- Boutons -->
                  <ViewButton buttonText="Soumettre" buttonId="submitBtn" @bouton-click="submit"/>
                  <ViewButton buttonText="Reinitialiser" buttonId="resetBtn" @bouton-click="reset" />
              </form>
          </div>
          <!-- End Formulaire -->
            
          <!-- Couches à cocher -->
          <div class="mt-2 greyBackground border border-dark p-1"> 
            <ViewChecboxLayer :layers="layers" :layerVisibility="layerVisibility"/>
          </div>
          <!-- End Conteneur layers -->

      <!-- End Conteneur menu -->
      </div>

      <!-- Right: Contenur map -->
      <div class="col-9">
        <ViewMaps :layers="layers" :layerVisibility="layerVisibility" :isDrawing="isDrawing" :intialiserFormulaire="intialiserFormulaire" :isResults="isResults" :selectedCoordinates="selectedCoordinates" @close-draw="this.isDrawing=false"/>      
      </div>
      <!-- End Contenur map --> 

    </div>
  </div>
  <router-view />
</template>

<script>

// Import fichier js
import * as flightForm from './assets/js/flightForm.js';


// Import composant
import ViewMaps from './components/views/ViewMaps.vue';
import ViewButton from './components/views/ViewButton.vue';
import ViewChecboxLayer from './components/views/ViewChecboxLayer.vue'; 
import ViewSearch from './components/views/ViewSearch.vue'; 

import { wmsUrlGeoadmin, attributionUrlGeoadmin } from './assets/js/constante.js';
import {createLayer } from './assets/js/addLayer.js';

export default {
  name: 'App-root',
  components: {
    ViewMaps,
    ViewButton,
    ViewChecboxLayer,
    ViewSearch,
  },

  data(){
    /**
     * État de l'application.
     * @typedef {Object} AppState
     * @property {String} selectedCoordinates - contient les coordonnée de la recherche 
     * @property {boolean} isDrawing - Indique si le dessin de la zone de vol est en cours.
     * @property {boolean} intialiserFormulaire - Indique si le formulaire est initialisé.
     * @property {Array<Object>} layers - Liste des couches de la carte.
     * @property {Array<boolean>} layerVisibility - Visibilité des couches de la carte.
     * @property {boolean} isResults - Indique si le tableau de résultats est affiché.
     * @property {boolean} isVectorLayer - Indique si la couche vectorielle est activée.
     * @returns {AppState} État initial de l'application.
    */
    
    return {
      selectedCoordinates: null, 

      isDrawing : false, // Etat change quand on clique sur bouton dessin ou soumettre
      intialiserFormulaire : false,
      
      layers : [
        createLayer("Zones géographiques UAS en Suisse","ch.bazl.einschraenkungen-drohnen", "Zones géographiques UAS en Suisse / OFAC", wmsUrlGeoadmin, attributionUrlGeoadmin, false ),
        createLayer("Obstacle a la navigation aerienne","ch.bazl.luftfahrthindernis", "Obstacles à la navigation aérienne / OFAC", wmsUrlGeoadmin, attributionUrlGeoadmin, false ),
        // Ajoutez d'autres couches si necessaire (pas oublier ajouter false dans layerVisibility aussi)      
      ],

      // Visibilite des couches 
      layerVisibility : [
        false,
        false,
      ],      

      isResults : false, // Etat affichage tbl result
      isVectorLayer : true, 

    };
  },
  computed: {
    currentRoute(){
      return this.$route.path;
    }
  },
  methods: {

    submit(event) {
      /**
       * Méthode pour soumettre le formulaire.
       * @param {Event} event - L'événement de soumission du formulaire.
      */
      event.preventDefault();

      // TODO : Verifier que perimetre zone dessiner : 
      // definir draw comme objet parent afin de pouvoir utiliser dans formulaire au lieu comme state de maps. 
      // puis faudrait ensuite regarder son contenu avec deep pour voir si il y a des modifications et de envoyer au parent. 

      if (flightForm.validateForm()) {
        this.isResults = true // etat affichage tbl resultat
        // console.log("Formulaire soumis avec succès !");
      }
    },

    reset(event){
      /**
       * Méthode pour réinitialiser le formulaire.
       * @param {Event} event - L'événement de réinitialisation du formulaire.
      */
      // Rinitialise hauteur vol / poids du drone
      flightForm.resetForm();
      
      // Enelver interaction dessin map
      this.endDraw();

      // Enlever vector layer 
      this.endVectorLayer()
      
      // Enlever tableau resultat 
      this.endTableau()
      
      // console.log("Formulaire réinitialiser !");
    },

    startDraw(event) {
    /**
     * Méthode pour commencer le dessin de la zone de vol.
     * @param {Event} event - L'événement de démarrage du dessin.
    */

      // Eviter que quand clique sur un bouton sa envoie le formulaire 
      // Comporetement par defaut du navigateur quand clique sur bouton dans un fomrulaire et d envoyer le formulaire
      // Solution : event.preventDefault() --> evite envoyer formulaire
      event.preventDefault();
      this.isDrawing = true;
      this.isVectorLayer = true; 

      // console.log("Fonction pour dessiner activer");
    },

    endDraw(event) {
      /**
       * Méthode pour arrêter le dessin de la zone de vol.
       * @param {Event} event - L'événement d'arrêt du dessin.
      */
      this.isDrawing = false;
      // console.log('Etat endDraw isDrawing' , this.isDrawing)
    },

    endVectorLayer(event){
      /**
       * Méthode pour désactiver la couche vectorielle.
       * @param {Event} event - L'événement de désactivation de la couche vectorielle.
      */

      // Enlever tableau resultat 
      this.isVectorLayer = false
    },

    endTableau(event){
      /**
       * Méthode pour désactiver l'affichage du tableau de résultats.
       * @param {Event} event - L'événement de désactivation du tableau de résultats.
      */
      this.isResults = false
    },

    showTooltip() {
      /**
       * Affiche la tooltip.
      */
      document.getElementById("tooltip").style.display = "block"
   },

    hideTooltip() {
      /**
       * Masque la tooltip.
      */
      document.getElementById("tooltip").style.display = "none"
    },

    handleSearchResult(geom_st_box2d) {
      /**
       * Met à jour les coordonnées de la localisation recherchée
      */
      //  console.log('Résultat de la recherche:', geom_st_box2d);
      this.selectedCoordinates = geom_st_box2d
    },

  },
  mounted() {

  },
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 0px;
    height: 100%;
    width: 100%;
  }

  #vue-icon{
    height: 5em;
  }

  #menu {
    height: 100vh;
}

  /* ----- Bouton dessiner polygone */
  /* #drawSelection {
      position: absolute;
      right: 20px;
      top: 50px;
  }

  #startDrawingButton {
      border-style: solid;
      border-width: 1px;
      border-color: black;
      padding: 5px;
      height: 50px;
      width: 50px;
  }

  #imgDraw {
      width: 40px;
      height: 40px;
  }
   */

  /* ----- End : Bouton dessiner polygone */

</style>