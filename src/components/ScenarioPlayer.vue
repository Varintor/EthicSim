<script setup>
import { computed, nextTick, ref } from 'vue'
import AppIcon from './AppIcon.vue'
const props = defineProps({ module: Object })
const emit = defineEmits(['complete', 'exit'])
const stage = ref('intro'), step = ref(0), selected = ref(null), slider = ref(0), answers = ref([])
const scenario = computed(() => props.module.scenarios[step.value])
const feedback = computed(() => selected.value === null ? null : scenario.value.options[selected.value])
async function focusHeading() { await nextTick(); document.querySelector('.player h1')?.focus() }
function begin() { stage.value = 'play'; focusHeading() }
function choose(index) { if (selected.value !== null) return; selected.value = index; nextTick(() => document.querySelector('.feedback-card')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' })) }
function advance() {
  if (selected.value === null) return
  answers.value.push(selected.value)
  if (step.value === props.module.scenarios.length - 1) { emit('complete', answers.value); return }
  step.value++; selected.value = null; slider.value = 0; focusHeading()
}
</script>
<template>
  <section class="player" :class="module.color">
    <button class="text-button mb-8" @click="emit('exit')"><AppIcon name="left" :size="16" /> All modules</button>
    <div class="player-heading"><span class="eyebrow">MODULE {{ module.number }} <span class="mx-2">/</span> {{ module.domain }}</span><span class="small muted">{{ stage === 'intro' ? 'THE BRIEFING' : `DECISION ${step + 1} OF ${module.scenarios.length}` }}</span></div>
    <div class="step-track"><span :class="{active: true}"></span><span :class="{active:stage==='play'}"></span><span :class="{active:step>0}"></span><span></span></div>
    <div v-if="stage === 'intro'" class="intro-panel">
      <div class="intro-emblem"><AppIcon :name="module.icon" :size="62" /></div><div class="hero-badge mt-7">YOUR NEXT CHALLENGE</div><h1 tabindex="-1">{{ module.title }}</h1><p class="intro-description">{{ module.intro }}</p>
      <div class="mission-box"><AppIcon name="target" :size="24" /><div><span class="eyebrow">YOUR MISSION</span><p>{{ module.mission }}</p></div></div>
      <div class="flex justify-center gap-6 muted small my-7"><span class="flex items-center gap-2"><AppIcon name="clock" :size="16" /> ~3 minutes</span><span class="flex items-center gap-2"><AppIcon name="message" :size="16" /> 2 decisions</span></div><button class="btn-primary" @click="begin">Enter scenario <AppIcon name="right" :size="18" /></button><p class="small muted mt-5">A safe space to make the difficult calls.</p>
    </div>
    <div v-else :key="step" class="scenario-layout animate-in">
      <div class="scenario-main"><div class="eyebrow mt-7 mb-3">{{ scenario.scene }}</div><h1 tabindex="-1">{{ scenario.title }}</h1><p class="scenario-context">{{ scenario.context }}</p>
        <div v-if="scenario.kind === 'dialog'" class="dialog-card"><div class="flex items-center gap-3 mb-4"><span class="avatar">{{ scenario.speaker[0] }}</span><div><strong>{{ scenario.speaker }}</strong><p class="small muted">{{ scenario.position }}</p></div><span class="small muted ml-auto">now</span></div><blockquote>{{ scenario.message }}</blockquote></div>
        <h2 class="decision-prompt">{{ scenario.prompt }}</h2>
        <div v-if="scenario.kind === 'dialog'" class="choices"><button v-for="(option,index) in scenario.options" :key="option.label" class="choice" :class="{selected:selected===index, dimmed:selected!==null && selected!==index}" :disabled="selected !== null" @click="choose(index)"><span class="choice-letter">{{ String.fromCharCode(65+index) }}</span><span><strong>{{ option.label }}</strong><span class="choice-detail">{{ option.detail }}</span></span><AppIcon v-if="selected===index" name="check" :size="20" /></button></div>
        <div v-else class="slider-card"><label for="collection-scope" class="sr-only">Data collection scope</label><input id="collection-scope" v-model.number="slider" type="range" min="0" max="2" step="1" :disabled="selected!==null" :aria-valuetext="scenario.options[slider].label" /><div class="flex justify-between small muted mt-2"><span>{{ scenario.minLabel }}</span><span>{{ scenario.maxLabel }}</span></div><div class="slider-selection"><AppIcon name="scale" :size="24" /><strong>{{ scenario.options[slider].label }}</strong><p class="small muted">{{ scenario.options[slider].detail }}</p></div><button class="btn-primary w-full justify-center" :disabled="selected!==null" @click="choose(slider)">Commit to this approach <AppIcon name="right" :size="17" /></button></div>
        <div v-if="feedback" class="feedback-card animate-in" role="status" aria-live="polite"><div class="eyebrow lime mb-3">THE CONSEQUENCE</div><h2>{{ feedback.heading }}</h2><p>{{ feedback.consequence }}</p><div class="feedback-reason"><strong>Why it matters</strong><p>{{ feedback.reasoning }}</p></div><div><strong>The trade-off</strong><p>{{ feedback.tradeoff }}</p></div><a :href="scenario.source" target="_blank" rel="noopener noreferrer" class="principle-link">{{ scenario.principle }} <AppIcon name="arrow" :size="14" /></a><button class="btn-primary mt-6" @click="advance">{{ step === module.scenarios.length-1 ? 'Reveal my ethics radar' : 'Continue the story' }}<AppIcon name="right" :size="18" /></button></div>
      </div>
      <aside class="scenario-sidebar"><div class="eyebrow mb-4">YOU ARE PLAYING AS</div><AppIcon :name="module.icon" :size="34" /><h3 class="mt-4">{{ module.role.split(' · ')[0] }}</h3><p class="muted small mt-1">{{ module.role.split(' · ')[1] }}</p><hr /><AppIcon name="brain" :size="24" /><h3 class="mt-3">Think beyond the code.</h3><p class="muted small mt-3">Who is affected by your decision? What would they need you to consider?</p><div class="sidebar-note">There is more to a decision than getting it “right”. Explore the consequences.</div></aside>
    </div>
  </section>
</template>
