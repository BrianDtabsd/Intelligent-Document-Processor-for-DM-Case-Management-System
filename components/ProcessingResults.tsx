
import React from 'react';
import { AutomatedWorkflowResult, SuggestedTask, SuggestedCalendarEvent, SimulatedAlert, DraftLetter, StakeholderCommunication } from '../types';

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  isAgentAction?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children, className, isAgentAction }) => (
  <div className={`p-6 rounded-lg shadow-xl ${isAgentAction ? 'bg-indigo-900/40 border border-indigo-500/30' : 'bg-slate-700'} ${className}`}>
    <div className="flex items-center mb-4">
      {icon && <span className={`mr-3 text-2xl ${isAgentAction ? 'text-indigo-400' : 'text-sky-400'}`}>{icon}</span>}
      <h3 className={`text-2xl font-semibold ${isAgentAction ? 'text-indigo-400' : 'text-sky-400'}`}>{title}</h3>
    </div>
    <div className="text-slate-200 space-y-3">{children}</div>
  </div>
);

const DetailItem: React.FC<{ label: string; value: string | null | undefined; isBlock?: boolean }> = ({ label, value, isBlock }) => (
  <div className={isBlock ? 'mb-2' : 'flex flex-wrap'}>
    <strong className="text-slate-300 mr-2">{label}:</strong>
    <span className={`whitespace-pre-wrap ${value ? 'text-slate-100' : 'italic text-slate-400'}`}>
      {value || 'Not specified'}
    </span>
  </div>
);

const UrgencyBadge: React.FC<{level: string}> = ({ level }) => {
  let bgColor = 'bg-gray-500';
  if (level?.toLowerCase() === 'low') bgColor = 'bg-green-600';
  else if (level?.toLowerCase() === 'medium') bgColor = 'bg-yellow-500';
  else if (level?.toLowerCase() === 'high') bgColor = 'bg-red-600';
  return <span className={`px-3 py-1 text-sm font-bold text-white rounded-full ${bgColor}`}>{level}</span>;
}

const LetterPreview: React.FC<{ letter: DraftLetter }> = ({ letter }) => (
  <div className="bg-slate-100 text-slate-900 p-6 rounded shadow-md font-serif text-sm relative mt-2">
    <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded border border-yellow-300 font-sans font-bold">
      {letter.status.toUpperCase()}
    </div>
    <p className="mb-2"><strong>To:</strong> {letter.recipient}</p>
    <p className="mb-4"><strong>Subject:</strong> {letter.subject}</p>
    <hr className="border-slate-300 mb-4"/>
    <div className="whitespace-pre-wrap leading-relaxed">
      {letter.content}
    </div>
    <div className="mt-4 pt-4 border-t border-slate-300 flex justify-end space-x-2 font-sans">
      <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">Approve & Send</button>
      <button className="bg-slate-500 text-white px-3 py-1 rounded text-xs hover:bg-slate-600">Edit</button>
    </div>
  </div>
);

// Icons
const EmailIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>;
const DocumentIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 17.25H6.75A2.25 2.25 0 0 1 4.5 15V6.75A2.25 2.25 0 0 1 6.75 4.5h7.5a2.25 2.25 0 0 1 2.25 2.25v6.063" /></svg>;
const PlanIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 6.471 3H4.5a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 4.5 21h10.975M9 12H3.75M9 15H3.75M9 18H3.75" /></svg>;
const TaskIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" /></svg>;
const CalendarIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>;
const AlertIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M12 6v.01" /></svg>;
const CloudUploadIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.045 11.096A4.502 4.502 0 0112 19.5z" /></svg>;
const RobotIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12h1.5m12 0h1.5m-1.5 3.75h1.5m-1.5 3.75h-1.5s-3 1.5-6 1.5-6-1.5-6-1.5H4.5m15-1.125L12 12 4.5 15.75" /></svg>;

export const ProcessingResults: React.FC<{ result: AutomatedWorkflowResult }> = ({ result }) => {
  const { initialProcessing, analysisAndStorage, planningAndTasks, notificationsAndUrgency, aiAgentActions } = result;

  return (
    <div className="space-y-8">
      {/* Agent Action Section - Promoted to top or relevant area */}
      {aiAgentActions && (
        <SectionCard title="AI Agent Actions" icon={RobotIcon} isAgentAction>
          <div className="mb-6">
            <h4 className="text-lg font-medium text-indigo-300 mb-3 border-b border-indigo-500/30 pb-1">Draft Letters (Pending Approval)</h4>
            {aiAgentActions.draftLetters && aiAgentActions.draftLetters.length > 0 ? (
               <div className="grid gap-6 md:grid-cols-2">
                 {aiAgentActions.draftLetters.map((letter, idx) => (
                    <div key={idx} className="space-y-2">
                        <p className="text-xs text-indigo-300">Context: {letter.context}</p>
                        <LetterPreview letter={letter} />
                    </div>
                 ))}
               </div>
            ) : <p className="italic text-slate-400">No formal letters required for this update.</p>}
          </div>

          <div>
             <h4 className="text-lg font-medium text-indigo-300 mb-3 border-b border-indigo-500/30 pb-1">Stakeholder Communication Plan</h4>
             {aiAgentActions.stakeholderCommunications && aiAgentActions.stakeholderCommunications.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-800/50 text-indigo-200">
                            <tr>
                                <th className="px-4 py-2">Stakeholder</th>
                                <th className="px-4 py-2">Update Type</th>
                                <th className="px-4 py-2">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-600">
                            {aiAgentActions.stakeholderCommunications.map((comm, idx) => (
                                <tr key={idx} className="hover:bg-slate-800/30">
                                    <td className="px-4 py-2 font-medium text-white">{comm.stakeholder}</td>
                                    <td className="px-4 py-2 text-sky-200">{comm.updateType}</td>
                                    <td className="px-4 py-2 text-slate-300">{comm.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             ) : <p className="italic text-slate-400">No additional stakeholder updates needed.</p>}
          </div>
        </SectionCard>
      )}

      <SectionCard title="Initial Processing & Receipt" icon={EmailIcon}>
        <DetailItem label="Case ID" value={result.caseId} />
        <DetailItem label="Simulated Acknowledgement" value={initialProcessing.acknowledgedToSender} isBlock/>
        <DetailItem label="Document Type Identified" value={initialProcessing.documentTypeIdentified} />
        <DetailItem label="Employee Name" value={initialProcessing.employeeName} />
        <DetailItem label="Date of Incident" value={initialProcessing.dateOfIncident} />
        <DetailItem label="Date Received" value={initialProcessing.dateReceived} />
      </SectionCard>

      <SectionCard title="Document Analysis & Simulated Storage" icon={DocumentIcon}>
        <DetailItem label="AI Summary" value={analysisAndStorage.summary} isBlock />
        <div className="mb-2">
          <strong className="text-slate-300 block mb-1">Key Points:</strong>
          {analysisAndStorage.keyPoints && analysisAndStorage.keyPoints.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 pl-4 text-slate-100">
              {analysisAndStorage.keyPoints.map((point, index) => <li key={index}>{point}</li>)}
            </ul>
          ) : <p className="italic text-slate-400">No specific key points identified.</p>}
        </div>
        <DetailItem label="Disability Details" value={analysisAndStorage.disabilityDetails} isBlock/>
        <p className="text-slate-300 flex items-center">
            {CloudUploadIcon}
            {analysisAndStorage.simulatedStorageConfirmation}
        </p>
      </SectionCard>

      <div className="grid md:grid-cols-2 gap-6">
        <SectionCard title="Case Plan Update" icon={PlanIcon}>
          <DetailItem label="Proposed Plan" value={planningAndTasks.casePlan.planDetails} isBlock/>
          <DetailItem label="Reasoning" value={planningAndTasks.casePlan.reasoning} isBlock/>
        </SectionCard>

        <SectionCard title="Suggested Tasks" icon={TaskIcon}>
          {planningAndTasks.suggestedTasks && planningAndTasks.suggestedTasks.length > 0 ? (
            <ul className="space-y-4">
              {planningAndTasks.suggestedTasks.map((task: SuggestedTask, index: number) => (
                <li key={index} className="p-4 bg-slate-600 rounded-md shadow">
                  <p className="font-semibold text-sky-300 text-lg">{task.title}</p>
                  <p className="text-sm text-slate-200 mt-1 mb-2 whitespace-pre-wrap">{task.details}</p>
                  <DetailItem label="Suggested Due Date" value={task.dueDateSuggestion} />
                  <DetailItem label="Suggested Assignee" value={task.assignedToSuggestion} />
                </li>
              ))}
            </ul>
          ) : <p className="italic text-slate-400">No specific tasks suggested.</p>}
        </SectionCard>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <SectionCard title="Suggested Calendar Events" icon={CalendarIcon}>
          {planningAndTasks.suggestedCalendarEvents && planningAndTasks.suggestedCalendarEvents.length > 0 ? (
            <ul className="space-y-4">
              {planningAndTasks.suggestedCalendarEvents.map((event: SuggestedCalendarEvent, index: number) => (
                <li key={index} className="p-4 bg-slate-600 rounded-md shadow">
                  <p className="font-semibold text-sky-300 text-lg">{event.title}</p>
                  <p className="text-sm text-slate-200 mt-1 mb-2 whitespace-pre-wrap">{event.description}</p>
                  <DetailItem label="Suggested Start" value={event.startTimeSuggestion} />
                  <DetailItem label="Suggested End" value={event.endTimeSuggestion} />
                  {event.alertMinutesBeforeSuggestion && <DetailItem label="Reminder" value={`${event.alertMinutesBeforeSuggestion} minutes before`} />}
                </li>
              ))}
            </ul>
          ) : <p className="italic text-slate-400">No calendar events suggested.</p>}
        </SectionCard>

        <SectionCard title="Simulated Alerts & Urgency" icon={AlertIcon}>
          <div className="mb-4">
            <strong className="text-slate-300 mr-2">Overall Urgency Level:</strong>
            <UrgencyBadge level={notificationsAndUrgency.overallUrgencyLevel} />
          </div>
          {notificationsAndUrgency.simulatedAlerts && notificationsAndUrgency.simulatedAlerts.length > 0 ? (
            <ul className="space-y-3">
              {notificationsAndUrgency.simulatedAlerts.map((alert: SimulatedAlert, index: number) => (
                <li key={index} className="p-3 bg-sky-800/70 rounded-md border border-sky-700">
                  <p className="font-medium text-sky-200">{alert.message}</p>
                  <p className="text-xs text-sky-400 mt-1">To: {alert.recipientSuggestion} (via {alert.channelSuggestion})</p>
                </li>
              ))}
            </ul>
          ) : <p className="italic text-slate-400">No specific alerts simulated.</p>}
        </SectionCard>
      </div>
    </div>
  );
};
