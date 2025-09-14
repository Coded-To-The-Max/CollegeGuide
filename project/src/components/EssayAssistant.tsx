import React, { useState } from "react";
import { PenTool, Send } from "lucide-react";
import { User, Message } from "../types";

interface EssayAssistantProps {
  user: User;
}

const EssayAssistant: React.FC<EssayAssistantProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      content: `Hello ${user.displayName || user.username}! I'm your Essay Assistant. Do you need help with: 
1) General essay/supplemental writing insight
2) Personal statement assistance
3) General writing advice?`,
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);

    const categoryPrompt =
      category === "1"
        ? "You selected: General essay/supplemental writing insight."
        : category === "2"
        ? "You selected: Personal statement assistance."
        : "You selected: General writing advice.";

    const botMessage: Message = {
      id: Date.now().toString(),
      sender: "bot",
      content: categoryPrompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedCategory) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      // Safe JSON parsing
      let data: { reply?: string } = { reply: "Sorry, I couldn't process your message." };
      try {
        if (res.ok) {
          data = await res.json();
        } else {
          console.error("OpenAI API returned an error:", res.status, res.statusText);
        }
      } catch (err) {
        console.error("Failed to parse OpenAI response:", err);
      }

      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content: data.reply || "Sorry, I couldn't process your message.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error("Error communicating with OpenAI:", err);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        sender: "bot",
        content: "Sorry, there was an error processing your message.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Essay Assistant</h1>
      <p className="text-gray-600 mb-6">Get specialized help with your college application essays</p>

      {!selectedCategory && (
        <div className="space-y-2">
          <button
            onClick={() => handleCategorySelect("1")}
            className="w-full bg-green-50 text-green-800 px-4 py-2 rounded-lg hover:bg-green-100"
          >
            1. General essay/supplemental writing insight
          </button>
          <button
            onClick={() => handleCategorySelect("2")}
            className="w-full bg-green-50 text-green-800 px-4 py-2 rounded-lg hover:bg-green-100"
          >
            2. Personal statement assistance
          </button>
          <button
            onClick={() => handleCategorySelect("3")}
            className="w-full bg-green-50 text-green-800 px-4 py-2 rounded-lg hover:bg-green-100"
          >
            3. General writing advice
          </button>
        </div>
      )}

      {selectedCategory && (
        <div className="bg-white rounded-lg shadow-md flex flex-col h-96 mt-4">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-2xl px-4 py-3 rounded-lg ${msg.sender === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-lg animate-pulse">Typing...</div>
              </div>
            )}
          </div>

          <div className="p-4 border-t flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your question..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayAssistant;
