const DETECTION_KEYWORDS = [
  "free trial",
  "trial period",
  "subscription",
  "billing begins",
  "renewal",
  "starts charging",
  "after your trial",
  "trial ends",
];

export function scoreKeywordMatch(subject: string, body: string): number {
  const haystack = `${subject} ${body}`.toLowerCase();
  const matches = DETECTION_KEYWORDS.filter((keyword) => haystack.includes(keyword)).length;
  return Math.min(1, matches / 4);
}

export function isLikelyTrialEmail(subject: string, body: string): boolean {
  return scoreKeywordMatch(subject, body) >= 0.25;
}
