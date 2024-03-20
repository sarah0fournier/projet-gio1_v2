<!-- Vue : Gestion de la map, choix fond de carte et initialisation de la map -->

<!-- Question A : Comment définir des variables globale eg. url wms ? -->

<!-- Question B : Juste de faire let map, puis exporter cette variable et importer dans mouseCoord.js ? Comment faire cette relation avec map ? -->

<!-- TODO : Adapter a faire sous forme de liste les choix de fond carte -->

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
    </div>
</template>
  
<script>
    // import ol from 'ol'; // Importez OpenLayers ici --> fonctione pas !!!!!!!!!!!!
    import ViewCheckboxLayer from './ViewChecboxLayer.vue';
    import ViewFlightZone from './ViewFlightZone.vue';
    //--------------- VARIABLES -----------------  
    // URL de base pour les services WMS
    const wmsUrlGeoadmin = "https://wms.geo.admin.ch/";
    const wmsUrlGeodienst = "https://geodienste.ch/db/av_0/fra?";

    // URL de base pour les attributions
    const attributionUrlGeoadmin = "https://www.geo.admin.ch/fr/home.html";
    const attributionUrlGeodienst = "https://geodienste.ch/db/av_0/fra?";

    // Code pour la projections Suisse
    const projectionCode = "EPSG:2056";

// Classe pour definir les fonds de carte
// Question : Aurait voulu faire une classe pour fond de carte puis des sous classe ou je fait varie name, layerName, attribution. url, ...
// class BackgroundLayer {
//     constructor(params) {
//         this.layer = new ol.layer.Tile({
//         source: new ol.source.TileWMS(params.source),
//         opacity: params.opacity || 0.5
//         });
//     }
  
//     getLayer() {
//       return this.layer;
//     }
// }

// Classe pour definir les couches sur la map
class BackgroundLayerGeoAdmin {
    constructor(name, layerName, attribution) {
        this.name = name; // Name couche
        this.visible = false; // Par defaut, la couche pas visible
        this.layer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: wmsUrlGeoadmin,
                projection: projectionCode,
                params: { layers: layerName },
                attributions: [`&copy; <a href="${attributionUrlGeoadmin}">${attribution}</a>`]
            }),
            zIndex: -99,
            opacity:  0.5,

        });
    }

    getLayer() {
        return this.layer;
    }
}

// Classe pour definir les couches sur la map
class BackgroundLayerGeodienste {
    constructor(name, layerName, attribution) {
        this.name = name; // Name couche
        this.visible = false; // Par defaut, la couche pas visible
        this.layer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: wmsUrlGeodienst,
                projection: projectionCode,
                params: { layers: layerName, 'TILED': true },
                attributions: [`&copy; <a href="${attributionUrlGeodienst}">${attribution}</a>`]
            }),
            zIndex: -99,
            opacity:  0.5,

        });
    }

    getLayer() {
        return this.layer;
    }
}

   
export default {
    components: {
        ViewCheckboxLayer,
        ViewFlightZone,
    },
    props: {
        layers: Array,
        layerVisibility: Array,
    },
    watch: {
        // layerVisibility: {
        //     handler(newVal) {
        //         console.log(`ViewMaps.vue : layerVisibility changed to ${newVal}`)
        //         // Pour chaque couche et sa visibilité correspondante
        //         this.layers.forEach((layer, index) => {
        //             // Vérifiez si la couche est visible
        //             if (newVal[index]) {
        //                 // Ajoutez la couche à la carte
        //                 console.log(`ViewMaps.vue : adding layer`, layer)
        //                 layer.setVisible(true);
        //             } else {
        //                 // Sinon, retirez la couche de la carte
        //                 layer.setVisible(false);
        //             }
        //         });
        //     },
        //     deep: true,
        // },
    },
    data() {
      return {
        map: null,
        layersBackground: {
            CN : new BackgroundLayerGeoAdmin("CarteNationale", "ch.swisstopo.pixelkarte-farbe", "WMTS CarteNationale / geo.admin.ch"),
            swissSurface3D : new BackgroundLayerGeoAdmin("SwissSURFACE3D", "ch.swisstopo.swisssurface3d-reliefschattierung-multidirektional", "WMTS Relief multidir. issu de SwissSURFACE3D / geo.admin.ch"),
            MO : new BackgroundLayerGeodienste("MO", 'LCSF,LCSFPROJ,Conduites,SOLI,SOSF,SOPT,Adresses_des_batiments,Nomenclature,Biens_fonds,Biens_fonds_projetes,Limites_territoriales', "WMTS Relief multidir. issu de SwissSURFACE3D / geo.admin.ch"),
            swissImage : new BackgroundLayerGeoAdmin("swissImage", "ch.swisstopo.swissimage", "WMTS swissimage / geo.admin.ch"),
        },
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

                // this.map.addLayer(this.layersBackground[layer].getLayer());
            }
        },

        // Methode pour ajouter une couche à la carte
        // addLayer(layer) {
        //     this.map.addLayer(layer);

        // }
    },
    mounted() {
        // Appelez initMap lors du montage du composant
        this.initMap();

        // Ajouter les layers a la map
        // Pour chaque couche et sa visibilité correspondante
        this.layers.forEach((layer, index) => {
            // Vérifiez si la couche est visible
            this.map.addLayer(layer);
            layer.setVisible(this.layerVisibility[index]);
        });
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
</style>
  