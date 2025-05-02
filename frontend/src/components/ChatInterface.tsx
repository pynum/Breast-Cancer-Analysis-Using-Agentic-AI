import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant for breast cancer detection. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/groq-chat', {
        message: inputValue,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.reply || "Sorry, I couldn't process that.",
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          text: 'Oops! There was an error contacting the AI. Please try again.',
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-medical-blue/10">
            <Bot className="h-5 w-5 text-medical-blue" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">AI Assistant</h3>
            <p className="text-xs text-gray-500">Medical Analysis Expert</p>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Online
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] rounded-2xl px-4 py-2 animate-fadeIn
                ${message.sender === 'user'
                  ? 'bg-medical-blue text-white rounded-tr-none'
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'}
              `}
            >
              <div className="flex items-start mb-1">
                {message.sender === 'ai' && <Bot className="h-4 w-4 mr-1 mt-1" />}
                <div className="text-sm">
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
                {message.sender === 'user' && <User className="h-4 w-4 ml-1 mt-1" />}
              </div>
              <div
                className={`text-right text-xs ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 animate-pulse flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
              <span className="text-sm text-gray-600">AI is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent resize-none text-sm"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={inputValue.trim() === '' || isLoading}
            className={`p-2 rounded-lg focus:outline-none ${
              inputValue.trim() === '' || isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-medical-blue text-white hover:bg-opacity-90'
            }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 text-center">
          This AI assistant provides general information and should not replace professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
