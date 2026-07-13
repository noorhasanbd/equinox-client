import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default async function Page() {
  // Replace this object block with your real async dynamic session resolution logic later:
  const mockUser = {
    name: "Jane Doe",
    email: "jane@hotelowner.com",
    role: "owner" as const, // Change to "guest" to immediately observe dynamic view flip
  };

  return (
    <></>
  );
}