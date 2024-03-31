<!-- Vue : Gestion du contenu de la popup -->

<template>
    <div v-if="popupVisible" class="popup">

        <div v-if="resultsPopup.length > 0">

            <div class="header-content">
                <h1 class="popup-title">Information objet</h1>
                <button @click="closePopup" class="close-button">X</button>
            </div>

            <!-- Parcourir les layer qui ont ete cocher -->
            <div v-for="(layer, index) in resultsPopup" :key="index" class="popup-content">
                <!-- Nom du layer -->
                <h1 class="popup-header-layer"> {{ layer.name }} </h1>

                <!-- Affiche les popup si elle ont des data -->
                <div v-if="layer.data.length > 0">
                    <div v-for="(zone, idx) in layer.data" :key="idx" class="popup-content">
                        <div class="popup-header">
                            <h1>Désignation : {{ zone.zone_name_fr }}</h1>
                        </div>
                        <div class="popup-body">
                            <p>Restriction : {{ zone.zone_restriction_fr }}</p> 
                            <p>Exceptions : {{ zone.zone_message_fr }}</p>
                        </div>
                    </div>
                </div>
                <div v-else class="no-info-message">
                    <p>Pas d'autres informations.</p>
                </div>
            </div>

        </div>
    </div>
</template>
  
<script>
    export default {
        /**
         * Composant pour gérer le contenu de la popup.
         * @component
         * @prop {Array} coordinates - Les coordonnées de la popup.
         * @prop {boolean} popupVisible - Indique si la popup est visible ou non.
         * @prop {Array} resultsPopup - Les résultats de la popup.
             * Exemple format resultsPopup 
                * resultsPopup =[ { name_layer :"ch.bazl.einschraenkungen-drohnen", 
                                    name : Zones géographiques UAS en Suisse,
                                    data [ [zone_name_fr: "CTR BERN", ...], [zone_name_fr: "LSZB Bern-Belp", ...] ] },
                                { name_layer :"ch.bazl.luftfahrthindernis", 
                                    name : Obstacle a la navigation aerienne
                                    data [] },
                                { ... }]
         * @method closePopup - Méthode pour fermer la popup.
        */
        
        props: {
            coordinates: Array, 
            popupVisible: Boolean, 
            resultsPopup: Array,
        },

        methods: {
            /**
             * Ferme la popup.
            */
            closePopup() {
                this.$emit('close-popup'); // Émettre un événement pour fermer la popup
            }
        }
    };
</script>
  
<style scoped>
    /* Styles CSS */
    .popup {
        position: absolute;
        top: 20vh;
        right: 5vh;
        background-color: #ffffff;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        max-width: 300px;
        max-height: 200px; /* Hauteur maximale avec défilement */
        overflow-y: auto; /* Ajout de la barre de défilement verticale si nécessaire */
    }
  
    .header-content {
        display: flex;
        align-items: center;
    }

    .popup-title {
        font-weight: bold;
        text-align: center;
        flex-grow: 1; /* Le titre occupe tout l'espace restant */
    }

    .popup-header-layer {
        font-weight: bold;
        text-align: center;
        border-top: 5px solid #ccc;
    }

    .close-button {
        background: none;
        border: none;
        font-size: 1rem;
        cursor: pointer;
    }


    .popup-content {
        padding: 5px;
    }

    .popup-header {
        display: flex;
        justify-content: space-between;
        text-align: center;
        padding: 10px;
        border-bottom: 1px solid #ccc;
    }

    .popup-body {
        display: flex;
        justify-content: space-between;
        text-align: left;
        padding: 10px;
    }
   
    .close-button:hover {
        color: #333;
    } 
  
</style>
  