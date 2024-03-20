<!-- Vue : Cree les checkbox des layer et gere si couches actives ou non sur la map -->

<!-- QUESTION B suite: Comment faire l'interaction avec la map ? Car map est definit dans ViewMaps.vue ? N arrive pas a relier pour que quand clique danc checkbox sa affiche le layer -->
<!-- Obtient error en essayer exportant map et en mettant dans ce code  : map.addLayer(this.layer); -->
<!-- MSG Erreur : Uncaught TypeError: _components_views_ViewMaps_vue__WEBPACK_IMPORTED_MODULE_0__.map is undefined -->


<!-- Etat de la checkbox en fct du layerVisibility, comment ? Si je intialise tous a false ok de pas gerer le cas -->
<template>
    <div>
      <h2>Layers</h2>
      <div v-for="(layer, index) in layers" :key="index">
        <input type="checkbox" @change="toggleLayer(index)">
        <label>{{ layer.name }}</label>
        <label>{{ index }}</label>
        
      </div>
    </div>
</template>
  
<script>
    // import { map } from '@/components/views/ViewMaps.vue';
    import { wmsUrlGeoadmin, attributionUrlGeoadmin, projectionCode } from '../../assets/js/constante.js';


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
        }

        getLayer() {
            return this.layer;
        }
    }

    export function createLayerGeoAdmin(name, layerName, attribution, wmsurl, attributionUrl ) {
        return new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: wmsurl,
                projection: projectionCode,
                params: { layers: layerName },
                attributions: [`&copy; <a href="${attributionUrl}">${attribution}</a>`]
            }),
            zIndex: -99,
            opacity: 0.5,
        });
    }

    export { GeoAdminLayer };

    export default {
        // TODO make those layers props
        // data() {
        //     return {
        //         layers: [
        //             new GeoAdminLayer("Restriction pour drone CH","ch.bazl.einschraenkungen-drohnen", "Zones géographiques UAS en Suisse / OFAC"),
        //             new GeoAdminLayer("Obstacle a la navigation aerienne","ch.bazl.luftfahrthindernis", "Obstacles à la navigation aérienne / OFAC")
        //             // Ajoutez d'autres couches si necessaire
        //         ]
        //     };
        // },
        props : ['layers', 'layerVisibility'],

        methods: {
            // toggleLayer(index) {
            //     // Changer la visibilite de la couche
            //     console.log("Toggling layer", layer);
            //     // layer[index].setVisible(this.layerVisibility[index])

            //     layer.visible = !layer.visible; // Inversez la visibilité de la couche
            //     this.$emit('layer-visibility-changed', layer);
            //     console.log("Layer visibility:", layer.visible);
            // } ,

            toggleLayer(index) {
                // Changer la visibilite de la couche
                console.log("Toggling layer", this.layers[index]);
                // this.layerVisibility[index] = !this.layers[index].visible

                this.layers[index].visible = !this.layers[index].visible; // Inversez la visibilité de la couche
                this.layers[index].setVisible(this.layers[index].visible)

                this.$emit('layer-visibility-changed', this.layers[index]); // Sert a quoi ? Si j enelve code fonctionne comme meme ?
                console.log("Layer visibility:", this.layers[index].visible);
            } ,
        }
    };

</script>
  