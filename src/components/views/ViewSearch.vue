<template>
    <div>
      <input type="text" v-model="searchQuery" @keypress.enter="search" placeholder="Rechercher...">
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: '',
      };
    },
    methods: {
      async search(event) {
        if (event.key === 'Enter' && this.searchQuery.trim() !== '') {
          try {
            const response = await fetch(`https://api3.geo.admin.ch/rest/services/blw/SearchServer?sr=2056&searchText=${this.searchQuery}&lang=fr&type=locations`);
            if (!response.ok) {
              throw new Error('Erreur lors de la recherche');
            }
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const firstResult = data.results[0];
              var geom_st_box2d = firstResult.attrs.geom_st_box2d;
              this.$emit('box-search', geom_st_box2d); // Émettre la valeur geom_st_box2d
            } else {
              console.log('Aucun résultat trouvé');
            }
          } catch (error) {
            console.error('Erreur lors de la recherche :', error.message);
          }
        }
      }
    }
  };
  </script>
  