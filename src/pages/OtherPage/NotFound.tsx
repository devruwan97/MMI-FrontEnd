import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

export default function ResetPassword() {
  return (
    <>
      <PageMeta
        title="Reset Password | Mathsmastery Institute"
        description="Reset your password page"
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
        <GridShape />
        <div className="mx-auto w-full max-w-md text-center">
          <div className="mb-10">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form className="text-left">
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input placeholder="info@mathsmasterylms.com.au" />
              </div>

              <Button className="w-full" size="sm">
                Send Reset Link
              </Button>

              <div className="mt-5 text-center">
                <Link
                  to="/signin"
                  className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
