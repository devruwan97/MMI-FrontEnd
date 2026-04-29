import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";

export default function PaymentFailurePage() {
  return (
    <>
      <PageMeta title="Payment Failed | LMS" description="Your transaction could not be processed" />
      
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-5xl mb-6">
          ❌
        </div>
        
        <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-2">
          Payment Declined
        </h1>
        
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
          We were unable to process your payment. This could be due to incorrect card details, insufficient funds, or a temporary issue with your bank.
        </p>
        
        <Link 
          to="/payments" 
          className="rounded-xl bg-gray-800 dark:bg-gray-700 px-8 py-3 text-sm font-bold text-white hover:bg-gray-900 transition-all shadow-lg"
        >
          Try Again
        </Link>
      </div>
    </>
  );
}