"use client";

import LoginForm from "@/components/auth/loginForm";

export default function LoginPage() {
  return (
    <LoginForm
      title="Welcome to FairMeet"
      subtitle="Sign in to your account"
      allowSignup={true}
      allowedRoles={["basic"]}
      redirectPath="/"
    />
  );
}
