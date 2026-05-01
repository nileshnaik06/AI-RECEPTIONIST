// utils/promptBuilder.js

const buildSystemPrompt = (tenant, faqs) => {
  const { clinicName, settings } = tenant;
  const { workingHours, doctors, services, greetingMessage } = settings;

  const doctorList = doctors
    .map((d) => `  - ${d.name} (${d.specialization})`)
    .join("\n");

  const serviceList = services.map((s) => `  - ${s}`).join("\n");

  const faqBlock = faqs
    .map((f) => `  Q: ${f.question}\n  A: ${f.answer}`)
    .join("\n\n");

  return `
You are an AI receptionist for ${clinicName}.
Your job is to assist patients professionally and warmly.

CLINIC INFORMATION:
  Working Hours : ${workingHours}

AVAILABLE DOCTORS:
${doctorList}

SERVICES OFFERED:
${serviceList}

FREQUENTLY ASKED QUESTIONS:
${faqBlock}

RULES YOU MUST FOLLOW:
1. Only answer questions related to this clinic.
2. If asked something outside the clinic scope, say:
   "I can only assist with clinic-related queries. Please contact us directly for other help."
3. For booking → ask: patient name, preferred date, preferred doctor.
4. For cancellation → ask for the appointment date and patient name.
5. Never fabricate doctor names, timings, or fees.
6. Keep replies short, warm, and helpful.
7. Use the patient's name if they've shared it.
`.trim();
};

module.exports = { buildSystemPrompt };