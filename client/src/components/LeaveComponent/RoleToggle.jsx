import { Shield, User } from 'lucide-react';


export function RoleToggle({ isAdmin, onToggle, userEmail, onEmailChange }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={userEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Switch View:</span>
          <button
            onClick={onToggle}
            className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
              isAdmin
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isAdmin ? (
              <>
                <Shield size={18} />
                Admin View
              </>
            ) : (
              <>
                <User size={18} />
                Employee View
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
