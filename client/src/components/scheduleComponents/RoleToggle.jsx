import { Shield, User } from 'lucide-react';


export default function RoleToggle({ isAdmin, onToggle }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl px-6 py-3 shadow-lg border border-gray-100">
      <span className="text-sm font-medium text-gray-600">Role:</span>
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onToggle(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-300 ${
            isAdmin
              ? 'bg-white text-indigo-600 shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          Admin Mode
        </button>
        <button
          onClick={() => onToggle(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-300 ${
            !isAdmin
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <User className="w-4 h-4" />
          Employee Mode
        </button>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
        isAdmin
          ? 'bg-indigo-100 text-indigo-700'
          : 'bg-blue-100 text-blue-700'
      }`}>
        {isAdmin ? 'Full Access' : 'View Only'}
      </div>
    </div>
  );
}
