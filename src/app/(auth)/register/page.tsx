import { Metadata } from "next";
import { RegisterForm } from "@/components/features/auth/register-form";

export const metadata: Metadata = {
    title: "Register - College Event Management System",
    description: "Create an account",
};

export default function RegisterPage() {
    return <RegisterForm />;
}
