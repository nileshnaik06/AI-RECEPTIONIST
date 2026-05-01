import { useState, useCallback } from 'react';
import {
  ChevronDown, ChevronUp, Check, AlertCircle, Shield,
  Zap, MessageSquare, Clock, Activity, Plus, X, Globe,
  TrendingUp, BarChart2, Wifi
} from 'lucide-react';
import { cn, copyToClipboard } from '../../lib/utils';
import {
  FAQ_ITEMS, CHECKLIST_ITEMS,
  POSITIONS, THEMES, PRESET_COLORS, PLATFORM_META, PLATFORMS
} from './embedData';

/* ─── Step Badge ─────────────────────────────────────────────────────────── */
export function StepBadge({ n, done }) {
  return (
    <div className={cn(
      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300',
      done
        ? 'bg-success text-white'
        : 'bg-primary text-white'
    )}>
      {done ? <Check size={13} /> : n}
    </div>
  );
}

/* ─── Section Card ───────────────────────────────────────────────────────── */
export function SectionCard({ children, className }) {
  return (
    <div className={cn(
      'bg-surface border border-border rounded-xl p-5 transition-shadow hover:shadow-sm',
      className
    )}>
      {children}
    </div>
  );
}

/* ─── Section Header ─────────────────────────────────────────────────────── */
export function SectionHeader({ step, title, subtitle, done }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <StepBadge n={step} done={done} />
      <div>
        <h2 className="text-sm font-semibold text-text-primary leading-none">{title}</h2>
        {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ─── Platform Tab Bar ───────────────────────────────────────────────────── */
export function PlatformTabs({ active, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-4 scrollbar-none border-b border-border">
      {PLATFORMS.map((tab) => {
        const meta = PLATFORM_META[tab];
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            title={meta.desc}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-md whitespace-nowrap border-b-2 -mb-px transition-all duration-150',
              active === tab
                ? 'border-primary text-primary bg-primary-light'
                : 'border-transparent text-text-muted hover:text-text-primary hover:bg-surface-secondary'
            )}
          >
            <span>{meta.icon}</span>
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Inline Copy Button ─────────────────────────────────────────────────── */
export function InlineCopyBtn({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-medium border transition-all duration-150',
        copied
          ? 'border-success text-success bg-success-light'
          : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary bg-surface hover:bg-surface-secondary'
      )}
    >
      {copied ? <Check size={11} /> : null}
      {copied ? 'Copied!' : label}
    </button>
  );
}

/* ─── Code Block ─────────────────────────────────────────────────────────── */
export function CodeBlock({ code, language = 'html' }) {
  const lines = code.split('\n');

  const tokenize = (line) => {
    // Very lightweight syntax highlight
    return line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/(\/\/.*$)/g, '<span style="color:#6A9955">$1</span>')
      .replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color:#CE9178">$1</span>')
      .replace(/\b(window|const|export|import|default|return|function|async|defer|from)\b/g,
        '<span style="color:#569CD6">$1</span>')
      .replace(/\b(apiKey|position|theme|primaryColor|greeting|src|strategy)\b/g,
        '<span style="color:#9CDCFE">$1</span>');
  };

  return (
    <div className="code-block overflow-hidden rounded-xl">
      {/* top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2A3140]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <span className="text-[10px] text-[#5A6477] font-mono uppercase tracking-wider">{language}</span>
        <InlineCopyBtn text={code} />
      </div>
      <div className="overflow-x-auto">
        <pre className="px-4 py-4 text-xs leading-6 font-mono">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="select-none w-8 text-[#3A4458] text-right mr-4 flex-shrink-0 text-[11px]">
                {i + 1}
              </span>
              <span
                className="text-[#E6EDF3] flex-1"
                dangerouslySetInnerHTML={{ __html: tokenize(line) || ' ' }}
              />
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

/* ─── Widget Configurator ────────────────────────────────────────────────── */
export function WidgetConfigurator({ config, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
      {/* Position */}
      <div>
        <label className="text-xs font-medium text-text-muted mb-1.5 block">Widget Position</label>
        <select
          value={config.position}
          onChange={(e) => onChange({ ...config, position: e.target.value })}
          className="w-full h-9 px-3 text-sm border border-border rounded-lg bg-surface-secondary text-text-primary focus:outline-none focus:border-primary transition-colors"
        >
          {POSITIONS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Theme */}
      <div>
        <label className="text-xs font-medium text-text-muted mb-1.5 block">Theme</label>
        <select
          value={config.theme}
          onChange={(e) => onChange({ ...config, theme: e.target.value })}
          className="w-full h-9 px-3 text-sm border border-border rounded-lg bg-surface-secondary text-text-primary focus:outline-none focus:border-primary transition-colors"
        >
          {THEMES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Greeting */}
      <div className="sm:col-span-2">
        <label className="text-xs font-medium text-text-muted mb-1.5 block">Welcome Greeting</label>
        <input
          type="text"
          value={config.greeting}
          onChange={(e) => onChange({ ...config, greeting: e.target.value })}
          placeholder="Hi! How can I help you today?"
          maxLength={100}
          className="w-full h-9 px-3 text-sm border border-border rounded-lg bg-surface-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Color */}
      <div className="sm:col-span-2">
        <label className="text-xs font-medium text-text-muted mb-1.5 block">Accent Color</label>
        <div className="flex items-center gap-2 flex-wrap">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              title={c}
              onClick={() => onChange({ ...config, color: c })}
              style={{ backgroundColor: c }}
              className={cn(
                'w-7 h-7 rounded-full transition-all duration-150 flex-shrink-0',
                config.color === c
                  ? 'ring-2 ring-offset-2 ring-offset-surface scale-110 ring-primary'
                  : 'hover:scale-110'
              )}
            />
          ))}
          <div className="flex items-center gap-2 ml-1">
            <input
              type="color"
              value={config.color}
              onChange={(e) => onChange({ ...config, color: e.target.value })}
              className="w-7 h-7 rounded-full border-2 border-border cursor-pointer bg-transparent p-0 appearance-none"
              title="Custom color"
            />
            <code className="text-xs text-text-muted font-mono bg-surface-secondary px-2 py-1 rounded-md">
              {config.color}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Live Widget Preview ─────────────────────────────────────────────────── */
export function WidgetPreview({ config }) {
  const posMap = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left':  'bottom-4 left-4',
    'top-right':    'top-4 right-4',
    'top-left':     'top-4 left-4',
  };

  return (
    <div className={cn(
      'relative rounded-xl overflow-hidden border border-border',
      'bg-gradient-to-br from-surface-secondary to-surface',
      'h-52'
    )}>
      {/* Mock site content */}
      <div className="p-4 opacity-30 pointer-events-none select-none mt-8">
        <div className="h-2 bg-text-muted rounded w-32 mb-2" />
        <div className="h-2 bg-text-muted rounded w-48 mb-2" />
        <div className="h-2 bg-text-muted rounded w-40" />
      </div>

      {/* Widget bubble */}
      <div className={cn('absolute flex flex-col items-end gap-2', posMap[config.position] || 'bottom-4 right-4')}>
        {/* Greeting bubble */}
        <div className="bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary shadow-md max-w-[160px] text-center leading-snug">
          {config.greeting || 'Hi! How can I help?'}
        </div>
        {/* FAB */}
        <button
          style={{ backgroundColor: config.color }}
          className="w-11 h-11 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-105"
        >
          <MessageSquare size={18} />
        </button>
      </div>

      <span className="absolute top-2 left-2 text-[10px] text-text-muted font-medium bg-surface/70 px-2 py-0.5 rounded-full border border-border">
        Live Preview
      </span>
    </div>
  );
}

/* ─── Domain Allowlist ───────────────────────────────────────────────────── */
export function DomainAllowlist({ domains, onChange }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const isValidDomain = (d) => /^(\*\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(d.trim());

  const add = () => {
    const d = input.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!d) return;
    if (!isValidDomain(d)) { setError('Enter a valid domain (e.g. example.com)'); return; }
    if (domains.includes(d)) { setError('Already in list'); return; }
    onChange([...domains, d]);
    setInput('');
    setError('');
  };

  const remove = (d) => onChange(domains.filter((x) => x !== d));

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="example.com or *.example.com"
            className="w-full h-9 pl-8 pr-3 text-sm border border-border rounded-lg bg-surface-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          onClick={add}
          className="h-9 px-3 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-1.5"
        >
          <Plus size={13} /> Add
        </button>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}

      {domains.length === 0 ? (
        <p className="text-xs text-text-muted py-2 px-3 bg-surface-secondary rounded-lg border border-border border-dashed text-center">
          No restrictions — widget runs on any domain. Add domains to restrict.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {domains.map((d) => (
            <span key={d} className="flex items-center gap-1.5 text-xs font-mono bg-surface-secondary border border-border px-2.5 py-1 rounded-lg text-text-primary">
              {d}
              <button onClick={() => remove(d)} className="text-text-muted hover:text-danger transition-colors">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Deployment Checklist ───────────────────────────────────────────────── */
export function DeployChecklist({ checked, onChange }) {
  const toggle = (id) => {
    const next = new Set(checked);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange(next);
  };
  const pct = Math.round((checked.size / CHECKLIST_ITEMS.length) * 100);

  return (
    <div>
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-text-muted">{checked.size} / {CHECKLIST_ITEMS.length} complete</span>
        <span className={cn('text-xs font-semibold', pct === 100 ? 'text-success' : 'text-primary')}>{pct}%</span>
      </div>
      <div className="h-1.5 bg-surface-secondary rounded-full mb-4 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: pct === 100 ? 'var(--success)' : 'var(--primary)' }}
        />
      </div>

      <div className="space-y-2">
        {CHECKLIST_ITEMS.map((item) => {
          const done = checked.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-150',
                done
                  ? 'border-success/30 bg-success-light'
                  : 'border-border hover:border-border-strong bg-surface-secondary hover:bg-surface'
              )}
            >
              <div className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all',
                done ? 'bg-success border-success' : 'border-border'
              )}>
                {done && <Check size={10} className="text-white" />}
              </div>
              <div>
                <p className={cn('text-xs font-medium', done ? 'text-success line-through' : 'text-text-primary')}>{item.label}</p>
                <p className="text-[11px] text-text-muted">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Mini Stats Bar ─────────────────────────────────────────────────────── */
export function MiniStatsBar() {
  const stats = [
    { icon: MessageSquare, label: 'Total Conversations', value: '1,284',  color: 'text-primary' },
    { icon: Activity,      label: 'Active Today',        value: '23',      color: 'text-success' },
    { icon: Zap,           label: 'Avg Response',        value: '420ms',   color: 'text-warning' },
    { icon: TrendingUp,    label: 'Uptime',              value: '99.98%',  color: 'text-success' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-surface-secondary rounded-lg p-3 border border-border">
          <s.icon size={14} className={cn('mb-2', s.color)} />
          <p className="text-base font-bold text-text-primary leading-none">{s.value}</p>
          <p className="text-[11px] text-text-muted mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Connection Status ───────────────────────────────────────────────────── */
export function ConnectionStatus({ connected }) {
  return (
    <div className={cn(
      'flex items-start gap-3 p-4 rounded-xl border',
      connected ? 'bg-success-light border-success/20' : 'bg-warning-light border-warning/20'
    )}>
      <div className="flex-shrink-0 mt-0.5">
        {connected ? (
          <div className="relative">
            <Wifi size={18} className="text-success" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-success rounded-full animate-pulse" />
          </div>
        ) : (
          <AlertCircle size={18} className="text-warning" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-semibold', connected ? 'text-success' : 'text-warning')}>
          {connected ? 'Connected — last activity 2 hours ago' : 'Waiting for first connection'}
        </p>
        <p className="text-xs text-text-muted mt-0.5">
          {connected
            ? 'Your chatbot is live and receiving requests.'
            : 'Paste the snippet and send a test message to verify.'}
        </p>
        {connected && (
          <a href="/logs" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1.5">
            <BarChart2 size={11} /> View in Chat Logs →
          </a>
        )}
      </div>
      <span className={cn(
        'flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full',
        connected ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
      )}>
        {connected ? 'LIVE' : 'PENDING'}
      </span>
    </div>
  );
}

/* ─── FAQ Accordion ───────────────────────────────────────────────────────── */
export function FaqAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div className="divide-y divide-border">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-4 text-left group"
          >
            <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors pr-4">
              {item.q}
            </span>
            <span className="flex-shrink-0 text-text-muted">
              {open === i ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </span>
          </button>
          {open === i && (
            <p className="text-sm text-text-secondary pb-4 leading-relaxed">
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Security Badge Row ─────────────────────────────────────────────────── */
export function SecurityBadges() {
  const items = [
    { icon: Shield, label: 'TLS 1.3 Encrypted' },
    { icon: Clock,  label: 'Rate Limited' },
    { icon: Globe,  label: 'Domain Restricted' },
  ];
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {items.map((s) => (
        <span key={s.label} className="flex items-center gap-1.5 text-[11px] font-medium text-text-muted bg-surface-secondary border border-border px-2.5 py-1 rounded-full">
          <s.icon size={11} className="text-success" /> {s.label}
        </span>
      ))}
    </div>
  );
}
