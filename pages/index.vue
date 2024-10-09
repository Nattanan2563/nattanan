<template>
  {{ x }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { add } from '~/utils/erp';
import * as Erp from '~/utils/erp';
import { ref, onMounted } from 'vue';
export default defineComponent({
  setup() {
    const x = ref<number | null>(null); // Declare x as a ref with type number or null

    onMounted(() => {
      x.value = Erp.add(1, 5); // Assign the result of Erp.add to x.value
    });

    return {
      x, // Return x so it can be used in the template
    };
  }
});
</script>