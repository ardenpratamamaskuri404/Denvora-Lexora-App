import { RoleWelcomeShell } from "@/components/auth/RoleWelcomeShell";

export default function PetugasDashboardPage() {
  return (
    <RoleWelcomeShell
      expectedRole="petugas"
      title="Dashboard Petugas"
      menus={["Kelola Data Buku", "Transaksi & Ekspor CSV", "Daftar Anggota"]}
    />
  );
}
