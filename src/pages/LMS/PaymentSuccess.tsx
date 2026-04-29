import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";

export default function PaymentSuccessPage() {
  return (
    <>
      <PageMeta title="Payment Successful | LMS" description="Your transaction has been processed" />
      
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-5xl mb-6 animate-bounce">
          ✅
        </div>
        
        <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-2">
          Payment Received!
        </h1>
        
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
          Thank you! Your transaction was successful. You can now access your course content and view the updated balance in your payment history.
        </p>
        
        <Link 
          to="/payments" 
          className="rounded-xl bg-brand-500 px-8 py-3 text-sm font-bold text-white hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20"
        >
          Back to Payments
        </Link>
      </div>
    </>
  );
}