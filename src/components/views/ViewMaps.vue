<!-- Vue : Gestion de la map, choix fond de carte et initialisation de la map -->

<template>
    <div>
        <div id="map" :class="{'map-container': isResults, 'full-height-map': !isResults}">
        </div>

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

        <!-- Popup -->
        <div>
            <Popup :coordinates="popupCoordinates" :popupVisible="popupVisible" :resultsPopup="resultsPopup" @close-popup="closePopup" />
            <ViewButton buttonText="POPUP" buttonId="popupBtn" @bouton-click="togglePopup" class="PositionPopup"/>
        </div>

        <!-- Ajout du composant tableau de resutlats pour afficher les résultats des zones de vol restreintes -->
        <ViewTableauResults :isResults="isResults" :resultsDatasPerimetre="resultsDatasPerimetre"/>
        
    </div>
</template>
  
<script>
    // import ol from 'ol'; // Importez OpenLayers ici --> fonctione pas !!!!!!!!!!!!

    // Import des fichier js
    import {BackgroundLayerGeoAdmin, BackgroundLayerGeodienste } from '../../assets/js/addLayer.js'
    import {BuildUrlApiGeoadmin, fetchDataFromURL, displayZoneRestrictionData } from '../../assets/js/draw.js'
    import initMouseCoord from '../../assets/js/mouseCoord.js'

    // Import des composant vue
    import ViewCheckboxLayer from './ViewChecboxLayer.vue'
    import ViewTableauResults from './ViewTableauResults.vue' 
    import Popup from './ViewPopup.vue'
    import ViewButton from './ViewButton.vue'


    export default {
        /**
         * Composant pour la gestion de la carte, le choix du fond de carte et l'initialisation de la carte.
         * @component
         * @prop {Array} layers - Les couches de la carte.
         * @prop {Array} layerVisibility - La visibilité des couches.
         * @prop {boolean} isDrawing - Indique si le dessin est en cours ou non.
         * @prop {boolean} isResults - Indique si les résultats sont affichés ou non.
         * @prop {boolean} isVectorLayer - Indique si la couche vectorielle est activée ou non.
         * @prop {String} selectedCoordinates - contient les coordonnée de la recherche 
         * @method changeBackground - Méthode pour changer le fond de carte.
         * @method startDrawingOnMap - Méthode pour commencer le dessin sur la carte.
         * @method togglePopup - Méthode pour afficher ou masquer la popup.
         * @method closeDraw - Méthode pour fermer le dessin.
         * @method setCoord - Méthode pour définir les coordonnées.
         * @method showPopup - Méthode pour afficher la popup.
         * @method closePopup - Méthode pour fermer la popup.
        */

        components: {
            ViewCheckboxLayer,
            Popup,
            ViewButton,
            ViewTableauResults,
        },
        props:{
            layers: Array,
            layerVisibility: Array,
            isDrawing: Boolean, 
            isResults: Boolean,
            isVectorLayer: Boolean, 
            selectedCoordinates: String,
        },  

        watch: {
            layerVisibility: {
                handler(newVal) {
                    // console.log(`ViewMaps.vue : layerVisibility changed to ${newVal}`)
                    // Pour chaque couche et sa visibilite correspondante

                    this.layers.forEach((layer, index) => {

                        // Verifiez si la couche est visible
                        if (newVal[index]) {
                            // Ajoutez la couche à la carte
                            // console.log(`ViewMaps.vue : adding layer`, layer)
                            layer.setVisible(true)
                        } 
                        else {
                        // Sinon, retirez la couche de la carte
                            layer.setVisible(false)
                        }
                    })
                },
                deep: true,
            },
        
            isDrawing: {
                handler(newValue) {
                    if (newValue) {

                        // Desactiver la gestion des popups et de ses evenements quand on dessine la zone de vol
                        this.isPopup = false 
                        this.closePopup()
                        this.map.un('click', this.showPopup);

                        // Ajouter interaction pour dessiner zone de vol
                        this.startDrawingOnMap();
                    }
                    else {
                        // Eneleve interaction map si isDrawing est false
                        this.map.removeInteraction(this.draw)
                    }
                },
                deep: true 
            },

            isVectorLayer: {
                handler(newValue) {
                    if (!newValue) {
                        // Supprimer le layer de la zone de vol 
                        this.vectorLayer.getSource().clear();
                        // console.log('La couche du permietre de vol est supprimer.')
                    }
                },
                deep: true 
            },

            selectedCoordinates: {
                handler(newValue) {
                    if (newValue) {
                        // Appeler la fonction pour centrer la carte sur les nouvelles coordonnées
                        this.centerMapOnCoordinates();
                    }
                },
                deep: true // Pour déclencher la fonction dès le montage du composant si selectedCoordinates est initialement défini
            },

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

            draw: null, // obj interaction draw polygon  
            vectorLayer: null,
            coordinate: null,

            // Gestion POPUP
            isPopup: false, // bouton popup activer pour cliquer
            popupCoordinates: [],
            popupVisible: false, // affichage popup sur la map 
            resultsPopup:[], // Data du lieu du clique --> regroupe layerS

            // Gestion resultats tableau
            resultsDatasPerimetre: [],

        }},

        methods: {
            
            initMap() {
                /**
                 * Initialise la carte.
                */

                // --------------- PROJETION -----------------  
                // Projection suisse
                const projection = new ol.proj.Projection({
                code: "EPSG:2056",
                units: "m"
                })
    
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
                })
            },

            //--------------- CHANGEMENT LAYER-----------------  
            changeBackground(layer) {
                /**
                 * Change le fond de carte (gere la visibiliter des couches).
                 * @param {string} layer - Le nom de la couche à changer.
                */
                Object.values(this.layersBackground).forEach(layer => {
                this.map.removeLayer(layer.getLayer())
                })
        
                if (this.layersBackground[layer]) {
                    const layerToAdd = this.layersBackground[layer].getLayer();
                    this.map.addLayer(layerToAdd)
                }
            },

            //--------------- DRAW----------------- 
            createVectorLayer() {
                /**
                 * Crée une nouvelle couche vectorielle.
                */
                
                this.vectorLayer = new ol.layer.Vector({
                    source: new ol.source.Vector()
                });
                this.map.addLayer(this.vectorLayer);
            },

            createDrawInteraction(vectorLayer) {
                /**
                 * Crée une nouvelle interaction de dessin.
                 * @method
                 * @param {ol.layer.Vector} vectorLayer - La couche vectorielle pour l'interaction de dessin.
                */

                var draw = new ol.interaction.Draw({
                    source: vectorLayer.getSource(),
                    type: 'Polygon'
                });
                this.draw = draw;
            },

            initLayerDraw(){
                /**
                 * Initialise la couche vectorielle et l'interaction de dessin.
                */

                this.createVectorLayer()
                this.createDrawInteraction(this.vectorLayer)
            },
    
            startDrawingOnMap() {
                /**
                 * Commence le dessin sur la carte.
                */
                // console.log('Fonction startDrawingOnMap est lancer')
                if (this.draw) {
                    // console.log('Commencer a dessiner')

                    // Événement de fin de dessin pour récupérer les coordonnées du polygone
                    this.draw.on("drawend", (event) => {
                        
                        // Supprimer d'abord les entités de la couche vectorielle existante
                        this.vectorLayer.getSource().clear();

                        // Traitement des coordonnées ici
                        var feature = event.feature;
                        var geometry = feature.getGeometry();
                        var coordinates = geometry.getCoordinates();
                        // console.log('Coordonnées du polygone dessiné :', coordinates);

                        // Vider la liste de resultsDatasPerimetre --> rinitialise a chaque clique
                        this.resultsDatasPerimetre = []

                        // Parcourir chaques layers pour faire intersection couche entre zone de vol et la couche
                        this.layers.forEach((layer, index) => {
                            // Dans ce cas, ajouter contrainte de faire que sur la couche ch.bazl.einschraenkungen-drohnen, car manque de temps pour faire tableau qui affiche resultat differents layers et la gestion resultat requete d autre couche
                            let name_layer = layer.getSource().getParams().layers

                            if (name_layer  == 'ch.bazl.einschraenkungen-drohnen'){

                                // Envoie requete url pour chaque layer (peut importe si activer ou non)
                                // let name_layer = layer.getSource().getParams().layers
                                let url = BuildUrlApiGeoadmin(name_layer, coordinates)

                                // Appeler la fonction pour récupérer les données à partir de l'URL
                                fetchDataFromURL(url)                
                                    .then(resultDataPerimetre => {
                                        // console.log('Ajouter les resultats de la requete url de la couche : ', name_layer)
                                        this.resultsDatasPerimetre.push({ name_layer: name_layer, 
                                                                        name : layer.getSource().getParams().name, 
                                                                        data: resultDataPerimetre });
                                    })
                                    .catch(error => {
                                        console.error('Erreur lors de la récupération des données :', error);
                                    }
                                )
                            }
                        })

                    })

                    this.map.addInteraction(this.draw);
                } 
            },

            // ----------- Popup 
            togglePopup() {
                /**
                 * Affiche ou masque la popup.
                */

                // Inversez l'état de la popup
                this.isPopup =!  this.isPopup

                if (this.isPopup) {
                    
                    // Modifier parent isDrawing
                    this.closeDraw()
                    
                    // Ajouter un gestionnaire d'événement au clic de la carte
                    this.map.on('click', this.showPopup)

                } else {
                    // Retirer le gestionnaire d'événement au clic de la carte
                    this.map.un('click', this.showPopup)
                }
            },

            closeDraw(){
                /**
                 * Ferme le dessin.
                */
                this.$emit('close-draw')
            }, 

            setCoord(coordinate){
                /**
                 * Définit les coordonnées.
                 * @param {Array} coordinate - Les coordonnées à définir.
                */
                
                // Calculer les coordonnees des coins du rectangle
                // 2.5 choix fixer par nous (precision du clic)
                var topLeft = [coordinate[0] - 2.5, coordinate[1] + 2.5]
                var topRight = [coordinate[0] + 2.5, coordinate[1] + 2.5]
                var bottomRight = [coordinate[0] + 2.5, coordinate[1] - 2.5]
                var bottomLeft = [coordinate[0] - 2.5, coordinate[1] - 2.5]

                // Formater les coordonnées pour la requête
                var rectangleCoordinates = [
                    [topLeft, topRight, bottomRight, bottomLeft, topLeft] // Premier anneau du polygone
                ];

                // console.log('Coordonnées du rectangle :', rectangleCoordinates);
                            
                // Vider la liste de resultsPopup --> rinitialise a chaque clique
                this.resultsPopup = []
                // Parcourir chaques layers pour afficher les popups
                this.layers.forEach((layer, index) => {

                    // Envoie requete url du layer, si layer est activer
                    if(layer.getVisible()){
                        var name_layer = layer.getSource().getParams().layers
                        var url = BuildUrlApiGeoadmin(name_layer, rectangleCoordinates);

                        // Appeler la fonction pour récupérer les données à partir de l'URL
                        // Pbl : Gere que le cas de restriction drone car a formater reponse pour ch.bazl.einschraenkungen-drohnen
                        fetchDataFromURL(url)                
                            .then(resultPopup => {
                                // console.log('Ajouter les resultats de la requete url de la couche : ', name_layer)
                                this.resultsPopup.push({ name_layer: name_layer, 
                                                        name : layer.getSource().getParams().name, 
                                                        data: resultPopup });
                            })
                            .catch(error => {
                                console.error('Erreur lors de la récupération des données :', error);
                            }
                        )
                    }
                })
            }, 

            showPopup(event) {
                /**
                 * Affiche la popup.
                 * @param {Event} event - L'événement de clic.
                */

                // Récupérer les coordonnées du clic
                this.popupCoordinates = event.coordinate

                this.setCoord(this.popupCoordinates)

                // Etat popup devient visible car a qqch a mettre dans popup
                this.popupVisible = true 

                // console.log(`Coordonnées du clic : Est = ${this.popupCoordinates[1]}, Nord = ${this.popupCoordinates[0]}`);
            },


            closePopup() {
                /**
                 * Ferme la popup.- Quand on appuie sur croix popup, elle se ferme (popup ne s affiche pas)
                */

                this.popupVisible = false
            },

            parseCoordinatesFromString(coordinatesString) {
                // Remplacer la virgule par un espace
                const cleanedString = coordinatesString.replace(/,/g, ' ');

                // Supprime les parties non numériques et divise la chaîne en un tableau de valeurs
                const coordinatesArray = cleanedString.replace(/[BOX()]/g, '').split(' ');
                // Convertis les valeurs en nombres flottants et retourne-les sous forme de tableau
                return coordinatesArray.map(coord => parseFloat(coord));
            },


            centerMapOnCoordinates() {
                // Parse les coordonnées de la chaîne
                const coordinates = this.parseCoordinatesFromString(this.selectedCoordinates);

                // Calcule les coordonnées du centre de la boîte englobante
                const centerCoordinates = [
                    (coordinates[0] + coordinates[2]) / 2, // Moyenne 
                    (coordinates[1] + coordinates[3]) / 2  // Moyenne 
                ];

                // Centre la carte sur les coordonnées calculées et zoom a un niveau par defaut
                if (this.map && centerCoordinates) {
                    this.map.getView().animate({ center: centerCoordinates, duration: 1000, zoom: 15 });
                }
            },

        },



        mounted() {
            // Fonction appeler lors du montage du composant

            // Initialiser la map
            this.initMap()

            // Ajouter les layers a la map pour chaque couche et sa visibilité correspondante
            this.layers.forEach((layer, index) => {
                // Recupere la visibilite de la couche
                this.map.addLayer(layer);
                layer.setVisible(this.layerVisibility[index])
            })



            // Intialiser les couches pour stockage de la zone de vol
            this.initLayerDraw()

            // Intialiser interaction des coordonnee avec la souris
            initMouseCoord(this.map)
        },
    }

</script>
  
<style scoped>
    /* ------   AFFICAHGE MAP   -------- */
    /* Hauteur de la carte lorsqu'isResults est vrai */
    .map-container {
        height: 50vh; 
    }

    /* Hauteur de la carte lorsque isResults est faux */
    .full-height-map {
        height: 100vh; 
    } 

    /* ------   AFFICAHGE ICONE   -------- */
    .PositionLayerChange {
        position: absolute;
        top: 5vh;
        right: 1vw;
        width: 90px;
    }

    .PositionPopup {
        position: absolute;
        top: 15vh;
        right: 2vw;
        width: 90px;
    }


    /* ----- Bouton changement layer */
    /* #changeMapSelection {
        position: absolute;
        right: 20px;
        top: 50px;
    } */

    /* #changeMapButton {
        border-style: solid;
        border-width: 1px;
        border-color: black;
        padding: 5px;
        height: 50px;
        width: 50px;
    }

    #imgchangeMap {
        width: 40px;
        height: 40px;
    } */

    /* ----- End : Bouton changement layer */
</style>
