import React from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useAppData } from "@/hooks/useAppData";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { TrialSelector } from "@/components/documents/TrialSelector.tsx";
import { DocumentAssistantTabs } from "@/components/documents/DocumentAssistantTabs";
import { ActiveDocuments } from "@/components/documents/ActiveDocuments";
import { DocumentAI } from "@/components/documents/DocumentAI";
import { QARepository } from "@/components/documents/QARepository";
import { ChatPDFFallbackProvider } from "@/components/documents/ChatPDFFallbackProvider";
import { BookOpen, MessageSquare } from "lucide-react";
import type { BreadcrumbItem } from "@/components/ui/breadcrumb";
import { TrialDropdownBreadcrumb } from "@/components/common/breadcrumbs/TrialDropdownBreadcrumb";
import { DocumentRag } from "@/components/documents/DocumentRag";
import { DocumentRagBioBERT } from "@/components/documents/DocumentRagBioBERT";
import { AppLayoutNew } from "@/components/layout/AppLayoutNew";

const tabNames: Record<string, string> = {
  "document-ai": "Document AI",
  "active-documents": "Active Documents",
  "qa-repository": "QA Repository",
  "select-trial": "Select Trial",
  "rag": "RAG",
  "rag-biobert": "RAG-BioBERT",
};

export default function DocumentAssistantPage() {
  const { trialId, tab } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { metrics, isUserAssignedToTrial } = useAppData();
  const trials = metrics?.trials || [];
  const [selectedDocumentId, setSelectedDocumentId] = React.useState<string | null>(null)
  const from = searchParams.get("from") || "other";
  const currentTab = tab || "active-documents";
  console.log("DocumentAssistantPage - currentTab:", currentTab);
  // Validar que el trial existe y el usuario tiene acceso
  const selectedTrial = trialId ? trials.find((t) => t.id === trialId) : null;

  // Breadcrumb base
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Document Assistant",
      href: "/document-assistant/select-trial",
      icon: MessageSquare,
    },
  ];

  // Siempre agregamos el selector de trial
  breadcrumbItems.push({
    customContent: (
      <TrialDropdownBreadcrumb
        currentTrial={
          selectedTrial || {
            id: "",
            name: "Select Trial",
          }
        }
        basePath="/document-assistant"
        className="px-2 py-1 -ml-2"
      />
    ),
  });

  // Si no hay trialId, mostrar selector de trial
  // if (!trialId) {
  //   return (
  //     <AppLayoutNew>
  //       <TrialSelector from={from} />
  //     </AppLayoutNew>
  //   );
  // }

  // Validar acceso al trial
  if (!selectedTrial) {
    return (
      <AppLayoutNew>
        <div className="h-full flex flex-col items-center justify-center text-center px-6">
          <BookOpen className="w-12 h-12 text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-800">
            Document AI Assistant
          </h3>
          <p className="text-slate-600 mt-2">
            Select a trial to get started with the Document AI Assistant.
          </p>
          
        </div>
      </AppLayoutNew>
    );
  }

  if (!isUserAssignedToTrial(trialId)) {
    return (
      <AppLayoutNew>
        <TrialError message="You don't have access to this trial" />
      </AppLayoutNew>
    );
  }

  // Agregar tab actual al breadcrumb
  if (currentTab && tabNames[currentTab]) {
    breadcrumbItems.push({
      label: tabNames[currentTab],
      isActive: true,
    });
  }

  return (
    <AppLayoutNew
      selectedTrialId={trialId}
      onSelectDocument={(docId) => setSelectedDocumentId(docId)}
    >
      <div className="flex-1 flex flex-col h-full">
        {/* <DocumentAssistantTabs
          currentTab={currentTab}
          onTabChange={(newTab) =>
            navigate(`/document-assistant/${trialId}/${newTab}`)
          }
        /> */}

        <div className="flex-1 h-0 relative">
          <ChatPDFFallbackProvider>
            <DocumentAssistantContent
              trial={selectedTrial}
              currentTab={currentTab}
              documentId={selectedDocumentId}
            />
          </ChatPDFFallbackProvider>
        </div>
      </div>
    </AppLayoutNew>
  );
}

// Error component
function TrialError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-red-600">{message}</h3>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}

// Content router component
function DocumentAssistantContent({
  trial,
  documentId,
  currentTab,
}: {
  trial: {
    id: string;
    name: string;
  };
  currentTab: string;
  documentId?: string;
}) {
  switch (currentTab) {
    case "document-ai":
      return <DocumentAI trial={trial} />;
    case "active-documents":
      return <ActiveDocuments trial={trial} />;
    case "qa-repository":
      return <QARepository trial={trial} />;
    case "rag":
      return <DocumentRag trial={trial} documentId={documentId} />;
    case "rag-biobert":
      return <DocumentRagBioBERT trial={trial} />;
    default:
      return <ActiveDocuments trial={trial} />;
  }
}




// import React from "react";
// import { useParams, useSearchParams, useNavigate } from "react-router-dom";
// import { useAppData } from "@/hooks/useAppData";
// import { AppLayout } from "@/components/layout/AppLayout";
// import { Button } from "@/components/ui/button";
// import { TrialSelector } from "@/components/documents/TrialSelector.tsx";
// import { DocumentAssistantTabs } from "@/components/documents/DocumentAssistantTabs";
// import { ActiveDocuments } from "@/components/documents/ActiveDocuments";
// import { DocumentAI } from "@/components/documents/DocumentAI";
// import { QARepository } from "@/components/documents/QARepository";
// import { ChatPDFFallbackProvider } from "@/components/documents/ChatPDFFallbackProvider";
// import { MessageSquare } from "lucide-react";
// import type { BreadcrumbItem } from "@/components/ui/breadcrumb";
// import { TrialDropdownBreadcrumb } from "@/components/common/breadcrumbs/TrialDropdownBreadcrumb";
// import { DocumentRag } from "@/components/documents/DocumentRag";
// import { DocumentRagBioBERT } from "@/components/documents/DocumentRagBioBERT";

// const tabNames: Record<string, string> = {
//   "document-ai": "Document AI",
//   "active-documents": "Active Documents",
//   "qa-repository": "QA Repository",
//   "select-trial": "Select Trial",
//   "rag": "RAG",
//   "rag-biobert": "RAG-BioBERT",
// };

// export default function DocumentAssistantPage() {
//   const { trialId, tab } = useParams();
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { metrics, isUserAssignedToTrial } = useAppData();
//   const trials = metrics?.trials || [];

//   const from = searchParams.get("from") || "other";
//   const currentTab = tab || "active-documents";
//   console.log("DocumentAssistantPage - currentTab:", currentTab);
//   // Validar que el trial existe y el usuario tiene acceso
//   const selectedTrial = trialId ? trials.find((t) => t.id === trialId) : null;

//   // Breadcrumb base
//   const breadcrumbItems: BreadcrumbItem[] = [
//     {
//       label: "Document Assistant",
//       href: "/document-assistant/select-trial",
//       icon: MessageSquare,
//     },
//   ];

//   // Siempre agregamos el selector de trial
//   breadcrumbItems.push({
//     customContent: (
//       <TrialDropdownBreadcrumb
//         currentTrial={
//           selectedTrial || {
//             id: "",
//             name: "Select Trial",
//           }
//         }
//         basePath="/document-assistant"
//         className="px-2 py-1 -ml-2"
//       />
//     ),
//   });

//   // Si no hay trialId, mostrar selector de trial
//   if (!trialId) {
//     return (
//       <AppLayout title="Document Assistant" breadcrumbItems={breadcrumbItems}>
//         <TrialSelector from={from} />
//       </AppLayout>
//     );
//   }

//   // Validar acceso al trial
//   if (!selectedTrial) {
//     return (
//       <AppLayout title="Document Assistant" breadcrumbItems={breadcrumbItems}>
//         <TrialError message="Trial not found" />
//       </AppLayout>
//     );
//   }

//   if (!isUserAssignedToTrial(trialId)) {
//     return (
//       <AppLayout title="Document Assistant" breadcrumbItems={breadcrumbItems}>
//         <TrialError message="You don't have access to this trial" />
//       </AppLayout>
//     );
//   }

//   // Agregar tab actual al breadcrumb
//   if (currentTab && tabNames[currentTab]) {
//     breadcrumbItems.push({
//       label: tabNames[currentTab],
//       isActive: true,
//     });
//   }

//   return (
//     <AppLayout title="Document Assistant" breadcrumbItems={breadcrumbItems}>
//       <div className="flex-1 flex flex-col h-full">
//         {/* <DocumentAssistantTabs
//           currentTab={currentTab}
//           onTabChange={(newTab) =>
//             navigate(`/document-assistant/${trialId}/${newTab}`)
//           }
//         /> */}

//         <div className="flex-1 h-0 relative">
//           <ChatPDFFallbackProvider>
//             <DocumentAssistantContent
//               trial={selectedTrial}
//               currentTab={currentTab}
//             />
//           </ChatPDFFallbackProvider>
//         </div>
//       </div>
//     </AppLayout>
//   );
// }

// // Error component
// function TrialError({ message }: { message: string }) {
//   return (
//     <div className="flex items-center justify-center h-64">
//       <div className="text-center">
//         <h3 className="text-lg font-semibold text-red-600">{message}</h3>
//         <Button
//           variant="outline"
//           className="mt-4"
//           onClick={() => window.history.back()}
//         >
//           Go Back
//         </Button>
//       </div>
//     </div>
//   );
// }

// // Content router component
// function DocumentAssistantContent({
//   trial,
//   currentTab,
// }: {
//   trial: {
//     id: string;
//     name: string;
//   };
//   currentTab: string;
// }) {
//   switch (currentTab) {
//     case "document-ai":
//       return <DocumentAI trial={trial} />;
//     case "active-documents":
//       return <ActiveDocuments trial={trial} />;
//     case "qa-repository":
//       return <QARepository trial={trial} />;
//     case "rag":
//       return <DocumentRag trial={trial} />;
//     case "rag-biobert":
//       return <DocumentRagBioBERT trial={trial} />;
//     default:
//       return <ActiveDocuments trial={trial} />;
//   }
// }
