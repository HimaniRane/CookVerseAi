import React from 'react';

export const RecipeCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl overflow-hidden shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-200 dark:bg-darkbg-800 w-full" />
      
      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Category tag */}
        <div className="h-4 bg-gray-200 dark:bg-darkbg-800 rounded w-1/4" />
        
        {/* Title */}
        <div className="h-6 bg-gray-200 dark:bg-darkbg-800 rounded w-3/4" />
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-darkbg-800 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-darkbg-800 rounded w-5/6" />
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-50 dark:border-darkbg-800">
          <div className="h-4 bg-gray-200 dark:bg-darkbg-800 rounded w-1/3" />
          <div className="h-4 bg-gray-200 dark:bg-darkbg-800 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-darkbg-900 p-6 rounded-3xl border border-gray-100 dark:border-darkbg-800 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-darkbg-800 rounded w-1/2" />
          <div className="h-8 bg-gray-200 dark:bg-darkbg-800 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
};

export const RecipeDetailsSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
      {/* Hero card */}
      <div className="h-64 md:h-96 bg-gray-200 dark:bg-darkbg-800 rounded-3xl w-full" />
      
      {/* Details */}
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 dark:bg-darkbg-800 rounded w-1/2" />
        <div className="h-6 bg-gray-200 dark:bg-darkbg-800 rounded w-1/4" />
        <div className="h-20 bg-gray-200 dark:bg-darkbg-800 rounded w-full" />
      </div>

      {/* Grid columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        <div className="md:col-span-1 space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-darkbg-800 rounded w-1/2" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-darkbg-800 rounded w-3/4" />
          ))}
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-darkbg-800 rounded w-1/3" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-darkbg-800 rounded w-1/12" />
              <div className="h-4 bg-gray-200 dark:bg-darkbg-800 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
