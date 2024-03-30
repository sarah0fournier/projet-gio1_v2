<template>
    <div v-if="isResults"  class="future-results table-container">

      <h2 class="results-title">Résultats des zones de vol restreintes</h2>
      <!-- Fonctionne pas car pas gerer cas si resultsDatasPerimetre[0] donc pas de zone restriction vol dans couche -->
      <!-- <h1 class="results-title"> {{ resultsDatasPerimetre[0]['name'] }} </h1> -->

      <div class="table-wrapper">
            <table>
            <thead>
              <tr>
                <th>Zone</th>
                <th>Restriction</th>
                <th>Message</th>
                <th>URL d'authentification</th>
                <th>Nom d'authentification</th>
                <th>Contact d'authentification</th>
                <th>Service d'authentification</th>
                <th>Email d'authentification</th>
                <th>Téléphone d'authentification</th>
              </tr>
            </thead>
            <tbody class="table-body-container">

              <tr v-for="(zone, index) in resultsDatasPerimetre[0]['data']" :key="index">
                <td>{{ zone.zone_name_fr }}</td>
                <td>{{ zone.zone_restriction_fr }}</td>
                <td>{{ zone.zone_message_fr }}</td>
                <td> <!-- Modifier cette cellule pour afficher un lien cliquable -->
                <a :href="zone.auth_url_fr" target="_blank" v-if="zone.auth_url_fr[0]">{{ zone.auth_url_fr[0] }}</a>
                <span v-else>-</span> <!-- Afficher un tiret si l'URL n'est pas définie -->
                </td>
                <td>{{ zone.auth_name_fr[0] }}</td>
                <td>{{ zone.auth_contact[0] }}</td>
                <td>{{ zone.auth_service_fr[0] }}</td>
                <td>{{ zone.auth_email[0]}}</td>
                <td>{{ zone.auth_phone[0] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
  
    </div>
</template>
    
<script>
    export default {
        /**
         * @prop {Array} resultsDatasPerimetre - Données des zones de vol restreintes.
         * @prop {Boolean} isResults - Indique si les résultats sont disponibles ou non.
        */

      props: {
        resultsDatasPerimetre: Array,  // Propriete pour recevoir les données des zones de vol restreintes
        isResults : Boolean,
      }
    }
</script>
    
<style scoped>
    /* Vos styles CSS ici */
    .future-results {
    border: 2px solid black;
    padding: 10px;
    margin-top: 20px;
    height: 400px;
    overflow-y: auto; 
  }
  
  .results-title {
    margin-bottom: 10px;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .table-wrapper {
    max-height: 350px; /* Hauteur maximale pour la zone de défilement */
    overflow-y: auto; /* Activer la barre de défilement verticale si nécessaire */
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  th {
    background-color: #f2f2f2;
    font-weight: bold;
    text-align: left;
  }
  
  thead {
    position: sticky;
    top: 0;
    background-color: #f5f5f5;
    z-index: 1;
  }
  
</style>