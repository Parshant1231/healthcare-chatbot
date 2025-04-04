require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Formatting function
const formatResponse = (text) => {
  // 1. Limit to 2 sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const shortText = sentences.slice(0, 2).join(' ');

  // 2. Format bullets and numbering
  return shortText
    .replace(/\*\s+/g, '• ') // Convert markdown bullets
    .replace(/\d\.\s/g, '◦ ') // Convert numbers to circles
    .replace(/(\d+\))/g, '◦') // Convert numbered lists
    .substring(0, 200); // Hard character limit
};

app.post("/api/chat", async (req, res) => {
  try {
    console.log("Received request:", req.body); // Log incoming request
    
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { maxOutputTokens: 80 }
    });

    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    
    res.json({ response: response.text() });

  } catch (error) {
    console.error("API Error:", error); // Detailed error logging
    res.status(500).json({ 
      error: "Failed to process request",
      details: error.message 
    });
  }
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});