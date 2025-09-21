"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Book,
  Code,
  Shield,
  Zap,
  Globe,
  CheckCircle,
} from "lucide-react";

interface APIEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  parameters?: { name: string; type: string; required: boolean; description: string }[];
  response: string;
  example: string;
}

export function APIDocs() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "endpoints" | "authentication" | "pricing"
  >("overview");

  const endpoints: APIEndpoint[] = [
    {
      method: "GET",
      path: "/api/v1/codes/search",
      description: "Search NAMASTE codes with ICD-11 mapping",
      response: "Array of NAMASTE codes with ICD-11 mappings",
      example: `{
  "results": [
    {
      "code": "NAMASTE-001",
      "display": "Essential Hypertension",
      "icd11Code": "BA00.0",
      "description": "Primary hypertension without known secondary cause"
    }
  ],
  "total": 1
}`,
    },
    {
      method: "POST",
      path: "/api/v1/fhir/bundle",
      description: "Create FHIR Bundle with patient data and conditions",
      response: "FHIR Bundle resource",
      example: `{
  "resourceType": "Bundle",
  "id": "example-bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "patient-001",
        "name": [{"given": ["John"], "family": "Doe"}]
      }
    }
  ]
}`,
    },
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      requests: "10,000",
      features: ["Basic API access", "Standard support", "Documentation access"],
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      requests: "100,000",
      features: ["Full API access", "Priority support", "Advanced analytics"],
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      requests: "Unlimited",
      features: ["Unlimited API access", "Dedicated support", "Custom deployment"],
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-500/20 text-green-400";
      case "POST":
        return "bg-blue-500/20 text-blue-400";
      case "PUT":
        return "bg-yellow-500/20 text-yellow-400";
      case "DELETE":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-8 py-12 space-y-6">
      {/* Header */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
              API Documentation
            </h2>
            <p className="text-gray-400">
              Guide to integrating with Medi-Link NAMASTE–ICD11 Mapping API
            </p>
          </div>

          <div className="flex gap-2">
            {["overview", "endpoints", "authentication", "pricing"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-md font-medium capitalize transition ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Getting Started */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                Getting Started
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p>Base URL: </p>
                <div className="bg-black border border-gray-700 p-2 rounded font-mono">
                  https://api.medi-link.com/v1
                </div>
                <p>Authentication: API Key in Authorization header</p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-400" />
                Features
              </h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex gap-2 items-start">
                  <CheckCircle className="text-green-400 w-4 h-4 mt-0.5" /> NAMASTE ↔ ICD-11 mapping
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle className="text-green-400 w-4 h-4 mt-0.5" /> FHIR R4 Compliant Bundles
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle className="text-green-400 w-4 h-4 mt-0.5" /> CSV Bulk Uploads
                </li>
              </ul>
            </div>

            {/* Example */}
            <div className="lg:col-span-2 bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-400" />
                Example
              </h3>
              <div className="bg-black border border-gray-700 rounded p-4 overflow-x-auto text-sm font-mono">
                <pre>
{`curl -X GET "https://api.medi-link.com/v1/codes/search?query=hypertension" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === "endpoints" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Endpoints */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg">
              <div className="p-4 border-b border-gray-700">
                <h3 className="font-medium">API Endpoints</h3>
              </div>
              {endpoints.map((ep, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedEndpoint(ep)}
                  className={`p-4 cursor-pointer transition ${
                    selectedEndpoint === ep
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-4 border-blue-500"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 text-xs rounded font-mono ${getMethodColor(ep.method)}`}
                    >
                      {ep.method}
                    </span>
                    <code className="text-gray-200">{ep.path}</code>
                  </div>
                  <p className="text-gray-400 text-sm">{ep.description}</p>
                </div>
              ))}
            </div>

            {/* Endpoint details */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              {selectedEndpoint ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 text-xs rounded font-mono ${getMethodColor(
                        selectedEndpoint.method
                      )}`}
                    >
                      {selectedEndpoint.method}
                    </span>
                    <code className="text-gray-200">{selectedEndpoint.path}</code>
                  </div>
                  <p className="text-gray-400">{selectedEndpoint.description}</p>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Example</h4>
                    <div className="bg-black border border-gray-700 rounded p-3 text-sm">
                      <pre>{selectedEndpoint.example}</pre>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedEndpoint.example)}
                      className="mt-2 text-xs text-blue-400 hover:underline"
                    >
                      Copy Example
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 text-center py-10">
                  <Book className="w-6 h-6 mx-auto mb-2" />
                  Select an endpoint
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "authentication" && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-400" />
              Authentication
            </h3>
            <p className="text-sm text-gray-300">
              Use an API key in the Authorization header:
            </p>
            <div className="bg-black border border-gray-700 rounded p-2 mt-2 font-mono text-sm">
              Authorization: Bearer sk_live_abc123
            </div>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-lg p-6 bg-gray-900 border ${
                  tier.name === "Professional"
                    ? "border-blue-500 shadow-lg scale-105"
                    : "border-gray-700"
                }`}
              >
                <h4 className="text-xl font-bold mb-2">{tier.name}</h4>
                <div className="text-3xl font-bold">{tier.price}</div>
                <p className="text-gray-400 mb-4">{tier.requests} requests/month</p>
                <ul className="space-y-2 text-sm text-gray-300">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-2 items-center">
                      <CheckCircle className="text-green-400 w-4 h-4" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-4 w-full py-2 rounded-md font-semibold transition ${
                    tier.name === "Professional"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {tier.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
