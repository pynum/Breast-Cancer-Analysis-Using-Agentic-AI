
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';

const Chat = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Side - Chat Interface */}
            <div className="flex-1 animate-fadeIn">
              <div className="mb-4 flex items-center justify-between">
                <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Home
                </Link>
                <div className="text-sm text-gray-500">Medical AI Assistant</div>
              </div>
              
              <div className="h-[calc(100vh-180px)]">
                <ChatInterface />
              </div>
            </div>
            
            {/* Right Side - Information & FAQ */}
            <div className="md:w-1/3 animate-fadeIn animation-delay-200">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-6">
                <h2 className="text-lg font-semibold mb-3">About AI Assistant</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Our AI assistant is designed to help answer your questions about breast 
                  cancer, imaging results, and general medical information.
                </p>
                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800 flex">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p>
                    This AI does not provide medical advice. Always consult with a healthcare 
                    professional for diagnosis and treatment.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold mb-3">Suggested Questions</h2>
                <div className="space-y-2">
                  <button 
                    className="w-full text-left p-2 text-sm rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 transition-colors"
                  >
                    What is breast cancer?
                  </button>
                  <button 
                    className="w-full text-left p-2 text-sm rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 transition-colors"
                  >
                    What are common symptoms of breast cancer?
                  </button>
                  <button 
                    className="w-full text-left p-2 text-sm rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 transition-colors"
                  >
                    How accurate is AI in detecting breast cancer?
                  </button>
                  <button 
                    className="w-full text-left p-2 text-sm rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 transition-colors"
                  >
                    What do my results mean?
                  </button>
                  <button 
                    className="w-full text-left p-2 text-sm rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 transition-colors"
                  >
                    What treatments are available for breast cancer?
                  </button>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Link 
                  to="/dashboard" 
                  className="text-medical-blue hover:underline text-sm"
                >
                  Return to your results dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
