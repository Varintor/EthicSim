<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import AppIcon from './components/AppIcon.vue'
import Dashboard from './components/Dashboard.vue'
import ScenarioPlayer from './components/ScenarioPlayer.vue'
import ResultsView from './components/ResultsView.vue'
import { modules } from './data/modules.js'
import { STORAGE_KEY, sanitizeProgress } from './lib/progress.js'
const storageWarning = ref('')
let initial
try { initial = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') } catch { storageWarning.value = 'Saved progress could not be read. You can still play this session.' }
const progress = ref(sanitizeProgress(initial))
const route = ref(location.hash.slice(1) || '/')
const howDialog = ref(null), run = ref(0)
const activeModule = computed(() => modules.find(m=>route.value === `/play/${m.id}`))
const screen = computed(() => activeModule.value ? 'play' : route.value === '/results' ? 'results' : 'dashboard')
const completed = computed(() => Object.keys(progress.value.results).length)
watch(progress, value => { try { localStorage.setItem(STORAGE_KEY,JSON.stringify(value)); storageWarning.value='' } catch { storageWarning.value='Browser storage is unavailable. Progress will last only for this session.' } }, {deep:true})
async function onRoute() { route.value=location.hash.slice(1)||'/'; await nextTick(); window.scrollTo({top:0}); document.querySelector('main h1')?.focus() }
function navigate(path) { if (location.hash === `#${path}`) onRoute(); else location.hash=path }
function start(id) { run.value++; navigate(`/play/${id}`) }
function skipToMain() { document.getElementById('main')?.focus() }
function complete(answers) { progress.value.results[activeModule.value.id]=[...answers]; navigate('/results') }
onMounted(()=>window.addEventListener('hashchange',onRoute))
onUnmounted(()=>window.removeEventListener('hashchange',onRoute))
watch(screen, value => { document.title = `${value==='play' ? activeModule.value.title : value==='results' ? 'Your ethics radar' : 'Build your ethical instinct'} — EthicSim` },{immediate:true})
</script>
<template>
  <a href="#main" class="skip-link" @click.prevent="skipToMain">Skip to content</a>
  <aside class="app-sidebar"><a href="#/" class="brand" aria-label="EthicSim home"><span class="brand-icon"><AppIcon name="shield" :size="23" /></span>Ethic<span class="lime">Sim</span><span class="beta">BETA</span></a><div class="sidebar-section-label">WORKSPACE</div><nav aria-label="Main navigation"><a href="#/" class="nav-item" :class="{active:screen==='dashboard'||screen==='play'}" :aria-current="screen==='dashboard'?'page':undefined"><AppIcon name="dashboard" :size="19" /> Learning lab <span class="nav-count">4</span></a><a href="#/results" class="nav-item" :class="{active:screen==='results'}" :aria-current="screen==='results'?'page':undefined"><AppIcon name="radar" :size="19" /> My ethics radar</a><button class="nav-item" @click="howDialog.showModal()"><AppIcon name="book" :size="19" /> How it works <AppIcon class="ml-auto" name="arrow" :size="14" /></button></nav>
    <div class="sidebar-course"><span class="course-icon"><AppIcon name="code" :size="23" /></span><span class="eyebrow">BUILT FOR THE REAL WORLD</span><h3>Better code starts<br />with better questions.</h3><p>Build the judgment they don’t teach in a syntax tutorial.</p><div class="course-dots"><span v-for="i in 4" :key="i" :class="{filled:i<=completed}"></span></div><span class="small muted">{{ completed }} of 4 perspectives explored</span></div>
    <div class="sidebar-bottom"><span class="user-avatar">D</span><div><strong>Future changemaker</strong><p class="small muted">Your learning space</p></div><span class="status-dot ml-auto"></span></div>
  </aside>
  <div class="app-body"><header class="topbar"><div class="breadcrumb"><span class="muted">Workspace</span><AppIcon name="chevron" :size="14" /><span>{{ screen==='results'?'My ethics radar':screen==='play'?'Scenario lab':'Learning lab' }}</span></div><div class="flex items-center gap-4"><span class="prototype-label">INTERACTIVE PROTOTYPE</span><span class="topbar-divider"></span><span class="small flex items-center gap-2"><AppIcon name="zap" :size="16" /><strong>{{ completed * 100 }}</strong> XP</span></div></header>
    <div v-if="storageWarning" class="storage-warning" role="status">{{ storageWarning }}</div>
    <main id="main" tabindex="-1"><Transition name="page" mode="out-in"><Dashboard v-if="screen==='dashboard'" :results="progress.results" @start="start" @report="navigate('/results')" @how="howDialog.showModal()"/><ScenarioPlayer v-else-if="screen==='play'" :key="`${activeModule.id}-${run}`" :module="activeModule" @complete="complete" @exit="navigate('/')"/><ResultsView v-else :results="progress.results" :reflection="progress.reflection" @start="start" @home="navigate('/')" @reflect="progress.reflection=$event" @reset="progress=sanitizeProgress(null)"/></Transition></main>
    <footer><span class="flex items-center gap-2"><AppIcon name="shield" :size="15" /> Made for thoughtful developers.</span><span>GROUP 10 <span class="mx-2">/</span> 953420 ETHICS & PROFESSIONALISM</span></footer>
  </div>
  <dialog ref="howDialog" class="how-dialog"><div class="flex justify-between gap-5 items-center"><span class="eyebrow lime">THE ETHICSIM METHOD</span><button class="btn-secondary" autofocus @click="howDialog.close()">Close</button></div><h2>Learn by facing the consequence.</h2><div v-for="(item,i) in [['Meet the dilemma','Step into a fictional workplace scenario and understand what is at stake.'],['Make your call','Respond to a teammate or choose a data scope. Each option has a trade-off.'],['See the impact','Get immediate feedback about affected people, consequences and ethical principles.'],['Reflect & grow','Explore your radar, write a reflection and replay to consider another perspective.']]" :key="i" class="how-step"><span>0{{ i+1 }}</span><div><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p></div></div><p class="small muted">100 XP per completed module, awarded once. Results and reflections are saved on this browser. In-progress scenarios restart if you leave or refresh.</p></dialog>
</template>
