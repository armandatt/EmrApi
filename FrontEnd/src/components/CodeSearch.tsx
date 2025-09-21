"use client";

import {useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Check } from "lucide-react";
import { BACKEND_URL } from "@/config";

interface DiseaseSuggestion {
    id: string;
    code: string;
    system: string;
    display: string;
    description: string;
}

interface DiseaseDetail extends DiseaseSuggestion {
    icd11Mappings: {
        id: string;
        code: string;
        system: string;
        display: string;
        priority: number;
        validated: boolean;
    }[];
}

interface PatientDetails {
    patientId: string;
    givenName: string;
    gender: string;
    birthDate: string;
}

export function CodeSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<DiseaseSuggestion[]>([]);
    const [selectedCode, setSelectedCode] = useState<DiseaseDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [patientDetails, setPatientDetails] = useState<PatientDetails>({
        patientId: "",
        givenName: "",
        gender: "",
        birthDate: "",
    });

    // Concept map modal control + data to show
    const [showConceptMap, setShowConceptMap] = useState(false);
    const [conceptPayload, setConceptPayload] = useState<any>(null);

    // Stepper state for animated pipeline
    const pipelineSteps = ["SummarizingMap", "FhirCreation", "Finalizing"];
    const [activeStep, setActiveStep] = useState<number | null>(null);
    const [stepProgress, setStepProgress] = useState(0); // 0..100

    // ---------------- Helpers (same normalization as your original) ----------------
    const normalizeSuggestion = (s: any): DiseaseSuggestion => {
        const display =
            s.display ||
            (Array.isArray(s.displayNames) && s.displayNames[0]?.name) ||
            (Array.isArray(s.names) && s.names[0]?.name) ||
            s.description ||
            s.name ||
            "";
        const code = s.code || s.namasteCode || s.icd11Code || "";
        const system = s.system || s.source || "";
        return {
            id: String(s.id),
            code,
            system,
            display,
            description: s.description || "",
        };
    };

    const normalizeMapping = (m: any) => {
        const code = m.code || m.icd11Code || m.ICD11 || m.codeValue || null;
        const display = m.display || m.description || m.name || "";
        return {
            id: m.id || `${code}-${Math.random().toString(36).slice(2, 8)}`,
            code: String(code || ""),
            system: "ICD-11",
            display,
            priority: m.priority ?? 0,
            validated: !!m.validated,
        };
    };

    // ---------------- Search ----------------
    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/v1/HandlingApi/autocomplete?q=${encodeURIComponent(
                    searchTerm
                )}`,
                {
                    headers: {
                        Authorization: localStorage.getItem("token") || "",
                    },
                }
            );
            if (!res.ok) {
                setSearchResults([]);
                setLoading(false);
                return;
            }
            const data = await res.json();
            const raw = data.suggestions || [];
            setSearchResults(raw.map(normalizeSuggestion));
        } catch (err) {
            console.error("Search failed", err);
            setSearchResults([]);
        }
        setLoading(false);
    };

    // ---------------- Fetch details + fallback map ----------------
    const handleSelectCode = async (code: DiseaseSuggestion) => {
        setLoadingDetails(true);
        setSelectedCode(null);
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/v1/HandlingApi/disease/${code.id}/details`,
                {
                    headers: {
                        Authorization: localStorage.getItem("token") || "",
                    },
                }
            );
            if (!res.ok) {
                setLoadingDetails(false);
                return;
            }
            let data: any = await res.json();
            const detail: DiseaseDetail = {
                id: data.id || code.id,
                code: data.code || code.code || "",
                system: data.system || code.system || "",
                display: data.display || code.display || data.description || "",
                description: data.description || "",
                icd11Mappings: Array.isArray(data.icd11Mappings)
                    ? data.icd11Mappings.map(normalizeMapping)
                    : [],
            };

            // Fallback map call if no mappings
            if (!detail.icd11Mappings || detail.icd11Mappings.length === 0) {
                try {
                    const mapRes = await fetch(
                        `${BACKEND_URL}/api/v1/HandlingApi/disease/${code.id}/map`,
                        {
                            method: "POST",
                            headers: {
                                Authorization: localStorage.getItem("token") || "",
                            },
                        }
                    );
                    if (mapRes.ok) {
                        const mapData = await mapRes.json().catch(() => null);
                        if (mapData?.mappings && Array.isArray(mapData.mappings)) {
                            detail.icd11Mappings = mapData.mappings.map(normalizeMapping);
                        } else if (Array.isArray(mapData)) {
                            detail.icd11Mappings = mapData.map(normalizeMapping);
                        }
                    }
                } catch (err) {
                    console.error("Mapping fallback failed", err);
                }
            }

            setSelectedCode(detail);
        } catch (err) {
            console.error("Fetch details failed", err);
        } finally {
            setLoadingDetails(false);
        }
    };

    // ---------------- Animated pipeline helper ----------------
    // Simulate/progress pipeline visually while awaiting server responses.
    // We drive this from handleSendFHIRBundle below.
    const startPipelineAnimation = async (onComplete?: () => void) => {
        setActiveStep(0);
        setStepProgress(0);

        for (let i = 0; i < pipelineSteps.length; i++) {
            setActiveStep(i);
            // emulate progress gradually for the step
            for (let p = 0; p <= 100; p += 10) {
                setStepProgress(p);
                // small delay
                // eslint-disable-next-line no-await-in-loop
                await new Promise((r) => setTimeout(r, 120));
            }
        }
        setActiveStep(null);
        setStepProgress(100);
        onComplete?.();
    };

    // ---------------- Submit + show concept map ----------------
    const handleSendFHIRBundle = async () => {
        if (!selectedCode) return;
        setSubmitting(true);

        // Kick off pipeline animation in parallel (visual only)
        const pipelinePromise = startPipelineAnimation();

        try {
            // 1) register
            const regRes = await fetch(
                `${BACKEND_URL}/api/v1/HandlingApi/patient/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token") || "",
                    },
                    body: JSON.stringify({
                        patientId: patientDetails.patientId,   // this maps to externalId on backend
                        givenName: patientDetails.givenName,
                        gender: patientDetails.gender,
                        birthDate: patientDetails.birthDate,
                        codes: [
                            {
                                code: selectedCode.code,
                                system: selectedCode.system,
                            },
                        ],
                    }),
                }
            );

            if (!regRes.ok) {
                alert("❌ Failed to register patient");
                setSubmitting(false);
                return;
            }

            // 2) fetch FHIR bundle (POST)
            const res = await fetch(
                `${BACKEND_URL}/api/v1/HandlingApi/patient/${encodeURIComponent(
                    patientDetails.patientId
                )}/fhir-bundle`,
                {
                    method: "POST",
                    headers: {
                        Authorization: localStorage.getItem("token") || "",
                    },
                }
            );

            if (!res.ok) {
                alert("❌ Failed to get FHIR bundle");
                setSubmitting(false);
                return;
            }

            const bundle = await res.json();

            // Wait for pipeline animation to finish (so UI syncs)
            await pipelinePromise;

            // Construct a friendly payload for the concept map viewer
            const payload = {
                patient: patientDetails,
                disorder: {
                    id: selectedCode.id,
                    code: selectedCode.code,
                    display: selectedCode.display,
                    description: selectedCode.description,
                },
                mappings: selectedCode.icd11Mappings,
                fhirBundle: bundle,
                timestamp: new Date().toISOString(),
            };

            setConceptPayload(payload);
            setShowConceptMap(true);
        } catch (err) {
            console.error("Error submitting bundle", err);
            alert("❌ Failed to submit bundle");
        } finally {
            setSubmitting(false);
            // reset pipeline
            setActiveStep(null);
            setStepProgress(0);
        }
    };

    // ---------------- ConceptMap viewer component (inline) ----------------
    function ConceptMapViewer({
        payload,
        onClose,
    }: {
        payload: any;
        onClose: () => void;
    }) {
        if (!payload) return null;
        const { patient, disorder, mappings, fhirBundle } = payload;

        // simple layout + svg connectors for "concept map" aesthetic
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-6"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 10 }}
                        className="w-full max-w-6xl h-[80vh] bg-gradient-to-br from-black/80 to-slate-900/80 border border-gray-700 rounded-2xl shadow-2xl p-6 overflow-hidden"
                    >
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-green-400">
                                    Concept Map — {patient.givenName || patient.patientId}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Generated: {new Date(payload.timestamp).toLocaleString()}
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="rounded-full p-2 bg-gray-800 border border-gray-700 hover:bg-gray-700"
                                aria-label="Close concept map"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                            {/* Left: patient card */}
                            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs text-gray-400">Patient</div>
                                        <div className="text-lg font-semibold">
                                            {patient.givenName || "—"}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {patient.gender} • {patient.birthDate}
                                        </div>
                                    </div>
                                    <div className="text-sm font-mono text-green-400">
                                        {patient.patientId || "N/A"}
                                    </div>
                                </div>

                                <div className="mt-2 text-sm text-gray-300">
                                    Quick summary of patient + selected disorder.
                                </div>

                                <div className="mt-auto">
                                    <button
                                        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                        onClick={() =>
                                            window.open(
                                                "data:application/json;charset=utf-8," +
                                                encodeURIComponent(JSON.stringify(fhirBundle, null, 2))
                                            )
                                        }
                                    >
                                        Download FHIR (raw)
                                    </button>
                                </div>
                            </div>

                            {/* Center: concept map canvas */}
                            <div className="bg-gradient-to-b from-gray-900/40 to-transparent border border-gray-700 rounded-xl p-4 relative flex flex-col items-center justify-center">
                                {/* SVG connectors */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    {/* draw lines from center node to mapping nodes (simple decorative) */}
                                    {/* For simplicity, fixed coordinates used */}
                                    <defs>
                                        <marker
                                            id="arrow"
                                            viewBox="0 0 10 10"
                                            refX="6"
                                            refY="5"
                                            markerWidth="6"
                                            markerHeight="6"
                                            orient="auto-start-reverse"
                                        >
                                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
                                        </marker>
                                    </defs>

                                    {/* center node */}
                                    <circle cx="50%" cy="30%" r="0" fill="transparent" />

                                    {/* lines drawn to mapping nodes - decorative */}
                                    {/* we could programmatically compute positions, but for clarity use CSS layout */}
                                </svg>

                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative z-10 w-full"
                                >
                                    <div className="bg-gradient-to-r from-purple-700/40 via-blue-700/30 to-green-600/20 border border-gray-700 rounded-xl p-4 shadow-lg">
                                        <div className="text-xs text-gray-200">Disorder</div>
                                        <div className="font-semibold text-xl mt-1">{disorder.display}</div>
                                        <div className="text-sm font-mono text-gray-300 mt-1">{disorder.code}</div>
                                        <p className="text-gray-300 mt-2 text-sm">{disorder.description}</p>
                                    </div>

                                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {mappings && mappings.length > 0 ? (
                                            mappings.map((m: any) => (
                                                <motion.div
                                                    key={m.id}
                                                    initial={{ opacity: 0, scale: 0.98 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.08 }}
                                                    className="bg-gray-800 border border-gray-700 rounded-lg p-3"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <div className="font-mono">{m.code}</div>
                                                            <div className="text-sm text-gray-300">{m.display}</div>
                                                        </div>
                                                        <div className="text-xs px-2 py-1 rounded bg-green-700/80 text-white">
                                                            {m.system}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="text-gray-400">No ICD-11 mappings available</div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right: metadata + raw outputs */}
                            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 overflow-auto">
                                <div className="text-xs text-gray-400 mb-2">Meta</div>
                                <div className="text-sm text-gray-200">
                                    <div>
                                        <strong>Mappings:</strong> {mappings?.length ?? 0}
                                    </div>
                                    <div className="mt-2">
                                        <strong>Bundle size:</strong>{" "}
                                        {JSON.stringify(fhirBundle || {}).length} bytes
                                    </div>
                                </div>

                                <div className="mt-4 text-xs text-gray-400">Raw preview</div>
                                <pre className="mt-2 text-xs bg-black/50 p-2 rounded-md max-h-44 overflow-auto text-gray-200">
                                    {JSON.stringify({ patient, disorder, mappings }, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // ---------------- UI render ----------------
    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-black via-slate-900 to-slate-800 text-white px-6 py-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-green-400">
                            Medi-Link NAMASTE Mapping
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Fast mapping preview + FHIR bundle generation — pretty visuals included.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-300">Preview Mode</div>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-black font-bold">
                            ML
                        </div>
                    </div>
                </div>

                {/* Main grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left column */}
                    <div className="space-y-6">
                        {/* Patient card */}
                        <div className="bg-gradient-to-br from-black/60 to-slate-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-gray-400">Patient</div>
                                    <div className="text-lg font-semibold">{patientDetails.givenName || "—"}</div>
                                    <div className="text-sm text-gray-400">
                                        {patientDetails.gender || "Gender"} • {patientDetails.birthDate || "DOB"}
                                    </div>
                                </div>

                                <div className="text-sm font-mono text-green-400">
                                    {patientDetails.patientId || "No ID"}
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    placeholder="Patient ID"
                                    value={patientDetails.patientId}
                                    onChange={(e) =>
                                        setPatientDetails((p) => ({ ...p, patientId: e.target.value }))
                                    }
                                    className="px-3 py-2 bg-transparent border border-gray-700 rounded-lg"
                                />
                                <input
                                    placeholder="Given Name"
                                    value={patientDetails.givenName}
                                    onChange={(e) =>
                                        setPatientDetails((p) => ({ ...p, givenName: e.target.value }))
                                    }
                                    className="px-3 py-2 bg-transparent border border-gray-700 rounded-lg"
                                />
                                <select
                                    value={patientDetails.gender}
                                    onChange={(e) =>
                                        setPatientDetails((p) => ({ ...p, gender: e.target.value }))
                                    }
                                    className="px-3 py-2 bg-transparent border border-gray-700 rounded-lg"
                                >
                                    <option value="">Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                <input
                                    type="date"
                                    value={patientDetails.birthDate}
                                    onChange={(e) =>
                                        setPatientDetails((p) => ({ ...p, birthDate: e.target.value }))
                                    }
                                    className="px-3 py-2 bg-transparent border border-gray-700 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Search box */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="w-full pl-10 pr-28 py-4 rounded-xl bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500"
                                placeholder="Search NAMASTE disorders..."
                            />
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 disabled:opacity-50"
                            >
                                {loading ? "..." : "Search"}
                            </button>
                        </div>

                        {/* Results */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Search Results</h3>

                            <div className="grid gap-3">
                                {searchResults.length === 0 ? (
                                    <div className="text-gray-500 text-center py-12 rounded-lg border border-dashed border-gray-700">
                                        <Search className="w-10 h-10 mx-auto mb-2 text-gray-500" />
                                        <p>Start typing to fetch NAMASTE disorders</p>
                                    </div>
                                ) : (
                                    searchResults.map((code) => {
                                        const isActive = selectedCode?.id === code.id;
                                        return (
                                            <motion.button
                                                key={code.id}
                                                onClick={() => handleSelectCode(code)}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`w-full text-left p-4 rounded-2xl transition border ${isActive
                                                    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500 shadow-md"
                                                    : "bg-gray-900 border-gray-700 hover:border-gray-500"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="font-medium">{code.display}</div>
                                                        <div className="text-sm text-gray-400">{code.description}</div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <div className="text-sm font-mono text-gray-300">{code.code}</div>
                                                        <div className="text-xs px-2 py-1 rounded bg-green-700 text-white">
                                                            {code.system}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right column (details + submit + animated pipeline) */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-full flex flex-col">
                        {loadingDetails ? (
                            <div className="space-y-6" >
                                <h4 className="text-sm text-gray-300 mb-2">Processing Pipeline</h4>
                                <div className="bg-transparent border border-gray-800 rounded-xl p-4">
                                    {["DB Mapping", "LLM FallBack", "Finalizing"].map((s, i) => (
                                        <motion.div
                                            key={s}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.2 }}
                                            className="flex items-center gap-3 mb-4"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-medium text-gray-300">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-gray-200">{s}</div>
                                                <motion.div
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 1.2, delay: i * 0.5 }}
                                                    className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ) : selectedCode ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs text-gray-400">Selected</div>
                                        <div className="text-2xl font-semibold">{selectedCode.display}</div>
                                        <div className="text-sm text-gray-400 mt-1">{selectedCode.description}</div>
                                    </div>

                                    <div className="text-right">
                                        <div className="font-mono text-lg">{selectedCode.code}</div>
                                        <div className="text-xs px-2 py-1 rounded bg-green-700 text-white mt-1">
                                            {selectedCode.system}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="text-sm text-gray-300 mb-2">ICD-11 Mappings</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedCode.icd11Mappings.length === 0 ? (
                                            <div className="text-gray-400">No mappings available yet</div>
                                        ) : (
                                            selectedCode.icd11Mappings.map((m) => (
                                                <div
                                                    key={m.id}
                                                    className="p-3 border border-gray-700 rounded-lg bg-gray-800 min-w-[160px] shadow-sm"
                                                >
                                                    <div className="font-mono">{m.code}</div>
                                                    <div className="text-sm text-gray-300">{m.display}</div>
                                                    <div className="text-xs text-blue-300 mt-1">{m.system}</div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* pipeline animated visual */}
                                <div className="mt-6">
                                    <h4 className="text-sm text-gray-300 mb-3">Mapping Pipeline</h4>
                                    <div className="bg-transparent border border-gray-800 rounded-xl p-4">
                                        <div className="flex flex-col gap-3">
                                            {pipelineSteps.map((s, i) => {
                                                const isActiveStep = activeStep === i;
                                                const isDone = activeStep !== null && i < (activeStep || 0);
                                                return (
                                                    <div key={s} className="flex items-center gap-3">
                                                        <div
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${isDone
                                                                ? "bg-green-500 text-black"
                                                                : isActiveStep
                                                                    ? "bg-blue-500 text-black"
                                                                    : "bg-gray-800 text-gray-300"
                                                                }`}
                                                        >
                                                            {isDone ? <Check className="w-4 h-4" /> : i + 1}
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center">
                                                                <div className="font-medium">{s}</div>
                                                                <div className="text-xs text-gray-400">
                                                                    {isActiveStep ? `${stepProgress}%` : isDone ? "Done" : "Pending"}
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    animate={{ width: isActiveStep ? `${stepProgress}%` : isDone ? "100%" : "0%" }}
                                                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={handleSendFHIRBundle}
                                        disabled={submitting}
                                        className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-black font-semibold hover:opacity-90 disabled:opacity-50"
                                    >
                                        {submitting ? "Processing..." : "Submit FHIR Bundle"}
                                    </button>

                                    <button
                                        onClick={() => {
                                            // quick preview toggle concept map without submitting (useful for demo)
                                            setConceptPayload({
                                                patient: patientDetails,
                                                disorder: selectedCode,
                                                mappings: selectedCode.icd11Mappings,
                                                fhirBundle: { note: "Preview (no server request)" },
                                                timestamp: new Date().toISOString(),
                                            });
                                            setShowConceptMap(true);
                                        }}
                                        className="px-4 py-3 rounded-lg border border-gray-700"
                                    >
                                        Preview Map
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-gray-400 text-center py-12 rounded-lg border border-dashed border-gray-700">
                                Select a disorder to view details and mappings.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Concept map modal */}
            <AnimatePresence>
                {showConceptMap && (
                    <motion.div
                        key="concept-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <ConceptMapViewer
                            payload={conceptPayload}
                            onClose={() => setShowConceptMap(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}




