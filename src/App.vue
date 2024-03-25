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
                  <ViewButton buttonText="Soumettre" buttonId="submitBtn" @bouton-click="submit"/>
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
      <div class="col-9">
        <ViewMaps :layers="layers" :layerVisibility="layerVisibility" :isDrawing="isDrawing" :isVectorLayer="isVectorLayer" :isResults="isResults" @close-draw="isDrawing = false">      
        </ViewMaps>
      </div>
      <!-- End Contenur map --> 

    </div>
  </div>
  <router-view />
</template>

<script>


// A traiter 
// import searchLocation from './assets/js/searchLocation.js'; 
import * as flightForm from './assets/js/flightForm.js';


// Import composant
import ViewMaps from './components/views/ViewMaps.vue';
import ViewButton from './components/views/ViewButton.vue';
import ViewChecboxLayer from './components/views/ViewChecboxLayer.vue'; 

import { wmsUrlGeoadmin, attributionUrlGeoadmin, wmsUrlGeodienst, attributionUrlGeodienst } from './assets/js/constante.js';
import {createLayer } from './assets/js/addLayer.js';
import { isSorted } from 'ol/array';

export default {
  name: 'App-root',
  components: {
    ViewMaps,
    ViewButton,
    ViewChecboxLayer,
  },

  data(){
    return {
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

      // TODO : Layer background (meme principe que layers) --> PBL me donne ereur
      // layersBackground : [
      //   createLayer("CN","ch.swisstopo.pixelkarte-farbe", "WMTS CarteNationale", wmsUrlGeoadmin, attributionUrlGeoadmin),
      //   createLayer("SwissSURFACE3D","ch.swisstopo.swisssurface3d-reliefschattierung-multidirektional", "WMTS Relief multidir. issu de SwissSURFACE3D", wmsUrlGeoadmin, attributionUrlGeoadmin),
      //   createLayer("MO","LCSF,LCSFPROJ,Conduites,SOLI,SOSF,SOPT,Adresses_des_batiments,Nomenclature,Biens_fonds,Biens_fonds_projetes,Limites_territoriales", "WMTS MO", wmsUrlGeodienst, attributionUrlGeodienst),
      //   createLayer("swissImage","ch.swisstopo.swissimage", "WMTS swissimage", wmsUrlGeoadmin, attributionUrlGeoadmin),
      // ],

      // vectorLayer: null, 

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
      event.preventDefault();

      // console.log(this.draw.getSource().getFeatures().length)

      // Verifier que perimetre zone dessiner : 
      // definir draw comme objet parent afin de pouvoir utiliser dans formulaire au lieu comme state de maps. 
      // puis faudrait ensuite regarder son contenu avec deep pour voir si il y a des modifications et de envoyer au parent. 

      // if (flightForm.validateForm(this.draw)) {
      if (flightForm.validateForm()) {
        this.isResults = true // etat affichage tbl resultat
        // this.endDraw() // veut pouvoir dessiner apres avoir soumis formulaire (si veut pas pouvoir dessiner apres avoir soumis form activer cette ligne)
        console.log("Formulaire soumis avec succès !");
      }
    },

    reset(event){
      // Rinitialise hauteur vol / poids du drone
      flightForm.resetForm();
      
      // Enelver interaction dessin map
      this.endDraw();

      // Enlever vector layer 
      this.endVectorLayer()
      
      // Enlever tableau resultat 
      this.endTableau()
      
      console.log("Formulaire réinitialiser !");
    },

    startDraw(event) {
      // Eviter que quand clique sur un bouton sa envoie le formulaire 
      // Comporetement par defaut du navigateur quand clique sur bouton dans un fomrulaire et d envoyer le formulaire
      // Solution : event.preventDefault() --> evite envoyer formulaire
      event.preventDefault();
      this.isDrawing = true;
      this.isVectorLayer = true; 

      console.log("Fonction pour dessiner activer");
    },

    endDraw(event) {
      this.isDrawing = false;
      console.log('Etat endDraw isDrawing' , this.isDrawing)
    },

    endVectorLayer(event){
      // Enlever tableau resultat 
      this.isVectorLayer = false
    },

    endTableau(event){
      this.isResults = false
    }

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