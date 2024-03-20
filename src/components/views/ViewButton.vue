<template>
    <button id="buttonId" @click="boutonClick"> 
        <!-- Utilisation de l'image si buttonImage est défini -->
        <img v-if="buttonImage" :src="buttonImage" :style="{ width: imageSize, height: imageSize }" alt="Bouton Image">
       
        <!-- Sinon, utilisez le texte si buttonText est défini -->
        <template v-else>
            {{ buttonText }}
        </template>
    </button>
</template>
  
<script>
    // Importer les function qui sont dans flightForm.js
    import * as flightForm from '../../assets/js/flightForm.js';
    // import * as flightZone from '../../assets/js/flightZone.js';
    
    import {draw } from '@/components/views/ViewFlightZone.vue';
    import { startDrawingOnMap } from '@/components/views/ViewFlightZone.vue';

    export default {
        props: {
            buttonText: {
                type: String,
                required: true
            },
            buttonId: {
                type: String,
                required: true
            },
            buttonImage: {
                type: String // Chemin de l'image, facultatif
            },
            imageSize: {
                type: String,
                default: '50px' // Taille de l'image par défaut
            }
        },
        methods: {
          boutonClick(event) {
            this.$emit('bouton-click', event);
        // switch (this.buttonId) {
        //   case 'submitBtn':
        //     event.preventDefault();
        //     if (flightForm.validateForm()) {
        //       console.log("Formulaire soumis avec succès !");
        //     }
        //     console.log("Vous avez cliqué sur le bouton Soumettre !");
        //     break;

        //   case 'resetBtn':
        //     flightForm.resetForm();
        //     console.log("Vous avez cliqué sur le bouton Réinitialiser !");
        //     break;

        //   case 'drawBtn':
        //     // Je dois mettre les variables draw comme globale ? J'ai ce pbl a plusoeurs endroit avec des variables non globale et donc recupere pas hors function
        //     console.log("Ajouter fonction pour dessiner");
        //     // startDrawingOnClickFormular(event, draw);
        //     // startDrawingOnClick(event);
        //     this.startDrawing()
        //     break;

        //   default:
        //     console.log("Bouton non reconnu !");
        // }
      },
      startDrawing() {
          console.log('start-drawing')
          // Émettre un événement pour signaler le début du dessin
          this.$emit('start-drawing', 'polygon'); // 'polygon' peut être remplacé par le type de dessin souhaité
        }
    },
  };
</script>
  
  <style scoped>
/* Styles pour le composant ViewButton.vue */
  </style>
