import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import UserDashboard from "@/components/dashboard/UserDashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <UserDashboard user={user} />;
}
