"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  X,
} from "lucide-react";
import { BACKEND_URL } from "@/config";

interface UploadStatus {
  status: "idle" | "uploading" | "success" | "error";
  message: string;
  progress: number;
}

export function IngestCSV() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: "idle",
    message: "",
    progress: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 👇 new state for modal + CodeSystem JSON
  const [showModal, setShowModal] = useState(false);
  const [codeSystem, setCodeSystem] = useState<any>(null);

  const handleViewCodeSystem = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/HandlingApi/codesystem`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });
      if (!res.ok) throw new Error(`Failed with ${res.status}`);
      const data = await res.json();
      setCodeSystem(data);
      setShowModal(true);
    } catch (err) {
      console.error("❌ Fetch CodeSystem failed", err);
      alert("❌ Failed to fetch CodeSystem");
    }
  };

  const handleDownloadBundle = async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/v1/HandlingApi/codesystem/bundle`,
        {
          headers: { Authorization: localStorage.getItem("token") || "" },
        }
      );
      if (!res.ok) throw new Error(`Failed with ${res.status}`);
      const data = await res.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "fhir-bundle.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Download FHIR Bundle failed", err);
      alert("❌ Failed to download FHIR Bundle");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        setUploadStatus({ status: "idle", message: "", progress: 0 });
      } else {
        setUploadStatus({
          status: "error",
          message: "Please select a valid CSV file",
          progress: 0,
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus({
      status: "uploading",
      message: "Processing CSV file...",
      progress: 10,
    });

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch(`${BACKEND_URL}/api/v1/HandlingApi/ingest-csv`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUploadStatus({
        status: "success",
        message: data.message,
        progress: 100,
      });
    } catch (err: any) {
      setUploadStatus({
        status: "error",
        message: err.message,
        progress: 0,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
      setSelectedFile(file);
      setUploadStatus({ status: "idle", message: "", progress: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-8 py-12 space-y-8">
      {/* Header */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent mb-2">
          NAMASTE CSV Ingestion
        </h2>
        <p className="text-gray-400">
          Upload NAMASTE CSV export to generate FHIR CodeSystem and ConceptMap
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">Upload NAMASTE CSV</h3>

        <div
          className="border-2 border-dashed border-gray-600 rounded-lg p-10 text-center hover:border-blue-500 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-gray-500 mx-auto" />

            {selectedFile ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
                <p className="text-sm text-gray-400">
                  Size: {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-400">
                  Drag & drop your CSV file here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports CSV files up to 10MB
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              {selectedFile && uploadStatus.status !== "uploading" && (
                <button
                  onClick={handleUpload}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold hover:opacity-90 transition"
                >
                  Ingest CSV
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Upload Status */}
        {uploadStatus.status !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div
              className={`p-4 rounded-lg border ${
                uploadStatus.status === "success"
                  ? "border-green-500 bg-green-500/10"
                  : uploadStatus.status === "error"
                  ? "border-red-500 bg-red-500/10"
                  : "border-blue-500 bg-blue-500/10"
              }`}
            >
              <div className="flex items-start gap-3">
                {uploadStatus.status === "success" && (
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                )}
                {uploadStatus.status === "error" && (
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                )}
                {uploadStatus.status === "uploading" && (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mt-0.5" />
                )}

                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      uploadStatus.status === "success"
                        ? "text-green-400"
                        : uploadStatus.status === "error"
                        ? "text-red-400"
                        : "text-blue-400"
                    }`}
                  >
                    {uploadStatus.message}
                  </p>

                  {uploadStatus.status === "uploading" && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadStatus.progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-blue-400 mt-1">
                        {uploadStatus.progress}% complete
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Actions */}
        {uploadStatus.status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex gap-3"
          >
            {/* View CodeSystem */}
            <button
              onClick={handleViewCodeSystem}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
            >
              <Eye className="w-4 h-4" />
              View CodeSystem
            </button>

            {/* Download FHIR Bundle */}
            <button
              onClick={handleDownloadBundle}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold hover:opacity-90 transition"
            >
              <Download className="w-4 h-4" />
              Download FHIR Bundle
            </button>
          </motion.div>
        )}
      </div>

      {/* Modal for CodeSystem */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-2/3 max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                FHIR CodeSystem
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* JSON Content */}
            <div className="p-4 overflow-y-auto max-h-[65vh]">
              <pre className="text-sm text-green-300 whitespace-pre-wrap break-words">
                {JSON.stringify(codeSystem, null, 2)}
              </pre>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-700 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-900 border-l-4 border-blue-500 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-3">CSV Format Requirements</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>• CSV should contain columns: code, display, definition</p>
          <p>• First row should contain column headers</p>
          <p>• Codes should be unique within the CSV</p>
          <p>• Maximum file size: 10MB</p>
        </div>
      </div>
    </div>
  );
}