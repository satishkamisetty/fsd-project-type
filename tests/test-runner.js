/**
 * ZenZone Automated Verification & Unit Test Suite
 * Tests core timer algorithms, 4-4-4-4 breathing cycle state machine,
 * stress trend calculations, and backend input sanitization.
 */

const {
  sanitizeString,
  validateMoodPayload,
  validateSessionPayload,
  validateCalmWallPayload,
  validateSosLogPayload
} = require('../server/validation');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failedTests++;
  }
}

function assertEqual(actual, expected, testName) {
  if (actual === expected) {
    console.log(`  ✓ ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${testName} (Expected: ${expected}, Got: ${actual})`);
    failedTests++;
  }
}

console.log('\n==============================================');
console.log('🧪 RUNNING ZENZONE AUTOMATED UNIT TEST SUITE');
console.log('==============================================\n');

// ----------------------------------------------------
// 1. Box Breathing (4-4-4-4) State Machine Tests
// ----------------------------------------------------
console.log('--- 1. Box Breathing State Machine ---');

class BreathingEngine {
  constructor() {
    this.phaseDuration = 4; // 4 seconds per phase
    this.currentPhaseIndex = 0; // 0: Inhale, 1: Hold In, 2: Exhale, 3: Hold Out
    this.phases = ['Inhale', 'Hold In', 'Exhale', 'Hold Out'];
    this.secondsInPhase = 0;
    this.completedCycles = 0;
  }

  tick() {
    this.secondsInPhase++;
    if (this.secondsInPhase >= this.phaseDuration) {
      this.secondsInPhase = 0;
      this.currentPhaseIndex = (this.currentPhaseIndex + 1) % 4;
      if (this.currentPhaseIndex === 0) {
        this.completedCycles++;
      }
    }
    return {
      phase: this.phases[this.currentPhaseIndex],
      phaseIndex: this.currentPhaseIndex,
      secondsRemaining: this.phaseDuration - this.secondsInPhase,
      progress: (this.secondsInPhase / this.phaseDuration) * 100,
      completedCycles: this.completedCycles
    };
  }
}

const engine = new BreathingEngine();
assertEqual(engine.phases[engine.currentPhaseIndex], 'Inhale', 'Initial phase is Inhale');

// Simulate 4 seconds of Inhale
for (let i = 0; i < 3; i++) engine.tick();
let state = engine.tick();
assertEqual(state.phase, 'Hold In', 'Transitions to Hold In after 4 seconds');

// Simulate 4 seconds of Hold In
for (let i = 0; i < 4; i++) state = engine.tick();
assertEqual(state.phase, 'Exhale', 'Transitions to Exhale after 8 seconds');

// Simulate 4 seconds of Exhale
for (let i = 0; i < 4; i++) state = engine.tick();
assertEqual(state.phase, 'Hold Out', 'Transitions to Hold Out after 12 seconds');

// Simulate 4 seconds of Hold Out -> Completes 1 full cycle
for (let i = 0; i < 4; i++) state = engine.tick();
assertEqual(state.phase, 'Inhale', 'Loops back to Inhale after 16 seconds');
assertEqual(state.completedCycles, 1, 'Increments completed cycle counter to 1');


// ----------------------------------------------------
// 2. Meditation Countdown Timer Formatting Tests
// ----------------------------------------------------
console.log('\n--- 2. Meditation Countdown Timer Formatting ---');

function formatTimer(totalSeconds) {
  if (totalSeconds < 0) totalSeconds = 0;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

assertEqual(formatTimer(300), '05:00', 'Formats 5 minutes correctly');
assertEqual(formatTimer(65), '01:05', 'Formats 65 seconds with leading zero');
assertEqual(formatTimer(0), '00:00', 'Formats 0 seconds correctly');
assertEqual(formatTimer(600), '10:00', 'Formats 10 minutes correctly');


// ----------------------------------------------------
// 3. Daily Mood & Stress Journal Analytics Tests
// ----------------------------------------------------
console.log('\n--- 3. Mood & Stress Journal Analytics ---');

function computeAverageStress(entries) {
  if (!entries || entries.length === 0) return 0;
  const sum = entries.reduce((acc, curr) => acc + curr.stressLevel, 0);
  return Number((sum / entries.length).toFixed(1));
}

const sampleMoods = [
  { stressLevel: 5 },
  { stressLevel: 4 },
  { stressLevel: 3 },
  { stressLevel: 2 },
  { stressLevel: 1 }
];

assertEqual(computeAverageStress(sampleMoods), 3.0, 'Computes correct average stress rating');
assertEqual(computeAverageStress([]), 0, 'Handles empty mood array safely');


// ----------------------------------------------------
// 4. Security, Input Validation & Sanitization Tests
// ----------------------------------------------------
console.log('\n--- 4. Security & Sanitization Validation ---');

// XSS Sanitization
const dirtyInput = '<script>alert("hack")</script>';
const cleanInput = sanitizeString(dirtyInput);
assert(!cleanInput.includes('<script>'), 'Strips opening script tag');
assert(cleanInput.includes('&lt;script&gt;'), 'Properly encodes HTML entities for XSS prevention');

// Mood Payload Validation
const validMood = validateMoodPayload({
  stressLevel: 3,
  mood: 'calm',
  notes: 'Studied for 2 hours with clear mind.',
  tags: ['study', 'rest']
});
assert(validMood.isValid, 'Accepts valid mood entry payload');
assertEqual(validMood.sanitized.stressLevel, 3, 'Preserves numeric stress level');

// Invalid stress level (out of bounds)
const invalidMoodHigh = validateMoodPayload({ stressLevel: 8, mood: 'calm' });
assert(!invalidMoodHigh.isValid, 'Rejects stress level greater than 5');

const invalidMoodZero = validateMoodPayload({ stressLevel: 0, mood: 'calm' });
assert(!invalidMoodZero.isValid, 'Rejects stress level less than 1');

// SOS Mode Pre/Post Stress Delta
const validSos = validateSosLogPayload({
  preStress: 5,
  postStress: 2,
  reflection: 'Felt immediate physical calm.'
});
assert(validSos.isValid, 'Accepts valid SOS de-escalation entry');
assertEqual(validSos.sanitized.stressDelta, 3, 'Correctly computes stress drop delta');

// Campus Calm Wall Character Bounds
const shortWall = validateCalmWallPayload({ message: 'hi' });
assert(!shortWall.isValid, 'Rejects calm wall message shorter than 3 characters');

const validWall = validateCalmWallPayload({
  author: 'Final Year Student',
  message: 'You have solved harder challenges than this exam!',
  tag: 'Motivation'
});
assert(validWall.isValid, 'Accepts valid calm wall submission');

// ----------------------------------------------------
// Summary
// ----------------------------------------------------
console.log('\n==============================================');
console.log(`Results: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('==============================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 All automated tests passed successfully!\n');
}
