import { Outlet } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';

export function AppShell() {
  return (
    <div className="screen">
      <div className="scroll-content hide-scrollbar" style={{ paddingBottom: 'calc(var(--nav-height) + var(--safe-bottom) + 16px)' }}>
        <Outlet />
      </div>
      <BottomNavigation />
    </div>
  );
}
