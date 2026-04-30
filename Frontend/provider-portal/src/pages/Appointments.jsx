import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, ChevronLeft, ChevronRight,
  MoreHorizontal, X, CalendarDays, Filter,
} from 'lucide-react';
import useClinicStore from '../store/useClinicStore';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { useToast } from '../components/shared/Toast';
import { formatDate, formatTime, cn } from '../lib/utils';

const STATUSES = ['All', 'Pending', 'Confirmed', 'Cancelled'];
const PAGE_SIZE = 10;

// ─── Appointment Detail Drawer ────────────────────────────────────────────────

function DetailDrawer({ appointment, onClose, onStatusChange }) {
  if (!appointment) return null;
  const toast = useToast();

  const handleConfirm = () => {
    onStatusChange(appointment.id, 'Confirmed');
    toast.success(`${appointment.patient}'s appointment confirmed.`);
    onClose();
  };

  const handleCancel = () => {
    onStatusChange(appointment.id, 'Cancelled');
    toast.info(`Appointment cancelled.`);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 z-30 bg-black/20" />
      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="fixed top-[60px] right-0 bottom-0 z-40 w-[400px] bg-surface border-l border-border overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-h3 text-text-primary">{appointment.patient}</h2>
              <StatusBadge status={appointment.status} className="mt-1" />
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Details */}
          <dl className="space-y-3 mb-6">
            {[
              ['Service',   appointment.service],
              ['Date',      formatDate(appointment.date)],
              ['Time',      appointment.time],
              ['Phone',     appointment.phone],
              ['Booked At', formatDate(appointment.bookedAt, { hour: '2-digit', minute: '2-digit' })],
              ['Session',   appointment.sessionId],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-4">
                <dt className="text-label uppercase text-text-muted w-20 flex-shrink-0">{label}</dt>
                <dd className="text-sm text-text-primary font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          {/* Timeline */}
          <div className="mb-6">
            <h4 className="text-label uppercase text-text-muted mb-3">Timeline</h4>
            <div className="space-y-3">
              {[
                { label: 'Booked via chatbot', time: appointment.bookedAt, done: true },
                { label: 'Appointment scheduled', time: appointment.date, done: true },
                { label: appointment.status === 'Confirmed' ? 'Confirmed' : appointment.status === 'Cancelled' ? 'Cancelled' : 'Awaiting confirmation', time: null, done: appointment.status !== 'Pending' },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={cn(
                    'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                    step.done ? 'bg-success' : 'bg-border'
                  )} />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{step.label}</p>
                    {step.time && <p className="text-xs text-text-muted">{formatDate(step.time)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {appointment.status === 'Pending' && (
            <div className="flex gap-2">
              <button onClick={handleConfirm}
                className="flex-1 h-9 rounded-md text-sm font-semibold text-white bg-success hover:opacity-90 transition-opacity">
                Confirm Appointment
              </button>
              <button onClick={handleCancel}
                className="flex-1 h-9 rounded-md text-sm font-semibold border border-danger text-danger hover:bg-danger-light transition-colors">
                Cancel
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ─── Appointments Page ────────────────────────────────────────────────────────

export default function Appointments() {
  const { appointments, updateAppointmentStatus } = useClinicStore();
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('All');
  const [page, setPage]         = useState(1);
  const [selected, setSelected] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const toast = useToast();

  // Filter logic
  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const matchStatus = status === 'All' || a.status === status;
      const matchSearch = !search || [a.patient, a.service, a.phone].some(
        (f) => f.toLowerCase().includes(search.toLowerCase())
      );
      return matchStatus && matchSearch;
    });
  }, [appointments, status, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabCounts = {
    All:       appointments.length,
    Pending:   appointments.filter((a) => a.status === 'Pending').length,
    Confirmed: appointments.filter((a) => a.status === 'Confirmed').length,
    Cancelled: appointments.filter((a) => a.status === 'Cancelled').length,
  };

  const toggleRow = (id) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkConfirm = () => {
    selectedRows.forEach((id) => updateAppointmentStatus(id, 'Confirmed'));
    toast.success(`${selectedRows.size} appointments confirmed.`);
    setSelectedRows(new Set());
  };

  return (
    <div className="space-y-4 max-w-[1400px]">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-h2 text-text-primary">Appointments</h1>
          <span className="badge bg-surface-secondary text-text-secondary">
            {appointments.length} total
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedRows.size > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-2"
            >
              <button onClick={handleBulkConfirm}
                className="h-9 px-3 text-sm font-medium bg-success text-white rounded-md hover:opacity-90">
                Confirm {selectedRows.size}
              </button>
              <button onClick={() => {
                selectedRows.forEach((id) => updateAppointmentStatus(id, 'Cancelled'));
                setSelectedRows(new Set());
                toast.info('Selected appointments cancelled.');
              }}
                className="h-9 px-3 text-sm font-medium border border-danger text-danger rounded-md hover:bg-danger-light">
                Cancel {selectedRows.size}
              </button>
            </motion.div>
          )}
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search patients..."
              className="h-9 pl-9 pr-3 w-48 text-sm border border-border rounded-md bg-surface focus:outline-none focus:border-primary"
            />
          </div>
          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="h-9 px-3 text-sm border border-border rounded-md bg-surface text-text-secondary focus:outline-none"
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button className="h-9 px-3 flex items-center gap-2 text-sm border border-border rounded-md hover:bg-surface-secondary text-text-secondary transition-colors">
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────── */}
      <div className="flex gap-0 border-b border-border">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-150 -mb-px',
              status === s
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-primary'
            )}
          >
            {s}
            {tabCounts[s] > 0 && (
              <span className={cn(
                'ml-2 px-1.5 py-0.5 text-xs rounded-full',
                status === s ? 'bg-primary text-white' : 'bg-surface-secondary text-text-muted'
              )}>
                {tabCounts[s]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Table ───────────────────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-md overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No appointments found"
            description="Try adjusting your filters or date range."
            action={{ label: 'Clear Filters', onClick: () => { setSearch(''); setStatus('All'); } }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-10">
                    <input type="checkbox" onChange={(e) => {
                      setSelectedRows(e.target.checked ? new Set(paginated.map((a) => a.id)) : new Set());
                    }} className="rounded" />
                  </th>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Booked At</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {paginated.map((appt) => (
                  <tr
                    key={appt.id}
                    onClick={() => setSelected(appt)}
                    className={cn('cursor-pointer', selectedRows.has(appt.id) && 'bg-primary-light')}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(appt.id)}
                        onChange={() => toggleRow(appt.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="font-medium text-text-primary">{appt.patient}</td>
                    <td className="font-mono text-xs">{appt.phone}</td>
                    <td>{appt.service}</td>
                    <td>{formatDate(appt.date)}</td>
                    <td>{appt.time}</td>
                    <td><StatusBadge status={appt.status} /></td>
                    <td className="text-xs">{formatDate(appt.bookedAt)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button className="text-text-muted hover:text-text-primary">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ──────────────────────────────────────────── */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between text-sm text-text-muted">
          <span>
            Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-border hover:bg-surface-secondary disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={cn(
                  'w-8 h-8 text-xs rounded-md border transition-colors',
                  n === page ? 'bg-primary border-primary text-white' : 'border-border hover:bg-surface-secondary'
                )}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-border hover:bg-surface-secondary disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Detail Drawer ─────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <DetailDrawer
            appointment={selected}
            onClose={() => setSelected(null)}
            onStatusChange={updateAppointmentStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
