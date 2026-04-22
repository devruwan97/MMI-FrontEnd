import { useState, FormEvent, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";

export default function SignInForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    const { email, password } = formData;
    const newErrors: typeof errors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^@ \s]+@[^@ \s]+\.[^@ \s]+$/.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();

      // ✅ store JWT
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", email);

      console.log("Login success:", { ...data, rememberMe: isChecked });

      setLoading(false);
      navigate("/");
    } catch (err: unknown) {
      setLoading(false);
      setModalMessage(err instanceof Error ? err.message : "Login failed");
      openModal();
    }
  }, [formData, isChecked, navigate, openModal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your student email and password to sign in!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* EMAIL */}
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="info@mathsmasterylms.com.au"
                error={!!errors.email}
                hint={errors.email}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  error={!!errors.password}
                  hint={errors.password}
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox 
                  id="remember"
                  checked={isChecked} 
                  onChange={setIsChecked}
                />
                <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400 pl-3">
                  Keep me logged in
                </span>
              </div>
              <Link
                to="/reset-password"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Forgot password?
              </Link>
            </div>

            {/* BUTTON */}
            <Button className="w-full" size="sm" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
      </div>

      {/* ERROR MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[400px] p-6 text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 mb-4 bg-error-100 rounded-full dark:bg-error-500/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-error-500">
              <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">Login Failed</h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{modalMessage}</p>
          <Button onClick={closeModal} className="w-full" size="sm">
            Try Again
          </Button>
        </div>
      </Modal>
    </div>
  );
}
