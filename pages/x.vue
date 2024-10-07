<template>
  <div>
    <h1>Scraped Data</h1>
    <p v-if="error">{{ error }}</p>
    <div v-if="data">
      <h2>{{ data.associate_buy_price_goldbar }}</h2>
      <h2>{{ data.associate_sell_price_goldbar }}</h2>
      <h2>{{ data.associate_buy_price_goldornament }}</h2>
      <h2>{{ data.associate_sell_price_goldornament }}</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Import axios directly

const data = ref(null);
const error = ref(null);

onMounted(async () => {
  console.log("the battle begin"); // Confirm component is mounted
  try {
    console.log("Attempting API call..."); // Log before the API call
    const response = await axios.get('http://localhost:3001/api/scrape'); // Call the API
    console.log('Response from API:', response.data); // Log the response
    data.value = response.data; // Set the data
  } catch (err) {
    console.error('API call error:', err); // Log the error
    error.value = 'Failed to load scraped data.'; // Set error message
  }
});
</script>