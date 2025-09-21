"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  User,
  Activity,
  ChevronRight,
  Eye,
  Calendar,
  Search,
} from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  version: string;
  changes: string[];
  status: "success" | "warning" | "error";
}

interface VersionInfo {
  version: string;
  releaseDate: string;
  changes: string[];
  status: "current" | "deprecated" | "draft";
}

export function AuditTrail() {
  const [activeTab, setActiveTab] = useState<"audit" | "versions">("audit");
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock audit data
  const auditEntries: AuditEntry[] = [
    {
      id: "1",
      timestamp: "2024-01-15T10:30:00Z",
      user: "Dr. Rajesh Kumar",
      action: "CREATE",
      resource: "Patient/example-patient-001",
      version: "1.0",
      changes: ["Created new patient record", "Added demographic information", "Assigned ABHA ID"],
      status: "success",
    },
    {
      id: "2",
      timestamp: "2024-01-15T11:15:00Z",
      user: "Dr. Priya Sharma",
      action: "UPDATE",
      resource: "Condition/hypertension-001",
      version: "1.1",
      changes: ["Updated condition severity", "Added ICD-11 mapping", "Modified onset date"],
      status: "success",
    },
    {
      id: "3",
      timestamp: "2024-01-15T12:00:00Z",
      user: "System Admin",
      action: "DELETE",
      resource: "CodeSystem/deprecated-codes",
      version: "2.0",
      changes: ["Removed deprecated codes", "Updated concept mappings"],
      status: "warning",
    },
  ];

  // Mock version data
  const versions: VersionInfo[] = [
    {
      version: "2.1.0",
      releaseDate: "2024-01-15",
      changes: ["Added new NAMASTE mappings", "Improved FHIR compliance"],
      status: "current",
    },
    {
      version: "2.0.0",
      releaseDate: "2024-01-01",
      changes: ["Major API restructure", "Added audit trail"],
      status: "deprecated",
    },
  ];

  const filteredEntries = auditEntries.filter((entry) => {
    const matchesStatus = filterStatus === "all" || entry.status === filterStatus;
    const matchesSearch =
      !searchTerm ||
      entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-400";
      case "warning":
        return "bg-yellow-500/20 text-yellow-400";
      case "error":
        return "bg-red-500/20 text-red-400";
      case "current":
        return "bg-blue-500/20 text-blue-400";
      case "deprecated":
        return "bg-gray-500/20 text-gray-400";
      case "draft":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  const generateAISummary = (entry: AuditEntry) =>
    `AI Analysis: ${entry.action} operation on ${entry.resource} by ${entry.user}. All changes align with healthcare data standards.`;

  return (
    <div className="min-h-screen bg-black text-white px-8 py-12 space-y-6">
      {/* Header */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
            Version & Consent Demo
          </h2>
          <p className="text-gray-400">
            Audit trail and version management for healthcare data compliance
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeTab === "audit"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Audit Trail
          </button>
          <button
            onClick={() => setActiveTab("versions")}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeTab === "versions"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Version History
          </button>
        </div>
      </div>

      {activeTab === "audit" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Audit Entries */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search audit entries..."
                  className="w-full pl-10 pr-4 py-2 bg-black border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-black border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            {/* List */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg">
              <div className="p-4 border-b border-gray-700 font-semibold">Recent Activity</div>
              {filteredEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedEntry(entry)}
                  className={`p-4 cursor-pointer transition ${
                    selectedEntry?.id === entry.id
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-4 border-blue-500"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex gap-2 items-center mb-1">
                        <span className="font-medium">{entry.action}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            entry.status
                          )}`}
                        >
                          {entry.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{entry.resource}</p>
                      <div className="flex gap-4 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {entry.user}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Entry Details */}
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Entry Details</h3>
              {selectedEntry ? (
                <div className="space-y-3 text-sm text-gray-300">
                  <p>
                    <span className="text-gray-500">Action:</span> {selectedEntry.action}
                  </p>
                  <p>
                    <span className="text-gray-500">Resource:</span> {selectedEntry.resource}
                  </p>
                  <p>
                    <span className="text-gray-500">User:</span> {selectedEntry.user}
                  </p>
                  <ul className="space-y-1">
                    {selectedEntry.changes.map((c, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="w-1 h-1 bg-gray-500 rounded-full mt-2" /> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  <Eye className="w-6 h-6 mx-auto mb-2" />
                  Select an entry
                </div>
              )}
            </div>

            {selectedEntry && (
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" /> AI Analysis
                </h3>
                <p className="text-sm text-gray-300">{generateAISummary(selectedEntry)}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Versions
        <div className="bg-gray-900 border border-gray-700 rounded-lg">
          <div className="p-4 border-b border-gray-700 font-semibold">Version History</div>
          {versions.map((v, i) => (
            <motion.div
              key={v.version}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 border-b border-gray-800 last:border-b-0"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">Version {v.version}</h4>
                  <p className="text-xs text-gray-500 flex gap-1 items-center">
                    <Calendar className="w-3 h-3" /> {new Date(v.releaseDate).toDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(v.status)}`}>
                  {v.status}
                </span>
              </div>
              <ul className="space-y-1 text-sm text-gray-400">
                {v.changes.map((c, j) => (
                  <li key={j} className="flex gap-2 items-start">
                    <span className="w-1 h-1 bg-gray-500 rounded-full mt-2" /> {c}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
