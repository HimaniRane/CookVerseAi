import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorState = ({ title = 'Something went wrong', message, retryText = 'Try Again', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-950/20 rounded-3xl max-w-md mx-auto my-8 animate-fade-in">
      <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-full mb-4">
        <AlertCircle size={40} className="stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-red-600/80 dark:text-red-400/80 text-sm mb-6 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-full shadow-md shadow-red-600/10 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-all duration-200 hover:scale-[1.02]"
        >
          {retryText}
        </button>
      )}
    </div>
  );
};
export default ErrorState;
