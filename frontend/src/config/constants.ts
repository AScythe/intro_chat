// constants.ts
// Description: Application configuration constants — chat duration, timer defaults, demo delays

export const CONFIG = {
  CHAT_DURATION: 30,
  MATCH_FOUND_COUNTDOWN: 60,
  TIMER_WARNING_THRESHOLD: 5,
  TIMER_DANGER_THRESHOLD: 3,

  DEMO_LOADING_DELAY_MS: 2000,
  DEMO_CONNECTION_DELAY_MS: 2000,
  SIMULATE_RESPONSE_DELAY_MS: 3000,
  SIMULATE_READY_DELAY_MS: 5000,
} as const;


