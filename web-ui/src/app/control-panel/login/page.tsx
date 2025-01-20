"use client";

import LoginForm from "@/components/auth/loginForm";

export default function ControlPanelLoginPage() {
  return (
    <LoginForm
      title="Control Panel Access"
      subtitle="Sign in to manage your business or government entity"
      allowSignup={false} // Typically these accounts are created by admins
      allowedRoles={["business_owner", "gov_entity"]}
      redirectPath="/app/control-panel"
    />
  );
}
