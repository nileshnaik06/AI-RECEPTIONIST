import { useState, useMemo } from 'react';
import {
  Eye, EyeOff, RefreshCw, ExternalLink,
  Shield, ChevronRight, Rocket, Code2,
  Settings2, HelpCircle, Activity
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { CopyButton } from '../../components/shared/CopyButton';
import { ConfirmModal } from '../../components/shared/ConfirmModal';
import { useToast } from '../../components/shared/Toast';
import { maskApiKey, cn } from '../../lib/utils';
import { SNIPPET_TEMPLATES } from './embedData';
import {
  SectionCard,
  SectionHeader,
  PlatformTabs,
  CodeBlock,
  WidgetConfigurator,
  WidgetPreview,
  DomainAllowlist,
  DeployChecklist,
  MiniStatsBar,
  ConnectionStatus,
  FaqAccordion,
  SecurityBadges,
} from './EmbedComponents';

// ─── Default widget config ─────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  position: 'bottom-right',
  theme: 'light',
  color: '#1A56DB',
  greeting: 'Hi! How can I help you today?',
};

// ─── Sidebar nav sections ──────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'api-key', icon: Shield, label: 'API Key' },
  { id: 'configurator', icon: Settings2, label: 'Configurator' },
  { id: 'snippet', icon: Code2, label: 'Embed Snippet' },
  { id: 'test', icon: Activity, label: 'Test & Verify' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'checklist', icon: Rocket, label: 'Go Live' },
  { id: 'faq', icon: HelpCircle, label: 'FAQ' },
];

// ─── Main EmbedCode Page ────────────────────────────────────────────────────
export default function EmbedCode() {
  const { getApiKey, regenerateApiKey } = useAuthStore();
  const apiKey = getApiKey();
  const toast = useToast();

  // State
  const [revealed, setRevealed] = useState(false);
  const [regenOpen, setRegenOpen] = useState(false);
  const [activePlatform, setActivePlatform] = useState('HTML');
  const [testUrl, setTestUrl] = useState('');
  const [testUrlErr, setTestUrlErr] = useState('');
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [domains, setDomains] = useState([]);
  const [checked, setChecked] = useState(new Set());
  const [activeSection, setActiveSection] = useState(null);

  const connected = true; // In production: derive from real API call

  // Memoize snippet to avoid recalculation on each render
  const snippet = useMemo(
    () => SNIPPET_TEMPLATES[activePlatform]?.(apiKey, config) ?? '',
    [activePlatform, apiKey, config]
  );

  // Handlers
  const handleRegenerate = () => {
    regenerateApiKey();
    setRegenOpen(false);
    setRevealed(false);
    toast.success('API key regenerated — update your embed snippet.');
  };

  const validateUrl = (url) => {
    try { new URL(url); return true; } catch { return false; }
  };

  const handleOpenTest = () => {
    if (!testUrl) return;
    if (!validateUrl(testUrl)) { setTestUrlErr('Please enter a valid URL (include https://)'); return; }
    setTestUrlErr('');
    window.open(testUrl, '_blank', 'noopener,noreferrer');
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  };

  return (
    <div className="flex gap-6 max-w-6xl">

      {/* ── Sticky Sidebar Navigation ──────────────────────────── */}
      <aside className="hidden lg:flex flex-col gap-1 w-44 flex-shrink-0 sticky top-20 self-start">
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-2 mb-2">
          On this page
        </p>
        {NAV_SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={cn(
              'flex items-center gap-2 text-xs px-2 py-1.5 rounded-md text-left transition-colors',
              activeSection === s.id
                ? 'text-primary bg-primary-light font-medium'
                : 'text-text-muted hover:text-text-primary hover:bg-surface-secondary'
            )}
          >
            <s.icon size={12} />
            {s.label}
          </button>
        ))}
      </aside>

      {/* ── Main Content ────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* ── Page Header ─────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary leading-tight">Embed Your Chatbot</h1>
            <p className="text-sm text-text-muted mt-1">
              Paste 2 lines of code and your AI receptionist goes live instantly.
            </p>
          </div>
          {/* Live indicator */}
          {connected && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-success bg-success-light border border-success/20 px-3 py-1.5 rounded-full flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Live
            </span>
          )}
        </div>

        {/* ── Mini Stats ──────────────────────────────────────── */}
        <MiniStatsBar />

        {/* ── Step 1: API Key ─────────────────────────────────── */}
        <div id="api-key">
          <SectionCard>
            <SectionHeader
              step={1}
              title="Your API Key"
              subtitle="Keep this private — never expose it in public repositories."
            />

            <div className="bg-surface-secondary border border-border rounded-xl p-3 flex items-center gap-3">
              <code className="mono flex-1 text-text-primary truncate text-[13px]">
                {revealed ? apiKey : maskApiKey(apiKey)}
              </code>
              <button
                onClick={() => setRevealed((v) => !v)}
                className="text-text-muted hover:text-text-primary transition-colors flex-shrink-0 p-1"
                aria-label={revealed ? 'Hide API key' : 'Reveal API key'}
              >
                {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <CopyButton text={apiKey} />
            </div>

            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => setRegenOpen(true)}
                className="flex items-center gap-1.5 text-xs text-danger hover:underline transition-colors"
              >
                <RefreshCw size={12} />
                Regenerate Key
              </button>
              <span className="text-text-muted text-xs">·</span>
              <span className="text-xs text-text-muted">
                Keys are domain-rate-limited — safe for client-side use.
              </span>
            </div>
          </SectionCard>
        </div>

        {/* ── Step 2: Widget Configurator ─────────────────────── */}
        <div id="configurator">
          <SectionCard>
            <SectionHeader
              step={2}
              title="Widget Configurator"
              subtitle="Customize appearance — the snippet below updates in real-time."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <WidgetConfigurator config={config} onChange={setConfig} />
              <WidgetPreview config={config} />
            </div>
          </SectionCard>
        </div>

        {/* ── Step 3: Embed Snippet ───────────────────────────── */}
        <div id="snippet">
          <SectionCard>
            <SectionHeader
              step={3}
              title="Copy the Embed Snippet"
              subtitle="Choose your platform — the snippet is pre-configured with your key and settings."
            />
            <PlatformTabs active={activePlatform} onChange={setActivePlatform} />
            <CodeBlock code={snippet} language={activePlatform} />
            <p className="text-xs text-text-muted mt-3 flex items-center gap-1">
              <ChevronRight size={11} />
              Paste this code before the closing{' '}
              <code className="mono text-[11px] bg-surface-secondary px-1.5 py-0.5 rounded">&lt;/body&gt;</code>{' '}
              tag on every page.
            </p>
          </SectionCard>
        </div>

        {/* ── Step 4: Test & Verify ───────────────────────────── */}
        <div id="test">
          <SectionCard>
            <SectionHeader
              step={4}
              title="Test It"
              subtitle="Open any URL to check the widget renders correctly on your site."
            />

            <div className="flex gap-2 mb-2">
              <input
                value={testUrl}
                onChange={(e) => { setTestUrl(e.target.value); setTestUrlErr(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleOpenTest()}
                placeholder="https://yourwebsite.com"
                className={cn(
                  'flex-1 h-10 px-3 text-sm border rounded-xl bg-surface-secondary text-text-primary',
                  'placeholder:text-text-muted focus:outline-none transition-colors',
                  testUrlErr ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'
                )}
              />
              <button
                onClick={handleOpenTest}
                disabled={!testUrl}
                className="h-10 px-4 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-40 flex items-center gap-2 transition-colors"
              >
                <ExternalLink size={14} />
                Open Test
              </button>
            </div>
            {testUrlErr && <p className="text-xs text-danger mb-2">{testUrlErr}</p>}

            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => window.open('https://sandbox.linor.ai', '_blank', 'noopener')}
                className="text-xs text-primary hover:underline flex items-center gap-1.5"
              >
                <ExternalLink size={12} />
                Test on sandbox page →
              </button>
              <span className="text-border">|</span>
              <a href="/logs" className="text-xs text-text-muted hover:text-primary transition-colors flex items-center gap-1.5">
                <Activity size={12} />
                View live chat logs →
              </a>
            </div>

            {/* Verify Connection */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Connection Status</p>
              <ConnectionStatus connected={connected} />
            </div>
          </SectionCard>
        </div>

        {/* ── Security — Domain Allowlist ─────────────────────── */}
        <div id="security">
          <SectionCard>
            <SectionHeader
              step={5}
              title="Security — Domain Allowlist"
              subtitle="Restrict the widget to specific domains. Leave empty to allow all."
            />
            <DomainAllowlist domains={domains} onChange={setDomains} />
            <SecurityBadges />
          </SectionCard>
        </div>

        {/* ── Go Live Checklist ───────────────────────────────── */}
        <div id="checklist">
          <SectionCard>
            <SectionHeader
              step={6}
              title="Go Live Checklist"
              subtitle="Track your deployment progress — check off each step as you complete it."
            />
            <DeployChecklist checked={checked} onChange={setChecked} />
          </SectionCard>
        </div>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <div id="faq">
          <SectionCard>
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle size={16} className="text-text-muted" />
              <h2 className="text-sm font-semibold text-text-primary">Frequently Asked Questions</h2>
            </div>
            <FaqAccordion />
          </SectionCard>
        </div>

        {/* ── Docs CTA ─────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-primary-light to-surface border border-border rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-text-primary">Need advanced configuration?</p>
            <p className="text-xs text-text-muted mt-0.5">
              Explore the full API reference, webhook events, and custom styling options in our docs.
            </p>
          </div>
          <a
            href="https://docs.linor.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 h-9 px-4 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex-shrink-0"
          >
            View Docs <ExternalLink size={12} />
          </a>
        </div>

      </div>

      {/* Regenerate Key Modal */}
      <ConfirmModal
        open={regenOpen}
        onClose={() => setRegenOpen(false)}
        onConfirm={handleRegenerate}
        title="Regenerate API Key?"
        description="This invalidates your current key immediately. Any site using the old key will break until you update the snippet."
        confirmLabel="Yes, Regenerate"
        confirmDanger
      />
    </div>
  );
}
