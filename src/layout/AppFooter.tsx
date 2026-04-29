import React from "react";

const AppFooter: React.FC = () => {
  return (
    <footer className="mt-auto py-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Mathsmastery Institute. All rights reserved.
        </p>
        <div className="mt-2 flex justify-center gap-4 text-xs font-medium text-gray-400 dark:text-gray-500">
          <a href="#" className="hover:text-brand-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-brand-500 transition-colors">Help Center</a>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;