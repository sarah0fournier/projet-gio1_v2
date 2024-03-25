<!-- Onglet.vue -->
<template>
    <div class="tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ active: activeTab === index }"
        @click="$emit('update:activeTab', index)"
      >
        {{ tab.name }}
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: ['tabs', 'activeTab']
  };
  </script>
  
  <style>
  .tabs {
    display: flex;
  }
  
  .tabs button {
    padding: 10px 15px;
    margin-right: 10px;
    border: none;
    background-color: #f0f0f0;
    cursor: pointer;
  }
  
  .tabs button.active {
    background-color: #ccc;
  }
  </style>
  