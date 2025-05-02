import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Upload, BarChart2, FileText, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FeatureCard from '@/components/FeatureCard';

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.classList.add('animate-fadeIn');
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="blob blob-medical w-96 h-96 top-20 -left-48 animate-float" />
        <div className="blob blob-medical w-96 h-96 bottom-0 -right-48 animation-delay-200 animate-float" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 px-3 py-1 bg-medical-blue/10 rounded-full">
            <span className="text-sm font-medium text-medical-blue">
              Advanced AI for Breast Cancer Detection
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-gradient">Revolutionary</span> Breast Cancer <br />
            Detection with AI
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Our intelligent system combines advanced deep learning with medical expertise 
            to provide accurate, early detection and personalized insights.
          </p>
          <div className="flex items-center justify-center">
            <Link
              to="/upload"
              className="px-6 py-3 bg-medical-blue text-white rounded-xl shadow-lg hover:shadow-xl hover:bg-opacity-90 transition-all"
            >
              Get Started
              <ArrowRight className="inline-block ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-16 md:py-24 px-4 relative"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Intelligent <span className="text-gradient">Features</span> at Your Service
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered system offers powerful tools to help detect and understand breast cancer better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              title="Diagnosis"
              description="Advanced image analysis for accurate detection of breast abnormalities with high precision."
              icon={<BarChart2 className="h-6 w-6" />}
              link="/upload"
              delay={0}
            />
            <FeatureCard
              title="Upload"
              description="Secure and easy upload of various medical images including MRI and thermal."
              icon={<Upload className="h-6 w-6" />}
              link="/upload"
              delay={200}
            />
            <FeatureCard
              title="Report"
              description="Generate detailed medical reports with findings, impressions and structured summaries."
              icon={<FileText className="h-6 w-6" />}
              link="/dashboard"
              delay={400}
            />
            <FeatureCard
              title="Chat Assistant"
              description="Interactive AI assistant to answer questions and provide explanations about results."
              icon={<MessageSquare className="h-6 w-6" />}
              link="/chat"
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple, intuitive process from upload to analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative animate-slideUp">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-medical-blue text-white flex items-center justify-center font-bold">
                1
              </div>
              <div className="pt-4">
                <h3 className="text-xl font-semibold mb-3 text-center">Upload</h3>
                <p className="text-gray-600 text-center">
                  Upload your MRI or other breast imaging scans securely to our platform.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative animate-slideUp animation-delay-200">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-medical-blue text-white flex items-center justify-center font-bold">
                2
              </div>
              <div className="pt-4">
                <h3 className="text-xl font-semibold mb-3 text-center">Analyze</h3>
                <p className="text-gray-600 text-center">
                  Our AI system processes the images using advanced machine learning algorithms.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative animate-slideUp animation-delay-400">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-medical-blue text-white flex items-center justify-center font-bold">
                3
              </div>
              <div className="pt-4">
                <h3 className="text-xl font-semibold mb-3 text-center">Results</h3>
                <p className="text-gray-600 text-center">
                  Receive a comprehensive report with diagnosis, findings, and recommendations.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/upload"
              className="px-6 py-3 bg-medical-blue text-white rounded-xl shadow-lg hover:shadow-xl hover:bg-opacity-90 transition-all"
            >
              Try It Now
              <ArrowRight className="inline-block ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="blob blob-medical w-96 h-96 top-0 right-0 opacity-30" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Experience the Future of Breast Cancer Detection?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Join thousands of healthcare professionals who trust our AI technology for 
                accurate, efficient breast cancer screening and diagnosis.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/upload"
                  className="px-6 py-3 bg-medical-blue text-white rounded-xl shadow-lg hover:shadow-xl hover:bg-opacity-90 transition-all"
                >
                  Get Started Now
                </Link>
                <Link
                  to="/chat"
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-800 rounded-xl shadow-sm hover:shadow hover:border-gray-300 transition-all"
                >
                  Chat with AI Assistant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-medical-blue to-medical-lightBlue flex items-center justify-center">
                <span className="text-white font-bold">BC</span>
              </div>
              <span className="font-semibold text-lg">SmartBreastCare</span>
            </Link>
            <p className="text-gray-500 text-sm mb-6">
              Advanced AI technology for breast cancer detection and analysis
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              {['Dashboard', 'Upload', 'Chat', 'About'].map((item) => (
                <Link
                  key={item}
                  to={item === 'About' ? '/' : `/${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-medical-blue transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
            <p className="text-gray-400 text-xs">
              © {new Date().getFullYear()} SmartBreastCare AI. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              This is a demo application. Not for actual medical use.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
