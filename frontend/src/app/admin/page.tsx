import { RoleWelcomeShell } from "@/components/auth/RoleWelcomeShell";

export default function AdminDashboardPage() {
  return (
    <RoleWelcomeShell
      expectedRole="admin"
      title="Dashboard Admin"
      menus={["Kelola Data Buku", "Transaksi", "Kelola Anggota & Petugas"]}
    />
  );
}
