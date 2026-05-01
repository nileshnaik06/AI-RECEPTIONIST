import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MOCK_FAQS,
  DEFAULT_WORKING_HOURS,
  DEFAULT_WORKING_HOURS_CONFIG,
  DEFAULT_SERVICES,
  DEFAULT_WIDGET_SETTINGS,
  MOCK_APPOINTMENTS,
  MOCK_CHAT_SESSIONS,
  MOCK_ORIGINS,
} from '../lib/mockData';
import {
  normalizeWorkingHoursConfig,
  createDefaultWorkingHoursConfig,
} from '../lib/workingHours';

/**
 * Clinic store — single source of truth for all clinic-specific data.
 * In a multi-tenant setup, this would be fetched per-clinic on login.
 */
const useClinicStore = create(
  persist(
    (set, get) => ({
      // ─── Clinic Profile ───────────────────────────────────────
      clinic: {
        name:        'HealthFirst Clinic',
        description: 'A modern primary care clinic serving the community since 2010.',
        website:     'https://healthfirstclinic.com',
        logo:        null,
        address:     '123 Medical Drive',
        city:        'San Francisco',
        postalCode:  '94102',
        phone:       '+1 (415) 555-0182',
        email:       'hello@healthfirstclinic.com',
        isPro:       true,
        setupSteps: {
          clinicInfo:     true,
          faqs:           false,
          workingHours:   true,
          embedWidget:    false,
        },
      },

      // ─── Working Hours ─────────────────────────────────────────
      workingHours: normalizeWorkingHoursConfig(DEFAULT_WORKING_HOURS_CONFIG),

      // ─── Services ──────────────────────────────────────────────
      services: DEFAULT_SERVICES,

      // ─── Widget Settings ────────────────────────────────────────
      widgetSettings: DEFAULT_WIDGET_SETTINGS,

      // ─── FAQs ──────────────────────────────────────────────────
      faqs: MOCK_FAQS,

      // ─── Appointments (mock, would come from API) ────────────────
      appointments: MOCK_APPOINTMENTS,

      // ─── Chat Sessions ──────────────────────────────────────────
      chatSessions: MOCK_CHAT_SESSIONS,

      // ─── Allowed Origins ────────────────────────────────────────
      allowedOrigins: MOCK_ORIGINS,

      // ─── Actions ────────────────────────────────────────────────

      updateClinic: (data) =>
        set((s) => ({ clinic: { ...s.clinic, ...data } })),

      // Legacy-compatible setter (array/object)
      updateWorkingHours: (hours) =>
        set({ workingHours: normalizeWorkingHoursConfig(hours ?? DEFAULT_WORKING_HOURS) }),

      // Canonical setter for the dedicated Working Hours page
      updateWorkingHoursConfig: (updater) =>
        set((s) => {
          const next = typeof updater === 'function' ? updater(s.workingHours) : updater;
          return { workingHours: normalizeWorkingHoursConfig(next) };
        }),

      resetWorkingHoursConfig: () =>
        set({ workingHours: createDefaultWorkingHoursConfig() }),

      addService: (service) =>
        set((s) => ({ services: [...s.services, service] })),

      removeService: (service) =>
        set((s) => ({ services: s.services.filter((sv) => sv !== service) })),

      reorderServices: (services) => set({ services }),

      updateWidgetSettings: (settings) =>
        set((s) => ({ widgetSettings: { ...s.widgetSettings, ...settings } })),

      // FAQ CRUD
      addFaq: (faq) =>
        set((s) => ({
          faqs: [...s.faqs, { ...faq, id: `faq-${Date.now()}`, hits: 0 }],
        })),

      updateFaq: (id, data) =>
        set((s) => ({
          faqs: s.faqs.map((f) => (f.id === id ? { ...f, ...data } : f)),
        })),

      deleteFaq: (id) =>
        set((s) => ({ faqs: s.faqs.filter((f) => f.id !== id) })),

      reorderFaqs: (faqs) => set({ faqs }),

      // Appointment status
      updateAppointmentStatus: (id, status) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        })),

      // Allowed origins
      addOrigin: (domain) =>
        set((s) => ({ allowedOrigins: [...s.allowedOrigins, domain] })),

      removeOrigin: (domain) =>
        set((s) => ({
          allowedOrigins: s.allowedOrigins.filter((o) => o !== domain),
        })),

      // Mark a setup step as complete
      completeSetupStep: (step) =>
        set((s) => ({
          clinic: {
            ...s.clinic,
            setupSteps: { ...s.clinic.setupSteps, [step]: true },
          },
        })),

      // Reset all FAQs (danger zone)
      resetFaqs: () => set({ faqs: [] }),
    }),
    {
      name: 'linor-clinic',
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== 'object') return persistedState;
        return {
          ...persistedState,
          workingHours: normalizeWorkingHoursConfig(persistedState.workingHours),
        };
      },
    }
  )
);

export default useClinicStore;
