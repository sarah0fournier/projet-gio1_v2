<template>

  <div class="container-fluid" id="mainContainer">

    <div class="row align-items-start">

      <!-- Left: menu and drop-down menu -->
      <div class="col-3 border overflow-y-auto" id="menu">
          
          <!-- Logo -->
          <div class="w3-center">
              <h1>Carte de la Suisse</h1>
          </div>
          <!-- End Logo -->

          <!-- Champ de saisie de recherche avec Typeahead -->
          <div class="mt-2 greyBackground border border-dark p-1">
              <div id="scrollable-dropdown-menu">
                  <input id="searchInput" class="form-control" type="text" placeholder="Recherche une parcelle, adresse,...">
              </div>
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
                      <!-- Pbl emplacement affichage info supplementaire -->
                      <button id="myButton" onmouseover="showTooltip()" onmouseout="hideTooltip()" style="margin-left: 5px;">?</button>
                      <div id="tooltip" style="display: none; position: absolute; z-index: 999; background-color: white;"> Hauteur relative la plus petite</div>
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
                  
                  <!-- Ajouter avec bouton vue iconne dessin -->
                  <ViewButton buttonImage="/img/pentagon-svgrepo-com.png" buttonId="drawBtn" @bouton-click="startDraw"/>
                  <br><br>

                  <!-- Boutons -->
                  <ViewButton buttonText="Soumettre" buttonId="submitBtn" @bouton-click="submit" />
                  <ViewButton buttonText="Reinitialiser" buttonId="resetBtn" @bouton-click="reset" />
              </form>
          </div>
          <!-- End Formulaire -->
            
          <!-- Couches à cocher -->
          <div class="mt-2 greyBackground border border-dark p-1"> 
            <!-- <ViewChecboxLayer @changed="layersChanged" /> -->
            <ViewChecboxLayer :layers="layers" :layerVisibility="layerVisibility" @layer-visibility-changed="toggleLayer" />
          </div>
          <!-- End Conteneur layers -->

      <!-- End Conteneur menu -->
      </div>

      <!-- Right: Contenur map -->
      <div class="col">
        <ViewMaps :layers="layers" :layerVisibility="layerVisibility" :isDrawing="isDrawing" :vectorLayer="vectorLayer" :intialiserFormulaire="intialiserFormulaire">      
        </ViewMaps>
          <!-- <div id="map">
              <div id="popup" class="ol-popup"></div>
          </div> -->
      </div>
      <!-- End Contenur map --> 

    </div>
  </div>
  <router-view />
</template>

<script>


// A traiter 
// import searchLocation from './assets/js/searchLocation.js'; 
// import infoClick from './assets/js/infoClick.js'; 
import * as flightForm from './assets/js/flightForm.js';


// Import composant
import ViewMaps from './components/views/ViewMaps.vue';
import ViewButton from './components/views/ViewButton.vue';
import ViewChecboxLayer from './components/views/ViewChecboxLayer.vue'; 

import { wmsUrlGeoadmin, attributionUrlGeoadmin, wmsUrlGeodienst, attributionUrlGeodienst } from './assets/js/constante.js';
import {createLayer } from './assets/js/addLayer.js';

export default {
  name: 'App-root',
  components: {
    ViewMaps,
    ViewButton,
    ViewChecboxLayer,
  },

  data(){
    return {
      isDrawing : false,
      intialiserFormulaire : false,

      layers : [
        createLayer("Restriction pour drone CH","ch.bazl.einschraenkungen-drohnen", "Zones géographiques UAS en Suisse / OFAC", wmsUrlGeoadmin, attributionUrlGeoadmin, false ),
        createLayer("Obstacle a la navigation aerienne","ch.bazl.luftfahrthindernis", "Obstacles à la navigation aérienne / OFAC", wmsUrlGeoadmin, attributionUrlGeoadmin, false ),
        // Ajoutez d'autres couches si necessaire (pas oublier ajouter false dans layerVisibility aussi)      
      ],

      // Visibilite des couches 
      layerVisibility : [
        false,
        false,
      ],      

      // TODO : Layer background (meme principe que layers) --> PBL me donne ereur
      // layersBackground : [
      //   createLayer("CN","ch.swisstopo.pixelkarte-farbe", "WMTS CarteNationale", wmsUrlGeoadmin, attributionUrlGeoadmin),
      //   createLayer("SwissSURFACE3D","ch.swisstopo.swisssurface3d-reliefschattierung-multidirektional", "WMTS Relief multidir. issu de SwissSURFACE3D", wmsUrlGeoadmin, attributionUrlGeoadmin),
      //   createLayer("MO","LCSF,LCSFPROJ,Conduites,SOLI,SOSF,SOPT,Adresses_des_batiments,Nomenclature,Biens_fonds,Biens_fonds_projetes,Limites_territoriales", "WMTS MO", wmsUrlGeodienst, attributionUrlGeodienst),
      //   createLayer("swissImage","ch.swisstopo.swissimage", "WMTS swissimage", wmsUrlGeoadmin, attributionUrlGeoadmin),
      // ],

      vectorLayer: null, 
    };
  },
  computed: {
    currentRoute(){
      return this.$route.path;
    }
  },
  methods: {

    submit(event) {
      event.preventDefault();
      if (flightForm.validateForm()) {
        this.endDraw()
        console.log("Formulaire soumis avec succès !");
      }
    },

    reset(event){
      flightForm.resetForm();
      // this.endDraw();
      this.endFormular() ;
      console.log("Formulaire réinitialiser !");
    },

    startDraw(event) {
      this.isDrawing = true;
      console.log("Fonction pour dessiner activer");
    },

    endFormular(event){
      this.intialiserFormulaire = true ;
    },

    endDraw(event) {
      this.isDrawing = false;
    },

    showPopup(event) {
      // this.activPopup = true
      // this.popupVisible = true; // Afficher la popup
      this.coordinates = [0,0];
      this.popupVisible = true;
    },

    endPopup(event){
      this.activPopup = false
    },

        // Méthode pour mettre à jour les coordonnées de la popup
        updatePopupCoordinates(coordinates) {
      this.popupCoordinates = coordinates;}


  },
  mounted() {
    // initLayer();
    // initFlightZone();   
    // initFlightForm();
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
    margin-top: 60px;
    height: 100%;
    width: 100%;
  }
  #vue-icon{
    height: 5em;
  }
</style>