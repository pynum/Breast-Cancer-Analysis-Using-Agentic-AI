import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Home, MessageSquare, LayoutDashboard } from 'lucide-react';

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    image_type: 'MRI',
    lump: 'no',
    family: 'no',
    density: 'dense'
  });

  // Navigation options
  const navigationOptions = [
    { path: '/', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/chat', icon: <MessageSquare className="w-5 h-5" />, label: 'Chat' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('image', file);
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      navigate('/results', { state: data });
    } catch (error) {
      console.error('Error:', error);
      // Add error handling here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
      <div className="container mx-auto px-4 py-8 pt-20"> {/* Added pt-20 for navigation bar spacing */}
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-medical-blue">
            Upload Thermal Image
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <UploadIcon className="h-12 w-12 text-gray-400 mb-4" />
                <span className="text-gray-600">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </span>
              </label>
            </div>

            {/* Patient Information Form */}
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-blue focus:ring-medical-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image Type</label>
                <select
                  name="image_type"
                  value={formData.image_type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-blue focus:ring-medical-blue"
                >
                  <option value="MRI">MRI</option>
                  <option value="Thermal">Thermal</option>
                  <option value="Mammogram">Mammogram</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Presence of Lump</label>
                <select
                  name="lump"
                  value={formData.lump}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-blue focus:ring-medical-blue"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Family History</label>
                <select
                  name="family"
                  value={formData.family}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-blue focus:ring-medical-blue"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Breast Density</label>
                <select
                  name="density"
                  value={formData.density}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-blue focus:ring-medical-blue"
                >
                  <option value="dense">Dense</option>
                  <option value="fatty">Fatty</option>
                  <option value="scattered">Scattered</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!file || loading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium 
                ${!file || loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-medical-blue hover:bg-medical-blue/90'}`}
            >
              {loading ? 'Processing...' : 'Upload and Analyze'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;