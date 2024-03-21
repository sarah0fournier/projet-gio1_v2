<template>
    <div class="future-results">
      <h2>Résultats des zones de vol restreintes</h2>
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
        <tbody>
          <tr v-for="(zone, index) in zonesData" :key="index">
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
  </template>
  
  <script>
  export default {
    props: {
      zonesData: Array // Propriété pour recevoir les données des zones de vol restreintes
    }
  }
  </script>
  
  <style scoped>
  /* Vos styles CSS ici */
  .future-results {
    border: 2px solid black;
    padding: 10px;
    margin-top: 20px;
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
  </style>