export const STATUSES = ['FILED', 'ASSIGNED', 'IN_REVIEW', 'RESOLVED', 'ESCALATED'];

export const STATUS_LABEL = {
  FILED: 'Filed',
  ASSIGNED: 'Assigned',
  IN_REVIEW: 'In Review',
  RESOLVED: 'Resolved',
  ESCALATED: 'Escalated'
};

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const CATEGORIES = [
  'Academic',
  'Hostel & Mess',
  'Facilities & Hygiene',
  'Infrastructure',
  'Administration',
  'Harassment & Safety',
  'IT & Lab Services',
  'Fee & Financial',
  'Other'
];

export const SLA_HOURS = {
  CRITICAL: 24,
  HIGH: 48,
  MEDIUM: 120, // 5 days
  LOW: 168     // 7 days
};

export const TRANSITIONS = {
  FILED: ['ASSIGNED', 'ESCALATED'],
  ASSIGNED: ['IN_REVIEW', 'ESCALATED'],
  IN_REVIEW: ['RESOLVED', 'ESCALATED'],
  ESCALATED: ['ASSIGNED', 'IN_REVIEW', 'RESOLVED'],
  RESOLVED: []
};

export const statusLabel = (status = '') => STATUS_LABEL[status] || status.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

export const canTransition = (from, to) => (TRANSITIONS[from] || []).includes(to);

/**
 * Computes canonical SHA-256 hex string using Web Crypto API.
 * Works seamlessly in Browser window and Node 19+.
 */
export async function sha256Hex(text) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Crypto API (crypto.subtle) is not available');
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Creates canonical string representation of an audit event payload
 */
export function canonicalPayload(eventData) {
  if (typeof eventData === 'string') return eventData;
  const sorted = {};
  Object.keys(eventData || {}).sort().forEach(k => {
    sorted[k] = eventData[k];
  });
  return JSON.stringify(sorted);
}

/**
 * Computes audit block hash from previous hash + canonical event payload
 */
export async function computeAuditHash(previousHash, eventData) {
  const prev = previousHash || 'GENESIS';
  const payload = canonicalPayload(eventData);
  return await sha256Hex(prev + payload);
}

/**
 * Verifies an array of audit events for chain integrity & hash consistency
 */
export async function verifyAuditChain(events = []) {
  if (!events || events.length === 0) {
    return { valid: true, count: 0, reason: 'Empty chain' };
  }

  let expectedPrev = 'GENESIS';
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    const prev = ev.previous_hash || 'GENESIS';

    if (prev !== expectedPrev) {
      return {
        valid: false,
        count: i,
        errorIndex: i,
        reason: `Broken chain link at Block #${i}: Expected previous hash "${expectedPrev.slice(0, 10)}...", but found "${prev.slice(0, 10)}..."`
      };
    }

    const payload = canonicalPayload(ev.event_data);
    const calculatedHash = await sha256Hex(prev + payload);

    if (calculatedHash !== ev.entry_hash) {
      return {
        valid: false,
        count: i,
        errorIndex: i,
        reason: `Cryptographic hash mismatch at Block #${i}: Record payload has been tampered with! Expected ${calculatedHash.slice(0, 12)}..., but stored hash is ${ev.entry_hash.slice(0, 12)}...`
      };
    }

    expectedPrev = ev.entry_hash;
  }

  return {
    valid: true,
    count: events.length,
    reason: `All ${events.length} audit block${events.length === 1 ? '' : 's'} cryptographically verified against SHA-256 chain.`
  };
}

/**
 * Calculates due date based on SLA policy
 */
export function calculateDueAt(priority = 'MEDIUM', baseDate = new Date()) {
  const hours = SLA_HOURS[priority] || 120;
  const due = new Date(baseDate.getTime() + hours * 60 * 60 * 1000);
  return due.toISOString();
}

/**
 * Formats remaining SLA countdown or overdue duration
 */
export function getSLACountdown(dueAt, resolvedAt = null) {
  if (!dueAt) return { isOverdue: false, text: 'No SLA Set', badge: 'neutral', percent: 0 };
  const target = new Date(dueAt).getTime();
  const now = resolvedAt ? new Date(resolvedAt).getTime() : Date.now();
  const diffMs = target - now;

  if (resolvedAt) {
    const wasOverdue = diffMs < 0;
    return {
      isOverdue: wasOverdue,
      text: wasOverdue ? 'Resolved Overdue' : 'Resolved within SLA',
      badge: wasOverdue ? 'warning' : 'success',
      percent: 100
    };
  }

  if (diffMs < 0) {
    const overdueMs = Math.abs(diffMs);
    const hours = Math.floor(overdueMs / (1000 * 60 * 60));
    const mins = Math.floor((overdueMs % (1000 * 60 * 60)) / (1000 * 60));
    return {
      isOverdue: true,
      text: `Overdue by ${hours > 24 ? Math.floor(hours / 24) + 'd ' : ''}${hours % 24}h ${mins}m`,
      badge: 'danger',
      percent: 100
    };
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  let badge = 'success';
  if (hours < 12) badge = 'danger';
  else if (hours < 48) badge = 'warning';

  return {
    isOverdue: false,
    text: `${hours > 24 ? Math.floor(hours / 24) + 'd ' : ''}${hours % 24}h ${mins}m remaining`,
    badge,
    percent: Math.max(5, Math.min(95, Math.round((1 - (diffMs / (168 * 60 * 60 * 1000))) * 100)))
  };
}
