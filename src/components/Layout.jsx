import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
    return (
        <div className="flex flex-col h-screen radiant-background text-gray-900 font-sans">
            <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide relative z-0">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
}
