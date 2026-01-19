"use client";

import { useState, useRef } from 'react';
import { Upload, File as FileIcon, Plus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabaseClient } from '@/lib/supabase/client';

interface DynamicField {
  id: number;
  label: string;
  value: string;
  startTime: string;
  endTime: string;
}

export function FormCard() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldOne, setFieldOne] = useState('');
  const [location, setLocation] = useState<string>('');
  const [customLocation, setCustomLocation] = useState<string>('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [nextId, setNextId] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value);
    if (e.target.value !== 'custom') {
      setCustomLocation('');
    }
  };

  const handleAddField = () => {
    const newField: DynamicField = {
      id: nextId,
      label: 'Field Label One',
      value: '',
      startTime: '',
      endTime: '',
    };
    setDynamicFields([...dynamicFields, newField]);
    setNextId(nextId + 1);
  };

  const updateDynamicField = (id: number, updates: Partial<DynamicField>) => {
    setDynamicFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `submissions/${fileName}`;

    const { error: uploadError } = await supabaseClient.storage
      .from('submissions')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabaseClient.storage
      .from('submissions')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let fileUrl = '';
      if (file) {
        fileUrl = await uploadFile(file);
      }

      const formData = {
        label_one: fieldOne,
        location: location === 'custom' ? customLocation : location,
        start_time: startTime,
        end_time: endTime,
        file_name: file?.name || '',
        file_url: fileUrl,
        dynamic_fields: dynamicFields.map(f => ({
          label: f.label,
          value: f.value,
          start_time: f.startTime,
          end_time: f.endTime
        })),
        created_at: new Date().toISOString()
      };

      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save data');
      }

      toast.success('Form submitted successfully!');
      // Reset form
      setFieldOne('');
      setLocation('');
      setCustomLocation('');
      setStartTime('');
      setEndTime('');
      setFile(null);
      setDynamicFields([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred during submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">{currentDate}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Input 1 */}
        <div>
          <label htmlFor="input1" className="block text-sm font-medium text-gray-700 mb-2">
            Field Label One
          </label>
          <input
            type="text"
            id="input1"
            value={fieldOne}
            onChange={(e) => setFieldOne(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="Enter text here"
            required
          />
        </div>

        {/* Location Dropdown */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            id="location"
            value={location}
            onChange={handleLocationChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white font-inherit"
            required
          >
            <option value="">Select a location</option>
            <option value="location1">Office Building A</option>
            <option value="location2">Conference Room B</option>
            <option value="location3">Downtown Office</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Custom Location Input */}
        {location === 'custom' && (
          <div>
            <label htmlFor="custom-location" className="block text-sm font-medium text-gray-700 mb-2">
              Enter Custom Location
            </label>
            <input
              type="text"
              id="custom-location"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter custom location"
              required
            />
          </div>
        )}

        {/* Time Range 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              required
            />
            <span className="text-gray-500">–</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              required
            />
          </div>
        </div>

        {/* Dynamic Fields */}
        {dynamicFields.map((field) => (
          <div key={field.id} className="space-y-6 pt-4 border-t border-gray-200">
            <div>
              <label htmlFor={`dynamic-input-${field.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              <input
                type="text"
                id={`dynamic-input-${field.id}`}
                value={field.value}
                onChange={(e) => updateDynamicField(field.id, { value: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Enter text here"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Range
              </label>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <input
                  type="time"
                  value={field.startTime}
                  onChange={(e) => updateDynamicField(field.id, { startTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  required
                />
                <span className="text-gray-500">–</span>
                <input
                  type="time"
                  value={field.endTime}
                  onChange={(e) => updateDynamicField(field.id, { endTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add More Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleAddField}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add More
          </button>
        </div>

        {/* File Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload File
          </label>
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-gray-50">
              {file ? (
                <div className="flex items-center justify-between gap-2 text-gray-700">
                  <div className="flex items-center gap-2">
                    <FileIcon className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors z-20"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, PNG, JPG
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-sm hover:shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}