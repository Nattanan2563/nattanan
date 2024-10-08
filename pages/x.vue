<template>
  <div>
    <h1>WebSocket Client</h1>
    <p v-if="error">{{ error }}</p>
    <div v-if="data">
      <h2>Buy Price Gold Bar: {{ data.associate_buy_price_goldbar }}</h2>
      <h2>Sell Price Gold Bar: {{ data.associate_sell_price_goldbar }}</h2>
      <h2>Buy Price Gold Ornament: {{ data.associate_buy_price_goldornament }}</h2>
      <h2>Sell Price Gold Ornament: {{ data.associate_sell_price_goldornament }}</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const data = ref(null);
const error = ref(null);

onMounted(() => {
  // Create a new WebSocket connection
  const ws = new WebSocket('ws://localhost:8080'); // Use ws protocol

  // Listen for connection open event
  ws.onopen = () => {
    console.log('Connected to WebSocket server');
  };

  // Listen for messages from the server
  ws.onmessage = (event) => {
    const messageData = JSON.parse(event.data); // Parse the incoming message
    console.log('Received data:', messageData);
    data.value = messageData; // Update data with the new message
  };

  // Handle errors
  ws.onerror = (event) => {
    console.error('WebSocket error:', event);
    error.value = 'WebSocket error occurred. Check the console for details.';
  };

  // Handle connection close event
  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };
});
</script>