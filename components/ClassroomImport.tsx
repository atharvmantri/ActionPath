import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ClassroomImportProps {
  onImport: (texts: string[]) => void;
  disabled?: boolean;
}

interface ClassroomItem {
  id: string;
  course: string;
  title: string;
  type: 'announcement' | 'coursework';
  content: string;
  selected: boolean;
}

export default function ClassroomImport({ onImport, disabled }: ClassroomImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const [items, setItems] = useState<ClassroomItem[]>([
    {
      id: 'c1',
      course: 'Biology (Period 2)',
      title: 'Field Trip slip & Dissection Lab fee',
      type: 'announcement',
      content: 'Reminder from Ms. Rivera: In order to attend the Wetland Preserve trip next week, every student must return a signed permission slip to room 204 by Wednesday. Also, the lab supply fee of $15 for the dissection unit must be paid through the online portal by Thursday.',
      selected: true,
    },
    {
      id: 'c2',
      course: 'AP US History (Period 4)',
      title: 'Chapter 28 Primary Source Reading',
      type: 'coursework',
      content: 'AP US History assignment from Mr. Kowalski: Students should read all four primary source documents in the Great Depression folder before class on Thursday. Be prepared for a DBQ write-up.',
      selected: true,
    },
    {
      id: 'c3',
      course: 'Algebra 2 (Period 6)',
      title: 'Chapter 12 test corrections',
      type: 'coursework',
      content: 'Corrections worksheet: Make sure to submit your corrected answers to Mrs. Park by Friday, June 20th to earn half credit back on your mid-unit test.',
      selected: false,
    },
  ]);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate OAuth popup
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 1500);
  };

  const handleToggleSelect = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleImportClick = () => {
    const selectedTexts = items.filter((item) => item.selected).map((item) => `[Google Classroom - ${item.course}]\nSubject: ${item.title}\n\n${item.content}`);
    if (selectedTexts.length > 0) {
      onImport(selectedTexts);
      setIsOpen(false);
    }
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        Connect Classroom (Demo)
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
          zIndex: 9999, // Extremely high z-index to stay above everything else
          animation: 'fadeIn 0.2s ease',
        }}>
          <div
            className="glass-card-static animate-scale-up"
            style={{
              padding: '24px',
              maxWidth: '520px',
              width: '90%',
              border: '1px solid var(--border-glow)',
              boxShadow: 'var(--shadow-glow-blue)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 22 22 22"/><line x1="12" y1="13" x2="12" y2="17"/><line x1="12" y1="9" x2="12.01" y2="9"/></svg>
                Google Classroom Connector
                <span className="badge" style={{ background: 'rgba(255, 149, 0, 0.15)', color: 'var(--accent-orange)', fontSize: '0.65rem', border: '1px solid rgba(255, 149, 0, 0.25)' }}>Demo Mode</span>
              </h3>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
            </div>

            {!isConnected ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--bg-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>Import assignments directly</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '340px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                  Link your student Google account to pull announcements and assignment deadlines into your ActionPath planner automatically.
                </p>
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="btn-primary"
                  style={{ display: 'flex', gap: '8px', margin: '0 auto', padding: '10px 24px' }}
                >
                  {isConnecting ? (
                    <span>Connecting Google...</span>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.527a5.99 5.99 0 0 1 5.99-5.992c1.558 0 2.978.594 4.06 1.57l3.153-3.155A10.15 10.15 0 0 0 13.99 2a10.19 10.19 0 0 0-10.2 10.2a10.19 10.19 0 0 0 10.2 10.2c5.96 0 9.878-4.113 9.878-10.027 0-.672-.06-1.32-.178-1.954H12.24Z"/></svg>
                      Connect Google Account
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Connected as <strong style={{ color: 'var(--text-primary)' }}>student@lincolnhs.edu (Demo Account)</strong>. Select items to pull into your action plan checklist:
                </p>

                {/* List items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleSelect(item.id)}
                      className="glass-card-static"
                      style={{
                        padding: '12px 14px',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        cursor: 'pointer',
                        borderColor: item.selected ? 'var(--accent-blue)' : 'var(--border-subtle)',
                        background: item.selected ? 'rgba(10, 132, 255, 0.04)' : 'transparent',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => {}} // handled by click
                        style={{ cursor: 'pointer', marginTop: '2px', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                            {item.course}
                          </span>
                          <span className="badge" style={{
                            background: item.type === 'coursework' ? 'rgba(0, 113, 227, 0.1)' : 'rgba(52, 199, 89, 0.1)',
                            color: item.type === 'coursework' ? 'var(--accent-blue)' : 'var(--accent-emerald)',
                            fontSize: '0.65rem',
                            padding: '1px 6px',
                          }}>
                            {item.type}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '4px', color: 'var(--text-primary)' }}>
                          {item.title}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                          {item.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Import button */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setIsConnected(false)}
                    className="btn-ghost"
                    style={{ fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Disconnect
                  </button>
                  <button
                    onClick={handleImportClick}
                    disabled={items.filter((i) => i.selected).length === 0}
                    className="btn-primary"
                    style={{ fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    <span>Import & Process ({items.filter((i) => i.selected).length})</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      ) : null}
    </>
  );
}
