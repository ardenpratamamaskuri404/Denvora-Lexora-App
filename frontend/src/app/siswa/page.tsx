import { RoleWelcomeShell } from "@/components/auth/RoleWelcomeShell";

export default function SiswaDashboardPage() {
  return (
    <RoleWelcomeShell
      expectedRole="siswa"
      title="Dashboard Siswa"
      menus={["Peminjaman Buku", "Pengembalian Buku"]}
    />
  );
}
