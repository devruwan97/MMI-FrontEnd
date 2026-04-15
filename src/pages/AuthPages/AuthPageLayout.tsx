import React from "react";
// GridShape removed, no longer needed
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        
        {/* LEFT SIDE: Large Image Only */}
        <div className="relative hidden w-full h-full lg:w-1/2 lg:block">
          
         
            <img
              src="/images/logo/sign.jpg"
              alt="Logo"
              // Removed padding, rounding, shadow, and text.
              // object-cover ensures the image fills the 50% width cleanly.
              className="object-cover w-full h-full" 
            />
          
          
          {/* Note: GridShape and the text description have been removed from this section. */}
        </div>

        {/* RIGHT SIDE: Form Container */}
        <div className="flex flex-col flex-1">
          {children}
        </div>

        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}