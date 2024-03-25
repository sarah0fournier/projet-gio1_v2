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
      props : ['layers', 'layerVisibility'],

      methods: {
        toggleLayer(layer) {
          // Changer la visibilite de la couche
          layer.setVisible(!layer.getVisible())
          console.log("Toggling layer", layer)
        },
      },
  };

</script>
  