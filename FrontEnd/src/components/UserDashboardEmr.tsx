"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Upload,
  Book,
  User,
  Menu,
  Bell,
  LogOut,
  Shield,
} from "lucide-react";

import { CodeSearch } from "../components/CodeSearch";
import { IngestCSV } from "../components/IngestCSV";
import { AuditTrail } from "../components/AuditTrial";
import { APIDocs } from "../components/ApiDocs";
import { BACKEND_URL } from "@/config";
import { useNavigate } from "react-router-dom";

type TabType = "code-search" | "ingest-csv" | "audit-trail" | "api-docs";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("code-search");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [username, setUsername] = useState<string>("Loading...");

  useEffect(() => {
    // Fetch logged-in user details
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/HandlingApi/me`, {
          headers: {
            Authorization: `${localStorage.getItem("token") || ""}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUsername(data?.name || "Unknown User");
        } else {
          setUsername("Guest");
        }
      } catch (err) {
        console.error("❌ Failed to fetch user", err);
        setUsername("Guest");
      }
    };
    fetchUser();
  }, []);

  const Navigate = useNavigate();

  const Logout = () => {
    localStorage.removeItem("token");
    Navigate("/sign-in");
  }

  const tabs = [
    {
      id: "code-search" as const,
      label: "Code Search",
      icon: Search,
      description: "Terminology Code Search",
    },
    {
      id: "ingest-csv" as const,
      label: "Ingest NAMASTE",
      icon: Upload,
      description: "CSV Data Import",
    },
    {
      id: "audit-trail" as const,
      label: "Version & Consent Demo",
      icon: Shield,
      description: "Audit Trail & Versioning",
    },
    {
      id: "api-docs" as const,
      label: "API Docs",
      icon: Book,
      description: "API Documentation",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "code-search":
        return <CodeSearch />;
      case "ingest-csv":
        return <IngestCSV />;
      case "audit-trail":
        return <AuditTrail />;
      case "api-docs":
        return <APIDocs />;
      default:
        return <CodeSearch />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
        className={`bg-gray-900/90 backdrop-blur-md border-r border-gray-800 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-extrabold text-white shadow-lg shadow-blue-500/40"
          >
            M
          </motion.div>
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-white text-lg tracking-wide">
                Medi-Link
              </h1>
              <p className="text-xs text-gray-400">FHIR R4 Dashboard</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <nav className="mt-8 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white shadow-inner"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {sidebarOpen && (
                <div>
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs text-gray-500">
                    {tab.description}
                  </div>
                </div>
              )}
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {tabs.find((tab) => tab.id === activeTab)?.label}
                </h1>
                <p className="text-sm text-gray-400">
                  {tabs.find((tab) => tab.id === activeTab)?.description}
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-5">
              <button className="p-2 hover:bg-gray-800 rounded-lg relative text-gray-400">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                <div className="text-right">
                  <div className="font-medium text-white">{username}</div>
                  {/* Removed ABHA ID */}
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md"
                >
                  <User className="w-4 h-4 text-white" />
                </motion.div>
                <button onClick={Logout} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

