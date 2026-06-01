import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r p-6 font-semibold">
        Sidebar placeholder
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}