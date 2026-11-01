/**
 * Cute Cat Bubble Shooter - CLI Test Runner (Node.js)
 */

import { runAllTests } from './unit-tests.js';

class CliReporter {
  constructor() {
    this.total = 0;
    this.passed = 0;
    this.failed = 0;
  }

  suite(name) {
    console.log(`\n\x1b[1m\x1b[36m--- ${name} ---\x1b[0m`);
  }

  test(desc, fn) {
    this.total++;
    try {
      fn();
      this.passed++;
      console.log(`  \x1b[32m✔ PASS\x1b[0m ${desc}`);
    } catch (err) {
      this.failed++;
      console.log(`  \x1b[31m✖ FAIL\x1b[0m ${desc}`);
      console.log(`    \x1b[31mError: ${err.message}\x1b[0m`);
    }
  }

  assertEqual(actual, expected, msg) {
    if (actual !== expected) {
      throw new Error(`${msg || 'Assertion failed'}: expected [${expected}], got [${actual}]`);
    }
  }

  assertTrue(val, msg) {
    if (!val) {
      throw new Error(`${msg || 'Assertion failed'}: expected true, got [${val}]`);
    }
  }

  assertFalse(val, msg) {
    if (val) {
      throw new Error(`${msg || 'Assertion failed'}: expected false, got [${val}]`);
    }
  }
}

async function run() {
  console.log('\x1b[1mStarting Unit Tests execution...\x1b[0m');
  const reporter = new CliReporter();
  await runAllTests(reporter);

  console.log('\n========================================');
  console.log(`Total: ${reporter.total} | Passed: \x1b[32m${reporter.passed}\x1b[0m | Failed: \x1b[31m${reporter.failed}\x1b[0m`);
  console.log('========================================\n');

  if (reporter.failed > 0) {
    process.exit(1);
  }
}

run();
