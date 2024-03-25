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
        this.$emit('bouton-click', event)
      },
    },
  };
</script> 
