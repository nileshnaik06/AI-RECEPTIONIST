import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Bot, MessageSquare, Download } from 'lucide-react';
import useClinicStore from '../store/useClinicStore';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { formatDate, formatTime, truncate, cn } from '../lib/utils';

// ─── Chat Message Bubble ──────────────────────────────────────────────────────

function ChatBubble({ role, text, time }) {
  const isUser   = role === 'user';
  const isSystem = role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <span className="text-xs text-text-muted bg-surface-secondary px-3 py-1 rounded-full border border-border">
          {text}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex gap-2 mb-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0 mt-1">
          <Bot size={14} className="text-primary" />
        </div>
      )}
      <div className={cn('max-w-[75%]', isUser && 'items-end flex flex-col')}>
        <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}>
          {text}
        </div>
        <span className="text-[11px] text-text-muted mt-1 px-1">
          {time ? formatTime(time) : ''}
        </span>
      </div>
    </div>
  );
}

// ─── Chat Logs Page ───────────────────────────────────────────────────────────

export default function ChatLogs() {
  const { chatSessions } = useClinicStore();
  const [active,     setActive]   = useState(null);
  const [search,     setSearch]   = useState('');
  const [outcome,    setOutcome]  = useState('All');

  const outcomes = ['All', 'Booked', 'FAQ Only', 'Unresolved'];

  const filtered = useMemo(() => {
    return chatSessions.filter((s) => {
      const matchSearch  = !search || s.id.toLowerCase().includes(search.toLowerCase()) || s.preview.toLowerCase().includes(search.toLowerCase());
      const matchOutcome = outcome === 'All' || s.outcome === outcome;
      return matchSearch && matchOutcome;
    });
  }, [chatSessions, search, outcome]);

  const activeSession = chatSessions.find((s) => s.id === active);

  return (
    <div className="flex gap-0 border border-border rounded-md overflow-hidden bg-surface" style={{ height: 'calc(100vh - 120px)' }}>
      {/* ── Left Panel: Session List ────────────────────────────── */}
      <div className="w-[360px] flex-shrink-0 border-r border-border flex flex-col">
        {/* Search + Filter */}
        <div className="p-3 border-b border-border space-y-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sessions..."
              className="w-full h-8 pl-8 pr-3 text-sm border border-border rounded-md bg-surface-secondary focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            className="w-full h-8 px-2 text-xs border border-border rounded-md bg-surface-secondary text-text-secondary focus:outline-none"
          >
            {outcomes.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No sessions found"
              description="Adjust your search or filter."
            />
          ) : (
            filtered.map((session) => (
              <button
                key={session.id}
                onClick={() => setActive(session.id)}
                className={cn(
                  'w-full text-left p-4 border-b border-border last:border-b-0',
                  'hover:bg-surface-secondary transition-colors duration-80',
                  active === session.id && 'bg-primary-light border-l-2 border-l-primary'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <code className="text-xs text-text-muted font-mono">{session.id}</code>
                  <span className="text-[11px] text-text-muted">{formatDate(session.date)}</span>
                </div>
                <p className="text-sm text-text-secondary truncate mb-2">{session.preview}</p>
                <div className="flex items-center justify-between">
                  <StatusBadge status={session.outcome} />
                  <span className="text-[11px] text-text-muted">{session.messages} msgs</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Right Panel: Transcript ─────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {!activeSession ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={MessageSquare}
              title="Select a session"
              description="Click a chat session on the left to view the full transcript."
            />
          </div>
        ) : (
          <>
            {/* Session header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <code className="text-xs text-text-muted font-mono">{activeSession.id}</code>
                <span className="text-xs text-text-muted">·</span>
                <span className="text-xs text-text-muted">{formatDate(activeSession.date)}</span>
                <StatusBadge status={activeSession.outcome} />
              </div>
              <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors">
                <Download size={13} />
                Export
              </button>
            </div>

            {/* Transcript */}
            <div className="flex-1 overflow-y-auto p-5">
              {activeSession.transcript.map((msg, i) => (
                <ChatBubble key={i} {...msg} />
              ))}
            </div>

            {/* Summary card */}
            {activeSession.outcome === 'Booked' && (
              <div className="px-5 pb-4 flex-shrink-0">
                <div className="bg-success-light border border-success/20 rounded-md p-3">
                  <p className="text-xs font-semibold text-success mb-0.5">Session Outcome</p>
                  <p className="text-sm text-text-primary">
                    Appointment booked via chatbot — {activeSession.messages} messages exchanged
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
