import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b flex items-center px-8 font-semibold">
        Portfolio — Nav placeholder
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="h-16 border-t flex items-center justify-center text-sm text-gray-500">
        Footer placeholder
      </footer>
    </div>
  );
}