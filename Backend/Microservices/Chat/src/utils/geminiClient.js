// utils/geminiClient.js
const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const streamGeminiReply = async (conversationHistory, systemPrompt, onToken) => {
  if (!Array.isArray(conversationHistory) || conversationHistory.length === 0) {
    throw new Error("conversationHistory must include the current user message");
  }

  const latestMessageEntry = conversationHistory.at(-1);
  const latestMessage = latestMessageEntry?.parts?.[0]?.text;

  if (!latestMessage) {
    throw new Error("Latest user message is missing from conversationHistory");
  }

  const chat = genAI.chats.create({
    model: "gemini-2.0-flash",
    config: {
      systemInstruction: systemPrompt,
    },
    history: conversationHistory.slice(0, -1),
  });

  const responseStream = await chat.sendMessageStream({
    message: latestMessage,
  });

  let fullReply = "";

  for await (const chunk of responseStream) {
    const token = chunk.text ?? "";
    if (token) {
      fullReply += token;
      if (typeof onToken === "function") {
        onToken(token);
      }
    }
  }

  return fullReply;
};

module.exports = { streamGeminiReply };