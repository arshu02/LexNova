import { Sidebar } from '@/components/Sidebar';
import { DashboardNavbar } from '@/components/DashboardNavbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#07090D',
    }}>
      <Sidebar />
      <div style={{
        flex: 1,
        marginLeft: '250px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#07090D',
        overflowX: 'hidden',
      }}>
        <DashboardNavbar />
        <main style={{
          flex: 1,
          padding: '24px 32px',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
