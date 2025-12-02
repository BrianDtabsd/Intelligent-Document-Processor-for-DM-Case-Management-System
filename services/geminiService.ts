
import { GoogleGenAI, Type } from "@google/genai";
import { AutomatedWorkflowResult, DocumentDetails } from '../types';

const MODEL_NAME = "gemini-2.5-flash";

const getSystemInstruction = (caseId: string): string => {
  const currentDate = new Date().toISOString().split('T')[0];
  return `
You are "Casewrite AI", an advanced autonomous agent for employee disability case management.
Your goal is to process incoming case documents (images, PDFs, handwritten notes, or text), understand them deeply, and orchestrate the entire case management workflow.
The current date is ${currentDate}.
Case ID: "${caseId}".

**Your Capabilities:**
1. **Vision & OCR**: You can read complex documents, including cursive handwriting, forms, and medical notes.
2. **Analysis**: Identify document types, extract employee details, and summarize medical conditions.
3. **Planning**: Create actionable case management plans and schedule tasks.
4. **Communication Agent**:
   - You must DRAFT formal letters to stakeholders (Employee, Doctor, HR) based on the document content.
   - These letters should be professional, empathetic, and ready for the Case Manager to approve.
   - Identify necessary updates to other stakeholders.

**Output Requirement:**
Analyze the provided input (text and/or image) and return a strict JSON object matching the provided schema.
`;
};

export const analyzeDocumentWithGemini = async (details: DocumentDetails): Promise<AutomatedWorkflowResult> => {
  if (typeof process === 'undefined' || !process.env || !process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. Please ensure it's configured.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prepare contents: Text prompt + Optional Image/PDF Part
  const parts: any[] = [];
  
  // Always add the text prompt/context
  const textContext = details.documentContent.trim() 
    ? `Additional Context/Text Content:\n${details.documentContent}` 
    : "Please analyze the attached document.";
  
  parts.push({ text: textContext });

  // Add file if present
  if (details.fileData) {
    parts.push({
      inlineData: {
        mimeType: details.fileData.mimeType,
        data: details.fileData.data
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts },
      config: {
        systemInstruction: getSystemInstruction(details.caseId),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caseId: { type: Type.STRING },
            initialProcessing: {
              type: Type.OBJECT,
              properties: {
                acknowledgedToSender: { type: Type.STRING },
                documentTypeIdentified: { type: Type.STRING, description: "Identify if it is a form, letter, or handwritten note." },
                employeeName: { type: Type.STRING, nullable: true },
                dateOfIncident: { type: Type.STRING, nullable: true },
                dateReceived: { type: Type.STRING },
              },
              required: ["acknowledgedToSender", "documentTypeIdentified", "dateReceived"]
            },
            analysisAndStorage: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                disabilityDetails: { type: Type.STRING, description: "Details extracted from text or handwriting regarding the condition." },
                simulatedStorageConfirmation: { type: Type.STRING },
              },
              required: ["summary", "keyPoints", "disabilityDetails", "simulatedStorageConfirmation"]
            },
            planningAndTasks: {
              type: Type.OBJECT,
              properties: {
                casePlan: {
                  type: Type.OBJECT,
                  properties: {
                    planDetails: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                  },
                  required: ["planDetails", "reasoning"]
                },
                suggestedTasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      details: { type: Type.STRING },
                      dueDateSuggestion: { type: Type.STRING },
                      assignedToSuggestion: { type: Type.STRING },
                    },
                    required: ["title", "details", "dueDateSuggestion", "assignedToSuggestion"]
                  }
                },
                suggestedCalendarEvents: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      startTimeSuggestion: { type: Type.STRING },
                      endTimeSuggestion: { type: Type.STRING },
                      alertMinutesBeforeSuggestion: { type: Type.NUMBER, nullable: true }
                    },
                    required: ["title", "description", "startTimeSuggestion", "endTimeSuggestion"]
                  }
                }
              },
              required: ["casePlan", "suggestedTasks", "suggestedCalendarEvents"]
            },
            notificationsAndUrgency: {
              type: Type.OBJECT,
              properties: {
                simulatedAlerts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      recipientSuggestion: { type: Type.STRING },
                      channelSuggestion: { type: Type.STRING },
                      message: { type: Type.STRING }
                    },
                    required: ["recipientSuggestion", "channelSuggestion", "message"]
                  }
                },
                overallUrgencyLevel: { type: Type.STRING }
              },
              required: ["simulatedAlerts", "overallUrgencyLevel"]
            },
            aiAgentActions: {
              type: Type.OBJECT,
              properties: {
                draftLetters: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      recipient: { type: Type.STRING },
                      subject: { type: Type.STRING },
                      content: { type: Type.STRING, description: "Full draft of the letter content." },
                      context: { type: Type.STRING },
                      status: { type: Type.STRING, enum: ["Pending Approval"] }
                    },
                    required: ["recipient", "subject", "content", "context", "status"]
                  }
                },
                stakeholderCommunications: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stakeholder: { type: Type.STRING },
                      updateType: { type: Type.STRING },
                      notes: { type: Type.STRING }
                    },
                    required: ["stakeholder", "updateType", "notes"]
                  }
                }
              },
              required: ["draftLetters", "stakeholderCommunications"]
            }
          },
          required: ["caseId", "initialProcessing", "analysisAndStorage", "planningAndTasks", "notificationsAndUrgency", "aiAgentActions"]
        }
      },
    });

    if (!response.text) {
        throw new Error("No text response from Gemini.");
    }

    const parsedData = JSON.parse(response.text);
    return parsedData as AutomatedWorkflowResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Failed to analyze document: ${error instanceof Error ? error.message : String(error)}`);
  }
};
