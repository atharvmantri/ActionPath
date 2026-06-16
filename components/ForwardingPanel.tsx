import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ForwardingPanelProps {
  onForward: (text: string) => void;
  disabled?: boolean;
}

export default function ForwardingPanel({ onForward, disabled }: ForwardingPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const emailAddress = 'student-784@inbound.actionpath.app';

  const handleCopy = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateEmails = [
    {
      label: 'AP Exam Fees Notice',
      subject: 'Urgent: AP Exam Fees due by Friday',
      body: 'Lincoln High AP Coordinator: This is a notice that College Board AP Exam fees are due by Friday, June 19th. The standard fee is $97 per exam. If you are qualified for the fee reduction scholarship sponsored by the Lincoln Alumni Foundation, please submit the form linked on the portal by Wednesday at 3:00 PM.',
    },
    {
      label: 'Emergency School Closure',
      subject: 'Advisory: School Closed Due to Severe Weather',
      body: 'Lincoln Administration: Due to the severe winter weather advisory, all Lincoln High School campuses will be closed tomorrow, Tuesday, June 17th. Midterm exams scheduled for Tuesday (Chemistry, Algebra 2) are postponed to Wednesday. Study guides originally due Monday are now due on Tuesday.',
    },
  ];

  const handleSimulate = (subject: string, body: string) => {
    const formatted = `From: Lincoln Communications <no-reply@lincolnhs.edu>\nTo: ${emailAddress}\nSubject: ${subject}\n\n${body}`;
    onForward(formatted);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="btn-secondary"
        style={{
          padding: '8px 16px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          borderColor: 'var(--accent-blue)',
          color: 'var(--text-accent)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        Email Forwarding (Demo)
      </button>

      {isOpen && mounted && typeof document !== 'undefined' ? createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999, // Above everything
          animation: 'fadeIn 0.2s ease',
        }}>
          <div
            className="glass-card-static animate-scale-up"
            style={{
              padding: '24px',
              maxWidth: '520px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid var(--border-glow)',
              boxShadow: 'var(--shadow-glow-blue)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Auto-Forwarding Inbox Setup
                <span className="badge" style={{ background: 'rgba(255, 149, 0, 0.15)', color: 'var(--accent-orange)', fontSize: '0.65rem', border: '1px solid rgba(255, 149, 0, 0.25)' }}>Demo Mode</span>
              </h3>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                  Forward your school emails directly to this address. ActionPath will automatically extract, structure, and prioritize your assignments.
                </p>

                {/* Email Display Box */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-glass)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '16px',
                }}>
                  <code style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    {emailAddress}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Simulation panel */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px', color: 'var(--text-primary)' }}>
                  Auto-Forwarding Simulation Sandbox
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Simulate forwarding an email from a teacher or administration office:
                </p>

                {/* Simulated Email Options */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {simulateEmails.map((email) => (
                    <button
                      key={email.label}
                      onClick={() => handleSimulate(email.subject, email.body)}
                      className="btn-ghost"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                      }}
                    >
                      Forward: {email.label}
                    </button>
                  ))}
                </div>

                {/* Custom simulation input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--bg-glass)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>OR SIMULATE CUSTOM EMAIL</span>
                  <input
                    type="text"
                    placeholder="Subject..."
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 10px',
                      fontSize: '0.75rem',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                  <textarea
                    placeholder="Body content..."
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '60px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 10px',
                      fontSize: '0.75rem',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                  <button
                    onClick={() => handleSimulate(customSubject || 'No Subject', customBody || 'No Content')}
                    disabled={!customBody.trim()}
                    className="btn-primary"
                    style={{ fontSize: '0.75rem', padding: '6px 14px', alignSelf: 'flex-end', opacity: !customBody.trim() ? 0.5 : 1 }}
                  >
                    <span>Simulate Incoming Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </>
  );
}
