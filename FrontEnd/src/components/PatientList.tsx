import { motion } from 'framer-motion';
import { User, Calendar, Stethoscope, FileText, Clock } from 'lucide-react';
import type { Patient } from '../types/medical';

interface PatientListProps {
  patients: Patient[];
}

export function PatientList({ patients }: PatientListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (patients.length === 0) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 text-center">
        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-400 mb-2">No Records Yet</h3>
        <p className="text-gray-500 text-sm">Patient records will appear here once created.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {patients.map((patient, index) => (
        <motion.div
          key={patient.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-white truncate">{patient.name}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {formatDate(patient.created_at)}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {patient.age} years
                </span>
                {patient.icd11_code && (
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {patient.icd11_code}
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <Stethoscope className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-300 line-clamp-2">{patient.symptoms}</p>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-400 line-clamp-2">{patient.description}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}