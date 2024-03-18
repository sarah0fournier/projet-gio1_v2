<template>
  
  <div class="container-fluid" id="mainContainer">

    <div class="row align-items-start">

        <!-- Left: menu and drop-down menu -->
        <div class="col-3 border overflow-y-auto" id="menu">
            
            <!-- Logo -->
            <div class="w3-center">
                <h1>Carte de la Suisse</h1>
                <!-- Possible de mettre un logo a la place -->
                <!-- <img src="img/logoAvecTitre2.png" class="imgLogo w3-center" alt="Logo de ??"> -->
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
                    <button class="w3-button" id="startDrawingButton" onclick="startDrawingOnClickFormular(event, draw)">
                        <!-- <img id="imgDraw" src="./img/pentagon-svgrepo-com.png" alt="Drawing a polygon"> -->
                    </button><br><br>

                    <!-- Possible ajouter autre elements -->

                    <!-- Boutons -->
                    <!-- <input type="submit" value="Soumettre"> -->
                    <button type="button" onclick="validateForm()">Soumettre</button>
                    <button type="button" onclick="resetForm()">Réinitialiser</button>
                </form>
            </div>
            <!-- End Formulaire -->
            
            <div class="mt-2 greyBackground border border-dark p-1"> 
                <!-- Liste déroulante de fond de carte -->
                <select id="selectBackground">
                    <option value="nationalMapCH">Carte nationale</option>
                    <option value="swissImage">SwissImage</option>
                    <option value="swissSurface3D">SwissSURFACE3D</option>
                    <option value="MO_nb">MO noir et blanc</option>
                    <option value="none">Aucun</option>
                </select>

                <div style="align-items: center;">
                    <!-- Couches à cocher -->
                    <input type="checkbox" id="restrictionsCheckbox" checked>
                    <label for="restrictionsCheckbox">Restrictions pour drônes CH</label><br>

                    <input type="checkbox" id="obstaclesCheckbox" checked>
                    <label for="obstaclesCheckbox">Obstacles à la navigation aérienne</label>
                </div>   
                <!-- End Conteneur layers -->
            </div>
        <!-- End Conteneur menu -->
        </div>

        <!-- Right: Contenur map -->
        <div class="col">
            <div id="map">
                <div id="popup" class="ol-popup"></div>
            </div>
        </div>
        <!-- End Contenur map -->

    </div>

    <!-- Adapter code ci dessous pour faire un icone pour changement Layer -->
    <div class="w3-dropdown-hover w3-right" id="changeMapSelection">
        <button class="w3-button" id="changeMapSButton">
            <!-- <img src="./img/map_fond_carte.svg" alt="layers" class="imgLchangeMap" width="50" /> -->
        </button>
        </div>
    </div>

    <!-- Code original lors de la recuperation du fichier de github -->
    <!-- <img id="vue-icon" src="./assets/logo.png" alt="Logo" />
    <div class="tabs is-centered">
      <ul>
        <li
          v-for="menu in menuList"
          :key="menu.name"
          :class="{ 'is-active': currentRoute === menu.route }"
        >
          <router-link :to="menu.route"> {{ menu.menuname }} </router-link>
        </li>
      </ul>
    </div> -->

<!-- Script personnel -->
<!-- <script src="./assets/js/layer.js"></script> -->
<!-- <script src="./assets/js/mouseCoord.js"></script> -->
<!-- <script src="./assets/js/flightZone.js"></script> -->
<!-- <script src="./assets/js/flightForm.js"></script> -->
<!-- <script src="./js/searchLocation.js"></script>-->
<!-- <script src="./assets/js/infoClick.js"></script> -->

  <router-view />
</template>

<script>


// import ViewLayer from './components/views/ViewLayer.vue';
import initLayer  from './assets/js/layer.js';
import initMouseCoord from './assets/js/mouseCoord.js';

export default {
  name: 'App-root',
  data(){
    return {
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
    }
  },
  computed: {
    currentRoute(){
      return this.$route.path;
    }
  },
  mounted() {
    initLayer();
    initMouseCoord();
  }
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