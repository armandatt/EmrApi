import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Calendar, Stethoscope, FileText, AlertCircle } from 'lucide-react';
import type { Patient } from '../types/medical';
import { v4 as uuidv4 } from 'uuid';

interface EMRFormProps {
  onPatientAdded: (patient: Patient) => void;
}

export function EMRForm({ onPatientAdded }: EMRFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    symptoms: '',
    description: '',
    icd11_code: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Patient name is required';
    if (!formData.age || parseInt(formData.age) <= 0) newErrors.age = 'Valid age is required';
    if (!formData.symptoms.trim()) newErrors.symptoms = 'Symptoms are required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPatient: Patient = {
      id: uuidv4(),
      name: formData.name,
      age: parseInt(formData.age),
      symptoms: formData.symptoms,
      description: formData.description,
      icd11_code: formData.icd11_code || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    onPatientAdded(newPatient);
    
    // Reset form
    setFormData({
      name: '',
      age: '',
      symptoms: '',
      description: '',
      icd11_code: ''
    });
    
    setIsSubmitting(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <User className="w-4 h-4" />
            Patient Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.name ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="Enter patient's full name"
          />
          {errors.name && (
            <div className="flex items-center gap-1 mt-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </div>
          )}
        </div>

        {/* Age */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <Calendar className="w-4 h-4" />
            Age
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.age ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="Enter patient's age"
            min="1"
            max="150"
          />
          {errors.age && (
            <div className="flex items-center gap-1 mt-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.age}
            </div>
          )}
        </div>

        {/* Symptoms */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <Stethoscope className="w-4 h-4" />
            Symptoms
          </label>
          <textarea
            value={formData.symptoms}
            onChange={(e) => handleChange('symptoms', e.target.value)}
            className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
              errors.symptoms ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="List patient's symptoms (e.g., fever, headache, nausea)"
            rows={3}
          />
          {errors.symptoms && (
            <div className="flex items-center gap-1 mt-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.symptoms}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <FileText className="w-4 h-4" />
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="Detailed description of patient's condition, examination findings, etc."
            rows={4}
          />
          {errors.description && (
            <div className="flex items-center gap-1 mt-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.description}
            </div>
          )}
        </div>

        {/* ICD-11 Code (Optional) */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <FileText className="w-4 h-4" />
            ICD-11 Code (Optional)
          </label>
          <input
            type="text"
            value={formData.icd11_code}
            onChange={(e) => handleChange('icd11_code', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Enter ICD-11 diagnostic code (e.g., 1A00.0)"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving Record...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Patient Record
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}

