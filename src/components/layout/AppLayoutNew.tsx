import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppData } from "@/hooks/useAppData";
import { useTrialDocuments } from "@/hooks/useDocuments";

import { AppSidebar } from "./AppSidebar";

interface AppLayoutNewProps {
    children: React.ReactNode;
    selectedTrialId?: string;
    onSelectDocument?: (docId: string) => void;
}

export function AppLayoutNew({
    children,
    selectedTrialId,
    onSelectDocument,
}: AppLayoutNewProps) {
    const { trialId } = useParams();
    const { metrics } = useAppData();
    const trials = metrics?.trials || [];
    const { data: documents = [], isLoading: docsLoading } = useTrialDocuments(selectedTrialId ?? trialId);

    const [selectedDocumentId, setSelectedDocumentId] = React.useState("");

    // Whenever selectedDocumentId changes, notify parent
    React.useEffect(() => {
        if (selectedDocumentId && onSelectDocument) {
            onSelectDocument(selectedDocumentId);
        }
    }, [selectedDocumentId, onSelectDocument]);

    return (
        <div className="h-screen flex bg-white">
            {/* Sidebar */}
            <div className="flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
                <div className="flex flex-col flex-grow bg-gray-50 border-r border-gray-200 overflow-y-auto">
                    <AppSidebar />
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64 flex flex-col flex-1 min-h-0">
                {/* Header */}
                <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
                    <div className="px-4 sm:px-6 lg:px-8 flex items-center gap-4 h-16">
                        <TrialSelect
                            trials={trials}
                            selectedTrialId={selectedTrialId ?? trialId}
                        />
                        <TrialDocumentSelect
                            documents={documents}
                            loading={docsLoading}
                            selectedDocumentId={selectedDocumentId}
                            onChange={setSelectedDocumentId}
                        />
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto bg-white">
                    <div className="p-4 sm:p-6 lg:p-8 pb-0">{children}</div>
                </main>
            </div>
        </div>
    );
}

function TrialSelect({ trials, selectedTrialId }) {
    const navigate = useNavigate();
    const { tab } = useParams();
    const currentTab = tab ?? "rag";

    return (
        <select
            className="border rounded px-3 py-1 text-sm"
            value={selectedTrialId ?? ""}
            // --- FIX APPLIED HERE ---
            onChange={(e) => navigate(`/document-assistant/${e.target.value}/${currentTab}`)}
        >
            <option value="" disabled>
                Select trial
            </option>
            {trials.map((trial: any) => (
                <option key={trial.id} value={trial.id}>
                    {trial.name}
                </option>
            ))}
        </select>
    );
}

function TrialDocumentSelect({ documents, loading, selectedDocumentId, onChange }) {
    return (
        <select
            className="border rounded px-3 py-1 text-sm"
            disabled={loading || documents.length === 0}
            value={selectedDocumentId}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="" disabled>
                {loading ? "Loading documents..." : "Select document"}
            </option>
            {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                    {doc.document_name.replace(/\.pdf$/i, "")}
                </option>
            ))}
        </select>
    );
}