'use client';

import React, { useState, useRef, useCallback } from 'react';
import { DEMO_EMAILS } from '@/data/demo-emails';
import VoiceInput from './VoiceInput';
import ClassroomImport from './ClassroomImport';
import ForwardingPanel from './ForwardingPanel';

interface InputAreaProps {
  onSubmit: (text: string | string[]) => void;
  isProcessing: boolean;
}

export default function InputArea({ onSubmit, isProcessing }: InputAreaProps) {
  const [text, setText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleVoiceTranscript = useCallback((newText: string) => {
    setText((prev) => (prev ? prev + ' ' + newText : newText));
  }, []);

  const handleFilesRead = useCallback(async (files: File[]) => {
    const targetFiles = files.slice(0, 3);
    setFileName(`${targetFiles.length} file(s) selected`);

    const readPromises = targetFiles.map(async (file) => {
      if (file.type === 'application/pdf') {
        try {
          const arrayBuffer = await file.arrayBuffer();
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
          return fullText.trim();
        } catch {
          return await file.text();
        }
      } else {
        return await file.text();
      }
    });

    const texts = await Promise.all(readPromises);
    if (texts.length === 1) {
      setText(texts[0]);
      setFileName(targetFiles[0].name);
    } else {
      setText(`[Batch of ${texts.length} files loaded]`);
      (window as any)._batchTexts = texts;
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    if (files.length > 0) handleFilesRead(files);
  }, [handleFilesRead]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleProcessClick = () => {
    if ((window as any)._batchTexts && text === `[Batch of ${(window as any)._batchTexts.length} files loaded]`) {
      onSubmit((window as any)._batchTexts);
      (window as any)._batchTexts = null;
    } else {
      onSubmit(text);
    }
  };

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
        <div style={{ position: 'absolute', right: '16px', top: '16px', zIndex: 10 }}>
          <VoiceInput onTranscript={handleVoiceTranscript} disabled={isProcessing} />
        </div>
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
            padding: '20px 60px 20px 20px',
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
            <span style={{ fontSize: '1.2rem', color: 'var(--accent-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
              Drop file here
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
        {/* Left: file upload + Classroom + word count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            disabled={isProcessing}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
            Upload File
          </button>
          
          <ClassroomImport onImport={onSubmit} disabled={isProcessing} />

          <ForwardingPanel onForward={onSubmit} disabled={isProcessing} />

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.txt,.eml,.html,.htm"
            style={{ display: 'none' }}
            onChange={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              if (files.length > 0) handleFilesRead(files);
            }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {fileName ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                {fileName}
              </>
            ) : `${wordCount} words`}
          </span>
        </div>

        {/* Right: process button */}
        <button
          onClick={handleProcessClick}
          className="btn-primary"
          disabled={isProcessing || text.trim().length < 10}
          style={{
            padding: '12px 32px',
            fontSize: '0.9rem',
            opacity: isProcessing || text.trim().length < 10 ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>
            {isProcessing ? 'Processing...' : 'Process with ActionPath'}
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
