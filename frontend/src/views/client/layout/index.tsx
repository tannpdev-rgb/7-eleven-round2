import { Outlet } from "react-router-dom";
import ClientHeader from "./components/ClientHeader";
import ClientFooter from "./components/ClientFooter";
import BottomNav from "./components/BottomNav";

export default function LayoutClient() {
  return (
    <div className="client-body" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientHeader />
      <main style={{ flex: 1, paddingBottom: '60px' }}>
        <Outlet />
      </main>
      <ClientFooter />
      <BottomNav />
    </div>
  );
}