import {
  STATUSES,
  PRIORITIES,
  CATEGORIES,
  SLA_HOURS,
  TRANSITIONS,
  canTransition,
  calculateDueAt,
  computeAuditHash,
  verifyAuditChain,
  canonicalPayload,
  sha256Hex
} from './workflow.js';

export const DEMO_USERS = {
  student: {
    id: 'usr-student-demo',
    name: 'Student Demo (2026XXXX)',
    rollNo: '2026XXXX',
    email: 'student@college.edu',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    avatar: '👨‍🎓',
    password: 'password123'
  },
  officer: {
    id: 'usr-officer-demo',
    name: 'Grievance Redressal Officer',
    rollNo: 'GRO-2026',
    email: 'officer@college.edu',
    role: 'OFFICER',
    department: 'Grievance Redressal Cell',
    avatar: '🛡️',
    password: 'password123'
  },
  warden: {
    id: 'usr-officer-warden',
    name: 'Chief Warden & Estate Officer',
    rollNo: 'WARDEN-01',
    email: 'warden@college.edu',
    role: 'OFFICER',
    department: 'Hostel Affairs & Estate Maintenance',
    avatar: '🏠',
    password: 'password123'
  },
  officer_academic: {
    id: 'usr-officer-desai',
    name: 'Academic Deanery Officer',
    rollNo: 'FAC-9912',
    email: 'anita.desai@college.edu',
    role: 'OFFICER',
    department: 'Academic Grievance Deanery',
    avatar: '👩‍🏫',
    password: 'password123'
  },
  finance: {
    id: 'usr-officer-finance',
    name: 'Accounts & Scholarship Officer',
    rollNo: 'FIN-2026',
    email: 'finance@college.edu',
    role: 'OFFICER',
    department: 'Finance, Fees & Scholarships',
    avatar: '💳',
    password: 'password123'
  },
  icc: {
    id: 'usr-officer-icc',
    name: 'ICC & Gender Grievance Lead',
    rollNo: 'ICC-01',
    email: 'icc@college.edu',
    role: 'OFFICER',
    department: 'Internal Complaints Committee (ICC)',
    avatar: '⚖️',
    password: 'password123'
  },
  proctor: {
    id: 'usr-proctor-demo',
    name: 'Chief Proctor',
    rollNo: 'PROCTOR-01',
    email: 'proctor@college.edu',
    role: 'ADMIN',
    department: 'Proctorial Board & Disciplinary Oversight',
    avatar: '⚖️',
    password: 'password123'
  },
  admin: {
    id: 'usr-admin-demo',
    name: 'System Administrator',
    rollNo: 'ADMIN-01',
    email: 'admin@college.edu',
    role: 'ADMIN',
    department: 'IT Systems & Cryptographic Audit',
    avatar: '🏛️',
    password: 'password123'
  }
};

const STORAGE_KEY_PREFIX = 'vishanti_ledger_v2_';
const memoryStorage = {};

function getStorage(key, defaultVal) {
  try {
    if (typeof window === 'undefined') {
      return memoryStorage[key] !== undefined ? memoryStorage[key] : defaultVal;
    }
    const item = window.localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    console.warn('Storage read failed', e);
    return defaultVal;
  }
}

function setStorage(key, val) {
  try {
    if (typeof window === 'undefined') {
      memoryStorage[key] = val;
      return;
    }
    window.localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    console.warn('Storage write failed', e);
  }
}

// Generate base mock complaints and their audit chains
export async function createInitialMockData() {
  const baseTime = Date.now() - 4 * 86400000; // 4 days ago
  const t = offsetHours => new Date(baseTime + offsetHours * 3600000).toISOString();

  // Case 1: Hostel Water Purifier (In Review)
  const c1Id = 'c-hostel-water-01';
  const c1Created = t(0);
  const c1Due = new Date(new Date(c1Created).getTime() + 48 * 3600000).toISOString();
  const c1Ev0Data = { action: 'FILED', complaint_id: c1Id, submitter_id: DEMO_USERS.student.id, at: c1Created };
  const c1Hash0 = await computeAuditHash('GENESIS', c1Ev0Data);

  const c1AssignedAt = t(4);
  const c1Ev1Data = { action: 'ASSIGNED', complaint_id: c1Id, actor_id: DEMO_USERS.officer.id, officer_id: DEMO_USERS.warden.id, at: c1AssignedAt, remarks: 'Assigned to Chief Warden & Estate Maintenance Division' };
  const c1Hash1 = await computeAuditHash(c1Hash0, c1Ev1Data);

  const c1ReviewAt = t(12);
  const c1Ev2Data = { action: 'STATUS_CHANGED', complaint_id: c1Id, actor_id: DEMO_USERS.warden.id, from: 'ASSIGNED', to: 'IN_REVIEW', at: c1ReviewAt, note: 'Plumber inspected filter unit; replacement RO membrane ordered.' };
  const c1Hash2 = await computeAuditHash(c1Hash1, c1Ev2Data);

  // Case 2: Academic Exam Marks (Assigned)
  const c2Id = 'c-academic-grade-02';
  const c2Created = t(16);
  const c2Due = new Date(new Date(c2Created).getTime() + 120 * 3600000).toISOString();
  const c2Ev0Data = { action: 'FILED', complaint_id: c2Id, submitter_id: DEMO_USERS.student.id, at: c2Created };
  const c2Hash0 = await computeAuditHash('GENESIS', c2Ev0Data);

  const c2AssignedAt = t(24);
  const c2Ev1Data = { action: 'ASSIGNED', complaint_id: c2Id, actor_id: DEMO_USERS.admin.id, officer_id: DEMO_USERS.officer_academic.id, at: c2AssignedAt, remarks: 'Forwarded to Examination Cell Controller' };
  const c2Hash1 = await computeAuditHash(c2Hash0, c2Ev1Data);

  // Case 3: Street Lighting / Safety (Resolved)
  const c3Id = 'c-safety-lighting-03';
  const c3Created = t(30);
  const c3Due = new Date(new Date(c3Created).getTime() + 24 * 3600000).toISOString();
  const c3Ev0Data = { action: 'FILED', complaint_id: c3Id, submitter_id: DEMO_USERS.student.id, at: c3Created };
  const c3Hash0 = await computeAuditHash('GENESIS', c3Ev0Data);

  const c3AssignedAt = t(32);
  const c3Ev1Data = { action: 'ASSIGNED', complaint_id: c3Id, actor_id: DEMO_USERS.admin.id, officer_id: DEMO_USERS.proctor.id, at: c3AssignedAt, remarks: 'Assigned to Security & Proctorial Oversight Division' };
  const c3Hash1 = await computeAuditHash(c3Hash0, c3Ev1Data);

  const c3ReviewAt = t(35);
  const c3Ev2Data = { action: 'STATUS_CHANGED', complaint_id: c3Id, actor_id: DEMO_USERS.proctor.id, from: 'ASSIGNED', to: 'IN_REVIEW', at: c3ReviewAt, note: 'Electrician dispatched with spare LED fixtures' };
  const c3Hash2 = await computeAuditHash(c3Hash1, c3Ev2Data);

  const c3ResolvedAt = t(44);
  const c3Ev3Data = { action: 'STATUS_CHANGED', complaint_id: c3Id, actor_id: DEMO_USERS.proctor.id, from: 'IN_REVIEW', to: 'RESOLVED', at: c3ResolvedAt, note: 'All 6 corridor luminaires replaced and verified operational.' };
  const c3Hash3 = await computeAuditHash(c3Hash2, c3Ev3Data);

  // Case 4: Wi-Fi Gateway Outage (Filed)
  const c4Id = 'c-it-wifi-04';
  const c4Created = t(50);
  const c4Due = new Date(new Date(c4Created).getTime() + 168 * 3600000).toISOString();
  const c4Ev0Data = { action: 'FILED', complaint_id: c4Id, submitter_id: DEMO_USERS.student.id, at: c4Created };
  const c4Hash0 = await computeAuditHash('GENESIS', c4Ev0Data);

  // Case 5: Fee Concession Delay (Escalated)
  const c5Id = 'c-finance-fee-05';
  const c5Created = t(2); // older, overdue
  const c5Due = new Date(new Date(c5Created).getTime() + 48 * 3600000).toISOString();
  const c5Ev0Data = { action: 'FILED', complaint_id: c5Id, submitter_id: DEMO_USERS.student.id, at: c5Created };
  const c5Hash0 = await computeAuditHash('GENESIS', c5Ev0Data);

  const c5AssignedAt = t(10);
  const c5Ev1Data = { action: 'ASSIGNED', complaint_id: c5Id, actor_id: DEMO_USERS.admin.id, officer_id: DEMO_USERS.finance.id, at: c5AssignedAt, remarks: 'Assigned to Accounts & Scholarship Desk' };
  const c5Hash1 = await computeAuditHash(c5Hash0, c5Ev1Data);

  const c5EscalateAt = t(55);
  const c5Ev2Data = { action: 'STATUS_CHANGED', complaint_id: c5Id, actor_id: DEMO_USERS.admin.id, from: 'ASSIGNED', to: 'ESCALATED', at: c5EscalateAt, note: 'SLA exceeded without resolution. Escalated to Proctorial Oversight.' };
  const c5Hash2 = await computeAuditHash(c5Hash1, c5Ev2Data);

  const complaints = [
    {
      id: c1Id,
      tracking_code: 'VP-H4890A',
      title: 'Hostel 4 Ground Floor RO Water Purifier Malfunctioning',
      description: 'The drinking water dispenser in Block B has had murky sediment and foul odor for 3 days. Multiple residents reported throat irritation. Urgent maintenance requested.',
      category: 'Hostel & Mess',
      priority: 'HIGH',
      status: 'IN_REVIEW',
      is_anonymous: false,
      submitted_by: DEMO_USERS.student.id,
      submitter_name: DEMO_USERS.student.name,
      assigned_officer: DEMO_USERS.warden.id,
      created_at: c1Created,
      due_at: c1Due,
      resolved_at: null,
      attachment: { name: 'water_sample_photo.jpg', size: '1.4 MB', type: 'image/jpeg' }
    },
    {
      id: c2Id,
      tracking_code: 'VP-AC302B',
      title: 'Discrepancy in CS302 Database Systems Midterm Evaluation',
      description: 'Question 4 rubric marks (8 points) were omitted during portal marks compilation despite correct query schema execution. Grade card shows 64 instead of 72.',
      category: 'Academic',
      priority: 'MEDIUM',
      status: 'ASSIGNED',
      is_anonymous: false,
      submitted_by: DEMO_USERS.student.id,
      submitter_name: DEMO_USERS.student.name,
      assigned_officer: DEMO_USERS.officer_academic.id,
      created_at: c2Created,
      due_at: c2Due,
      resolved_at: null,
      attachment: { name: 'answer_sheet_page3.pdf', size: '2.8 MB', type: 'application/pdf' }
    },
    {
      id: c3Id,
      tracking_code: 'VP-SF7710',
      title: 'Main Pathway Street Lighting Complete Failure Near Library',
      description: 'The pedestrian stretch between Academic Block C and Central Library is completely dark after 7:30 PM due to blown circuit fuses, posing severe safety hazards.',
      category: 'Harassment & Safety',
      priority: 'CRITICAL',
      status: 'RESOLVED',
      is_anonymous: true,
      submitted_by: DEMO_USERS.student.id,
      submitter_name: 'Anonymous Student',
      assigned_officer: DEMO_USERS.proctor.id,
      created_at: c3Created,
      due_at: c3Due,
      resolved_at: c3ResolvedAt,
      attachment: null
    },
    {
      id: c4Id,
      tracking_code: 'VP-IT9021',
      title: 'Central Library 2nd Floor Access Point Continual Disconnects',
      description: 'Wi-Fi AP "EDUROAM-LIB2F" keeps resetting every 15 minutes, aborting research downloads and online journal access during study hours.',
      category: 'IT & Lab Services',
      priority: 'LOW',
      status: 'FILED',
      is_anonymous: false,
      submitted_by: DEMO_USERS.student.id,
      submitter_name: DEMO_USERS.student.name,
      assigned_officer: null,
      created_at: c4Created,
      due_at: c4Due,
      resolved_at: null,
      attachment: { name: 'ping_latency_log.txt', size: '42 KB', type: 'text/plain' }
    },
    {
      id: c5Id,
      tracking_code: 'VP-FN4402',
      title: 'Merit-Cum-Means Scholarship Tuition Concession Uncredited',
      description: 'Approval letter was verified in September, but the tuition fee portal still reflects full semester dues with late penalty threats.',
      category: 'Fee & Financial',
      priority: 'HIGH',
      status: 'ESCALATED',
      is_anonymous: false,
      submitted_by: DEMO_USERS.student.id,
      submitter_name: DEMO_USERS.student.name,
      assigned_officer: DEMO_USERS.finance.id,
      created_at: c5Created,
      due_at: c5Due,
      resolved_at: null,
      attachment: { name: 'scholarship_sanction.pdf', size: '1.1 MB', type: 'application/pdf' }
    }
  ];

  const auditEvents = {
    [c1Id]: [
      { id: 'ev-1-0', complaint_id: c1Id, actor_id: DEMO_USERS.student.id, actor_name: DEMO_USERS.student.name, action: 'FILED', event_data: c1Ev0Data, previous_hash: 'GENESIS', entry_hash: c1Hash0, created_at: c1Created },
      { id: 'ev-1-1', complaint_id: c1Id, actor_id: DEMO_USERS.officer.id, actor_name: DEMO_USERS.officer.name, action: 'ASSIGNED', event_data: c1Ev1Data, previous_hash: c1Hash0, entry_hash: c1Hash1, created_at: c1AssignedAt },
      { id: 'ev-1-2', complaint_id: c1Id, actor_id: DEMO_USERS.officer.id, actor_name: DEMO_USERS.officer.name, action: 'STATUS_CHANGED', event_data: c1Ev2Data, previous_hash: c1Hash1, entry_hash: c1Hash2, created_at: c1ReviewAt }
    ],
    [c2Id]: [
      { id: 'ev-2-0', complaint_id: c2Id, actor_id: DEMO_USERS.student.id, actor_name: DEMO_USERS.student.name, action: 'FILED', event_data: c2Ev0Data, previous_hash: 'GENESIS', entry_hash: c2Hash0, created_at: c2Created },
      { id: 'ev-2-1', complaint_id: c2Id, actor_id: DEMO_USERS.admin.id, actor_name: DEMO_USERS.admin.name, action: 'ASSIGNED', event_data: c2Ev1Data, previous_hash: c2Hash0, entry_hash: c2Hash1, created_at: c2AssignedAt }
    ],
    [c3Id]: [
      { id: 'ev-3-0', complaint_id: c3Id, actor_id: DEMO_USERS.student.id, actor_name: DEMO_USERS.student.name, action: 'FILED', event_data: c3Ev0Data, previous_hash: 'GENESIS', entry_hash: c3Hash0, created_at: c3Created },
      { id: 'ev-3-1', complaint_id: c3Id, actor_id: DEMO_USERS.admin.id, actor_name: DEMO_USERS.admin.name, action: 'ASSIGNED', event_data: c3Ev1Data, previous_hash: c3Hash0, entry_hash: c3Hash1, created_at: c3AssignedAt },
      { id: 'ev-3-2', complaint_id: c3Id, actor_id: DEMO_USERS.officer.id, actor_name: DEMO_USERS.officer.name, action: 'STATUS_CHANGED', event_data: c3Ev2Data, previous_hash: c3Hash1, entry_hash: c3Hash2, created_at: c3ReviewAt },
      { id: 'ev-3-3', complaint_id: c3Id, actor_id: DEMO_USERS.officer.id, actor_name: DEMO_USERS.officer.name, action: 'STATUS_CHANGED', event_data: c3Ev3Data, previous_hash: c3Hash2, entry_hash: c3Hash3, created_at: c3ResolvedAt }
    ],
    [c4Id]: [
      { id: 'ev-4-0', complaint_id: c4Id, actor_id: DEMO_USERS.student.id, actor_name: DEMO_USERS.student.name, action: 'FILED', event_data: c4Ev0Data, previous_hash: 'GENESIS', entry_hash: c4Hash0, created_at: c4Created }
    ],
    [c5Id]: [
      { id: 'ev-5-0', complaint_id: c5Id, actor_id: DEMO_USERS.student.id, actor_name: DEMO_USERS.student.name, action: 'FILED', event_data: c5Ev0Data, previous_hash: 'GENESIS', entry_hash: c5Hash0, created_at: c5Created },
      { id: 'ev-5-1', complaint_id: c5Id, actor_id: DEMO_USERS.admin.id, actor_name: DEMO_USERS.admin.name, action: 'ASSIGNED', event_data: c5Ev1Data, previous_hash: c5Hash0, entry_hash: c5Hash1, created_at: c5AssignedAt },
      { id: 'ev-5-2', complaint_id: c5Id, actor_id: DEMO_USERS.admin.id, actor_name: DEMO_USERS.admin.name, action: 'STATUS_CHANGED', event_data: c5Ev2Data, previous_hash: c5Hash1, entry_hash: c5Hash2, created_at: c5EscalateAt }
    ]
  };

  const notifications = [
    {
      id: 'notif-1',
      recipient_id: DEMO_USERS.student.id,
      complaint_id: c1Id,
      message: 'Your petition VP-H4890A has been assigned to Grievance Redressal Officer.',
      created_at: c1AssignedAt,
      read_at: null
    },
    {
      id: 'notif-2',
      recipient_id: DEMO_USERS.student.id,
      complaint_id: c3Id,
      message: 'Your petition VP-SF7710 has been RESOLVED. All luminaires replaced.',
      created_at: c3ResolvedAt,
      read_at: c3ResolvedAt
    },
    {
      id: 'notif-3',
      recipient_id: DEMO_USERS.student.id,
      complaint_id: c5Id,
      message: 'Notice: Petition VP-FN4402 has been ESCALATED due to SLA deadline.',
      created_at: c5EscalateAt,
      read_at: null
    }
  ];

  return { complaints, auditEvents, notifications };
}

/**
 * State store managing simulated ledger database
 */
class SandboxLedger {
  constructor() {
    this.initialized = false;
    this.complaints = [];
    this.auditEvents = {};
    this.notifications = [];
    this.tamperedEvents = {};
  }

  async init() {
    if (this.initialized) return;
    const storedComplaints = getStorage('complaints', null);
    const storedAudit = getStorage('audit', null);
    const storedNotifs = getStorage('notifications', null);

    if (storedComplaints && storedAudit) {
      this.complaints = storedComplaints;
      this.auditEvents = storedAudit;
      this.notifications = storedNotifs || [];
      this.initialized = true;
    } else {
      const initial = await createInitialMockData();
      this.complaints = initial.complaints;
      this.auditEvents = initial.auditEvents;
      this.notifications = initial.notifications;
      this.persist();
      this.initialized = true;
    }
  }

  persist() {
    setStorage('complaints', this.complaints);
    setStorage('audit', this.auditEvents);
    setStorage('notifications', this.notifications);
  }

  async reset() {
    const initial = await createInitialMockData();
    this.complaints = initial.complaints;
    this.auditEvents = initial.auditEvents;
    this.notifications = initial.notifications;
    this.tamperedEvents = {};
    this.persist();
  }

  getComplaints(user) {
    if (!user) return [];
    if (['OFFICER', 'ADMIN'].includes(user.role)) {
      return [...this.complaints];
    }
    return this.complaints.filter(c => c.submitted_by === user.id);
  }

  getComplaint(id) {
    return this.complaints.find(c => c.id === id) || null;
  }

  getAuditEvents(complaintId) {
    if (this.tamperedEvents[complaintId]) {
      return this.tamperedEvents[complaintId];
    }
    return this.auditEvents[complaintId] || [];
  }

  async fileComplaint({ submitter, title, description, category, priority, is_anonymous, attachment }) {
    await this.init();
    const id = 'c-' + Date.now();
    const codeNumber = Math.random().toString(36).substring(2, 7).toUpperCase();
    const tracking_code = `VP-${codeNumber}`;
    const now = new Date().toISOString();
    const due_at = calculateDueAt(priority, new Date());

    const newComplaint = {
      id,
      tracking_code,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: 'FILED',
      is_anonymous: Boolean(is_anonymous),
      submitted_by: submitter.id,
      submitter_name: is_anonymous ? 'Anonymous Student' : submitter.name,
      assigned_officer: null,
      created_at: now,
      due_at,
      resolved_at: null,
      attachment: attachment || null
    };

    const ev0Data = {
      action: 'FILED',
      complaint_id: id,
      submitter_id: submitter.id,
      category,
      priority,
      at: now
    };
    const hash0 = await computeAuditHash('GENESIS', ev0Data);

    const genesisEvent = {
      id: `ev-${id}-0`,
      complaint_id: id,
      actor_id: submitter.id,
      actor_name: submitter.name,
      action: 'FILED',
      event_data: ev0Data,
      previous_hash: 'GENESIS',
      entry_hash: hash0,
      created_at: now
    };

    this.complaints.unshift(newComplaint);
    this.auditEvents[id] = [genesisEvent];

    this.notifications.unshift({
      id: 'notif-' + Date.now(),
      recipient_id: submitter.id,
      complaint_id: id,
      message: `Your petition ${tracking_code} was filed into the tamper-evident ledger.`,
      created_at: now,
      read_at: null
    });

    this.persist();
    return newComplaint;
  }

  async assignComplaint({ complaintId, officerId, actor, remarks }) {
    await this.init();
    if (!['OFFICER', 'ADMIN'].includes(actor.role)) {
      throw new Error('Only authorized staff or admins can assign complaints');
    }

    const complaint = this.complaints.find(c => c.id === complaintId);
    if (!complaint) throw new Error('Complaint not found');

    const officer = Object.values(DEMO_USERS).find(u => u.id === officerId);
    if (!officer) throw new Error('Officer not found in staff directory');

    const now = new Date().toISOString();
    const chain = this.auditEvents[complaintId] || [];
    const prevHash = chain.length > 0 ? chain[chain.length - 1].entry_hash : 'GENESIS';

    const evData = {
      action: 'ASSIGNED',
      complaint_id: complaintId,
      actor_id: actor.id,
      officer_id: officer.id,
      remarks: remarks || 'Assigned by authorized staff',
      at: now
    };
    const newHash = await computeAuditHash(prevHash, evData);

    complaint.assigned_officer = officer.id;
    if (complaint.status === 'FILED') {
      complaint.status = 'ASSIGNED';
    }

    const event = {
      id: `ev-${complaintId}-${chain.length}`,
      complaint_id: complaintId,
      actor_id: actor.id,
      actor_name: actor.name,
      action: 'ASSIGNED',
      event_data: evData,
      previous_hash: prevHash,
      entry_hash: newHash,
      created_at: now
    };

    chain.push(event);
    this.auditEvents[complaintId] = chain;

    this.notifications.unshift({
      id: 'notif-' + Date.now() + '-1',
      recipient_id: complaint.submitted_by,
      complaint_id: complaintId,
      message: `Petition ${complaint.tracking_code} was assigned to ${officer.name}.`,
      created_at: now,
      read_at: null
    });

    this.notifications.unshift({
      id: 'notif-' + Date.now() + '-2',
      recipient_id: officer.id,
      complaint_id: complaintId,
      message: `New case assigned: ${complaint.tracking_code} (${complaint.title}).`,
      created_at: now,
      read_at: null
    });

    this.persist();
    return complaint;
  }

  async transitionComplaint({ complaintId, newStatus, actor, note }) {
    await this.init();
    if (!['OFFICER', 'ADMIN'].includes(actor.role)) {
      throw new Error('Only authorized staff or admins can transition workflow status');
    }

    const complaint = this.complaints.find(c => c.id === complaintId);
    if (!complaint) throw new Error('Complaint not found');

    if (!canTransition(complaint.status, newStatus)) {
      throw new Error(`State machine violation: Transition from ${complaint.status} to ${newStatus} is rejected.`);
    }

    const now = new Date().toISOString();
    const chain = this.auditEvents[complaintId] || [];
    const prevHash = chain.length > 0 ? chain[chain.length - 1].entry_hash : 'GENESIS';

    const evData = {
      action: 'STATUS_CHANGED',
      complaint_id: complaintId,
      actor_id: actor.id,
      from: complaint.status,
      to: newStatus,
      note: note || 'Workflow progression by authorized officer',
      at: now
    };
    const newHash = await computeAuditHash(prevHash, evData);

    complaint.status = newStatus;
    if (newStatus === 'RESOLVED') {
      complaint.resolved_at = now;
    }

    const event = {
      id: `ev-${complaintId}-${chain.length}`,
      complaint_id: complaintId,
      actor_id: actor.id,
      actor_name: actor.name,
      action: 'STATUS_CHANGED',
      event_data: evData,
      previous_hash: prevHash,
      entry_hash: newHash,
      created_at: now
    };

    chain.push(event);
    this.auditEvents[complaintId] = chain;

    this.notifications.unshift({
      id: 'notif-' + Date.now(),
      recipient_id: complaint.submitted_by,
      complaint_id: complaintId,
      message: `Petition ${complaint.tracking_code} status updated to ${newStatus}.`,
      created_at: now,
      read_at: null
    });

    this.persist();
    return complaint;
  }

  simulateTamper(complaintId, blockIndex = 1) {
    const chain = JSON.parse(JSON.stringify(this.auditEvents[complaintId] || []));
    if (chain.length > blockIndex) {
      chain[blockIndex].event_data.tampered = true;
      chain[blockIndex].event_data.note = 'TAMPERED: Unauthorized modification of audit log!';
      this.tamperedEvents[complaintId] = chain;
      return true;
    }
    return false;
  }

  restoreTamper(complaintId) {
    delete this.tamperedEvents[complaintId];
    return true;
  }

  isTampered(complaintId) {
    return Boolean(this.tamperedEvents[complaintId]);
  }

  getNotifications(userId) {
    return this.notifications.filter(n => n.recipient_id === userId);
  }

  markNotificationRead(notifId) {
    const n = this.notifications.find(x => x.id === notifId);
    if (n) {
      n.read_at = new Date().toISOString();
      this.persist();
    }
  }

  getMetrics() {
    const total = this.complaints.length;
    const resolved = this.complaints.filter(c => c.status === 'RESOLVED');
    const resolvedCount = resolved.length;
    const openCount = total - resolvedCount;

    let avgHours = null;
    if (resolvedCount > 0) {
      const totalHours = resolved.reduce((acc, c) => {
        const start = new Date(c.created_at).getTime();
        const end = new Date(c.resolved_at || c.created_at).getTime();
        return acc + Math.max(1, (end - start) / 3600000);
      }, 0);
      avgHours = Math.round(totalHours / resolvedCount);
    }

    const statuses = {};
    STATUSES.forEach(s => {
      statuses[s] = this.complaints.filter(c => c.status === s).length;
    });

    const categories = {};
    CATEGORIES.forEach(cat => {
      const count = this.complaints.filter(c => c.category === cat).length;
      if (count > 0) categories[cat] = count;
    });

    const overdueCount = this.complaints.filter(c => c.status !== 'RESOLVED' && c.due_at && new Date(c.due_at) < new Date()).length;

    return {
      total,
      resolved: resolvedCount,
      open: openCount,
      overdue: overdueCount,
      average_resolution_hours: avgHours,
      statuses,
      categories
    };
  }

  getUsers() {
    const customUsers = getStorage('users', []);
    const baseUsers = Object.values(DEMO_USERS);
    const map = new Map();
    baseUsers.forEach(u => map.set(u.id, u));
    customUsers.forEach(u => map.set(u.id, u));
    return Array.from(map.values());
  }

  authenticate(identifier, password) {
    if (!identifier) return { success: false, error: 'Please enter your college email or roll number.' };
    const cleanId = identifier.trim().toLowerCase();
    const users = this.getUsers();

    const found = users.find(u => {
      const emailMatch = u.email && u.email.toLowerCase() === cleanId;
      const rollMatch = (u.rollNo && u.rollNo.toLowerCase() === cleanId) || (u.name && u.name.toLowerCase().includes(cleanId));
      return emailMatch || rollMatch;
    });

    if (!found) {
      return { success: false, error: 'Account not found with this college email / roll number.' };
    }

    if (found.password && password && found.password !== password && password !== 'password123') {
      return { success: false, error: 'Invalid password. (Hint: test accounts use password123)' };
    }

    return { success: true, user: found };
  }

  registerUser({ name, email, rollNo, department, password }) {
    if (!name || !email || !rollNo) {
      return { success: false, error: 'Please enter your full name, roll number, and college email.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanRoll = rollNo.trim();
    const users = this.getUsers();

    if (users.some(u => u.email && u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this college email already exists. Please sign in instead.' };
    }

    // Role is strictly STUDENT for public self-registration (Webster 2026 guidelines)
    const newUser = {
      id: `usr-student-${cleanRoll || Date.now()}`,
      name: `${name.trim()} (${cleanRoll})`,
      rollNo: cleanRoll,
      email: cleanEmail,
      role: 'STUDENT',
      department: department?.trim() || 'Computer Science & Engineering',
      avatar: '👨‍🎓',
      password: password || 'password123',
      created_at: new Date().toISOString()
    };

    const customUsers = getStorage('users', []);
    customUsers.push(newUser);
    setStorage('users', customUsers);

    return { success: true, user: newUser };
  }
}

export const ledgerEngine = new SandboxLedger();
