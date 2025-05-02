import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReactMarkdown from 'react-markdown';
import { Home, Upload, MessageSquare, LayoutDashboard } from 'lucide-react'; // Import icons

const ResultsViewer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data || !data.diagnosis) {
    return (
      <div className="text-center mt-10 text-red-500 text-lg font-medium">
        No data available. Please upload an image first.
      </div>
    );
  }

  const handleReset = () => {
    navigate('/upload');
  };

  // Navigation options
  const navigationOptions = [
    { path: '/', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/upload', icon: <Upload className="w-5 h-5" />, label: 'New Analysis' },
    { path: '/chat', icon: <MessageSquare className="w-5 h-5" />, label: 'Chat' },
  ];

  // Pie Chart config
  const chartData = data.diagnosis.map((item: { name: string; value: number }) => ({
    name: item.name,
    value: item.value,
  }));

  const COLORS: { [key: string]: string } = {
    Benign: '#0EA5E9',     // light blue
    Malignant: '#EF4444',  // red
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex justify-center space-x-4">
            {navigationOptions.map((option) => (
              <button
                key={option.path}
                onClick={() => navigate(option.path)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-6 text-medical-blue">Analysis Results</h2>

        {/* Diagnosis Chart */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Probability Distribution</h3>
          <div className="w-full h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#ccc'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Report */}
        {data.detailed_report && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Detailed Report</h3>
            <div className="prose max-w-none">
              <ReactMarkdown>{data.detailed_report}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {data.detailed_recommendations && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
            <div className="prose max-w-none">
              <ReactMarkdown>{data.detailed_recommendations}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => navigate('/upload')}
            className="bg-medical-blue text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discuss Results</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsViewer;