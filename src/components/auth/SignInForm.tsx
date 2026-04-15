import { useState, FormEvent, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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

      console.log("Login success:", data);

      setLoading(false);
      navigate("/");
    } catch (err: any) {
      setLoading(false);
      setModalMessage(err.message || "Login failed");
      openModal();
    }
  }, [formData, navigate, openModal]);

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
              <Label>Email *</Label>
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
              <Label>Password *</Label>
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="size-5" />
                  ) : (
                    <EyeCloseIcon className="size-5" />
                  )}
                </span>
              </div>
            </div>

            {/* BUTTON */}
            <Button className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

          </div>
        </form>
      </div>

      {/* ERROR MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[400px] p-6 text-center">
        <div className="flex flex-col items-center">
          <h3 className="mb-2 text-lg font-semibold">Login Failed</h3>
          <p className="mb-6 text-sm text-gray-500">{modalMessage}</p>
          <Button onClick={closeModal} className="w-full">
            Try Again
          </Button>
        </div>
      </Modal>
    </div>
  );
}
