<script setup>
import { computed } from 'vue'
const props = defineProps({ scores: Array })
const point = (i, value) => { const angle = (i * 90 - 90) * Math.PI / 180; return `${180 + Math.cos(angle) * value * 1.05},${155 + Math.sin(angle) * value * 1.05}` }
const polygon = value => [0,1,2,3].map(i => point(i,value)).join(' ')
const result = computed(() => props.scores.map((v,i) => point(i,v ?? 0)).join(' '))
</script>
<template>
  <svg class="radar-chart" viewBox="0 0 360 320" role="img" aria-labelledby="radar-title radar-desc">
    <title id="radar-title">Ethics radar</title><desc id="radar-desc">Scores from your completed modules. Privacy: {{ scores[0] ?? 'not assessed' }}. Responsibility: {{ scores[1] ?? 'not assessed' }}. AI ethics: {{ scores[2] ?? 'not assessed' }}. Intellectual property: {{ scores[3] ?? 'not assessed' }}. Unassessed domains are drawn at the center, not scored zero.</desc>
    <polygon v-for="level in [25,50,75,100]" :key="level" :points="polygon(level)" fill="none" stroke="#364138" stroke-width="1" />
    <line v-for="i in [0,1,2,3]" :key="i" x1="180" y1="155" :x2="point(i,100).split(',')[0]" :y2="point(i,100).split(',')[1]" stroke="#29362c" />
    <polygon :points="result" fill="#b4f175" fill-opacity=".16" stroke="#b4f175" stroke-width="2" />
    <template v-for="(score,i) in scores" :key="i"><circle v-if="score !== null" :cx="point(i,score).split(',')[0]" :cy="point(i,score).split(',')[1]" r="4" fill="#b4f175" /></template>
    <g fill="#aeb8b0" font-size="11" font-family="inherit" text-anchor="middle"><text x="180" y="26">PRIVACY</text><text x="311" y="151">RESPONSI-</text><text x="311" y="166">BILITY</text><text x="180" y="290">AI ETHICS</text><text x="44" y="151">INTELLECTUAL</text><text x="44" y="166">PROPERTY</text></g>
  </svg>
</template>
