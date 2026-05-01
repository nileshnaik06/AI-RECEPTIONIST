import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateApiKey } from '../lib/utils';

/**
 * Auth store — handles login state, user session, and API key.
 * Persisted to localStorage so the session survives page refresh.
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      apiKey: null,
      isAuthenticated: false,

      // Simulate login — replace with real API call in production
      login: (email) => {
        set({
          user: {
            id:    'usr-001',
            email,
            name:  'Dr. Sarah Chen',
            role:  'admin',
            plan:  'pro',
            avatar: null,
          },
          isAuthenticated: true,
        });
      },

      // Register generates an API key on completion
      register: (clinicData) => {
        const key = generateApiKey();
        set({
          user: {
            id:    'usr-001',
            email: clinicData.email,
            name:  clinicData.clinicName,
            role:  'admin',
            plan:  'starter',
            avatar: null,
          },
          apiKey: key,
          isAuthenticated: true,
        });
        return key;
      },

      logout: () => {
        set({ user: null, apiKey: null, isAuthenticated: false });
      },

      regenerateApiKey: () => {
        const key = generateApiKey();
        set({ apiKey: key });
        return key;
      },

      // Lazy initialize API key if not set
      getApiKey: () => {
        const { apiKey } = get();
        if (apiKey) return apiKey;
        const key = generateApiKey();
        set({ apiKey: key });
        return key;
      },
    }),
    {
      name: 'linor-auth',
      // Only persist what's needed — avoid leaking sensitive data
      partialize: (state) => ({
        user:            state.user,
        apiKey:          state.apiKey,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
