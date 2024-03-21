<!-- Vue : Gestion de la map, choix fond de carte et initialisation de la map -->

<!-- TODO : SwissImage fonctionne pas ? Adapter Background sur principe de layer-->
<!-- TODO : Deplacer function / classe pour creer layer dans fichier js-->

<template>
    <div>
      <div id="map"></div>
      <div class="PositionLayerChange w3-dropdown-hover w3-right">
        <button class="w3-button">
          <img src="/img/map_fond_carte.svg" alt="layers" class="imgLayers" width="50" />
        </button>
        
        <div class="w3-dropdown-content w3-bar-block w3-border" style="right:0">
          <a @click="changeBackground('CN')" class="w3-bar-item w3-button">CN</a>
          <a @click="changeBackground('swissSurface3D')" class="w3-bar-item w3-button">swissSurface3D</a>
          <a @click="changeBackground('MO')" class="w3-bar-item w3-button">MO</a>
          <a @click="changeBackground('swissimage')" class="w3-bar-item w3-button">swissImage</a>
          <a @click="changeBackground('nothing')" class="w3-bar-item w3-button">-</a>
        </div>
    </div>

    <!-- Ajout du composant FutureResults.vue pour afficher les résultats des zones de vol restreintes -->
    <FutureResults :zonesData="zonesData" />
  </div>
</template>
  
<script>
    // import ol from 'ol'; // Importez OpenLayers ici --> fonctione pas !!!!!!!!!!!!
    import ViewCheckboxLayer from './ViewChecboxLayer.vue';

    import {BackgroundLayerGeoAdmin, BackgroundLayerGeodienste } from '../../assets/js/addLayer.js';
    import {BuildUrlApiGeoadmin, fetchDataFromURL, displayZoneRestrictionData } from '../../assets/js/draw.js';
    import initMouseCoord from '../../assets/js/mouseCoord.js'; // File a laisser

    import FutureResults from './FutureResults.vue'; // Import du composant FutureResults.vue
   
export default {
    components: {
        ViewCheckboxLayer,
        FutureResults,
    },
    props:{
        layers: Array,
        layerVisibility: Array,
        // layersBackground: Array,
        // layerBackgroundVisibility : Array, 
        isDrawing: Boolean, 
        intialiserFormulaire: Boolean,
    },  

    watch: {
        layerVisibility: {
            handler(newVal) {
                console.log(`ViewMaps.vue : layerVisibility changed to ${newVal}`)
                // Pour chaque couche et sa visibilité correspondante
                this.layers.forEach((layer, index) => {
                    // Vérifiez si la couche est visible
                    if (newVal[index]) {
                        // Ajoutez la couche à la carte
                        console.log(`ViewMaps.vue : adding layer`, layer)
                        layer.setVisible(true);
                    } else {
                        // Sinon, retirez la couche de la carte
                        layer.setVisible(false);
                    }
                });
            },
            deep: true,
        },
        // Si met pas ce truc de watch il met que layersBackground est indefini. Props ont pas eu le temps d etre tous charge avant que layersBackground soit utiliser.
        // layersBackground: {
        //     immediate: true,
        //     handler(newVal) {
        //         if (newVal && newVal.length > 0 && !this.map) {
        //             // Initialisez la carte avec la première couche
        //             this.initMap(newVal[0]);
        //         };
        //     },
        //     deep: true,
        // },
        
        isDrawing: {
            handler(newValue) {
            if (newValue) {
                this.startDrawingOnMap();
                }
            },
                immediate: true // Pour déclencher la fonction dès le montage du composant si isDrawing est initialement true
        },

        intialiserFormulaire: {
            handler(newValue) {
            if (newValue) {
                this.viderFormulaireLayer();
                }
            },
                immediate: true 
        },

    },     
    data() {
      return {
        map: null,
        zonesData: [],

        layersBackground: {
            CN : new BackgroundLayerGeoAdmin("CarteNationale", "ch.swisstopo.pixelkarte-farbe", "WMTS CarteNationale / geo.admin.ch"),
            swissSurface3D : new BackgroundLayerGeoAdmin("SwissSURFACE3D", "ch.swisstopo.swisssurface3d-reliefschattierung-multidirektional", "WMTS Relief multidir. issu de SwissSURFACE3D / geo.admin.ch"),
            MO : new BackgroundLayerGeodienste("MO", 'LCSF,LCSFPROJ,Conduites,SOLI,SOSF,SOPT,Adresses_des_batiments,Nomenclature,Biens_fonds,Biens_fonds_projetes,Limites_territoriales', "WMTS Relief multidir. issu de SwissSURFACE3D / geo.admin.ch"),
            swissImage : new BackgroundLayerGeoAdmin("swissImage", "ch.swisstopo.swissimage", "WMTS swissimage / geo.admin.ch"),
        },
        draw: null,
        drawInteraction: null, 
        coordinate: null,
      };
    },    
    methods: {
        initMap() {
            // --------------- PROJETION -----------------  
            // Projection suisse
            const projection = new ol.proj.Projection({
            code: "EPSG:2056",
            units: "m"
            });
    
            //--------------- INITIALISATION CARTE -----------------  
           this.map = new ol.Map({
                target: "map",
                layers: [this.layersBackground.CN.getLayer()],
                // layers: [layer],
                

                //--------------- VUE-----------------  
                // Définition de la vue de la carte
                view: new ol.View({
                    center: [2660000, 1190000],
                    projection: projection,
                    zoom: 8,
                    extent: [232e4, 93e4, 30e5, 145e4]
            })
            });

        },
        //--------------- CHANGEMENT LAYER-----------------  
        // Fonction générique pour gérer le changement de visibilité des couches
        changeBackground(layer) {
            Object.values(this.layersBackground).forEach(layer => {
            this.map.removeLayer(layer.getLayer());
            });
    
            if (this.layersBackground[layer]) {
                const layerToAdd = this.layersBackground[layer].getLayer();
                this.map.addLayer(layerToAdd);
            }
        },

        //--------------- DRAW----------------- 
        // TODO : Ajouter fct dans un File.js separer fonction pour envoyer requete (POSTRequest, GetRequest,...) 
        createVectorLayer() {
            var vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector()
            });
            this.map.addLayer(vectorLayer);
            this.vectorLayer = vectorLayer;
        },

        createDrawInteraction(vectorLayer) {
            var draw = new ol.interaction.Draw({
                source: vectorLayer.getSource(),
                type: 'Polygon'
            });
            this.draw = draw;
        },

        initLayerDraw(){
            this.createVectorLayer();
            this.createDrawInteraction(this.vectorLayer); // Ajoutez cette ligne

            //  ????? Attacher l'écouteur d'événements une fois que le bouton est rendu  ?????
            // this.$nextTick(() => {
            //     this.startDrawingOnClick();
            // });
        },
    
        startDrawingOnMap() {
            console.log('Fonction startDrawingOnMap est lancer')
            if (this.draw) {
                console.log('Commencer a dessiner')
 
                // Événement de fin de dessin pour récupérer les coordonnées du polygone
                this.draw.on("drawend", (event) => {
                    
                    // Supprimer d'abord les entités de la couche vectorielle existante
                    this.vectorLayer.getSource().clear();

                    // Traitement des coordonnées ici
                    var feature = event.feature;
                    var geometry = feature.getGeometry();
                    var coordinates = geometry.getCoordinates();
                    console.log('Coordonnées du polygone dessiné :', coordinates);
                    
                    var url = BuildUrlApiGeoadmin("ch.bazl.einschraenkungen-drohnen", coordinates);
                    fetchDataFromURL(url)
                .then(zonesData => {
                    // Assurez-vous que les données sont correctement assignées à la propriété zonesData
                    this.zonesData = zonesData;
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des données :', error);
                });

            // Désactiver l'interaction de dessin une fois que le polygone a été dessiné
            this.map.removeInteraction(this.draw);

        });
        this.map.addInteraction(this.draw);
    }             
},



    },

    mounted() {
        // Appelez initMap lors du montage du composant
        this.initMap();

        // Ajouter les layers a la map
        // Pour chaque couche et sa visibilité correspondante
        this.layers.forEach((layer, index) => {
            // Recupere la visibilite de la couche
            this.map.addLayer(layer);
            layer.setVisible(this.layerVisibility[index])
        });

        this.initLayerDraw();

        initMouseCoord(this.map);
    },

 
  };

</script>
  
<style scoped>
/* Vos styles CSS ici */

    /* ------   AFFICAHGE COUCHEE   -------- */
    .PositionLayerChange {
        position: absolute;
        top: 1vh;
        right: 1vw;
        width: 90px;
    }
     /* Ajoutez une bordure noire au composant "future-results" */
     .future-results {
        border: 2px solid black;
        padding: 10px;
        margin-top: 20px; /* Pour ajouter un espace entre la carte et le composant des résultats */
    }
</style>
