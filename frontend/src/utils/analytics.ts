export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window !== 'undefined' && window.trackEvent) {
    window.trackEvent(eventName, params);
  }
}
