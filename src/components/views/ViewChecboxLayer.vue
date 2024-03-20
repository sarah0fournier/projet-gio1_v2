<!-- Vue : Cree les checkbox des layer et gere si couches actives ou non sur la map -->

<!-- QUESTION B suite: Comment faire l'interaction avec la map ? Car map est definit dans ViewMaps.vue ? N arrive pas a relier pour que quand clique danc checkbox sa affiche le layer -->
<!-- Obtient error en essayer exportant map et en mettant dans ce code  : map.addLayer(this.layer); -->
<!-- MSG Erreur : Uncaught TypeError: _components_views_ViewMaps_vue__WEBPACK_IMPORTED_MODULE_0__.map is undefined -->

<template>
    <div>
      <h2>Layers</h2>
      <div v-for="(layer, index) in layers" :key="index">
        <input type="checkbox" @change="toggleLayer(layer)">
        <label>{{ layer.name }}</label>
      </div>
    </div>
</template>
  
<script>
import { map } from '@/components/views/ViewMaps.vue';

    //--------------- VARIABLES -----------------  
    // URL de base pour les services WMS
    const wmsUrlGeoadmin = "https://wms.geo.admin.ch/";
    // URL de base pour les attributions
    const attributionUrlGeoadmin = "https://www.geo.admin.ch/fr/home.html";
    // Code pour la projections Suisse
    const projectionCode = "EPSG:2056";


    // Classe pour definir les couches sur la map
    class GeoAdminLayer {
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
                opacity: 1,
                zIndex: -98,
            });

            // Ajouter la couche à la carte
            map.addLayer(this.layer);
        }

        getLayer() {
            return this.layer;
        }
    }

    export default {
        // TODO make those layers props
        data() {
            return {
                layers: [
                    new GeoAdminLayer("Restriction pour drone CH","ch.bazl.einschraenkungen-drohnen", "Zones géographiques UAS en Suisse / OFAC"),
                    new GeoAdminLayer("Obstacle a la navigation aerienne","ch.bazl.luftfahrthindernis", "Obstacles à la navigation aérienne / OFAC")
                    // Ajoutez d'autres couches si necessaire
                ]
            };
        },
        methods: {
            toggleLayer(layer) {
                // Changer la visibilite de la couche
                console.log("Toggling layer", layer);
                layer.getLayer().setVisible(layer.visible);
                console.log("Layer visibility:", layer.visible);
            } 
        }
    };
</script>
  