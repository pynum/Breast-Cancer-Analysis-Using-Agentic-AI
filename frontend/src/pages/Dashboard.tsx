import React from 'react';
import Navbar from '@/components/Navbar';
import ResultsViewer from '@/components/ResultsViewer';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <ResultsViewer />
      </div>
    </div>
  );
};

export default Dashboard;


