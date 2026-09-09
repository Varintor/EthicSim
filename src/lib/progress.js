import { modules } from '../data/modules.js'
export const STORAGE_KEY = 'ethicsim.progress.v1'
export function sanitizeProgress(value) {
  const clean = { results: {}, reflection: '' }
  if (!value || typeof value !== 'object') return clean
  for (const module of modules) {
    const answers = value.results?.[module.id]
    if (Array.isArray(answers) && answers.length === module.scenarios.length && answers.every((a, i) => Number.isInteger(a) && a >= 0 && a < module.scenarios[i].options.length)) clean.results[module.id] = answers
  }
  if (typeof value.reflection === 'string') clean.reflection = value.reflection.slice(0, 2000)
  return clean
}
export function getScores(results) {
  return modules.map(module => {
    const answers = results[module.id]
    return answers ? Math.round(answers.reduce((sum, a, i) => sum + module.scenarios[i].options[a].score, 0) / answers.length) : null
  })
}
export function getArchetype(scores) {
  const assessed = scores.filter(s => s !== null)
  if (!assessed.length) return { title: 'Your story starts here', description: 'Complete a module to discover your decision-making style.' }
  const average = assessed.reduce((a,b) => a+b, 0) / assessed.length
  if (average >= 80) return { title: 'The Thoughtful Guardian', description: 'You make room for people in technical decisions. You tend to reduce harm, question assumptions, and build trust into the process.' }
  if (average >= 50) return { title: 'The Pragmatic Navigator', description: 'You look for a workable path through competing priorities. Your next step is to check whether a convenient compromise leaves someone carrying the risk.' }
  return { title: 'The Momentum Builder', description: 'You value getting things moving. Practice pausing at the point where speed can shift a hidden cost onto users, creators, or your teammates.' }
}
