<template>
  <NTable striped>
    <thead>
      <tr>
        <th v-for="label in airesultsHeaders" :key="label">{{ label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="recognitionData.length === 0">
        <td v-for="n in airesultsHeaders.length" :key="n">-</td>
      </tr>
      <tr v-else v-for="(item, index) in recognitionData" :key="index">
        <td v-for="label in airesultsHeaders" :key="label">{{ item[label] || '-' }}</td>
      </tr>
    </tbody>
  </NTable>
</template>

<script setup lang="ts">
import { airesultsHeaders } from '@/utils/config/index.ts';

defineProps<{
  recognitionData: any[];
}>();
</script>
