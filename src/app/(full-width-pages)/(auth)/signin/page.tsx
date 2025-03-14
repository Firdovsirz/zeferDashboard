import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan Hesabat Sistemi Daxil Ol",
  description: "Plan Hesabat Sistemi Giriş",
};

export default function SignIn() {
  return <SignInForm />;
}
