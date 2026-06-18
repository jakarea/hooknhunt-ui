// Redirect Guard - Prevents infinite redirect loops

interface RedirectRecord {
  from: string;
  to: string;
  timestamp: number;
}

const redirectHistory: RedirectRecord[] = [];
const MAX_HISTORY = 10;
const LOOP_DETECT_WINDOW = 3000; // 3 seconds
const MAX_REDIRECTS_IN_WINDOW = 5;

export function recordRedirect(from: string, to: string) {
  redirectHistory.push({
    from,
    to,
    timestamp: Date.now(),
  });

  // Keep only recent history
  if (redirectHistory.length > MAX_HISTORY) {
    redirectHistory.shift();
  }
}

export function detectInfiniteLoop(): boolean {
  const now = Date.now();
  const recentRedirects = redirectHistory.filter(
    (r) => now - r.timestamp < LOOP_DETECT_WINDOW
  );

  if (recentRedirects.length >= MAX_REDIRECTS_IN_WINDOW) {
    return true;
  }

  return false;
}

export function resetRedirectHistory() {
  redirectHistory.length = 0;
}

export function handleInfiniteLoop() {
  // Clear all auth
  localStorage.removeItem('auth_token');
  localStorage.removeItem('cached_user');
  sessionStorage.clear();

  // Clear history
  resetRedirectHistory();

  // Force navigate to login
  window.location.href = '/login?error=session_error';
}
