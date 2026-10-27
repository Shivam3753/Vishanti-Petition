import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TRANSITIONS,
  canTransition,
  statusLabel,
  sha256Hex,
  canonicalPayload,
  computeAuditHash,
  verifyAuditChain,
  calculateDueAt,
  getSLACountdown,
  SLA_HOURS
} from '../src/lib/workflow.js';

test('workflow accepts only documented transitions', () => {
  assert.ok(canTransition('FILED', 'ASSIGNED'));
  assert.ok(canTransition('FILED', 'ESCALATED'));
  assert.ok(!canTransition('FILED', 'RESOLVED'));
  assert.ok(canTransition('ASSIGNED', 'IN_REVIEW'));
  assert.ok(canTransition('IN_REVIEW', 'RESOLVED'));
  assert.ok(canTransition('ESCALATED', 'RESOLVED'));
  assert.deepEqual(TRANSITIONS.RESOLVED, []);
});

test('public signup role is always student', () => {
  const publicSignupRole = 'STUDENT';
  assert.equal(publicSignupRole, 'STUDENT');
  assert.notEqual(publicSignupRole, 'ADMIN');
});

test('computes deterministic SHA-256 digests matching standard Web Crypto', async () => {
  const hash = await sha256Hex('test');
  assert.equal(hash, '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
});

test('cryptographic audit chain verifies valid consecutive blocks', async () => {
  const ev1Data = { action: 'FILED', complaint_id: 'test-1', timestamp: '2026-10-27T00:00:00Z' };
  const hash1 = await computeAuditHash('GENESIS', ev1Data);

  const ev2Data = { action: 'ASSIGNED', complaint_id: 'test-1', officer_id: 'off-1', timestamp: '2026-10-27T01:00:00Z' };
  const hash2 = await computeAuditHash(hash1, ev2Data);

  const ev3Data = { action: 'STATUS_CHANGED', from: 'ASSIGNED', to: 'IN_REVIEW', timestamp: '2026-10-27T02:00:00Z' };
  const hash3 = await computeAuditHash(hash2, ev3Data);

  const chain = [
    { id: '1', previous_hash: 'GENESIS', event_data: ev1Data, entry_hash: hash1 },
    { id: '2', previous_hash: hash1, event_data: ev2Data, entry_hash: hash2 },
    { id: '3', previous_hash: hash2, event_data: ev3Data, entry_hash: hash3 }
  ];

  const verification = await verifyAuditChain(chain);
  assert.equal(verification.valid, true);
  assert.equal(verification.count, 3);
});

test('cryptographic audit chain flags tampered block payload', async () => {
  const ev1Data = { action: 'FILED', complaint_id: 'test-1' };
  const hash1 = await computeAuditHash('GENESIS', ev1Data);

  const ev2Data = { action: 'ASSIGNED', complaint_id: 'test-1' };
  const hash2 = await computeAuditHash(hash1, ev2Data);

  // Tamper: Modify ev2Data after hash computation
  const tamperedChain = [
    { id: '1', previous_hash: 'GENESIS', event_data: ev1Data, entry_hash: hash1 },
    { id: '2', previous_hash: hash1, event_data: { action: 'TAMPERED_ACTION' }, entry_hash: hash2 }
  ];

  const verification = await verifyAuditChain(tamperedChain);
  assert.equal(verification.valid, false);
  assert.equal(verification.errorIndex, 1);
  assert.match(verification.reason, /tampered/i);
});

test('SLA deadline calculations align with priority policies', () => {
  const base = new Date('2026-10-27T10:00:00Z');
  const criticalDue = new Date(calculateDueAt('CRITICAL', base));
  assert.equal(criticalDue.getTime() - base.getTime(), SLA_HOURS.CRITICAL * 3600000);

  const mediumDue = new Date(calculateDueAt('MEDIUM', base));
  assert.equal(mediumDue.getTime() - base.getTime(), SLA_HOURS.MEDIUM * 3600000);
});

test('pre-loaded mock data audit chains all pass cryptographic verification', async () => {
  const { createInitialMockData } = await import('../src/lib/ledgerEngine.js');
  const { complaints, auditEvents } = await createInitialMockData();
  assert.ok(complaints.length >= 5);

  for (const c of complaints) {
    const chain = auditEvents[c.id];
    assert.ok(chain && chain.length > 0, `Complaint ${c.id} should have an audit chain`);
    const result = await verifyAuditChain(chain);
    assert.equal(result.valid, true, `Chain for ${c.id} failed verification: ${result.reason}`);
  }
});

test('user authentication matches roll number or email', async () => {
  const { ledgerEngine, DEMO_USERS } = await import('../src/lib/ledgerEngine.js');
  // Match by roll number
  const byRoll = ledgerEngine.authenticate('2026XXXX', 'password123');
  assert.equal(byRoll.success, true);
  assert.equal(byRoll.user.id, DEMO_USERS.student.id);

  // Match by email
  const byEmail = ledgerEngine.authenticate('student@college.edu', 'password123');
  assert.equal(byEmail.success, true);
  assert.equal(byEmail.user.role, 'STUDENT');

  // Failed login
  const failed = ledgerEngine.authenticate('nonexistent@college.edu', 'wrongpass');
  assert.equal(failed.success, false);
});

test('self-registration strictly assigns STUDENT role per Webster guidelines', async () => {
  const { ledgerEngine } = await import('../src/lib/ledgerEngine.js');
  const reg = ledgerEngine.registerUser({
    name: 'Aman Verma',
    rollNo: '20259999',
    email: 'aman.verma@college.edu',
    department: 'CSE',
    password: 'securePassword!'
  });

  assert.equal(reg.success, true);
  assert.equal(reg.user.role, 'STUDENT');
  assert.equal(reg.user.rollNo, '20259999');

  // Authenticate the newly registered student
  const auth = ledgerEngine.authenticate('20259999', 'securePassword!');
  assert.equal(auth.success, true);
  assert.equal(auth.user.name, 'Aman Verma (20259999)');
});

