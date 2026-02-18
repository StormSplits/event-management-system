import { Metadata } from "next";
import { LoginForm } from "@/components/features/auth/login-form";

export const metadata: Metadata = {
    title: "Login - College Event Management System",
    description: "Login to your account",
};

export default function LoginPage() {
    return <LoginForm />;
}
