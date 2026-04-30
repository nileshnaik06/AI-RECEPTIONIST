import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Home, LayoutDashboard, Search, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

function getShortPath(pathname) {
  if (!pathname) return '/';
  if (pathname.length <= 28) return pathname;
  const parts = pathname.split('/').filter(Boolean);
  const tail = parts.slice(-2).join('/');
  return `/${parts.length > 2 ? '…/' : ''}${tail}`;
}

export default function NotFound() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const reduceMotion = useReducedMotion();

  const primaryHref = isAuthenticated ? '/dashboard' : '/login';
  const primaryLabel = isAuthenticated ? 'Go to dashboard' : 'Go to login';
  const pathLabel = getShortPath(pathname);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(26,86,219,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,159,110,0.08),transparent_24%),linear-gradient(180deg,var(--background)_0%,var(--background)_100%)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-9rem] h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-7rem] right-[-5rem] h-64 w-64 rounded-full bg-text-muted/10 blur-3xl" />
        <div className="absolute left-[10%] top-[18%] h-px w-24 bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <div className="absolute right-[14%] top-[28%] h-px w-20 bg-gradient-to-r from-transparent via-border-strong to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl items-center px-6 py-8 lg:px-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12"
        >
          <div className="max-w-xl">
            <motion.div
              variants={itemVariants}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary backdrop-blur"
            >
              <Search size={14} />
              Page not found
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-5 text-left">
              <div>
                <p className="font-mono text-sm font-medium tracking-[0.32em] text-text-muted">
                  404
                </p>
                <h1 className="mt-2 max-w-[12ch] text-5xl font-semibold tracking-[-0.05em] text-text-primary md:text-6xl">
                  This route does not exist.
                </h1>
              </div>

              <p className="max-w-lg text-base leading-7 text-text-secondary md:text-lg">
                The page you requested is not registered in the portal. You can return to a safe
                entry point or use the browser back action if you just navigated here.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(primaryHref, { replace: true })}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-primary/10 bg-primary px-5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-hover"
              >
                <Home size={16} />
                {primaryLabel}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-surface-secondary"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 flex items-center gap-2 text-sm text-text-secondary">
              <Sparkles size={16} className="text-primary" />
              <span>Premium recovery flow. No dead-end, no extra noise.</span>
            </motion.div>
          </div>

          <motion.section
            variants={itemVariants}
            animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
            transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(255,255,255,0.55))] blur-xl dark:bg-[linear-gradient(180deg,rgba(22,27,34,0.88),rgba(22,27,34,0.58))]" />

            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface/90 p-6 backdrop-blur-xl md:p-8">
              <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-success/10 blur-3xl" aria-hidden="true" />

              <div className="relative space-y-6 text-left">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                      Route status
                    </p>
                    <h2 className="mt-1 text-h2 text-text-primary">Unmatched path</h2>
                  </div>

                  <div className="rounded-full border border-border bg-surface-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
                    404
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background/80 p-4 md:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                      Current path
                    </span>
                    <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">
                      Not registered
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl border border-dashed border-border-strong bg-surface px-4 py-4">
                    <p className="font-mono text-sm text-text-secondary">{pathLabel}</p>
                    <p className="mt-2 text-sm leading-6 text-text-muted">
                      The portal could not map this route to a valid view.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Stable', value: 'Clean state' },
                    { label: 'Fast', value: 'Zero scroll' },
                    { label: 'Clear', value: 'One action' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-border bg-surface px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-text-primary">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </main>
  );
}