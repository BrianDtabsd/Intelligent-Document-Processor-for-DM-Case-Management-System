
export interface SimulatedReceipt {
  acknowledgedToSender: string; // e.g., "Email receipt automatically acknowledged to sender."
  documentTypeIdentified: string; // e.g., "Doctor's Note", "Claim Form"
  employeeName: string | null;
  dateOfIncident: string | null; // ISO YYYY-MM-DD
  dateReceived: string; // ISO YYYY-MM-DD
}

export interface DocumentAnalysis {
  summary: string; // Concise summary
  keyPoints: string[]; // Bullet points of critical info
  disabilityDetails: string; // Description of condition
  simulatedStorageConfirmation: string; // e.g., "Document and summary noted for upload to Case File {{caseId}}."
}

export interface CasePlan {
  planDetails: string; // AI generated plan update
  reasoning: string; // Reasoning for the plan
}

export interface SuggestedTask {
  title: string;
  details: string;
  dueDateSuggestion: string; // e.g., "5 days from now", "YYYY-MM-DD"
  assignedToSuggestion: string; // e.g., "Case Manager", "HR Specialist"
}

export interface SuggestedCalendarEvent {
  title: string;
  description: string;
  startTimeSuggestion: string; // e.g., "7 days from now at 09:00", "YYYY-MM-DDTHH:mm:ss"
  endTimeSuggestion: string;
  alertMinutesBeforeSuggestion?: number;
}

export interface SimulatedAlert {
  recipientSuggestion: string; // e.g., "Assigned Case Manager"
  channelSuggestion: string; // e.g., "Urgent Notifications", "Case Management System Alert"
  message: string;
}

export interface DraftLetter {
  recipient: string;
  subject: string;
  content: string; // The full body of the letter
  context: string; // Why this letter is being sent
  status: 'Draft' | 'Pending Approval';
}

export interface StakeholderCommunication {
  stakeholder: string; // e.g., "HR Director", "Legal"
  updateType: string; // e.g., "Status Report", "Risk Alert"
  notes: string;
}

export interface AutomatedWorkflowResult {
  caseId: string;
  initialProcessing: SimulatedReceipt;
  analysisAndStorage: DocumentAnalysis;
  planningAndTasks: {
    casePlan: CasePlan;
    suggestedTasks: SuggestedTask[];
    suggestedCalendarEvents: SuggestedCalendarEvent[];
  };
  notificationsAndUrgency: {
    simulatedAlerts: SimulatedAlert[];
    overallUrgencyLevel: 'Low' | 'Medium' | 'High' | string;
  };
  aiAgentActions: {
    draftLetters: DraftLetter[];
    stakeholderCommunications: StakeholderCommunication[];
  };
}

// Keep DocumentDetails for input form
export interface DocumentDetails {
  caseId: string;
  documentContent: string;
  fileData?: {
    mimeType: string;
    data: string; // Base64
  } | null;
}
