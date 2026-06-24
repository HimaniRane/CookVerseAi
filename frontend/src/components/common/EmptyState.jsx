import React from 'react';
import { ChefHat } from 'lucide-react';

export const EmptyState = ({ title, message, actionText, onActionClick }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl shadow-sm animate-fade-in max-w-md mx-auto my-8">
      <div className="p-4 bg-brand-50 dark:bg-darkbg-800 text-brand-500 rounded-full mb-4">
        <ChefHat size={40} className="stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{message}</p>
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="px-6 py-2.5 bg-brand-500 text-white font-medium rounded-full shadow-md shadow-brand-500/20 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all duration-200 hover:scale-[1.02]"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
export default EmptyState;
