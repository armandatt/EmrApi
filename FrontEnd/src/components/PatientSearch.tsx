import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Calendar, User, Stethoscope, X } from 'lucide-react';
import type { Patient, SearchFilters } from '../types/medical';

// Mock data for demonstration
const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 45,
    symptoms: 'Chest pain, shortness of breath',
    description: 'Patient presents with acute chest pain radiating to left arm. ECG shows ST elevation.',
    icd11_code: 'BA41.0',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 32,
    symptoms: 'Fever, headache, body aches',
    description: 'Patient has high fever (102°F) with severe headache and muscle aches. Possible viral infection.',
    icd11_code: '1D47.Z',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T14:20:00Z'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    age: 28,
    symptoms: 'Persistent cough, fatigue',
    description: 'Dry cough persisting for 3 weeks with increasing fatigue. Chest X-ray shows mild infiltrates.',
    icd11_code: 'CA40.0',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z'
  }
];

export function PatientSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    icd11_code: ''
  });
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!filters.keyword.trim() && !filters.icd11_code.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock search logic
    const results = mockPatients.filter(patient => {
      const keywordMatch = !filters.keyword || 
        patient.name.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        patient.symptoms.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        patient.description.toLowerCase().includes(filters.keyword.toLowerCase());
      
      const icdMatch = !filters.icd11_code || 
        patient.icd11_code?.toLowerCase().includes(filters.icd11_code.toLowerCase());
      
      return keywordMatch && icdMatch;
    });
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const clearSearch = () => {
    setFilters({ keyword: '', icd11_code: '' });
    setSearchResults([]);
    setHasSearched(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Search className="w-4 h-4" />
              Search by Keyword
            </label>
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => setFilters((prev: any) => ({ ...prev, keyword: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="Search by name, symptoms, or description..."
            />
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Filter className="w-4 h-4" />
              ICD-11 Code
            </label>
            <input
              type="text"
              value={filters.icd11_code}
              onChange={(e) => setFilters((prev: any) => ({ ...prev, icd11_code: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="Enter ICD-11 code..."
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <motion.button
            onClick={handleSearch}
            disabled={isSearching || (!filters.keyword.trim() && !filters.icd11_code.trim())}
            className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isSearching ? 1 : 1.02 }}
            whileTap={{ scale: isSearching ? 1 : 0.98 }}
          >
            {isSearching ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search Records
              </>
            )}
          </motion.button>
          
          {hasSearched && (
            <motion.button
              onClick={clearSearch}
              className="flex items-center gap-2 bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:bg-gray-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <X className="w-4 h-4" />
              Clear
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Search Results */}
      {hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Search Results ({searchResults.length})
            </h3>
          </div>
          
          {searchResults.length === 0 ? (
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-12 text-center">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Records Found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or keywords.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {searchResults.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{patient.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Age: {patient.age}
                          </span>
                          {patient.icd11_code && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              ICD-11: {patient.icd11_code}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(patient.created_at)}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                        <Stethoscope className="w-4 h-4" />
                        Symptoms
                      </div>
                      <p className="text-gray-400 text-sm">{patient.symptoms}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                        <FileText className="w-4 h-4" />
                        Description
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{patient.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}