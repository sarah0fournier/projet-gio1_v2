
<template>
    <!-- <button @click="startDrawingOnMap('polygon')">Commencer le dessin</button> -->
    <ViewButton buttonImage="/img/pentagon-svgrepo-com.png" buttonId="drawBtn" @start-drawing="startDrawingOnMap('polygon')"/>
</template>

<!-- TODO : Function dessiner zone vol fonctionne pas !!!!!!!!!!¨¨ -->
<!-- PBL : Quand clique sur le bouton dessin du polygone sa me console.log bien la fct dans ViewButonn mais pas celle de startDrawingOnMap -->


<script>
    import { map } from '@/components/views/ViewMaps.vue';
    import ViewCheckboxLayer from './ViewButton.vue';
    // import * as flightZone from '../../assets/js/flightZone.js';
    import ViewButton from './ViewButton.vue';
    import ViewMaps from './ViewMaps.vue';


    //--------------- Interaction dessin zone de vol  ----------------- 
    // var drawInteraction; // Variable globale pour stocker l'interaction de dessin

    // Créez une couche vectorielle pour stocker les traits dessinés
    // let vectorLayer = createVectorLayer();

    // Interaction pour dessiner un polygone
    // let draw = createDrawInteraction(vectorLayer);
    // export {drawInteraction, vectorLayer, draw};


    export default {
        components:{
            ViewMaps,
        },

        data(){
            return  {
                vectorLayer:null,
                draw:null,
            }
        },
        mounted(){
            this.initFlightZone()
        },
        methods: {
        startDrawingOnMap(type) {
            // Logique pour démarrer le dessin dans la zone de dessin
            console.log("Démarrage du dessin dans la zone de dessin...");
              // Activer le contrôle de dessin pour le polygone
            // Par exemple, en utilisant Leaflet Draw, vous pouvez faire quelque chose comme ceci :
            if (type === 'polygon') {
                this.drawControl.setDrawingOptions({ polygon: {} });
                this.map.addControl(this.drawControl);
            }
        },
        initFlightZone() {
            this.createVectorLayer();
            this.createDrawInteraction(this.vectorLayer); // Ajoutez cette ligne

                       // Attacher l'écouteur d'événements une fois que le bouton est rendu
                       this.$nextTick(() => {
                this.startDrawingOnClick();
            });

            // Événement de fin de dessin pour récupérer les coordonnées du polygone
            this.draw.on('drawend', function(event) {
                var feature = event.feature;
                var geometry = feature.getGeometry();
                var coordinates = geometry.getCoordinates();
                console.log('Coordonnées du polygone dessiné :', coordinates);

                var url = this.BuildUrlApiGeoadmin("ch.bazl.einschraenkungen-drohnen", coordinates);
                this.fetchDataFromURL(url);

                // Désactiver l'interaction de dessin une fois que le polygone a été dessiné
                map.removeInteraction(drawInteraction);
            });
        },

        createVectorLayer() {
            var vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector()
            });
            map.addLayer(vectorLayer);
            this.vectorLayer = vectorLayer;
        },

        createDrawInteraction(vectorLayer) {
            var draw = new ol.interaction.Draw({
                source: vectorLayer.getSource(),
                type: 'Polygon'
            });
            this.draw = draw;
        },
            // Fonction pour construire l'URL de requête vers le serveur API map geo admin
        BuildUrlApiGeoadmin(layer, polygonCoordinates) {
            var url = "https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryPolygon&geometry=" + encodeURIComponent(JSON.stringify({ "rings": polygonCoordinates })) + "&layers=all:" + encodeURIComponent(layer) + "&geometryFormat=geojson&sr=2056&tolerance=0";
            //console.log("URL de la requête:", url);
            return url;
        },

        // Fonction pour envoyer la requête de l'URL et recevoir les données
        fetchDataFromURL(url) {
            // Effectuez la requête HTTP
            fetch(url)
                .then(response => {
                    if (response.ok) {
                        return response.json(); // Si la réponse est OK, retournez les données JSON
                    } else {
                        throw new Error('Erreur lors de la requête');
                    }
                })
                .then(data => {
                    // Appel de la fonction pour afficher les données des zones de vol restreintes
                    displayZoneRestrictionData(data.results);
                    //console.log(data);
                })
                .catch(error => {
                    console.error('Erreur :', error);
                });
        },

        displayZoneRestrictionData(results) {
            // Variable pour stocker les données des zones de vol restreintes
            var zonesData = [];

            // Parcours du tableau "results"
            results.forEach(function(result) {
                // Création d'un objet contenant les attributs spécifiés
                var zoneData = {
                    zone_name_fr: result.properties.zone_name_fr,
                    zone_restriction_fr: result.properties.zone_restriction_fr,
                    zone_message_fr: result.properties.zone_message_fr,
                    auth_url_fr: result.properties.auth_url_fr,
                    auth_name_fr: result.properties.auth_name_fr,
                    auth_contact: result.properties.auth_contact,
                    auth_service_fr: result.properties.auth_service_fr,
                    auth_email: result.properties.auth_email,
                    auth_phone: result.properties.auth_phone
                };

                // Ajout de l'objet au tableau
                zonesData.push(zoneData);
            });

            // Affichage du tableau dans la console ou autre traitement que vous souhaitez faire avec les données
            console.log(zonesData);
            // Faudra les afficher qqpart d'autre 
        },
  

    },
}

export function startDrawingOnClick(event) {
    var startDrawingButton = document.getElementById('drawBtn');
    startDrawingButton.addEventListener('click', function() {
        // Supprimer d'abord les entités de la couche vectorielle existante
        this.vectorLayer.getSource().clear();

        // Supprimer l'interaction de dessin existante si elle existe
        if (this.draw) {
            map.removeInteraction(this.draw);
        }
        
        // Activer l'interaction de dessin lorsque l'utilisateur clique sur le bouton
        // drawInteraction = draw;
        map.addInteraction(drawInteraction);
    });
}

</script>
  