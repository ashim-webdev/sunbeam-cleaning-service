import React from "react";
import { useSelector } from "react-redux";
import {
  ShieldCheck,
  ClipboardCheck,
  CalendarCheck,
  Lock,
  MessageSquare,
  FileText,
  Award,
  AlertTriangle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

const PolicyCard = ({ icon: Icon, title, children, LightMode }) => (
  <div
    className={`rounded-2xl border p-6 transition-all duration-300 ${
      LightMode
        ? "bg-white border-slate-200 shadow-sm"
        : "bg-black/80 border-slate-300"
    }`}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 rounded-xl bg-blue-600">
        <Icon className="w-5 h-5 text-white" />
      </div>

      <h2
        className={`text-lg font-bold ${
          LightMode ? "text-slate-900" : "text-white"
        }`}
      >
        {title}
      </h2>
    </div>

    <div
      className={`space-y-2 text-sm leading-7 ${
        LightMode ? "text-slate-600" : "text-slate-300"
      }`}
    >
      {children}
    </div>
  </div>
);

const TermsAndPolicies = () => {
  const { LightMode } = useSelector((state) => state.auth);

  return (
    <div
      className="min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="sm:p-4 p-2 rounded-2xl bg-blue-600">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
              <h1
                className={`sm:text-3xl text-lg font-bold ${
                  LightMode ? "text-slate-900" : "text-white"
                }`}
              >
                Company Terms & Policies
              </h1>
          </div>
          <div className="-mt-2">
            <p
              className={`mt-2 text-center ${
                LightMode ? "text-slate-600" : "text-slate-200"
              }`}
            >
              Sunbeam Cleaning Services Employee Guidelines and Workplace
              Standards.
            </p>
          </div>
        </div>

        <div className="md:px-20 px-6 mb-6 mt-4">
          <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10" />
        </div>

        {/* Policies */}
        <div className="grid gap-6">
          <PolicyCard
            icon={ShieldCheck}
            title="System Usage Policy"
            LightMode={LightMode}
          >
            <ul className="list-disc pl-5">
              <li>This platform is provided for company-related work only.</li>
              <li>
                Employees must use their assigned accounts and keep credentials
                secure.
              </li>
              <li>Sharing passwords or accounts is prohibited.</li>
              <li>
                Unauthorized access to company information is strictly
                forbidden.
              </li>
            </ul>
          </PolicyCard>

          <PolicyCard
            icon={ClipboardCheck}
            title="Task Management Policy"
            LightMode={LightMode}
          >
            <ul className="list-disc pl-5">
              <li>
                Employees are responsible for updating task statuses
                accurately.
              </li>
              <li>
                Tasks should be updated promptly as work progresses through:
                Todo, In Progress, and Completed stages.
              </li>
              <li>
                False completion reports or misleading updates are prohibited.
              </li>
              <li>
                Important task updates should be documented within the system.
              </li>
            </ul>
          </PolicyCard>

          <PolicyCard
            icon={CalendarCheck}
            title="Attendance & Leave Policy"
            LightMode={LightMode}
          >
            <ul className="list-disc pl-5">
              <li>
                Leave requests must be submitted through the company system.
              </li>
              <li>Employees must provide accurate leave information.</li>
              <li>
                Leave approval remains subject to management review and
                scheduling requirements.
              </li>
              <li>
                Repeated unauthorized absences may result in disciplinary
                action.
              </li>
            </ul>
          </PolicyCard>

          <PolicyCard
            icon={Lock}
            title="Data Protection & Privacy"
            LightMode={LightMode}
          >
            <ul className="list-disc pl-5">
              <li>All company and client information is confidential.</li>
              <li>
                Employees must not disclose sensitive information to external
                parties.
              </li>
              <li>
                Personal data must be handled responsibly and professionally.
              </li>
              <li>
                Any suspected data breach should be reported immediately.
              </li>
            </ul>
          </PolicyCard>

          <PolicyCard
            icon={MessageSquare}
            title="Communication Standards"
            LightMode={LightMode}
          >
            <ul className="list-disc pl-5">
              <li>Maintain professional communication at all times.</li>
              <li>
                Harassment, discrimination, bullying, or abusive language is
                prohibited.
              </li>
              <li>Respect coworkers, supervisors, and clients.</li>
              <li>
                Work-related discussions should remain constructive and
                professional.
              </li>
            </ul>
          </PolicyCard>

          <PolicyCard
            icon={FileText}
            title="Asset & File Upload Policy"
            LightMode={LightMode}
          >
            <ul className="list-disc pl-5">
              <li>Uploaded files must be relevant to company operations.</li>
              <li>
                Inappropriate, offensive, or illegal content is prohibited.
              </li>
              <li>
                Users are responsible for ensuring uploaded documents are
                accurate and safe.
              </li>
              <li>
                Uploaded media may be reviewed by management when necessary.
              </li>
            </ul>
          </PolicyCard>

          <PolicyCard
            icon={Award}
            title="Performance & Accountability"
            LightMode={LightMode}
          >
            <ul className="list-disc pl-5">
              <li>
                Employees are accountable for assigned tasks and duties.
              </li>
              <li>
                Task history and activity logs may be reviewed by management.
              </li>
              <li>
                Consistent failure to update tasks may affect performance
                evaluations.
              </li>
              <li>
                High-quality work and professionalism are expected from all
                employees.
              </li>
            </ul>
          </PolicyCard>

          <PolicyCard
            icon={ShieldCheck}
            title="Cleaning Operations Policy"
            LightMode={LightMode}
          >
            <ul className="list-disc pl-5">
              <li>
                Staff must arrive on time for scheduled cleaning appointments.
              </li>
              <li>
                Proper uniforms and safety equipment must be worn when required.
              </li>
              <li>
                Client property must be treated with care and respect.
              </li>
              <li>
                Any damages, incidents, or concerns must be reported
                immediately.
              </li>
              <li>
                Cleaning assignments must meet company standards before being
                marked as completed.
              </li>
            </ul>
          </PolicyCard>

          <PolicyCard
            icon={AlertTriangle}
            title="Disciplinary Actions"
            LightMode={LightMode}
          >
            <ul className="list-disc pl-5">
              <li>Verbal warning.</li>
              <li>Written warning.</li>
              <li>Temporary suspension of system access.</li>
              <li>
                Additional disciplinary action as determined by management.
              </li>
            </ul>
          </PolicyCard>

          <PolicyCard
            icon={RefreshCw}
            title="Policy Updates"
            LightMode={LightMode}
          >
            <ul className="list-disc pl-5">
              <li>
                Sunbeam Cleaning Services reserves the right to modify these
                policies when necessary.
              </li>
              <li>
                Employees will be notified of significant changes through
                official company communication channels.
              </li>
              <li>
                Continued use of company systems constitutes acceptance of
                updated policies.
              </li>
            </ul>
          </PolicyCard>
        </div>

        {/* Footer Notice */}
        <div
          className={`mt-8 mb-4 rounded-2xl p-6 ${
            LightMode
              ? "bg-blue-50 border border-blue-200"
              : "bg-blue-950/30 border border-blue-700"
          }`}
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 mt-1" />

            <div>
              <h3
                className={`font-bold mb-2 ${
                  LightMode ? "text-slate-900" : "text-white"
                }`}
              >
                Acknowledgement
              </h3>

              <p
                className={`text-sm leading-7 ${
                  LightMode ? "text-slate-700" : "text-slate-300"
                }`}
              >
                By using the Sunbeam Cleaning Services Employee Management
                System, employees acknowledge that they have read, understood,
                and agreed to comply with the company policies and standards
                outlined above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPolicies;