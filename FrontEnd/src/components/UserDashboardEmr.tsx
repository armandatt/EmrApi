import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Plus, User, Calendar, Stethoscope, FileSearch } from 'lucide-react';
import { EMRForm } from './EMRForm';
import { PatientSearch } from './PatientSearch';
import { PatientList } from './PatientList';
import type { Patient } from '../types/medical';

export function UserDashboardEmr() {
  const [activeTab, setActiveTab] = useState<'emr' | 'search'>('emr');
  const [patients, setPatients] = useState<Patient[]>([]);

  const handlePatientAdded = (patient: Patient) => {
    setPatients(prev => [patient, ...prev]);
  };

  const tabs = [
    {
      id: 'emr' as const,
      label: 'EMR Records',
      icon: FileText,
      description: 'Create and manage patient records'
    },
    {
      id: 'search' as const,
      label: 'Search & Fetch',
      icon: Search,
      description: 'Find patient records by symptoms or ICD-11 codes'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  Medi-Link
                </h1>
                <p className="text-sm text-gray-400">Medical Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-5 h-5" />
                <span>Dr. Smith</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-4 mb-8">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800/50 border border-gray-800'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">{tab.label}</div>
                <div className="text-xs opacity-80">{tab.description}</div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {activeTab === 'emr' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Plus className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-bold">Create Patient Record</h2>
                </div>
                <EMRForm onPatientAdded={handlePatientAdded} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <FileSearch className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold">Recent Records</h2>
                </div>
                <PatientList patients={patients} />
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Search className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold">Search Patient Records</h2>
              </div>
              <PatientSearch />
            </div>
          )}
          
        </motion.div>
        
      </div>
      <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-400">
            <p>© 2025 Medi-Link All rights reserved.</p>
          </footer>
    </div>
  );
}