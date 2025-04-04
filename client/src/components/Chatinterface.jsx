import { useState } from "react";

export function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      // Add user message
      setMessages((prev) => [...prev, { text: inputText, isUser: true }]);

      // API call to backend
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputText }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();

      // Add AI response
      setMessages((prev) => [...prev, { text: data.response, isUser: false }]);
      setInputText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 h-screen flex flex-col bg-slate-800">
      <h1
        className="fixed left-6 top-6 z-[9999] flex items-center gap-3
           bg-white/5 backdrop-blur-lg px-4 py-3 rounded-2xl
           border border-white/10 hover:border-white/20
           transition-all duration-300 hover:scale-[1.02]
           group cursor-default shadow-xl hover:shadow-2xl"
      >
        {/* Animated Chat Icon */}
        <div className="relative h-8 w-8">
          <div
            className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg 
                  animate-pulse opacity-50"
          ></div>
          <svg
            className="relative h-8 w-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
        </div>

        {/* Medify Text with Gradient */}
        <span
          className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 
                  bg-clip-text text-transparent tracking-wide"
        >
          Medify
        </span>

        {/* Subtle Ping Animation */}
        <span className="absolute top-0 right-0 flex h-3 w-3 -mt-1 -mr-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </h1>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.isUser
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-3 rounded-lg bg-gray-100 text-gray-800">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 relative group">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Share your thoughts..."
          className="flex-1 p-4 text-white bg-gray-800/80 backdrop-blur-sm border-2 border-emerald-400/30 rounded-2xl 
             focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20
             transition-all duration-300 placeholder:text-gray-400
             hover:border-emerald-400/50 shadow-lg
             animate-[bloom_1s_ease-in-out]"
          disabled={isLoading}
          style={{
            boxShadow: "0 0 15px rgba(72,187,120,0.2)",
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-4 bg-gradient-to-br from-green-400 to-blue-500 text-white font-semibold rounded-2xl 
            hover:bg-gradient-to-br hover:from-green-300 hover:to-blue-400 
            active:scale-95 transition-all duration-300 
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center gap-2 shadow-lg
            animate-[bloom_1s_ease-in-out]"
          style={{
            boxShadow: "0 0 20px rgba(72,187,120,0.3)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          Send
        </button>
      </form>

      {/* Emergency Resources */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        If you're in crisis, please contact
        <a href="tel:1-800-273-8255" className="text-blue-500 ml-1">
          1-800-273-TALK (8255)
        </a>
      </div>
    </div>
  );
}
