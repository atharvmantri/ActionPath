'use client';

import React, { useState, useRef, useCallback } from 'react';
import { DEMO_EMAILS } from '@/data/demo-emails';

interface InputAreaProps {
  onSubmit: (text: string) => void;
  isProcessing: boolean;
}

export default function InputArea({ onSubmit, isProcessing }: InputAreaProps) {
  const [text, setText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleFileRead = useCallback(async (file: File) => {
    setFileName(file.name);

    if (file.type === 'application/pdf') {
      // For PDF, we'd use pdfjs-dist. For simplicity in the demo,
      // we'll read as text and let the user know if it fails.
      try {
        const arrayBuffer = await file.arrayBuffer();
        // Dynamic import to avoid SSR issues
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => ('str' in item ? (item as Record<string, unknown>).str as string : '')).join(' ');
          fullText += pageText + '\n';
        }
        setText(fullText.trim());
      } catch {
        // Fallback: try reading as text
        const textContent = await file.text();
        setText(textContent);
      }
    } else {
      // .txt, .eml, .html — read as text
      const textContent = await file.text();
      setText(textContent);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileRead(file);
  }, [handleFileRead]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
      {/* Text input area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          border: `2px dashed ${dragOver ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
          background: dragOver ? 'rgba(59, 130, 246, 0.04)' : 'transparent',
          transition: 'all 0.3s ease',
        }}
      >
        <textarea
          id="email-input"
          value={text}
          onChange={(e) => { setText(e.target.value); setFileName(null); }}
          placeholder="Paste a school email, LMS post, or newsletter here... or drag & drop a file (.pdf, .txt, .eml, .html)"
          disabled={isProcessing}
          style={{
            width: '100%',
            minHeight: '200px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            lineHeight: 1.7,
            padding: '20px',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'Inter, sans-serif',
          }}
        />

        {/* Drag overlay */}
        {dragOver && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: 'var(--radius-lg)',
            pointerEvents: 'none',
          }}>
            <span style={{ fontSize: '1.2rem', color: 'var(--accent-blue)', fontWeight: 600 }}>
              📎 Drop file here
            </span>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '12px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        {/* Left: file upload + word count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            disabled={isProcessing}
          >
            📎 Upload File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.eml,.html,.htm"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileRead(file);
            }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {fileName ? `📄 ${fileName}` : `${wordCount} words`}
          </span>
        </div>

        {/* Right: process button */}
        <button
          onClick={() => onSubmit(text)}
          className="btn-primary"
          disabled={isProcessing || text.trim().length < 10}
          style={{
            padding: '12px 32px',
            fontSize: '0.9rem',
            opacity: isProcessing || text.trim().length < 10 ? 0.5 : 1,
          }}
        >
          <span>
            {isProcessing ? '⚡ Processing...' : '🚀 Process with ActionPath'}
          </span>
        </button>
      </div>

      {/* Demo emails */}
      <div style={{ marginTop: '20px' }}>
        <p style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '10px',
          fontWeight: 500,
        }}>
          Or try a demo email:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {DEMO_EMAILS.map((email) => (
            <button
              key={email.id}
              onClick={() => { setText(email.content); setFileName(null); }}
              disabled={isProcessing}
              className="btn-ghost"
              style={{
                padding: '6px 14px',
                fontSize: '0.75rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
              title={email.description}
            >
              {email.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
