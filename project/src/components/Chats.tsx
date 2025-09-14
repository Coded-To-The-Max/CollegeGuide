// src/components/Chats.tsx
import React, { useState, useEffect } from "react";
import { Plus, Send, Bot, Trash2 } from "lucide-react";
import { supabase } from "../supabaseClient";
import { Chat, Message, User } from "../types";

interface ChatsProps {
  user: User;
}

const Chats: React.FC<ChatsProps> = ({ user }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Load chats from Supabase
  useEffect(() => {
    const fetchChats = async () => {
      const { data, error } = await supabase
        .from("chats")
        .select(`
          id, title, created_at,
          messages(id, sender, content, created_at)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) return console.error(error);
      if (data) {
        setChats(data as Chat[]);
        setCurrentChat((data as Chat[])[0] || null);
      }
    };

    fetchChats();
  }, [user.id]);

  // Real-time subscription for messages
  useEffect(() => {
    if (!currentChat) return;

    const channel = supabase
      .channel(`messages_chat_${currentChat.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${currentChat.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === currentChat.id
                ? { ...chat, messages: [...chat.messages, newMessage] }
                : chat
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentChat?.id]);

  const createNewChat = async () => {
    const title = `New Chat ${chats.length + 1}`;
    try {
      const { data: chatData, error } = await supabase
        .from("chats")
        .insert([{ user_id: user.id, title }])
        .select()
        .single();

      if (error || !chatData) return console.error(error);

      const welcomeMessage = `Hello ${user.displayName || user.username}! I'm your AI Assistant.`;
      const { data: msgData, error: msgError } = await supabase
        .from("messages")
        .insert([{ chat_id: chatData.id, sender: "bot", content: welcomeMessage }])
        .select();

      if (msgError) console.error(msgError);

      const newChat: Chat = {
        id: chatData.id,
        title,
        messages: [
          {
            id: msgData?.[0]?.id || Date.now().toString(),
            content: welcomeMessage,
            sender: "bot",
            timestamp: new Date(),
          },
        ],
        createdAt: new Date(),
      };

      setChats((prev) => [newChat, ...prev]);
      setCurrentChat(newChat);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedChat = { ...currentChat, messages: [...currentChat.messages, userMessage] };
    setCurrentChat(updatedChat);
    setChats((prev) => prev.map((c) => (c.id === currentChat.id ? updatedChat : c)));
    setInputValue("");
    setIsTyping(true);

    try {
      // Save user message in Supabase
      await supabase
        .from("messages")
        .insert([{ chat_id: currentChat.id, sender: "user", content: userMessage.content }]);

      // Call OpenAI API
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          conversation: updatedChat.messages,
        }),
      });

      const data = await res.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        sender: "bot",
        timestamp: new Date(),
      };

      // Save bot message in Supabase
      await supabase
        .from("messages")
        .insert([{ chat_id: currentChat.id, sender: "bot", content: data.reply }]);

      const updatedChatWithBot = {
        ...updatedChat,
        messages: [...updatedChat.messages, botMessage],
      };

      setCurrentChat(updatedChatWithBot);
      setChats((prev) => prev.map((c) => (c.id === currentChat.id ? updatedChatWithBot : c)));
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRemoveChat = async () => {
    if (!currentChat) return;
    await supabase.from("chats").delete().eq("id", currentChat.id);
    const remaining = chats.filter((c) => c.id !== currentChat.id);
    setChats(remaining);
    setCurrentChat(remaining[0] || null);
  };

  const activeChat = currentChat;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <button
            onClick={createNewChat}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Chat</span>
          </button>
          {activeChat && (
            <button
              onClick={handleRemoveChat}
              className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-full"
              title="Remove Current Chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 border-b cursor-pointer ${
                activeChat?.id === chat.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
              }`}
              onClick={() => setCurrentChat(chat)}
            >
              <h3 className="font-medium text-gray-800">{chat.title}</h3>
              <p className="text-sm text-gray-600 truncate">
                {chat.messages[chat.messages.length - 1]?.content || "No messages"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="p-4 bg-white border-b flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">{activeChat.title}</h2>
                <p className="text-sm text-gray-600">AI Assistant</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-2xl px-4 py-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white shadow-sm text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-lg shadow-sm animate-pulse">
                    Typing...
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-white border-t flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about colleges, essays, or deadlines..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            No active chat. Click "Create New Chat" to start.
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
