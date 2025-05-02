// components/UploadArea.tsx

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadAreaProps {
  onResultsReceived: (results: any) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onResultsReceived }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    age: '',
    image_type: 'MRI',
    lump: 'no',
    family: 'no',
    density: 'dense',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        setErrors([`${selected.name} exceeds 10MB`]);
        return;
      }
      setFile(selected);
      setErrors([]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrors(["Please upload an image."]);
      return;
    }
    if (!formData.age) {
      setErrors(["Please enter your age."]);
      return;
    }

    setUploading(true);

    const data = new FormData();
    data.append('image', file);
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    const startTime = Date.now();

    try {
      const res = await axios.post('http://localhost:5000/predict', data);

      // Ensure loader shows for at least 15 seconds
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(15000 - elapsed, 0);

      setTimeout(() => {
        onResultsReceived(res.data);
        setUploading(false);
      }, remaining);
    } catch (err) {
      setErrors(["Failed to upload. Try again."]);
      setUploading(false);
    }
  };

  const FullscreenLoader = () => (
    <div className="fixed inset-0 z-50 bg-[#0EA5E9] flex flex-col items-center justify-center text-white">
      <div className="flex space-x-3 mb-4">
        <span className="h-5 w-5 bg-blue-800 rounded-full animate-bounce delay-0"></span>
        <span className="h-5 w-5 bg-blue-700 rounded-full animate-bounce delay-150"></span>
        <span className="h-5 w-5 bg-blue-600 rounded-full animate-bounce delay-300"></span>
      </div>
      <p className="text-xl font-semibold animate-pulse">Analyzing...</p>
    </div>
  );

  return (
    <>
      {uploading && <FullscreenLoader />}
      <div className="space-y-4">
        {/* Upload Input */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#0EA5E9] p-6 rounded-lg text-center cursor-pointer hover:border-[#0EA5E9] transition"
        >
          <Upload className="mx-auto h-6 w-6 text-[#0EA5E9]" />
          <p className="text-sm text-[#0EA5E9]">Click to upload image (Max 10MB)</p>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {file && (
          <div className="bg-[#e6f7ff] p-3 border border-[#0EA5E9] rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              <div>
                <p className="text-sm font-medium text-[#0EA5E9]">{file.name}</p>
                <p className="text-xs text-[#0EA5E9]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700">
              <X />
            </button>
          </div>
        )}

        {/* User Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={e => setFormData({ ...formData, age: e.target.value })}
            className="border p-2 rounded w-full"
          />

          <select
            value={formData.image_type}
            onChange={e => setFormData({ ...formData, image_type: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="MRI">MRI</option>
            <option value="thermal">Thermal</option>
          </select>

          <select
            value={formData.lump}
            onChange={e => setFormData({ ...formData, lump: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="yes">Lump Present</option>
            <option value="no">No Lump</option>
          </select>

          <select
            value={formData.family}
            onChange={e => setFormData({ ...formData, family: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="yes">Family History</option>
            <option value="no">No Family History</option>
          </select>

          <select
            value={formData.density}
            onChange={e => setFormData({ ...formData, density: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="dense">Dense</option>
            <option value="fatty">Fatty</option>
            <option value="scattered">Scattered</option>
          </select>
        </div>

        {errors.map((err, i) => (
          <div key={i} className="bg-red-100 border border-red-300 text-sm text-red-600 p-2 rounded flex items-center justify-between">
            <span><AlertCircle className="inline-block mr-2" />{err}</span>
            <button onClick={() => setErrors([])} className="text-red-500 hover:text-red-700"><X /></button>
          </div>
        ))}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-[#0EA5E9] text-white w-full py-2 rounded hover:bg-[#0EA5E9] flex justify-center items-center gap-2"
        >
          {uploading ? <Loader2 className="animate-spin h-4 w-4" /> : "Analyze Images"}
        </button>
      </div>

      {/* Animation delay styling */}
      <style jsx>{`
        .delay-0 { animation-delay: 0s; }
        .delay-150 { animation-delay: 0.15s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </>
  );
};

export default UploadArea;
