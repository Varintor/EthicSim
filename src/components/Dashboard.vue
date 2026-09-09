<script setup>
import { computed } from 'vue'
import { modules } from '../data/modules.js'
import AppIcon from './AppIcon.vue'
const props = defineProps({ results: Object })
defineEmits(['start', 'report', 'how'])
const completed = computed(() => Object.keys(props.results).length)
const next = computed(() => modules.find(m => !props.results[m.id]) || modules[0])
</script>
<template>
  <section class="dashboard">
    <div class="page-eyebrow"><span class="status-dot"></span> YOUR ETHICS JOURNEY <span class="eyebrow-line"></span><span>LEARN. DECIDE. REFLECT.</span></div>
    <div class="hero">
      <div class="hero-copy">
        <div class="hero-badge"><AppIcon name="sparkles" :size="14" /> SMALL DECISIONS. REAL IMPACT.</div>
        <h1 tabindex="-1">Build your<br />ethical <span>instinct.</span></h1>
        <p>Great developers think beyond the code. Step into real-world dilemmas, make the tough calls, and discover the kind of developer you want to be.</p>
        <div class="flex flex-wrap items-center gap-5 mt-7"><button class="btn-primary" @click="$emit('start',next.id)">{{ completed ? 'Continue your journey' : 'Start your journey' }} <AppIcon name="right" :size="18" /></button><span class="small muted flex items-center gap-2"><AppIcon name="clock" :size="15" /> 3 minutes to a new perspective</span></div>
      </div>
      <div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="orbit orbit-three"></div><div class="orbit-axis"></div><div class="shield-core"><AppIcon name="shield" :size="86" /></div><div class="art-tag tag-top"><span class="status-dot"></span> ETHICAL THINKING: ACTIVE</div><div class="floating-symbol symbol-code"><AppIcon name="code" :size="24" /></div><div class="floating-symbol symbol-lock"><AppIcon name="lock" :size="24" /></div><div class="art-caption">YOUR NEXT DECISION MATTERS</div><span class="art-cross cross-one">+</span><span class="art-cross cross-two">+</span></div>
    </div>
    <div class="journey-strip">
      <div class="flex items-center gap-3"><span class="mini-icon"><AppIcon name="zap" /></span><div><strong>Your progress</strong><p class="small muted">One perspective at a time.</p></div></div>
      <div class="strip-progress"><div class="flex justify-between small mb-2"><span><strong>{{ completed }}</strong> <span class="muted">of 4 modules completed</span></span><span class="lime">{{ completed * 25 }}%</span></div><div class="progress-track" role="progressbar" :aria-valuenow="completed" :aria-valuemin="0" :aria-valuemax="4" aria-label="Modules completed"><span :style="{width: `${completed*25}%`}"></span></div></div>
      <button class="text-button" @click="$emit('report')">View ethics radar <AppIcon name="arrow" :size="17" /></button>
    </div>
    <div class="section-heading"><div><div class="eyebrow mb-2">THE LEARNING LAB</div><h2>Choose your next challenge<span class="lime">.</span></h2><p class="muted mt-2">Four domains. Different perspectives. No easy answers.</p></div><span class="pill"><span class="status-dot"></span> ALL MODULES OPEN</span></div>
    <div class="module-grid">
      <button v-for="module in modules" :key="module.id" class="module-card" :class="module.color" @click="$emit('start',module.id)">
        <div class="flex justify-between items-start"><span class="module-icon"><AppIcon :name="module.icon" :size="28" /></span><span class="module-number">{{ module.number }} <AppIcon name="arrow" :size="18" /></span></div>
        <div class="module-domain">{{ module.domain }}</div><h3>{{ module.title }}</h3><p>{{ module.description }}</p><div class="flex gap-2 flex-wrap mt-5"><span v-for="tag in module.tags" :key="tag" class="tag">{{ tag }}</span></div>
        <div class="module-bottom"><span class="flex items-center gap-2"><AppIcon name="clock" :size="14" /> 3 min <span class="separator">·</span> 2 decisions</span><span :class="{lime:results[module.id]}" class="flex items-center gap-1">{{ results[module.id] ? 'Completed · Replay' : 'Explore module' }} <AppIcon :name="results[module.id] ? 'check' : 'right'" :size="15" /></span></div>
      </button>
    </div>
    <div class="how-strip"><div class="flex items-center gap-3"><AppIcon name="book" :size="24" /><div><strong>Experience first. Understanding follows.</strong><p class="small muted mt-1">Face a dilemma <span class="mx-2">→</span> Make your call <span class="mx-2">→</span> See the impact <span class="mx-2">→</span> Reflect & grow</p></div></div><button class="text-button" @click="$emit('how')">How it works <AppIcon name="arrow" :size="16" /></button></div>
  </section>
</template>
