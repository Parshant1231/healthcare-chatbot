import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiArrowUpCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "./Header";

const GREETING_RESPONSES = [
  "Hello! I'm here to provide mental health support. How can I help you today?",
  "Hi there! I'm a mental health assistant. Feel free to share what's on your mind.",
  "Welcome! I'm here to listen and offer support. What would you like to talk about?",
  "Good day! Remember you're not alone. How can I assist you?",
  "Hello! Let's work through this together. What's concerning you?",
  "Hi! I'm here to help with mental wellness. What would you like to discuss?",
];

const isMentalHealthQuery = (text) => {
  const mentalHealthKeywords = [
    "stress",
    "anxiety",
    "depress",
    "sad",
    "lonely",
    "therapy",
    "cope",
    "mental",
    "feel",
    "emotion",
    "panic",
    "worthless",
    "hopeless",
    "helpless",
  ];
  return mentalHealthKeywords.some((keyword) =>
    text.toLowerCase().includes(keyword)
  );
};

const isGreeting = (text) => {
  const greetings = [
    "hello",
    "hi",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
    "how are you",
    "what's up",
    "sup",
    "yo",
    "greetings",
    "good day",
    "hey there",
    "hi there",
  ];
  return greetings.some(
    (greeting) =>
      text.toLowerCase().includes(greeting) && !isMentalHealthQuery(text)
  );
};

const checkForCrisis = (text) => {
  const crisisKeywords = ["suicide", "self-harm", "kill myself"];
  return crisisKeywords.some((keyword) => text.toLowerCase().includes(keyword));
};

export const GenerateAnswer = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const baseHeight = 56;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        baseHeight
      )}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
    scrollToBottom();
  }, [messages, newMessage]);

  const generateContent = async () => {
    const question = newMessage.trim();
    if (!question) {
      setError("Please enter a message");
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: question,
        isUser: true,
        timestamp: new Date().toISOString(),
      },
    ]);
    setNewMessage("");

    if (checkForCrisis(question)) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "I'm deeply concerned. Please contact:",
          resources: [
            "National Crisis Hotline: 988",
            "Text HOME to 741741",
            "Emergency Services: 911",
          ],
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
      return;
    }

    if (isGreeting(question)) {
      const randomIndex = Math.floor(Math.random() * GREETING_RESPONSES.length);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: GREETING_RESPONSES[randomIndex],
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBrsLQ46wM6LzSLfXHNNQ0LCMSSq-2WWfg",
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `As a mental health professional, provide structured advice with:
              1. Emotional validation (1 sentence)
              2. Practical coping strategies (2-3 specific steps)
              3. Professional resource suggestions
              4. Encouraging closing statement
              
              Format response with clear sections. Query: ${question}`,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.6,
            topP: 0.85,
          },
        },
      });

      const rawAnswer =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const formattedAnswer = formatResponse(rawAnswer);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: formattedAnswer,
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setError("Failed to fetch response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponse = (text) => {
    return text
      .replace(/\n/g, "<br/>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
       <Header />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl min-w-2xl mx-auto px-4 py-8">
          <div className="space-y-4 mb-24 ">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    message.isUser
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  {message.resources ? (
                    <div className="space-y-3">
                      <p className="font-medium">{message.text}</p>
                      <ul className="list-disc pl-5 space-y-2">
                        {message.resources.map((resource, index) => (
                          <li key={index} className="text-sm text-blue-300">
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div
                      className="prose prose-invert"
                      dangerouslySetInnerHTML={{ __html: message.text }}
                    />
                  )}
                  <div className="mt-2 text-xs text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="relative rounded-xl bg-gray-800 shadow-lg">
            <div className="flex items-end gap-2 p-4">
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  setError("");
                }}
                placeholder="Type your message here..."
                className="w-full bg-transparent text-gray-100 resize-none outline-none placeholder-gray-500 scrollbar-hide pr-20"
                style={{ minHeight: `${baseHeight}px` }}
                rows={1}
                disabled={isLoading}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    generateContent();
                  }
                }}
              />

              <motion.button
                onClick={generateContent}
                disabled={isLoading || !newMessage.trim()}
                className={`
                  mb-1 p-3 rounded-xl
                  bg-gradient-to-br from-blue-500 to-purple-600
                  text-white shadow-lg
                  transition-all duration-300
                  disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed
                  hover:scale-105 hover:shadow-xl
                  active:scale-95
                  flex items-center justify-center
                `}
                style={{ width: "48px", height: "48px" }}
                whileHover={{ rotate: 360 }}
                whileTap={{ scale: 0.9 }}
              >
                {isLoading ? (
                  <motion.div
                    className="w-6 h-6 border-2 border-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                ) : (
                  <FiArrowUpCircle className="w-6 h-6" />
                )}
              </motion.button>
            </div>

            <div className="px-4 pb-3 flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {newMessage.length}/2000
              </span>

              <div className="flex gap-2">
                {["Anxiety", "Stress", "Sleep", "Motivation"].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() =>
                      setNewMessage(
                        `I'm struggling with ${prompt.toLowerCase()}`
                      )
                    }
                    className="px-4 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};
