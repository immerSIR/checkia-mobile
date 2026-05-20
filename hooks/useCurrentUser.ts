import { useEffect, useState } from 'react';
import { authAPI } from '../services/api';

export type CurrentUser = {
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  email: string;
  country: string;
};

const fallbackUser: CurrentUser = {
  firstName: '',
  lastName: '',
  fullName: '',
  initials: '?',
  email: '',
  country: '',
};

const initialsOf = (firstName: string, lastName: string, email: string) => {
  const first = firstName?.trim()?.[0];
  const last = lastName?.trim()?.[0];
  if (first || last) return `${first ?? ''}${last ?? ''}`.toUpperCase();
  const emailInitial = email?.trim()?.[0];
  return emailInitial ? emailInitial.toUpperCase() : '?';
};

const fullNameOf = (firstName: string, lastName: string, email: string) => {
  const fromMetadata = [firstName, lastName].filter(Boolean).join(' ').trim();
  if (fromMetadata) return fromMetadata;
  return email?.split('@')[0] ?? '';
};

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser>(fallbackUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await authAPI.me();
        if (cancelled || !data) return;
        const meta = (data.user_metadata ?? {}) as Record<string, any>;
        const firstName = (meta.first_name ?? '').toString();
        const lastName = (meta.last_name ?? '').toString();
        const email = (data.email ?? '').toString();
        const country = (meta.country ?? '').toString();
        setUser({
          firstName,
          lastName,
          fullName: fullNameOf(firstName, lastName, email),
          initials: initialsOf(firstName, lastName, email),
          email,
          country,
        });
      } catch {
        // Leave fallback values; UI handles empty strings gracefully.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}
