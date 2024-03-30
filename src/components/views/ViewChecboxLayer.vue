<!-- Vue : Cree les checkbox des layer et gere si couches actives ou non sur la map -->

<!-- TODO eventuelle : Etat de la checkbox en fct du layerVisibility, comment ? Si je intialise tous a false ok de pas gerer le cas -->
<template>
    <div>
      <h2>Layers</h2>
      <div v-for="(layer, index) in layers" :key="index">
        <input type="checkbox" @change="toggleLayer(layer)">
        <label>{{ layer.getSource().getParams().name }}</label>
      </div>
    </div>
</template>
  
<script>

  export default {
      /**
       * Composant pour gérer les cases à cocher des couches et leur visibilité sur la carte.
       * @component
       * @prop {Array} layers - La liste des couches à afficher.
       * @prop {Object} layerVisibility - L'état de visibilité actuel des couches.
       * @method toggleLayer - Méthode pour basculer la visibilité d'une couche.
      */
      props : ['layers', 'layerVisibility'],

      methods: {
        /**
         * Bascule la visibilité d'une couche lorsqu'une case à cocher est cochée ou décochée.
         * @param {Object} layer - La couche à basculer.
        */
        toggleLayer(layer) {
          layer.setVisible(!layer.getVisible())
          console.log("Toggling layer", layer)
        },
      },
  };

</script>
  