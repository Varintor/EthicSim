<script setup>
import { computed, ref } from 'vue'
import { modules } from '../data/modules.js'
import { getScores, getArchetype } from '../lib/progress.js'
import RadarChart from './RadarChart.vue'
import AppIcon from './AppIcon.vue'
const props = defineProps({ results: Object, reflection: String })
defineEmits(['start','home','reflect','reset'])
const confirmReset = ref(false)
const scores = computed(() => getScores(props.results))
const assessed = computed(() => scores.value.map((score,i) => ({score,module:modules[i]})).filter(x=>x.score!==null))
const archetype = computed(() => getArchetype(scores.value))
const strongest = computed(() => [...assessed.value].sort((a,b)=>b.score-a.score)[0])
const growth = computed(() => [...assessed.value].sort((a,b)=>a.score-b.score)[0])
const next = computed(() => modules.find(m=>!props.results[m.id]) || modules[0])
</script>
<template>
  <section class="results-view"><div class="page-eyebrow"><span class="status-dot"></span> YOUR ETHICS RADAR</div><h1 tabindex="-1">A new perspective.<br /><span class="lime">A better next decision.</span></h1><p class="muted mt-4">{{ assessed.length }} of 4 domains explored. Every choice is a chance to learn.</p>
    <div v-if="!assessed.length" class="empty-state panel"><AppIcon name="radar" :size="60" /><h2>Your radar is waiting for its first signal.</h2><p class="muted">Play a module to see your strengths, growth areas, and developer archetype.</p><button class="btn-primary mt-6" @click="$emit('start',modules[0].id)">Explore The Privacy Shield <AppIcon name="right" :size="18" /></button></div>
    <template v-else><div class="results-grid"><div class="panel"><div class="flex justify-between items-center"><span class="eyebrow">DECISION PROFILE</span><span class="pill">{{ assessed.length === 4 ? 'ALL DOMAINS' : 'PARTIAL PROFILE' }}</span></div><RadarChart :scores="scores"/><div class="score-list"><div v-for="(module,i) in modules" :key="module.id"><span>{{ module.domain }}</span><strong :class="scores[i]===null ? 'muted':'lime'">{{ scores[i]===null ? 'Not assessed' : `${scores[i]} / 100` }}</strong></div></div><p class="small muted mt-5">Unplayed domains are unassessed; their chart points sit at the center.</p></div>
      <div class="archetype-panel panel"><span class="eyebrow">YOUR DEVELOPER ARCHETYPE</span><div class="archetype-emblem"><AppIcon name="shield" :size="52" /></div><h2>{{ archetype.title }}</h2><p class="muted mt-4">{{ archetype.description }}</p><div class="insight"><AppIcon name="sparkles" /><div><strong>Emerging strength · {{ strongest.module.domain }}</strong><p>{{ strongest.score >= 80 ? 'You considered people, permission and the downstream effects of your choices.' : 'You are building awareness of competing priorities. Revisit the feedback to strengthen your reasoning.' }}</p></div></div><div class="insight"><AppIcon name="target" /><div><strong>Keep exploring · {{ growth.module.domain }}</strong><p>{{ growth.score >= 80 ? 'Try a different path on replay. Explain what changes, who bears the cost, and what safeguards would help.' : 'Before committing, ask who carries the risk and whether a safer option still meets the underlying goal.' }}</p></div></div></div></div>
      <div class="panel reflection-panel"><div><span class="eyebrow">MAKE IT YOURS</span><h2 class="mt-2">What will you take into your next project?</h2><p class="small muted mt-2">Your reflection stays in this browser. It is not sent to a server.</p></div><label for="reflection" class="sr-only">Your post-session reflection</label><textarea id="reflection" :value="reflection" maxlength="2000" placeholder="Next time I face a similar decision, I will…" @input="$emit('reflect',$event.target.value)"></textarea><span class="small muted">{{ reflection.length }} / 2000</span></div>
      <details class="panel decision-review"><summary>Review your decisions <span class="muted small">and explore the reasoning</span></summary><div v-for="item in assessed" :key="item.module.id" class="review-module"><h3>{{ item.module.title }}</h3><div v-for="(answer,i) in results[item.module.id]" :key="i" class="review-answer"><strong>{{ item.module.scenarios[i].title }}</strong><p class="lime small mt-2">{{ item.module.scenarios[i].options[answer].label }}</p><p class="muted small mt-2">{{ item.module.scenarios[i].options[answer].reasoning }}</p></div></div></details>
      <p class="assessment-note">A learning snapshot, not a measure of your character. Scores use a transparent, illustrative rubric for these fictional scenarios, informed by the <a href="https://www.acm.org/code-of-ethics" target="_blank" rel="noopener noreferrer">ACM Code of Ethics</a>. This is not a validated or ACM-endorsed assessment. Replaying replaces that module’s previous result.</p>
    </template>
    <div class="results-actions"><button class="btn-secondary" @click="$emit('home')"><AppIcon name="left" :size="17" /> All modules</button><button v-if="assessed.length" class="btn-primary" @click="$emit('start',next.id)">{{ assessed.length === 4 ? 'Explore another perspective' : 'Try the next module' }} <AppIcon name="right" :size="18" /></button></div>
    <div v-if="assessed.length" class="reset-area"><button v-if="!confirmReset" class="text-button muted small" @click="confirmReset=true"><AppIcon name="reset" :size="14" /> Reset learning progress</button><div v-else class="flex flex-wrap items-center gap-4 small"><span>Clear all scores and your reflection from this browser?</span><button class="btn-secondary" @click="$emit('reset'); confirmReset=false">Yes, reset progress</button><button class="text-button" @click="confirmReset=false">Cancel</button></div></div>
  </section>
</template>
