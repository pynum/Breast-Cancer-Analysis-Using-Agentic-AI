
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  link,
  delay = 0
}) => {
  const delayClass = `animation-delay-${delay}`;
  
  return (
    <div 
      className={`
        opacity-0 glass-panel rounded-2xl p-6 
        hover:shadow-xl transition-all duration-300
        hover:translate-y-[-5px] animate-slideUp ${delayClass}
      `}
    >
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-medical-blue to-medical-lightBlue text-white">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 text-pretty">{description}</p>
      <Link 
        to={link} 
        className="inline-flex items-center text-medical-blue hover:text-medical-lightBlue transition-colors font-medium"
      >
        Learn more <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  );
};

export default FeatureCard;
