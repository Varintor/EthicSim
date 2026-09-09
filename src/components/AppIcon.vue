<script setup>
import { ShieldCheck, Bug, BrainCircuit, Code2, ArrowUpRight, ArrowRight, ArrowLeft, LayoutDashboard, Radar, Sparkles, Check, Clock3, Zap, BookOpen, RotateCcw, ChevronRight, CircleHelp, LockKeyhole, Target, MessageSquare, Scale, CheckCircle2 } from '@lucide/vue'
defineProps({ name: String, size: { type: Number, default: 20 } })
const icons = { shield: ShieldCheck, bug: Bug, brain: BrainCircuit, code: Code2, arrow: ArrowUpRight, right: ArrowRight, left: ArrowLeft, dashboard: LayoutDashboard, radar: Radar, sparkles: Sparkles, check: Check, clock: Clock3, zap: Zap, book: BookOpen, reset: RotateCcw, chevron: ChevronRight, help: CircleHelp, lock: LockKeyhole, target: Target, message: MessageSquare, scale: Scale, complete: CheckCircle2 }
</script>
<template><component :is="icons[name] || ShieldCheck" :size="size" :stroke-width="1.65" aria-hidden="true" /></template>
