<!-- Vue pour generer un bouton (s occupe pas de ce qu il fait) -->

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
  export default {
    /**
     * Composant bouton générique.
     * @component
     * @prop {String} buttonText - Le texte à afficher sur le bouton.
     * @prop {String} buttonId - L'identifiant unique du bouton.
     * @prop {String} [buttonImage] - Le chemin de l'image à afficher sur le bouton (facultatif).
     * @prop {String} [imageSize='50px'] - La taille de l'image (par défaut '50px').
     * @event bouton-click - Événement émis lors du clic sur le bouton.
    */

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
            type: String 
        },
        imageSize: {
            type: String,
            default: '50px' 
        }
    },
    methods: {
      /**
       * Gère le clic sur le bouton en émettant un événement.
       * @param {Event} event - L'événement de clic.
      */
     
      boutonClick(event) {
        this.$emit('bouton-click', event)
      },
    },
  };
</script> 
