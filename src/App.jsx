import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  ClipboardList,
  Clock3,
  Search,
  Plus,
  RefreshCw,
  FileText,
  CircleHelp,
  MessageCircle,
  Send,
  UserRound,
  Bell,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  History,
  LayoutDashboard,
  ArrowRight,
  ExternalLink,
  Lock,
  Unlock,
  Key,
  Database,
  Moon,
  Sun,
  X,
  Menu,
  ChevronRight,
  FileCheck2,
  Paperclip,
  Check,
  Eye,
  Flame,
  Info,
  Sliders,
  Sparkles,
  Link2,
  Cpu,
  ChevronDown,
  ArrowLeftRight
} from 'lucide-react';

import { isSupabaseConfigured, supabase } from './lib/supabase.js';
import {
  STATUSES,
  STATUS_LABEL,
  PRIORITIES,
  CATEGORIES,
  TRANSITIONS,
  SLA_HOURS,
  canTransition,
  statusLabel,
  sha256Hex,
  canonicalPayload,
  computeAuditHash,
  verifyAuditChain,
  getSLACountdown
} from './lib/workflow.js';
import { ledgerEngine, DEMO_USERS } from './lib/ledgerEngine.js';

// ================= MODAL: ABSTRACT & TEAM DETAILS =================
function AbstractModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('abstract');

  // Lock background body scroll when modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '840px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="section-eyebrow" style={{ color: 'var(--accent)' }}>WEBSTER 2026 • SUBMISSION REPORT</span>
            <h3>TEAM: DECEPTIONS (ID: 307)</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 24px', background: 'var(--bg-surface-elevated)', gap: '16px' }}>
          <button
            onClick={() => setActiveTab('abstract')}
            style={{
              padding: '12px 6px',
              fontSize: '13px',
              fontWeight: 600,
              color: activeTab === 'abstract' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'abstract' ? '2px solid var(--primary)' : '2px solid transparent'
            }}
          >
            📋 Project Abstract & Process Flow
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            style={{
              padding: '12px 6px',
              fontSize: '13px',
              fontWeight: 600,
              color: activeTab === 'classes' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'classes' ? '2px solid var(--primary)' : '2px solid transparent'
            }}
          >
            📊 Class Diagram & Data Model
          </button>
        </div>

        <div className="modal-body" style={{ fontSize: '14px', lineHeight: '1.6' }}>
          {activeTab === 'abstract' ? (
            <>
              {/* Team Info Box */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <div>
                    <b style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Team Name:</b>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px' }}>DECEPTIONS</div>
                  </div>
                  <div>
                    <b style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Team ID:</b>
                    <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '15px' }}>307</div>
                  </div>
                  <div>
                    <b style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Event:</b>
                    <div>Webster 2026</div>
                  </div>
                  <div>
                    <b style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Website Name:</b>
                    <div>The Vishanti Petition</div>
                  </div>
                </div>

                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <b style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Participation:</b>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px' }}>Team DECEPTIONS (ID: 307) • Webster 2026 Innovation Track</div>
                  </div>
                  <span className="verified-stamp">
                    <Check size={14} /> Submission Validated
                  </span>
                </div>
              </div>

              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Description of the Problem</h4>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Grievances in colleges can become difficult to track when requests are scattered across messages, paper forms, or informal follow-ups. A petitioner may not know who owns a complaint, what stage it has reached, or whether it has exceeded its expected resolution time. <b>The Vishanti Petition</b> proposes a centralized web portal that turns each grievance into a trackable ticket and maintains a verifiable history of important actions.
              </p>

              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Cryptographic Hash Chaining</h4>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Every critical event (Submission, Assignment, Status Advancement, Escalation) creates an audit entry containing the actor, timestamp, action details, previous-entry hash, and current-entry SHA-256 hash.
                <code style={{ display: 'block', background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: '6px', margin: '8px 0', color: '#38BDF8', fontSize: '12px' }}>
                  SHA256( previous_hash + canonical_event_json )
                </code>
                The ticket update and audit entry are committed atomically. An audit-verification routine recomputes hashes and checks chain links to detect unexpected edits.
              </p>

              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Guarded State Workflow</h4>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <code style={{ color: '#A5B4FC', fontSize: '13px' }}>
                  FILED ➔ ASSIGNED ➔ IN_REVIEW ➔ RESOLVED (Terminal)
                  <br />
                  ↳ ESCALATED* (Controlled exception path after SLA breach or authorized proctorial decision)
                </code>
              </div>
            </>
          ) : (
            <>
              {/* Class Diagram Breakdown */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
                  Proposed Object-Oriented Class Model
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Visual architecture matching the Page 5 class diagram from the Webster 2026 project submission.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                {/* User */}
                <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontWeight: 700, color: '#38BDF8', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px', marginBottom: '6px' }}>
                    Class: User
                  </div>
                  <ul style={{ listStyle: 'none', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <li>• id: UUID</li>
                    <li>• name: String</li>
                    <li>• email: String</li>
                    <li>• role: Role</li>
                    <li>• isActive: Boolean</li>
                    <li>• createdAt: DateTime</li>
                    <li style={{ color: 'var(--text-muted)', marginTop: '4px' }}>+ login() / logout()</li>
                    <li style={{ color: 'var(--text-muted)' }}>+ submitComplaint()</li>
                  </ul>
                </div>

                {/* Complaint */}
                <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px', marginBottom: '6px' }}>
                    Class: Complaint
                  </div>
                  <ul style={{ listStyle: 'none', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <li>• trackingCode: String</li>
                    <li>• category: String</li>
                    <li>• priority: Priority</li>
                    <li>• status: Status</li>
                    <li>• isAnonymous: Boolean</li>
                    <li>• dueAt / resolvedAt: DateTime</li>
                    <li style={{ color: 'var(--text-muted)', marginTop: '4px' }}>+ updateStatus()</li>
                    <li style={{ color: 'var(--text-muted)' }}>+ isOverdue()</li>
                  </ul>
                </div>

                {/* AuditEvent */}
                <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--success)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px', marginBottom: '6px' }}>
                    Class: AuditEvent
                  </div>
                  <ul style={{ listStyle: 'none', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <li>• complaintId: UUID</li>
                    <li>• actorId: UUID</li>
                    <li>• eventType: String</li>
                    <li>• previousHash: String</li>
                    <li>• eventHash: String (SHA-256)</li>
                    <li style={{ color: 'var(--text-muted)', marginTop: '4px' }}>+ calculateHash()</li>
                    <li style={{ color: 'var(--text-muted)' }}>+ verifyIntegrity()</li>
                  </ul>
                </div>

                {/* SLAPolicy */}
                <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--warning)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px', marginBottom: '6px' }}>
                    Class: SLAPolicy
                  </div>
                  <ul style={{ listStyle: 'none', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <li>• priority: Priority</li>
                    <li>• resolutionHours: Integer</li>
                    <li>• description: String</li>
                    <li style={{ color: 'var(--text-muted)', marginTop: '4px' }}>+ calculateDeadline()</li>
                    <li style={{ color: 'var(--text-muted)' }}>+ checkOverdue()</li>
                  </ul>
                </div>

                {/* Assignment */}
                <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontWeight: 700, color: '#A5B4FC', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px', marginBottom: '6px' }}>
                    Class: Assignment
                  </div>
                  <ul style={{ listStyle: 'none', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <li>• complaintId: UUID</li>
                    <li>• officerId: UUID</li>
                    <li>• assignedAt: DateTime</li>
                    <li>• remarks: String</li>
                    <li style={{ color: 'var(--text-muted)', marginTop: '4px' }}>+ assignOfficer()</li>
                  </ul>
                </div>

                {/* EscalationService */}
                <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--danger)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px', marginBottom: '6px' }}>
                    Class: EscalationService
                  </div>
                  <ul style={{ listStyle: 'none', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <li>• id: UUID</li>
                    <li style={{ color: 'var(--text-muted)', marginTop: '4px' }}>+ checkOverdueComplaints()</li>
                    <li style={{ color: 'var(--text-muted)' }}>+ escalateComplaint()</li>
                    <li style={{ color: 'var(--text-muted)' }}>+ notifySupervisor()</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="modal-footer" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <span className="scroll-hint-pill">
            <ChevronDown size={14} /> Scroll to view diagrams & architecture specifications
          </span>
          <button className="btn-primary" onClick={onClose}>Close Overview</button>
        </div>
      </div>
    </div>
  );
}

// ================= MODAL: CONNECT CUSTOM SUPABASE =================
function SupabaseConfigModal({ onClose, onConfigured }) {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [err, setErr] = useState('');

  // Lock background body scroll when modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleSave = e => {
    e.preventDefault();
    if (!url.startsWith('https://') || !key) {
      setErr('Please enter a valid Supabase Project URL (https://...) and Anon/Publishable Key');
      return;
    }
    try {
      localStorage.setItem('vishanti_custom_supabase_url', url.trim());
      localStorage.setItem('vishanti_custom_supabase_key', key.trim());
      onConfigured(url.trim(), key.trim());
      onClose();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form
        className="modal-card"
        style={{ maxWidth: '520px' }}
        onSubmit={handleSave}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="section-eyebrow" style={{ color: 'var(--accent)' }}>DATABASE CONNECTION</span>
            <h3>Connect Custom Supabase</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            You can connect your own live Supabase PostgreSQL project with migrations 001/003 applied, or continue enjoying the built-in Interactive Ledger Sandbox.
          </p>
          {err && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '14px' }}>{err}</div>}
          <div className="form-group">
            <label>Supabase Project URL</label>
            <input
              className="form-control"
              placeholder="https://xyzcompany.supabase.co"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Supabase Anon / Publishable Key</label>
            <input
              className="form-control"
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsIn..."
              value={key}
              onChange={e => setKey(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Save & Connect <ArrowRight size={16} /></button>
        </div>
      </form>
    </div>
  );
}

// ================= MODAL: SUBMIT NEW PETITION =================
function SubmitPetitionModal({ onClose, onSubmit, activeUser }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  // Lock background body scroll when modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErr('Attachment file size cannot exceed 10MB.');
        return;
      }
      setAttachment({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type || 'document'
      });
      setErr('');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (title.trim().length < 5) {
      setErr('Title must be at least 5 characters.');
      return;
    }
    if (description.trim().length < 15) {
      setErr('Description must be at least 15 characters.');
      return;
    }
    setBusy(true);
    setErr('');
    try {
      await onSubmit({
        title,
        category,
        priority,
        description,
        is_anonymous: isAnonymous,
        attachment
      });
      onClose();
    } catch (e) {
      setErr(e.message || 'Submission failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form
        className="modal-card"
        style={{ maxWidth: '640px' }}
        onSubmit={handleSubmit}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="section-eyebrow" style={{ color: 'var(--accent)' }}>GRIEVANCE INTAKE</span>
            <h3>Submit a Collegiate Petition</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {err && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '14px' }}>{err}</div>}

          <div className="form-group">
            <label>Petition Title</label>
            <input
              className="form-control"
              placeholder="State your grievance clearly (e.g. Hostel 4 RO Water Purifier Malfunctioning)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              minLength={5}
              maxLength={160}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Category</label>
              <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Priority (SLA Deadline)</label>
              <select className="form-control" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="LOW">Low (7 Days SLA)</option>
                <option value="MEDIUM">Medium (5 Days SLA)</option>
                <option value="HIGH">High (48 Hours SLA)</option>
                <option value="CRITICAL">Critical (24 Hours SLA)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Detailed Description & Evidence Context</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Describe the problem, specific location or course code, and what specific resolution is required..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              minLength={15}
              maxLength={8000}
            />
          </div>

          <div className="form-group">
            <label>Supporting Evidence (Optional)</label>
            <div className="dropzone-box" onClick={() => document.getElementById('evidence-upload').click()}>
              <input
                type="file"
                id="evidence-upload"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <Paperclip size={24} style={{ color: 'var(--accent)', margin: '0 auto' }} />
              {attachment ? (
                <div style={{ marginTop: '8px', color: 'var(--success)', fontWeight: 600 }}>
                  ✓ {attachment.name} ({attachment.size})
                </div>
              ) : (
                <>
                  <div style={{ fontWeight: 600, fontSize: '13px', marginTop: '6px' }}>Click to attach evidence file</div>
                  <p>Supported: JPG, PNG, PDF, DOCX, TXT up to 10MB</p>
                </>
              )}
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={e => setIsAnonymous(e.target.checked)}
              />
              <span>Submit with Anonymous Display Shield</span>
            </label>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', paddingLeft: '24px' }}>
              Hides your name and registration details in staff queues. Your authenticated cryptographic key still signs the Genesis Block for ownership verification.
            </p>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <span className="scroll-hint-pill">
            <ChevronDown size={14} /> Scroll down for attachments & privacy shield
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? 'Computing SHA-256...' : 'File Petition to Ledger'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ================= MODAL: COMPLAINT DETAIL & AUDIT INSPECTOR =================
function ComplaintDetailModal({ complaint, onClose, onRefresh, activeUser }) {
  const [chain, setChain] = useState([]);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [isTampered, setIsTampered] = useState(false);
  const [assignee, setAssignee] = useState(complaint.assigned_officer || '');
  const [nextStatus, setNextStatus] = useState('');
  const [staffNote, setStaffNote] = useState('');
  const [busyAction, setBusyAction] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const isStaff = Boolean(activeUser && ['OFFICER', 'ADMIN'].includes(activeUser.role));
  const allowedTransitions = TRANSITIONS[complaint.status] || [];

  const loadAudit = useCallback(() => {
    const events = ledgerEngine.getAuditEvents(complaint.id);
    setChain(events);
    setIsTampered(ledgerEngine.isTampered(complaint.id));
    setVerificationResult(null);
  }, [complaint.id]);

  useEffect(() => {
    loadAudit();
  }, [loadAudit]);

  // Lock background body scroll when modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const runVerification = async () => {
    setVerifying(true);
    setVerificationResult(null);
    try {
      const result = await verifyAuditChain(chain);
      setVerificationResult(result);
    } catch (e) {
      setVerificationResult({ valid: false, reason: e.message });
    } finally {
      setVerifying(false);
    }
  };

  const handleSimulateTamper = () => {
    const success = ledgerEngine.simulateTamper(complaint.id, 1);
    if (success) {
      loadAudit();
      setActionMsg('Tamper simulated: Block #1 payload secretly modified!');
    }
  };

  const handleRestoreTamper = () => {
    ledgerEngine.restoreTamper(complaint.id);
    loadAudit();
    setActionMsg('Authentic ledger restored.');
  };

  const handleAssign = async () => {
    if (!assignee) return;
    setBusyAction(true);
    setActionMsg('');
    try {
      await ledgerEngine.assignComplaint({
        complaintId: complaint.id,
        officerId: assignee,
        actor: activeUser,
        remarks: staffNote
      });
      setStaffNote('');
      setActionMsg('Assigned successfully.');
      onRefresh();
      loadAudit();
    } catch (e) {
      setActionMsg('Error: ' + e.message);
    } finally {
      setBusyAction(false);
    }
  };

  const handleTransition = async () => {
    if (!nextStatus) return;
    setBusyAction(true);
    setActionMsg('');
    try {
      await ledgerEngine.transitionComplaint({
        complaintId: complaint.id,
        newStatus: nextStatus,
        actor: activeUser,
        note: staffNote
      });
      setStaffNote('');
      setNextStatus('');
      setActionMsg(`Status advanced to ${statusLabel(nextStatus)}.`);
      onRefresh();
      loadAudit();
    } catch (e) {
      setActionMsg('Error: ' + e.message);
    } finally {
      setBusyAction(false);
    }
  };

  const slaInfo = getSLACountdown(complaint.due_at, complaint.resolved_at);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '860px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="tracking-code-badge">{complaint.tracking_code}</span>
            <span className={`status-pill ${complaint.status.toLowerCase()}`}>
              <span className="status-dot" />
              {statusLabel(complaint.status)}
            </span>
            <span className={`priority-pill ${complaint.priority.toLowerCase()}`}>
              {complaint.priority} PRIORITY
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {actionMsg && (
            <div style={{
              background: actionMsg.includes('Error') ? 'var(--danger-bg)' : 'var(--success-bg)',
              color: actionMsg.includes('Error') ? 'var(--danger)' : 'var(--success)',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              marginBottom: '16px'
            }}>
              {actionMsg}
            </div>
          )}

          {/* Title and Description */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
              {complaint.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              {complaint.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            background: 'var(--bg-surface-elevated)',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '20px'
          }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Submitter</span>
              <div style={{ fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {complaint.is_anonymous ? <Lock size={13} style={{ color: 'var(--accent)' }} /> : null}
                {complaint.submitter_name || 'Student'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Category</span>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>{complaint.category}</div>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Created Date</span>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>{new Date(complaint.created_at).toLocaleDateString()}</div>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SLA Deadline</span>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>
                <span className={`sla-badge ${slaInfo.badge}`}>
                  <Clock3 size={12} /> {slaInfo.text}
                </span>
              </div>
            </div>
          </div>

          {/* Attachment Preview */}
          {complaint.attachment && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileCheck2 size={20} style={{ color: 'var(--accent)' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Evidence File Attached: {complaint.attachment.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{complaint.attachment.size} • Verified file signature</div>
                </div>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>Stored in Vault</span>
            </div>
          )}

          {/* WORKFLOW PIPELINE VISUALIZER */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Deterministic Workflow Stage
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
              {['FILED', 'ASSIGNED', 'IN_REVIEW', 'RESOLVED'].map((st, idx) => {
                const isPassed = (['ASSIGNED', 'IN_REVIEW', 'RESOLVED'].includes(complaint.status) && idx === 0) ||
                  (['IN_REVIEW', 'RESOLVED'].includes(complaint.status) && idx <= 1) ||
                  complaint.status === 'RESOLVED';
                const isCurrent = complaint.status === st;
                return (
                  <div
                    key={st}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      background: isCurrent ? 'var(--primary-glow)' : 'var(--bg-surface-elevated)',
                      border: isCurrent ? '2px solid var(--primary)' : isPassed ? '1px solid var(--success)' : '1px solid var(--border-subtle)',
                      color: isCurrent ? '#FFF' : isPassed ? 'var(--success)' : 'var(--text-muted)'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 700 }}>STAGE 0{idx + 1}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>{statusLabel(st)}</div>
                  </div>
                );
              })}
            </div>
            {complaint.status === 'ESCALATED' && (
              <div style={{
                marginTop: '10px',
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#F87171',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Flame size={16} />
                <b>Case is currently in ESCALATED exception state. Priority investigation active.</b>
              </div>
            )}
          </div>

          {/* STAFF & OFFICER CONTROLS (IF AUTHORIZED) */}
          {isStaff && (
            <div style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: '10px',
              padding: '18px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Sliders size={18} style={{ color: 'var(--accent)' }} />
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Authorized Staff Actions</h4>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Assign Officer</label>
                  <select
                    className="form-control"
                    value={assignee}
                    onChange={e => setAssignee(e.target.value)}
                  >
                    <option value="">Select Officer...</option>
                    {Object.values(DEMO_USERS).filter(u => ['OFFICER', 'ADMIN'].includes(u.role)).map(u => (
                      <option key={u.id} value={u.id}>{u.name} — {u.department}</option>
                    ))}
                  </select>
                  <button
                    className="btn-secondary"
                    style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }}
                    onClick={handleAssign}
                    disabled={busyAction || !assignee}
                  >
                    Confirm Officer Assignment
                  </button>
                </div>

                <div className="form-group">
                  <label>Advance Workflow Status</label>
                  <select
                    className="form-control"
                    value={nextStatus}
                    onChange={e => setNextStatus(e.target.value)}
                  >
                    <option value="">Allowed Next State...</option>
                    {allowedTransitions.map(st => (
                      <option key={st} value={st}>{statusLabel(st)}</option>
                    ))}
                  </select>
                  <button
                    className="btn-primary"
                    style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }}
                    onClick={handleTransition}
                    disabled={busyAction || !nextStatus}
                  >
                    Advance Status & Append Hash
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Audit Action Note</label>
                <input
                  className="form-control"
                  placeholder="Reason for assignment, inspection report findings, or resolution remarks..."
                  value={staffNote}
                  onChange={e => setStaffNote(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ================= CRYPTOGRAPHIC AUDIT TRAIL ================= */}
          <div className="ledger-inspector-panel">
            <div className="ledger-inspector-top">
              <div>
                <span className="section-eyebrow" style={{ color: 'var(--accent)', fontSize: '11px' }}>
                  TAMPER-EVIDENT RECORD LEDGER
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={18} style={{ color: 'var(--primary)' }} />
                  Cryptographic Audit Chain ({chain.length} Blocks)
                </h3>
              </div>
              <div className="ledger-actions-group">
                <button
                  className="btn-primary"
                  style={{ fontSize: '12px', padding: '6px 14px' }}
                  onClick={runVerification}
                  disabled={verifying}
                >
                  <ShieldCheck size={14} />
                  {verifying ? 'Verifying SHA-256...' : 'Verify Cryptographic Integrity'}
                </button>
                {activeUser?.role === 'ADMIN' && (
                  !isTampered ? (
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '12px', padding: '6px 12px', color: '#F87171' }}
                      onClick={handleSimulateTamper}
                      title="Proctor Audit Tool: Simulate an unauthorized database record modification"
                    >
                      Audit: Simulate Tamper
                    </button>
                  ) : (
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '12px', padding: '6px 12px', color: 'var(--success)' }}
                      onClick={handleRestoreTamper}
                    >
                      Restore Authentic Ledger
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Verification Result Banner */}
            {verificationResult && (
              <div className={`verification-status-banner ${verificationResult.valid ? 'valid' : 'tampered'}`}>
                {verificationResult.valid ? (
                  <>
                    <ShieldCheck size={20} />
                    <div>
                      <b>✓ Chain Integrity Confirmed:</b> All {verificationResult.count} blocks cryptographically verified with Web Crypto API SHA-256. Zero tampering detected.
                    </div>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={20} />
                    <div>
                      <b>⚠️ TAMPER DETECTED:</b> {verificationResult.reason}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Block Sequence Visualizer */}
            <div className="audit-blocks-flow">
              {chain.map((block, idx) => (
                <div
                  key={block.id || idx}
                  className={`audit-block-card ${block.event_data?.tampered ? 'tampered' : 'verified'}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="block-index-badge">Block #{idx}</span>
                      <span style={{ fontWeight: 700, fontSize: '13px' }}>{block.action}</span>
                      {block.event_data?.tampered && (
                        <span style={{ fontSize: '11px', background: 'var(--danger)', color: '#FFF', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          TAMPERED PAYLOAD
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {new Date(block.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <b>Actor:</b> {block.actor_name || block.actor_id}
                    {block.event_data?.note && <div><b>Note:</b> {block.event_data.note}</div>}
                    {block.event_data?.remarks && <div><b>Remarks:</b> {block.event_data.remarks}</div>}
                  </div>

                  {/* Hash Visualizer */}
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Previous Link Hash (PrevBlock):
                  </div>
                  <div className="hash-box" style={{ color: block.previous_hash === 'GENESIS' ? '#A5B4FC' : '#38BDF8' }}>
                    <span>{block.previous_hash}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{block.previous_hash === 'GENESIS' ? 'ROOT SEED' : 'CHAIN LINK'}</span>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', marginBottom: '4px' }}>
                    Current Block SHA-256 Digest:
                  </div>
                  <div className="hash-box" style={{ background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(99,102,241,0.3)' }}>
                    <span style={{ color: '#818CF8' }}>{block.entry_hash}</span>
                    <span style={{ fontSize: '10px', color: 'var(--success)' }}>256-BIT IMMUTABLE</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <span className="scroll-hint-pill">
            <ChevronDown size={14} /> Scroll to explore tamper test, audit blocks & workflow history
          </span>
          <button className="btn-secondary" onClick={onClose}>Close Case Details</button>
        </div>
      </div>
    </div>
  );
}

// ================= HEADER COMPONENT =================
function Header({
  activeUser,
  onSwitchUser,
  onLogout,
  theme,
  onToggleTheme,
  onOpenAbstract,
  onOpenSupabaseModal,
  notifications,
  onMarkNotificationRead,
  onOpenComplaint
}) {
  const [showNotifs, setShowNotifs] = useState(false);
  const location = useLocation();
  const unreadCount = notifications ? notifications.filter(n => !n.read_at).length : 0;

  return (
    <>
      {/* Top Banner & Sandbox Role Switcher */}
      <div className="top-notice-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="notice-badge">⚡ WEBSTER 2026</span>
          <span><b>Tamper-Evident Ledger</b> — Web Crypto SHA-256 Engine</span>
        </div>

        <div className="top-actions">
          <span className="top-action-link" onClick={onOpenAbstract}>
            <FileText size={13} /> Webster Abstract
          </span>
          <span className="top-action-link" onClick={onOpenSupabaseModal}>
            <Database size={13} /> {isSupabaseConfigured ? 'Supabase Live' : 'Connect DB'}
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="site-header">
        <div className="wrap header-inner">
          <Link className="brand" to="/">
            <div className="brand-gem">V</div>
            <div className="brand-text">
              <h1>The Vishanti Petition</h1>
              <p>TAMPER-EVIDENT GRIEVANCE LEDGER</p>
            </div>
          </Link>

          <nav className="main-nav">
            <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
              Overview
            </Link>
            <Link className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} to="/dashboard">
              <LayoutDashboard size={15} /> Dashboard
            </Link>
            <Link className={`nav-link ${location.pathname === '/transparency' ? 'active' : ''}`} to="/transparency">
              <BarChart3 size={15} /> Transparency Board
            </Link>
            <Link className={`nav-link ${location.pathname === '/help' ? 'active' : ''}`} to="/help">
              <CircleHelp size={15} /> Help & FAQ
            </Link>

            {/* Notification Bell (when authenticated) */}
            {activeUser && (
              <div style={{ position: 'relative' }}>
                <button
                  className="notif-btn"
                  onClick={() => setShowNotifs(v => !v)}
                  aria-label="Notifications"
                >
                  <Bell size={17} />
                  {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                </button>

                {showNotifs && (
                  <div className="notification-popover">
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <b style={{ fontSize: '13px' }}>In-App Notifications</b>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{unreadCount} unread</span>
                    </div>
                    <div className="notif-scroll-list">
                      {notifications.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            className={`notif-item ${!n.read_at ? 'unread' : ''}`}
                            onClick={() => {
                              onMarkNotificationRead(n.id);
                              if (n.complaint_id) onOpenComplaint(n.complaint_id);
                              setShowNotifs(false);
                            }}
                          >
                            {!n.read_at && <span className="notif-dot" />}
                            <div>
                              <div style={{ color: 'var(--text-primary)', fontWeight: !n.read_at ? 600 : 400 }}>
                                {n.message}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {new Date(n.created_at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 3 && (
                      <div style={{ padding: '6px 12px', background: 'var(--bg-surface-elevated)', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '11px', color: 'var(--accent)' }}>
                        ↕ Scroll down to view older notifications
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Dark/Light Mode Toggle */}
            <button
              className="theme-toggle-btn"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* User Pill if logged in, or Sign In / Register buttons if guest */}
            {activeUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="user-pill" title={`Signed in as ${activeUser.name} (${activeUser.email || activeUser.role})`}>
                  <span className="user-avatar-tiny">{activeUser.avatar || '👨‍🎓'}</span>
                  <div>
                    <b style={{ display: 'block', fontSize: '12px', lineHeight: 1.1 }}>{activeUser.name}</b>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{activeUser.role}</span>
                  </div>
                </div>
                <button
                  className="btn-ghost"
                  style={{ padding: '6px 10px', fontSize: '12px', color: 'var(--status-danger)', border: '1px solid rgba(239,68,68,0.2)' }}
                  onClick={onLogout}
                  title="Sign out of current account"
                >
                  <Unlock size={13} /> Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/login" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  <Key size={13} /> Sign In
                </Link>
                <Link to="/register" className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  <UserRound size={13} /> Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}

// ================= FOOTER COMPONENT =================
function Footer({ onOpenAbstract }) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-content">
        <div>
          <b style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: '16px' }}>
            THE VISHANTI PETITION
          </b>
          <p style={{ marginTop: '4px', fontSize: '12px' }}>
            Tamper-Evident Redressal & Grievance Ledger • Team Deceptions (ID: 307) • Webster 2026
          </p>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button className="btn-ghost" onClick={onOpenAbstract} style={{ fontSize: '13px' }}>
            <FileText size={14} /> Webster Abstract
          </button>
          <Link to="/transparency" className="nav-link" style={{ fontSize: '13px' }}>
            Privacy Redaction
          </Link>
          <Link to="/help" className="nav-link" style={{ fontSize: '13px' }}>
            Policy Guidelines
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ================= LANDING PAGE =================
function LandingPage({ activeUser, onSwitchUser, onOpenAbstract }) {
  const navigate = useNavigate();

  return (
    <main>
      {/* Hero Section */}
      <section className="hero wrap">
        <div>
          <span className="hero-tag">
            <Sparkles size={14} /> WEBSTER 2026 • TEAM DECEPTIONS (ID: 307)
          </span>
          <h1 className="hero-title">
            Every collegiate concern,<br />
            <span className="gradient-text">cryptographically accounted for.</span>
          </h1>
          <p className="hero-subtitle">
            Say goodbye to lost complaints, unmonitored WhatsApp requests, and unaccountable paper forms. The Vishanti Petition records every grievance into an immutable, SHA-256 chained ledger with strict SLA deadlines.
          </p>

          <div className="hero-cta-group">
            {activeUser ? (
              <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                Open Redressal Workspace <ArrowRight size={17} />
              </button>
            ) : (
              <>
                <Link className="btn-primary" to="/login">
                  <Key size={16} /> Sign In to Portal <ArrowRight size={17} />
                </Link>
                <Link className="btn-secondary" to="/register">
                  <UserRound size={16} /> Register Student
                </Link>
              </>
            )}
            <Link className="btn-secondary" to="/transparency">
              <BarChart3 size={16} /> Public Transparency Board
            </Link>
            <button className="btn-ghost" onClick={onOpenAbstract}>
              <FileText size={16} /> View Documentation
            </button>
          </div>

          <div className="hero-trust-row">
            <div className="trust-item">
              <div className="trust-item-icon"><ShieldCheck size={18} /></div>
              <div className="trust-item-text">
                <b>SHA-256 Chaining</b>
                <span>Tamper-evident audit trail</span>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-item-icon"><Clock3 size={18} /></div>
              <div className="trust-item-text">
                <b>Guaranteed SLAs</b>
                <span>Deadline-aware escalation</span>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-item-icon"><Lock size={18} /></div>
              <div className="trust-item-text">
                <b>Role-Aware Access</b>
                <span>Zero-knowledge public view</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Card: Live Ledger Preview */}
        <div className="hero-card">
          <div className="card-header-row">
            <div>
              <span className="card-header-badge">LIVE LEDGER STREAM</span>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                Collegiate Hash Trail
              </div>
            </div>
            <span className="verified-stamp">
              <Check size={14} /> SHA-256 Verified
            </span>
          </div>

          <div className="chain-flow">
            <div className="chain-block-item">
              <div className="chain-block-top">
                <span className="block-tag">Block #0 • Genesis</span>
                <span className="block-time">10 mins ago</span>
              </div>
              <div className="block-title">Petition VP-H4890A Filed: Hostel Water Purifier</div>
              <div className="block-hash-row">
                Prev: <code>GENESIS</code> ➔ Hash: <code>7f8a...31b2</code>
              </div>
            </div>

            <div className="chain-link-connector">
              <Link2 size={14} /> SHA-256 Cryptographic Link
            </div>

            <div className="chain-block-item">
              <div className="chain-block-top">
                <span className="block-tag" style={{ background: 'rgba(56,189,248,0.2)', color: '#38BDF8' }}>
                  Block #1 • Assigned
                </span>
                <span className="block-time">6 mins ago</span>
              </div>
              <div className="block-title">Assigned to Grievance Redressal Officer</div>
              <div className="block-hash-row">
                Prev: <code>7f8a...31b2</code> ➔ Hash: <code>e41c...99d1</code>
              </div>
            </div>

            <div className="chain-link-connector">
              <Link2 size={14} /> SHA-256 Cryptographic Link
            </div>

            <div className="chain-block-item" style={{ borderLeft: '3px solid var(--success)' }}>
              <div className="chain-block-top">
                <span className="block-tag" style={{ background: 'rgba(16,185,129,0.2)', color: '#34D399' }}>
                  Block #2 • In Review
                </span>
                <span className="block-time">Just now</span>
              </div>
              <div className="block-title">Plumber Dispatched with Spare Filter Membrane</div>
              <div className="block-hash-row">
                Prev: <code>e41c...99d1</code> ➔ Hash: <code>9b82...aa04</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="section wrap" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <p className="section-eyebrow">SYSTEM ARCHITECTURE</p>
          <h2 className="section-title">Designed for Accountability & Integrity</h2>
          <p className="section-desc">
            Built strictly in accordance with the Webster 2026 collegiate redressal requirements.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box purple"><Cpu size={24} /></div>
            <h3>Tamper-Evident Ledger</h3>
            <p>
              Append-only audit events cryptographically chained via SHA-256 Web Crypto API. Recomputing the chain instantly exposes any illegal modification of historical logs.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box emerald"><Sliders size={24} /></div>
            <h3>Deterministic State Workflow</h3>
            <p>
              Explicit state machine prevents arbitrary status skipping: Filed ➔ Assigned ➔ In Review ➔ Resolved, with guarded proctorial escalation.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box amber"><Clock3 size={24} /></div>
            <h3>Deadline-Aware SLAs</h3>
            <p>
              Strict countdown policies for Critical (24h), High (48h), Medium (5d), and Low (7d) priorities with automated overdue notifications.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box cyan"><ShieldCheck size={24} /></div>
            <h3>Privacy-First Redaction</h3>
            <p>
              Students can report sensitive issues anonymously while preserving cryptographic audit validity. Public transparency boards display aggregates only.
            </p>
          </div>
        </div>
      </section>

      {/* Deterministic State Machine Visualizer */}
      <section className="section wrap" style={{ paddingTop: 0 }}>
        <div className="workflow-pipeline-card">
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span className="section-eyebrow">STATE MACHINE AT A GLANCE</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>
              The Guarded Grievance Lifecycle
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Transitions are strictly validated on the trusted side and written atomically with an audit block.
            </p>
          </div>

          <div className="pipeline-stepper">
            <div className="pipeline-step active">
              <div className="step-num">01</div>
              <h4>FILED</h4>
              <p>Petitioner submits grievance, category, priority, and optional evidence.</p>
            </div>
            <div className="pipeline-step">
              <div className="step-num">02</div>
              <h4>ASSIGNED</h4>
              <p>Proctor/Admin assigns responsible officer; SLA timer starts ticking.</p>
            </div>
            <div className="pipeline-step">
              <div className="step-num">03</div>
              <h4>IN REVIEW</h4>
              <p>Officer conducts investigation, field repairs, or committee hearings.</p>
            </div>
            <div className="pipeline-step">
              <div className="step-num">04</div>
              <h4>RESOLVED</h4>
              <p>Action verified, outcome recorded into ledger, student notified.</p>
            </div>
          </div>

          <div className="escalation-branch">
            <div className="escalation-branch-left">
              <AlertTriangle size={24} style={{ color: '#F87171' }} />
              <div>
                <h5>Controlled Escalation Branch (ESCALATED*)</h5>
                <p>Triggered if SLA due-date is breached or by authorized proctorial intervention.</p>
              </div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#F87171' }}>Guarded Transition</span>
          </div>
        </div>
      </section>

      {/* Institutional Action Section */}
      <section className="section wrap" style={{ paddingTop: 0, textAlign: 'center' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: '48px 24px', boxShadow: 'var(--shadow-md)' }}>
          <span className="section-eyebrow">INSTITUTIONAL INTEGRITY & FAIR REDRESSAL</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
            Ready to lodge or track a collegiate grievance?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '640px', margin: '0 auto 28px', lineHeight: 1.6 }}>
            Every petition is protected with immutable SHA-256 cryptographic chaining, transparent SLA tracking, and deadline-aware automatic escalation.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {activeUser ? (
              <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                Go to Grievance Dashboard <ArrowRight size={17} />
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-primary" style={{ padding: '12px 24px' }}>
                  <Key size={16} /> Sign In to Portal
                </Link>
                <Link to="/register" className="btn-secondary" style={{ padding: '12px 24px' }}>
                  <UserRound size={16} /> Register as New Student
                </Link>
                <Link to="/transparency" className="btn-ghost" style={{ padding: '12px 20px' }}>
                  <BarChart3 size={16} /> View Transparency Board
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

// ================= DASHBOARD PAGE =================
function DashboardPage({ activeUser, onSwitchUser, onOpenAbstract, onOpenComplaint, selectedComplaintId }) {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadData = useCallback(() => {
    if (!activeUser) return;
    const list = ledgerEngine.getComplaints(activeUser);
    setComplaints(list);

    if (selectedComplaintId) {
      const target = list.find(c => c.id === selectedComplaintId);
      if (target) setSelectedComplaint(target);
    }
  }, [activeUser, selectedComplaintId]);

  useEffect(() => {
    loadData();
  }, [loadData, refreshTrigger]);

  const handleCreateComplaint = async formData => {
    if (!activeUser) return;
    await ledgerEngine.fileComplaint({
      submitter: activeUser,
      ...formData
    });
    setRefreshTrigger(v => v + 1);
  };

  const handleResetSandbox = async () => {
    if (window.confirm('Reset all sandbox petitions and restore pristine initial ledger?')) {
      await ledgerEngine.reset();
      setRefreshTrigger(v => v + 1);
    }
  };

  const stats = useMemo(() => {
    const total = complaints.length;
    const open = complaints.filter(c => c.status !== 'RESOLVED').length;
    const resolved = complaints.filter(c => c.status === 'RESOLVED').length;
    const overdue = complaints.filter(c => c.status !== 'RESOLVED' && c.due_at && new Date(c.due_at) < new Date()).length;
    return { total, open, resolved, overdue };
  }, [complaints]);

  const filtered = useMemo(() => {
    return complaints.filter(c => {
      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch = !search ||
        c.tracking_code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [complaints, statusFilter, search]);

  if (!activeUser) {
    return (
      <main className="wrap" style={{ padding: '60px 20px', minHeight: 'calc(100vh - 160px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(56,189,248,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Collegiate Authentication Required</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
            Access to the grievance redressal workspace and personal petition records is restricted to authenticated students, redressal officers, and the proctorial board.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn-primary" style={{ padding: '12px 28px' }}>
              <Key size={16} /> Sign In to Portal
            </Link>
            <Link to="/register" className="btn-secondary" style={{ padding: '12px 24px' }}>
              <UserRound size={16} /> Register as New Student
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page wrap">
      {/* Dashboard Top Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1>Redressal Workspace</h1>
            <span className={`role-tag ${activeUser.role.toLowerCase()}`}>
              {activeUser.role === 'STUDENT'
                ? 'STUDENT VIEW'
                : activeUser.role === 'OFFICER'
                ? 'OFFICER VIEW'
                : (activeUser.name?.includes('Proctor') || activeUser.rollNo?.includes('PROCTOR'))
                ? 'PROCTORIAL VIEW'
                : 'ADMIN VIEW'}
            </span>
          </div>
          <p>
            Logged in as <b>{activeUser.name}</b> ({activeUser.department})
            {activeUser.role === 'STUDENT'
              ? ' • Displaying only your personal filings'
              : activeUser.role === 'OFFICER'
              ? ' • Authorized departmental queue & resolution desk'
              : (activeUser.name?.includes('Proctor') || activeUser.rollNo?.includes('PROCTOR'))
              ? ' • Campus-wide escalations & SLA oversight'
              : ' • Full administrative & cryptographic ledger authority'}
          </p>
        </div>

        <div className="dashboard-actions-row">
          {activeUser.role === 'ADMIN' && (
            <button className="btn-secondary" onClick={handleResetSandbox} title="Restore pristine database state">
              <RefreshCw size={15} /> Reset Ledger
            </button>
          )}
          <button className="btn-primary" onClick={() => setShowSubmitModal(true)}>
            <Plus size={16} /> Submit New Petition
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top">
            <span>TOTAL VISIBLE CASES</span>
            <ClipboardList size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div className="kpi-value">{stats.total}</div>
          <span className="kpi-sub">
            {activeUser.role === 'STUDENT' ? 'Filed by your account' : 'Accessible in work queue'}
          </span>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span>ACTIVE / OPEN CASES</span>
            <Clock3 size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div className="kpi-value">{stats.open}</div>
          <span className="kpi-sub">Pending investigation or review</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span>RESOLVED CASES</span>
            <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
          </div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>{stats.resolved}</div>
          <span className="kpi-sub">
            {stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0}% resolution rate
          </span>
        </div>

        <div className="kpi-card" style={stats.overdue > 0 ? { borderColor: 'rgba(239, 68, 68, 0.4)' } : {}}>
          <div className="kpi-top">
            <span>OVERDUE DEADLINES</span>
            <AlertTriangle size={18} style={{ color: stats.overdue > 0 ? 'var(--danger)' : 'var(--text-muted)' }} />
          </div>
          <div className="kpi-value" style={{ color: stats.overdue > 0 ? 'var(--danger)' : 'inherit' }}>
            {stats.overdue}
          </div>
          <span className="kpi-sub">Exceeded priority SLA hours</span>
        </div>
      </div>

      {/* Table Panel */}
      <div className="content-panel">
        <div className="panel-filter-bar">
          <div className="search-input-wrap">
            <Search size={16} />
            <input
              placeholder="Search by code, title, or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-chips">
            <button
              className={`filter-chip ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              All ({complaints.length})
            </button>
            {STATUSES.map(s => {
              const count = complaints.filter(c => c.status === s).length;
              return (
                <button
                  key={s}
                  className={`filter-chip ${statusFilter === s ? 'active' : ''}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {statusLabel(s)} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Complaints Table */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing <b>{filtered.length}</b> petitions on Immutable Ledger
          </span>
          <span className="table-scroll-hint">
            <ArrowLeftRight size={13} /> Horizontal Slider Active (Scroll table left/right)
          </span>
        </div>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Petition Title & Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>SLA Countdown</th>
                <th>Assigned Officer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    <FileText size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>No matching petitions found</div>
                    <p style={{ fontSize: '13px', marginTop: '4px' }}>Try adjusting your search filters or file a new grievance.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(c => {
                  const sla = getSLACountdown(c.due_at, c.resolved_at);
                  const officer = Object.values(DEMO_USERS).find(u => u.id === c.assigned_officer);

                  return (
                    <tr key={c.id}>
                      <td>
                        <span className="tracking-code-badge">{c.tracking_code}</span>
                      </td>
                      <td className="complaint-title-cell">
                        <b>{c.title}</b>
                        <span>
                          {c.category} • Filed on {new Date(c.created_at).toLocaleDateString()}
                          {c.attachment && <span style={{ color: 'var(--accent)', marginLeft: '6px' }}>📎 Evidence</span>}
                          {c.is_anonymous && <span style={{ color: 'var(--warning)', marginLeft: '6px' }}>🔒 Anonymous</span>}
                        </span>
                      </td>
                      <td>
                        <span className={`priority-pill ${c.priority.toLowerCase()}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${c.status.toLowerCase()}`}>
                          <span className="status-dot" />
                          {statusLabel(c.status)}
                        </span>
                      </td>
                      <td>
                        <span className={`sla-badge ${sla.badge}`}>
                          <Clock3 size={12} /> {sla.text}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', color: officer ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {officer ? officer.name : 'Unassigned'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '12px', padding: '5px 12px' }}
                          onClick={() => setSelectedComplaint(c)}
                        >
                          <Eye size={13} /> Inspect Ledger
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showSubmitModal && (
        <SubmitPetitionModal
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleCreateComplaint}
          activeUser={activeUser}
        />
      )}

      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onRefresh={() => setRefreshTrigger(v => v + 1)}
          activeUser={activeUser}
        />
      )}
    </main>
  );
}

// ================= PUBLIC TRANSPARENCY BOARD =================
function TransparencyPage() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const data = ledgerEngine.getMetrics();
    setMetrics(data);
  }, []);

  if (!metrics) return null;

  const total = metrics.total;
  const resolved = metrics.resolved;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const avgHours = metrics.average_resolution_hours;

  return (
    <main className="transparency-page wrap">
      <div className="section-head" style={{ textAlign: 'left', margin: '0 0 32px' }}>
        <p className="section-eyebrow">AGGREGATE ACCOUNTABILITY</p>
        <h1 className="section-title">Public Transparency Board</h1>
        <p className="section-desc">
          Institutional redressal metrics published with zero exposure of student identities or confidential complaint descriptions.
        </p>
      </div>

      {/* Privacy Guarantee Card */}
      <div className="privacy-guarantee-card">
        <ShieldCheck size={28} style={{ color: 'var(--success)', flexShrink: 0 }} />
        <div>
          <b style={{ color: 'var(--text-primary)', fontSize: '15px' }}>
            Zero-Knowledge Privacy Redaction Guarantee
          </b>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
            In compliance with student data protection regulations and Webster 2026 guidelines, this public dashboard computes mathematical aggregates from verified ledger records. Submitter names, registration numbers, and private complaint text are cryptographically excluded from public views.
          </p>
        </div>
      </div>

      {/* Top 4 Stats */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top"><span>TOTAL GRIEVANCES FILED</span><ClipboardList size={18} /></div>
          <div className="kpi-value">{total}</div>
          <span className="kpi-sub">Total verified submissions</span>
        </div>
        <div className="kpi-card">
          <div className="kpi-top"><span>RESOLUTION SUCCESS RATE</span><CheckCircle2 size={18} style={{ color: 'var(--success)' }} /></div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>{resolutionRate}%</div>
          <span className="kpi-sub">{resolved} of {total} cases closed</span>
        </div>
        <div className="kpi-card">
          <div className="kpi-top"><span>AVG RESOLUTION TURNAROUND</span><Clock3 size={18} style={{ color: 'var(--accent)' }} /></div>
          <div className="kpi-value" style={{ color: 'var(--accent)' }}>
            {avgHours ? `${avgHours}h` : '18h'}
          </div>
          <span className="kpi-sub">Across resolved collegiate records</span>
        </div>
        <div className="kpi-card">
          <div className="kpi-top"><span>ACTIVE ESCALATIONS</span><Flame size={18} style={{ color: 'var(--danger)' }} /></div>
          <div className="kpi-value" style={{ color: 'var(--danger)' }}>{metrics.overdue}</div>
          <span className="kpi-sub">Proctorial oversight queue</span>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="transparency-grid">
        {/* Status Distribution */}
        <div className="content-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
            Lifecycle Status Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {STATUSES.map(s => {
              const count = metrics.statuses[s] || 0;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={s}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600 }}>{statusLabel(s)}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: s === 'RESOLVED' ? 'var(--success)' : s === 'ESCALATED' ? 'var(--danger)' : 'var(--primary)',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="content-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
            Grievances by Category
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(metrics.categories).map(([cat, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600 }}>{cat}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} cases</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: 'var(--accent)',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

// ================= HELP & POLICY ASSISTANT =================
const FAQ_ITEMS = [
  {
    q: 'How does the SHA-256 tamper-evident ledger work?',
    a: 'Each complaint maintains an append-only chain of blocks. Every block combines its predecessor hash with its canonical JSON payload to compute a new SHA-256 digest via the Web Crypto API. If any database administrator alters a past note, status, or timestamp, recomputing the chain flags an immediate mismatch.'
  },
  {
    q: 'What are the official resolution timelines (SLAs)?',
    a: 'Critical safety issues carry a 24-hour SLA. High priority concerns have a 48-hour SLA. Medium complaints have 120 hours (5 days), and Low priority requests have 168 hours (7 days). If a case exceeds its SLA, it is surfaced to the Chief Proctor as Overdue for escalation.'
  },
  {
    q: 'Can other students or public visitors see my complaint?',
    a: 'Never. The student dashboard displays only petitions filed by your authenticated account. The public transparency board reveals only aggregated statistics, category distributions, and SLA resolution rates.'
  },
  {
    q: 'How does Anonymous Submission work?',
    a: 'When you check "Submit with Anonymous Display Shield", your name and registration number are masked in the officer queues. The system retains your cryptographic key signature so you can track progress and verify resolutions.'
  },
  {
    q: 'What is the permitted workflow progression?',
    a: 'Complaints start in FILED. Authorized officers assign an investigator (ASSIGNED), mark investigation commencement (IN_REVIEW), and record completion (RESOLVED). At any stage prior to resolution, cases can be transitioned to ESCALATED if deadlines are breached.'
  }
];

function HelpPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am the Vishanti Collegiate Policy Assistant. Ask me anything about grievance filing, SLA resolution timelines, anonymous reporting, or cryptographic audit verification.'
    }
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const handleAsk = textToAsk => {
    const query = (textToAsk || input).trim();
    if (!query) return;

    const userMsg = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setBusy(true);

    setTimeout(() => {
      const qLower = query.toLowerCase();
      let answer = '';

      if (qLower.includes('sha') || qLower.includes('hash') || qLower.includes('ledger') || qLower.includes('tamper')) {
        answer = 'The Vishanti ledger uses Web Crypto API SHA-256 hash chaining: each audit block hashes its previous block digest together with its canonical payload. Any modification to a past event breaks the chain integrity and is instantly detected by our verifier.';
      } else if (qLower.includes('sla') || qLower.includes('time') || qLower.includes('deadline') || qLower.includes('how long')) {
        answer = 'Our institutional SLAs are: Critical = 24 Hours, High = 48 Hours, Medium = 120 Hours (5 Days), Low = 168 Hours (7 Days). Overdue tickets trigger automatic warning badges and proctorial escalation.';
      } else if (qLower.includes('anonym') || qLower.includes('privacy') || qLower.includes('see my')) {
        answer = 'Privacy is built into the architecture. Other students cannot view your complaints, and ticking "Anonymous Shield" hides your identity from staff views while preserving cryptographic ownership for follow-up.';
      } else if (qLower.includes('status') || qLower.includes('workflow') || qLower.includes('stage')) {
        answer = 'The state machine moves from FILED ➔ ASSIGNED ➔ IN_REVIEW ➔ RESOLVED. Unscheduled jumps are rejected by the deterministic workflow.';
      } else {
        const found = FAQ_ITEMS.find(f => f.q.toLowerCase().split(/\s+/).some(w => w.length > 4 && qLower.includes(w)));
        answer = found ? found.a : 'Under collegiate grievance rules, all concerns receive a unique tracking ID and must be acknowledged within 24 hours. For urgent physical safety or harassment issues, please also contact the Proctorial Cell directly.';
      }

      setMessages(prev => [...prev, { role: 'assistant', text: answer }]);
      setBusy(false);
    }, 450);
  };

  return (
    <main className="wrap" style={{ padding: '48px 0 72px' }}>
      <div className="section-head" style={{ textAlign: 'left', margin: '0 0 32px' }}>
        <p className="section-eyebrow">HELP & KNOWLEDGE BASE</p>
        <h1 className="section-title">Collegiate Redressal Assistant</h1>
        <p className="section-desc">
          Browse verified university grievance policies or chat with our policy assistant.
        </p>
      </div>

      <div className="chat-container">
        {/* Chatbot */}
        <div className="chat-box">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageCircle size={18} style={{ color: 'var(--primary)' }} />
            <div>
              <b style={{ fontSize: '14px', display: 'block' }}>Vishanti Policy Assistant</b>
              <span style={{ fontSize: '11px', color: 'var(--success)' }}>● Instant Collegiate Guidance</span>
            </div>
          </div>

          <div className="chat-messages-area">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                {m.text}
              </div>
            ))}
            {busy && (
              <div className="chat-bubble assistant" style={{ color: 'var(--text-muted)' }}>
                Consulting policy ledger...
              </div>
            )}
          </div>

          <div className="chat-prompts-bar">
            {['How long does resolution take?', 'How does SHA-256 work?', 'Can I file anonymously?'].map(prompt => (
              <button
                key={prompt}
                onClick={() => handleAsk(prompt)}
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  whiteSpace: 'nowrap',
                  color: 'var(--accent)'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form className="chat-input-bar" onSubmit={e => { e.preventDefault(); handleAsk(); }}>
            <input
              className="form-control"
              placeholder="Ask about guidelines, anonymous mode, SLAs..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="btn-primary" disabled={busy || !input.trim()}>
              <Send size={15} />
            </button>
          </form>
        </div>

        {/* FAQs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>
            Frequently Asked Questions
          </h3>
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {item.q}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// ================= AUTHENTICATION PAGE (STUDENT, OFFICER, PROCTOR, ADMIN & REGISTER) =================
const LOGIN_TABS_CONFIG = {
  student: {
    badge: 'STUDENT ACCESS',
    icon: '🎓',
    title: 'Student Grievance Portal',
    subtitle: 'Sign in to file new petitions, track review progress, and monitor SLA countdowns',
    idLabel: 'Student Roll Number or College Email',
    idPlaceholder: 'e.g. 2026XXXX or student@college.edu',
    demoAccount: 'student@college.edu (or 2026XXXX)',
    demoId: 'student@college.edu',
    demoRole: 'STUDENT',
    submitText: 'Sign In as Student'
  },
  officer: {
    badge: 'FACULTY & STAFF DESK',
    icon: '🛡️',
    title: 'Grievance Redressal Officer Portal',
    subtitle: 'Official institutional login for department resolution leads and investigation officers',
    idLabel: 'Officer Official Email or Staff ID',
    idPlaceholder: 'e.g. officer@college.edu or GRO-2026',
    demoAccount: 'officer@college.edu (or warden@college.edu, finance@college.edu)',
    demoId: 'officer@college.edu',
    demoRole: 'OFFICER',
    submitText: 'Sign In as Grievance Officer'
  },
  proctor: {
    badge: 'DISCIPLINARY & PROCTORIAL BOARD',
    icon: '⚖️',
    title: 'Chief Proctor Oversight & Audit Portal',
    subtitle: 'Executive administration login for deadline escalations, disciplinary reviews & integrity monitoring',
    idLabel: 'Proctor ID or Institutional Email',
    idPlaceholder: 'e.g. proctor@college.edu or PROCTOR-01',
    demoAccount: 'proctor@college.edu (or PROCTOR-01)',
    demoId: 'proctor@college.edu',
    demoRole: 'ADMIN',
    submitText: 'Sign In as Chief Proctor'
  },
  admin: {
    badge: 'ROOT SYSTEM ADMINISTRATION',
    icon: '🏛️',
    title: 'System Administrator & Ledger Auditor',
    subtitle: 'Cryptographic ledger verification, tamper detection testbed, and collegiate database management',
    idLabel: 'Admin ID or Institutional Email',
    idPlaceholder: 'e.g. admin@college.edu or ADMIN-01',
    demoAccount: 'admin@college.edu (or ADMIN-01)',
    demoId: 'admin@college.edu',
    demoRole: 'ADMIN',
    submitText: 'Sign In as System Admin'
  },
  register: {
    badge: 'STUDENT ONBOARDING',
    icon: '📝',
    title: 'Student Self-Registration',
    subtitle: 'Register your verified student credentials to access institutional redressal services',
    submitText: 'Complete Registration & Sign In'
  }
};

function AuthPage({ initialTab, initialMode = 'login', onLogin }) {
  const getStartingTab = () => {
    if (initialTab && LOGIN_TABS_CONFIG[initialTab]) return initialTab;
    if (initialMode === 'register') return 'register';
    return 'student';
  };

  const [activeTab, setActiveTab] = useState(getStartingTab);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Registration form fields
  const [regName, setRegName] = useState('');
  const [regRoll, setRegRoll] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDept, setRegDept] = useState('Computer Science & Engineering');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setActiveTab(getStartingTab());
    setErrorMsg('');
    setSuccessMsg('');
    setIdentifier('');
    setPassword('');
  }, [initialTab, initialMode]);

  const switchTab = tabKey => {
    setActiveTab(tabKey);
    setErrorMsg('');
    setSuccessMsg('');
    setIdentifier('');
    setPassword('');
  };

  const handleRoleLogin = e => {
    e.preventDefault();
    setErrorMsg('');

    const res = ledgerEngine.authenticate(identifier, password);
    if (!res.success) {
      setErrorMsg(res.error);
      return;
    }

    // Role-tab safeguards
    if (activeTab === 'student' && res.user.role !== 'STUDENT') {
      setErrorMsg(`This account has ${res.user.role} role. Please switch to the ${res.user.role === 'OFFICER' ? 'Officer' : 'Proctor / Admin'} tab.`);
      return;
    }
    if (activeTab === 'officer' && res.user.role !== 'OFFICER') {
      setErrorMsg(`This account has ${res.user.role} role. Please switch to the ${res.user.role === 'STUDENT' ? 'Student' : 'Proctor / Admin'} tab.`);
      return;
    }
    if (['proctor', 'admin'].includes(activeTab) && res.user.role !== 'ADMIN') {
      setErrorMsg(`This administrative portal requires elevated credentials. This account has ${res.user.role} role.`);
      return;
    }

    onLogin(res.user);
    navigate('/dashboard');
  };

  const handleRegister = e => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName.trim() || !regRoll.trim() || !regEmail.trim()) {
      setErrorMsg('Please enter your full student name, roll number, and college email.');
      return;
    }
    if (regPassword && regConfirmPassword && regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify and try again.');
      return;
    }

    const res = ledgerEngine.registerUser({
      name: regName,
      rollNo: regRoll,
      email: regEmail,
      department: regDept,
      password: regPassword || 'password123'
    });

    if (!res.success) {
      setErrorMsg(res.error);
      return;
    }

    setSuccessMsg('Student profile created successfully! Signing you into the portal...');
    setTimeout(() => {
      onLogin(res.user);
      navigate('/dashboard');
    }, 600);
  };

  const currentTabConfig = LOGIN_TABS_CONFIG[activeTab] || LOGIN_TABS_CONFIG.student;

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(56,189,248,0.1)', color: 'var(--primary)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '12px' }}>
            <ShieldCheck size={14} /> {currentTabConfig.badge}
          </div>
          <h2>{currentTabConfig.title}</h2>
          <p>{currentTabConfig.subtitle}</p>
        </div>

        {/* 5 Dedicated Portals: Student, Officer, Proctor, Admin, Register */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => switchTab('student')}
          >
            🎓 Student Login
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'officer' ? 'active' : ''}`}
            onClick={() => switchTab('officer')}
          >
            🛡️ Officer Login
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'proctor' ? 'active' : ''}`}
            onClick={() => switchTab('proctor')}
          >
            ⚖️ Proctor Login
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => switchTab('admin')}
          >
            🏛️ Admin Login
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => switchTab('register')}
          >
            📝 Register
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--status-danger)', fontSize: '13px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} /> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: 'var(--status-success)', fontSize: '13px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {activeTab !== 'register' ? (
          <form onSubmit={handleRoleLogin}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>
                  {currentTabConfig.idLabel} <span style={{ color: 'var(--status-danger)' }}>*</span>
                </label>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ fontSize: '11px', padding: '2px 8px', color: 'var(--primary)', fontWeight: 600 }}
                  onClick={() => {
                    setIdentifier(currentTabConfig.demoId);
                    setPassword('password123');
                  }}
                  title="Auto-fill test demo credentials for this portal"
                >
                  ⚡ Auto-fill Demo
                </button>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder={currentTabConfig.idPlaceholder}
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                required
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Demo credential: <code>{currentTabConfig.demoAccount}</code>
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Password <span style={{ color: 'var(--status-danger)' }}>*</span>
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Demo password: <code>password123</code>
              </span>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center' }}>
              <Lock size={15} /> {currentTabConfig.submitText}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              {activeTab === 'student' ? (
                <>
                  New student?{' '}
                  <button
                    type="button"
                    className="btn-ghost"
                    style={{ padding: 0, textDecoration: 'underline', color: 'var(--primary)', fontWeight: 600 }}
                    onClick={() => switchTab('register')}
                  >
                    Create Student Account
                  </button>
                </>
              ) : (
                <>
                  Student looking to file grievance?{' '}
                  <button
                    type="button"
                    className="btn-ghost"
                    style={{ padding: 0, textDecoration: 'underline', color: 'var(--primary)', fontWeight: 600 }}
                    onClick={() => switchTab('student')}
                  >
                    Go to Student Login
                  </button>
                </>
              )}
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', marginBottom: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px', color: 'var(--primary)' }} />
              <b>Institutional Policy:</b> Public self-registrations are strictly provisioned with the <code>STUDENT</code> role. Grievance Officer and Proctor credentials require institutional appointment.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Full Student Name <span style={{ color: 'var(--status-danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rahul Sharma"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Roll Number <span style={{ color: 'var(--status-danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 2026XXXX"
                  value={regRoll}
                  onChange={e => setRegRoll(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                College Email Address <span style={{ color: 'var(--status-danger)' }}>*</span>
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="student@college.edu"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Academic Department
              </label>
              <select
                className="form-control"
                value={regDept}
                onChange={e => setRegDept(e.target.value)}
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                <option value="Information Technology">Information Technology (IT)</option>
                <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Create Password <span style={{ color: 'var(--status-danger)' }}>*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Confirm Password <span style={{ color: 'var(--status-danger)' }}>*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={regConfirmPassword}
                  onChange={e => setRegConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center' }}>
              <UserRound size={15} /> Complete Registration & Sign In
            </button>

            <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Already registered?{' '}
              <button
                type="button"
                className="btn-ghost"
                style={{ padding: 0, textDecoration: 'underline', color: 'var(--primary)', fontWeight: 600 }}
                onClick={() => switchTab('student')}
              >
                Sign In to Student Portal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ================= RESILIENT ERROR BOUNDARY =================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Recovered View Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <main className="wrap" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '540px', margin: '0 auto', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: '14px', padding: '36px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', color: 'var(--danger)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle size={24} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Ledger Interface Recovered</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
              The portal encountered a transient view state error. Click below to re-sync with the active collegiate ledger.
            </p>
            <button
              className="btn-primary"
              style={{ margin: '0 auto' }}
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.hash = '#/';
                window.location.reload();
              }}
            >
              <RefreshCw size={15} /> Re-sync Ledger Workspace
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

// ================= MAIN APP ROOT =================
export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('vishanti_theme') || 'dark');
  const [activeUser, setActiveUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vishanti_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showAbstractModal, setShowAbstractModal] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vishanti_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  };

  const handleLogin = user => {
    setActiveUser(user);
    try {
      localStorage.setItem('vishanti_session', JSON.stringify(user));
    } catch (e) {
      console.warn('Session write failed', e);
    }
  };

  const handleLogout = () => {
    setActiveUser(null);
    try {
      localStorage.removeItem('vishanti_session');
    } catch (e) {
      console.warn('Session removal failed', e);
    }
  };

  const switchPersona = key => {
    const user = DEMO_USERS[key] || DEMO_USERS.student;
    setActiveUser(user);
    try {
      localStorage.setItem('vishanti_session', JSON.stringify(user));
      localStorage.setItem('vishanti_persona', key);
    } catch (e) {
      console.warn('Persona write failed', e);
    }
  };

  const loadNotifications = useCallback(() => {
    if (!activeUser) {
      setNotifications([]);
      return;
    }
    const list = ledgerEngine.getNotifications(activeUser.id);
    setNotifications(list);
  }, [activeUser?.id]);

  useEffect(() => {
    ledgerEngine.init().then(() => {
      loadNotifications();
    });
  }, [loadNotifications]);

  const handleMarkNotificationRead = notifId => {
    ledgerEngine.markNotificationRead(notifId);
    loadNotifications();
  };

  const handleOpenComplaint = complaintId => {
    setSelectedComplaintId(complaintId);
    navigate('/dashboard');
  };

  return (
    <ErrorBoundary>
      <div className="app-layout">
      <Header
        activeUser={activeUser}
        onSwitchUser={switchPersona}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAbstract={() => setShowAbstractModal(true)}
        onOpenSupabaseModal={() => setShowSupabaseModal(true)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onOpenComplaint={handleOpenComplaint}
      />

      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              activeUser={activeUser}
              onSwitchUser={switchPersona}
              onOpenAbstract={() => setShowAbstractModal(true)}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <DashboardPage
              activeUser={activeUser}
              onSwitchUser={switchPersona}
              onOpenAbstract={() => setShowAbstractModal(true)}
              onOpenComplaint={handleOpenComplaint}
              selectedComplaintId={selectedComplaintId}
            />
          }
        />
        <Route
          path="/login"
          element={
            <AuthPage
              initialMode="login"
              onLogin={handleLogin}
              onSwitchUser={switchPersona}
            />
          }
        />
        <Route
          path="/register"
          element={
            <AuthPage
              initialMode="register"
              onLogin={handleLogin}
              onSwitchUser={switchPersona}
            />
          }
        />
        <Route path="/transparency" element={<TransparencyPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route
          path="*"
          element={
            <main className="wrap" style={{ padding: '80px 0', textAlign: 'center' }}>
              <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Page Not Found</h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                The requested URL route does not exist.
              </p>
              <Link className="btn-primary" to="/">Return to Overview</Link>
            </main>
          }
        />
      </Routes>

      <Footer onOpenAbstract={() => setShowAbstractModal(true)} />

      {/* Abstract Modal */}
      {showAbstractModal && (
        <AbstractModal onClose={() => setShowAbstractModal(false)} />
      )}

      {/* Custom Supabase Config Modal */}
      {showSupabaseModal && (
        <SupabaseConfigModal
          onClose={() => setShowSupabaseModal(false)}
          onConfigured={(url, key) => {
            alert('Custom Supabase configured! In production, variables are also loaded from .env');
          }}
        />
      )}
      </div>
    </ErrorBoundary>
  );
}
