import { Chat } from "./pages/Chat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChatBot } from "./pages/ChatBot";
import { ChatInterface } from "./components/Chatinterface";
function App() {
  return (
    <div className="bg-slate-800">
      <Router>
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/chatinterface" element={<ChatInterface />} />
          <Route path="/" element={<ChatBot />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
