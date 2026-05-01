// utils/geminiClient.js
const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

const model = genAI.models.generateContent({
  model: "gemini-2.0-flash",          // fast, cost-efficient for chat
  systemInstruction: "",              // will be overridden per call
});

const streamGeminiReply = async (conversationHistory, systemPrompt, onToken) => {
  // Attach system prompt dynamically per tenant
  const chatModel = genAI.models.generateContent({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
  });

  const chat = chatModel.startChat({
    history: conversationHistory.slice(0, -1),  // all except last message
  });

  // Last message is the current user input
  const latestMessage = conversationHistory.at(-1).parts[0].text;

  const result = await chat.sendMessageStream(latestMessage);

  let fullReply = "";

  // Stream each chunk → fire onToken callback
  for await (const chunk of result.stream) {
    const token = chunk.text();
    if (token) {
      fullReply += token;
      onToken(token);                 // this emits "ai_token" back to socket
    }
  }

  return fullReply;
};

module.exports = { streamGeminiReply };