// utils/intentDetector.js

const INTENT_PATTERNS = [
  {
    intent: "book_appointment",
    pattern:
      /\b(book|schedule|appointment|fix|arrange|visit|see\s+doctor|consult)\b/i,
  },
  {
    intent: "cancel_appointment",
    pattern:
      /\b(cancel|reschedule|postpone|remove|delete).{0,20}(appointment|booking|visit)\b/i,
  },
  {
    intent: "ask_faq",
    pattern:
      /\b(hours?|timing|open|close|fee|cost|price|charge|doctor|service|available|location|address|walk.?in|home\s+visit|teleconsult)\b/i,
  },
  {
    intent: "greeting",
    pattern:
      /^(hi|hello|hey|good\s+(morning|afternoon|evening|night)|namaste|hii+|helo)\b/i,
  },
];

const detectIntent = (message) => {
  const trimmed = message.trim();

  for (const { intent, pattern } of INTENT_PATTERNS) {
    if (pattern.test(trimmed)) return intent;
  }

  return "unknown";
};

module.exports = { detectIntent };
