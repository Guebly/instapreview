/**
 * Analytics & Event Tracking
 *
 * Hook points for tracking user behavior and conversions.
 * Integrate with Google Analytics, Mixpanel, PostHog, or your analytics tool.
 */

export type AnalyticsEvent =
  | "cta_click_high_score"
  | "cta_click_low_score"
  | "cta_click_power_user"
  | "cta_click_competitor"
  | "pdf_export"
  | "template_loaded"
  | "sample_images_loaded"
  | "pattern_applied"
  | "presentation_mode_entered"
  | "high_score_achieved"
  | "low_score_detected"
  | "power_user_detected";

interface EventData {
  [key: string]: any;
}

/**
 * Track analytics event
 * TODO: Integrate with your analytics provider
 */
export function trackEvent(event: AnalyticsEvent, data?: EventData): void {
  // Example: Google Analytics
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', event, data);
  // }

  // Example: Mixpanel
  // if (typeof window !== 'undefined' && window.mixpanel) {
  //   window.mixpanel.track(event, data);
  // }

  // Example: PostHog
  // if (typeof window !== 'undefined' && window.posthog) {
  //   window.posthog.capture(event, data);
  // }

  // Console log in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", event, data);
  }
}

/**
 * Identify user for analytics
 */
export function identifyUser(userId: string, traits?: EventData): void {
  // TODO: Implement user identification
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics] Identify:", userId, traits);
  }
}

/**
 * Track conversion (CTA click that leads to Guebly)
 */
export function trackConversion(source: string, username?: string): void {
  trackEvent("cta_click_high_score" as AnalyticsEvent, {
    source,
    username,
    timestamp: new Date().toISOString(),
  });

  // TODO: Send to conversion tracking API
  // fetch('/api/conversions', {
  //   method: 'POST',
  //   body: JSON.stringify({ source, username }),
  // });
}

/**
 * Track power user behavior
 * Trigger when user uses 3+ advanced features
 */
export function detectPowerUser(usedFeatures: string[]): void {
  if (usedFeatures.length >= 3) {
    trackEvent("power_user_detected", { features: usedFeatures });
    // TODO: Show special CTA for power users
  }
}

/**
 * Track funnel stage
 */
export type FunnelStage = "landed" | "used_template" | "saw_analysis" | "exported_pdf" | "clicked_cta";

export function trackFunnel(stage: FunnelStage): void {
  trackEvent(stage as any);
}
