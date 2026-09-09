import test from 'node:test'
import assert from 'node:assert/strict'
import { modules } from '../src/data/modules.js'
import { sanitizeProgress, getScores, getArchetype } from '../src/lib/progress.js'

test('unplayed modules are unassessed, not zero', () => {
  assert.deepEqual(getScores({}), [null,null,null,null])
  assert.equal(getArchetype(getScores({})).title, 'Your story starts here')
})
test('each module produces a different profile for contrasting decisions', () => {
  for (const module of modules) {
    const high = module.scenarios.map(s => s.options.findIndex(o=>o.score===Math.max(...s.options.map(x=>x.score))))
    const low = module.scenarios.map(s => s.options.findIndex(o=>o.score===Math.min(...s.options.map(x=>x.score))))
    assert.equal(getArchetype(getScores({[module.id]:high})).title,'The Thoughtful Guardian')
    assert.equal(getArchetype(getScores({[module.id]:low})).title,'The Momentum Builder')
  }
})
test('replay replaces the module score and does not add completion credit', () => {
  const results = {'privacy-shield':[0,0]}
  assert.equal(getScores(results)[0],95)
  results['privacy-shield']=[2,2]
  assert.equal(getScores(results)[0],23)
  assert.equal(Object.keys(results).length,1)
})
test('storage validation rejects partial, unknown, and out-of-range answers', () => {
  assert.deepEqual(sanitizeProgress({results:{'privacy-shield':[0],'bug-bounty':[0,9],'unmasking-ai':['0',0],'unknown':[0,0]}}).results,{})
  assert.deepEqual(sanitizeProgress({results:{'privacy-shield':[0,2]}}).results,{'privacy-shield':[0,2]})
  assert.equal(sanitizeProgress({reflection:'x'.repeat(3000)}).reflection.length,2000)
  for (const invalid of [null,4,'oops',[],{}]) assert.deepEqual(sanitizeProgress(invalid),{results:{},reflection:''})
})
test('all paths provide complete reasoning, consequences and trade-offs', () => {
  for (const module of modules) for (const scenario of module.scenarios) {
    assert.ok(scenario.source.startsWith('https://'))
    for (const option of scenario.options) {
      for (const field of ['label','detail','heading','consequence','reasoning','tradeoff']) assert.ok(option[field]?.length>10,`${module.id}: ${field}`)
      assert.ok(Number.isFinite(option.score) && option.score>=0 && option.score<=100)
    }
  }
})
