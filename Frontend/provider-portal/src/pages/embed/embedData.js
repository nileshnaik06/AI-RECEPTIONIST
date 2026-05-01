// ─── Embed Page — Data & Constants ───────────────────────────────────────────

export const PLATFORMS = ['HTML', 'React', 'WordPress', 'Webflow', 'Shopify', 'Next.js'];

export const PLATFORM_META = {
  HTML:      { label: 'HTML',      icon: '🌐', desc: 'Vanilla HTML / any CMS' },
  React:     { label: 'React',     icon: '⚛️',  desc: 'React & Vite projects' },
  WordPress: { label: 'WordPress', icon: '🅦',  desc: 'WordPress themes' },
  Webflow:   { label: 'Webflow',   icon: '🔷',  desc: 'Webflow custom code' },
  Shopify:   { label: 'Shopify',   icon: '🛍️',  desc: 'Shopify theme.liquid' },
  'Next.js': { label: 'Next.js',   icon: '▲',  desc: 'Next.js App Router' },
};

export const SNIPPET_TEMPLATES = {
  HTML: (apiKey, cfg) => `<!-- Paste before </body> on every page -->
<script>
  window.LinorConfig = {
    apiKey: "${apiKey}",
    position: "${cfg.position}",
    theme: "${cfg.theme}",
    primaryColor: "${cfg.color}",
    greeting: "${cfg.greeting}"
  };
</script>
<script src="https://cdn.linor.ai/widget.js" async defer></script>`,

  React: (apiKey, cfg) => `// 1. Install: npm install @linor/react-widget
// 2. Add to your root layout or App.jsx
import { LinorWidget } from '@linor/react-widget';

export default function App() {
  return (
    <>
      {/* your app */}
      <LinorWidget
        apiKey="${apiKey}"
        position="${cfg.position}"
        theme="${cfg.theme}"
        primaryColor="${cfg.color}"
        greeting="${cfg.greeting}"
      />
    </>
  );
}`,

  WordPress: (apiKey, cfg) => `// Add to your theme's functions.php
function linor_chatbot_script() {
  ?>
  <script>
    window.LinorConfig = {
      apiKey: "<?php echo '${apiKey}'; ?>",
      position: "${cfg.position}",
      theme: "${cfg.theme}",
      primaryColor: "${cfg.color}"
    };
  </script>
  <script src="https://cdn.linor.ai/widget.js" async defer></script>
  <?php
}
add_action('wp_footer', 'linor_chatbot_script');`,

  Webflow: (apiKey, cfg) => `<!-- Site Settings → Custom Code → Before </body> tag -->
<script>
  window.LinorConfig = {
    apiKey: "${apiKey}",
    position: "${cfg.position}",
    theme: "${cfg.theme}",
    primaryColor: "${cfg.color}"
  };
</script>
<script src="https://cdn.linor.ai/widget.js" async defer></script>`,

  Shopify: (apiKey, cfg) => `<!-- theme.liquid — before </body> -->
<script>
  window.LinorConfig = {
    apiKey: "${apiKey}",
    position: "${cfg.position}",
    theme: "${cfg.theme}",
    primaryColor: "${cfg.color}"
  };
</script>
<script src="https://cdn.linor.ai/widget.js" async defer></script>`,

  'Next.js': (apiKey, cfg) => `// app/layout.tsx — add the Script component
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script id="linor-config" strategy="beforeInteractive">
          {\`window.LinorConfig = {
            apiKey: "${apiKey}",
            position: "${cfg.position}",
            theme: "${cfg.theme}",
            primaryColor: "${cfg.color}"
          };\`}
        </Script>
        <Script
          src="https://cdn.linor.ai/widget.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}`,
};

export const FAQ_ITEMS = [
  {
    q: 'Does it slow down my website?',
    a: 'No — the script loads with async + defer flags, meaning it never blocks your main thread or delays page rendering. Average impact: < 2ms on Lighthouse score.',
  },
  {
    q: 'Will it work on multiple pages?',
    a: 'Yes. Add the snippet once in your site template (header or footer) and it appears on every page automatically. No per-page setup required.',
  },
  {
    q: 'Can I test it before going live?',
    a: 'Yes — enter any URL in the "Test It" section to open it in a new tab with your current config. You can also use our hosted sandbox page.',
  },
  {
    q: 'How do I customize the widget appearance?',
    a: 'Use the Widget Configurator above to set position, theme, color, and greeting. The snippet auto-updates. You can also configure advanced options via the Widget Settings page.',
  },
  {
    q: 'Is my API key safe in the frontend code?',
    a: 'API keys in the embed snippet are designed for client-side use and are rate-limited per domain. You can also set an allowlist of domains in the Security section above.',
  },
  {
    q: 'How do I remove the widget later?',
    a: 'Simply delete the two script tags from your HTML. The widget disappears immediately — no database changes needed.',
  },
];

export const CHECKLIST_ITEMS = [
  { id: 'copy',    label: 'Copy embed snippet',        desc: 'Get your personalized code above' },
  { id: 'paste',   label: 'Paste before </body>',      desc: 'Add to every page of your site' },
  { id: 'verify',  label: 'Verify connection',         desc: 'We\'ll auto-detect when you\'re live' },
  { id: 'test',    label: 'Send a test message',       desc: 'Confirm the widget responds correctly' },
];

export const MOCK_STATS = {
  totalConversations: 1284,
  activeToday: 23,
  avgResponseMs: 420,
  uptimePct: 99.98,
};

export const POSITIONS = [
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left',  label: 'Bottom Left' },
  { value: 'top-right',    label: 'Top Right' },
  { value: 'top-left',     label: 'Top Left' },
];

export const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark',  label: 'Dark' },
  { value: 'auto',  label: 'Auto (System)' },
];

export const PRESET_COLORS = [
  '#1A56DB', '#7C3AED', '#DB2777', '#059669',
  '#D97706', '#DC2626', '#0891B2', '#000000',
];
