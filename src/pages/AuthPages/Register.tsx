import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import RegisterForm from "../../components/auth/RegisterForm";

export default function Register() {
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | Mathsmastery Institute"
        description="This is React.js SignIn Tables Dashboard page for Mathsmastery Institute"
      />
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    </>
  );
}
