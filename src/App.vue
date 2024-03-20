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
                  <ViewButton buttonImage="/img/pentagon-svgrepo-com.png" buttonId="drawBtn" @bouton-clik="startDraw"/>

                  <!-- Bouton dessin pour test develloppement -->
                  <!-- <ViewFlightZone @start-drawing="startDrawingOnMap" /> -->
                  <br><br>

                  <!-- Boutons -->
                  <ViewButton buttonText="Soumettre" buttonId="submitBtn" @bouton-click="submit" />
                  <ViewButton buttonText="Reinitialiser" buttonId="resetBtn" />
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
        <ViewMaps :layers="layers" :layerVisibility="layerVisibility" :isDrawing="isDrawing" @end-draw="endDraw"> </ViewMaps>

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

// Traiter fini
// import initLayer  from './assets/js/layer.js'; // File plus besoin 
import initMouseCoord from './assets/js/mouseCoord.js'; // File a laisser

// A traiter 
// import initFlightZone from './assets/js/flightZone.js';
import initFlightForm from './assets/js/flightForm.js'; // File a laisser
// import searchLocation from './assets/js/searchLocation.js'; 
// import infoClick from './assets/js/infoClick.js'; 

import { GeoAdminLayer } from './components/views/ViewChecboxLayer.vue';

import { createLayerGeoAdmin } from './components/views/ViewChecboxLayer.vue';
// Import composant
import ViewMaps from './components/views/ViewMaps.vue';
import ViewButton from './components/views/ViewButton.vue';
import ViewChecboxLayer from './components/views/ViewChecboxLayer.vue'; 
import ViewFlightZone from './components/views/ViewFlightZone.vue'; 

// const wmsUrlGeoadmin = "https://wms.geo.admin.ch/";
    // URL de base pour les attributions
// const attributionUrlGeoadmin = "https://www.geo.admin.ch/fr/home.html";

import { wmsUrlGeoadmin, attributionUrlGeoadmin } from './assets/js/constante.js';

export default {
  name: 'App-root',
  components: {
    ViewMaps,
    ViewButton,
    ViewChecboxLayer,
    ViewFlightZone,
  },

  data(){
    return {
      isDrawing : false,
      layers : [
        createLayerGeoAdmin("Restriction pour drone CH","ch.bazl.einschraenkungen-drohnen", "Zones géographiques UAS en Suisse / OFAC", wmsUrlGeoadmin, attributionUrlGeoadmin ),
        createLayerGeoAdmin("Obstacle a la navigation aerienne","ch.bazl.luftfahrthindernis", "Obstacles à la navigation aérienne / OFAC", wmsUrlGeoadmin, attributionUrlGeoadmin ),
        
        // new GeoAdminLayer("Restriction pour drone CH","ch.bazl.einschraenkungen-drohnen", "Zones géographiques UAS en Suisse / OFAC"),
        // new GeoAdminLayer("Obstacle a la navigation aerienne","ch.bazl.luftfahrthindernis", "Obstacles à la navigation aérienne / OFAC")
        // Ajoutez d'autres couches si necessaire      
      ],

      // Visibilite des couches 
      layerVisibility : [
        false,
        false,
      ],


      menuList:[
        {
          menuname:"Hello",
          route:"/"
        },
        { 
          menuname:"Axios",
          route:"/axios"
        },
        { 
          menuname:"2d_openlayers",
          route:"/openlayers"
        },
        { 
          menuname:"2d_leaflet",
          route:"/leaflet"
        },
        { 
          menuname:"3d_cesium",
          route:"/cesium"
        }
      ] 
    };
  },
  computed: {
    currentRoute(){
      return this.$route.path;
    }
  },
  methods: {
    toggleLayer(layer) {
      console.log(`App.vue : toggled layer ${layer}`)
      this.layerVisibility[layerIdx] = !this.layerVisibility[layerIdx];
      // layer.setVisible(!layer.getVisible());
      // console.log(`App.vue : layer ${layerIdx} is now ${this.layerVisibility[layerIdx]}`)
    },
    submit(event) {
      event.preventDefault();
      if (flightForm.validateForm()) {
        console.log("Formulaire soumis avec succès !");
      }
      console.log("Vous avez cliqué sur le bouton Soumettre !");
    },
    startDraw(event) {
      this.isDrawing = true;
    },
    endDraw(event) {
      this.isDrawing = false;
    }
  },
  mounted() {
    // initLayer();
    // initMouseCoord();
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