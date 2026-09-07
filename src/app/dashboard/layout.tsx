import type { Metadata } from 'next';
import { Sidebar } from '@/components/Sidebar';
import { DashboardNavbar } from '@/components/DashboardNavbar';

export const metadata: Metadata = {
  title: 'AI Legal Console',
  description: 'Autonomous Legal Operations & Strategy Console',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#F8FAFC',
    }}>
      <Sidebar />
      <div style={{
        flex: 1,
        marginLeft: '250px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#F8FAFC',
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
