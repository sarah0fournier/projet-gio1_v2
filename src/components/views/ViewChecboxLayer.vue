<!-- Vue : Cree les checkbox des layer et gere si couches actives ou non sur la map -->
<!-- PBL Etat de la  Etat de la checkbox en fct du layerVisibility. Si initialise a true layerVisibility, la checbox foncttione pas --> 

<template>
    <div>
      <h2>Layers</h2>
      <div v-for="(layer, index) in layers" :key="index">
        <input type="checkbox" @change="toggleLayer(index)">       
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
      props : {
        layers:Array,
        layerVisibility:Array,
      },

      // props : ['layers', 'layerVisibility'],

     

      methods: {
        /**
         * Bascule la visibilité d'une couche lorsqu'une case à cocher est cochée ou décochée.
         * @param {Object} layer - La couche à basculer.
        */
        toggleLayer(index) {
          this.layerVisibility[index] =! this.layerVisibility[index]
          // console.log("New état de la checkbox ", this.layerVisibility[index])
        },
      },
  };

</script>
  