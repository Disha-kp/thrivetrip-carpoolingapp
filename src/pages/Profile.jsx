import { useState } from 'react';
import { User, Settings, CreditCard, Shield, ShieldCheck, LogOut, Wallet, X, CircleHelp, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { currentUser, logout, metroMiles } = useAuth();
    const navigate = useNavigate();
    const [showRedeemModal, setShowRedeemModal] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="min-h-full pb-24 p-6 space-y-6">

            {/* Header Profile Info */}
            <div className="flex items-center space-x-4 pt-4 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="relative group">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 p-1 shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50">
                            <span className="text-3xl font-bold text-white drop-shadow-md">
                                {currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-green-400 w-5 h-5 rounded-full border-4 border-white shadow-sm"></div>
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                        {currentUser?.displayName || 'User'}
                    </h1>
                    <div className="flex items-center space-x-2 mt-1">
                        <span className="bg-white/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-teal-800 border border-white/40 shadow-sm uppercase tracking-wider">
                            Rider & Driver
                        </span>
                        {currentUser?.isVerified ? (
                            <span className="bg-green-100/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-green-700 flex items-center border border-green-200">
                                <Shield className="w-3 h-3 mr-1" /> Verified
                            </span>
                        ) : (
                            <span className="bg-red-100/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-red-700 flex items-center border border-red-200 cursor-pointer hover:bg-red-100 transition">
                                <Shield className="w-3 h-3 mr-1" /> Not Verified
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* MetroMiles Card */}
            <div className="glass-card p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-500 animate-in zoom-in-95 duration-500 delay-100">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                    <Wallet className="w-24 h-24 text-teal-900/5 -rotate-12 transform group-hover:scale-110 transition-transform duration-700" />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-sm font-bold text-gray-500 tracking-widest uppercase">MetroMiles Balance</h2>
                        <div className="bg-white/30 p-2 rounded-full cursor-pointer hover:bg-white/50 transition">
                            <Wallet className="w-5 h-5 text-teal-700" />
                        </div>
                    </div>
                    <div className="text-5xl font-black text-gray-800 tracking-tighter mb-6">
                        {metroMiles || 0}
                    </div>

                    {!currentUser?.isVerified && (
                        <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 mb-4 flex items-center justify-between backdrop-blur-sm">
                            <div className="text-xs text-red-800">
                                <span className="font-bold block">Identity Not Verified</span>
                                Link your Aadhaar to drive.
                            </div>
                            <button className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-md transition-transform active:scale-95">
                                Verify
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => setShowRedeemModal(true)}
                        className="w-full glass-button bg-teal-500/10 hover:bg-teal-500/20 text-teal-900 font-bold py-3 rounded-xl text-sm transition-all border border-teal-500/20"
                    >
                        Scan for Vouchers
                    </button>
                </div>
            </div>

            {/* Menu Options */}
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                {[
                    { label: 'Settings', icon: Settings, path: '/settings' },
                    { label: 'Payment Methods', icon: CreditCard, path: '/payment' },
                    { label: 'Safety & Privacy', icon: Shield, path: '/safety' },
                    { label: 'Help & Support', icon: CircleHelp, path: '/faq' },
                ].map((item, index) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className="w-full glass-button p-4 rounded-xl flex items-center justify-between hover:bg-white/80 transition-all duration-300 group shadow-sm hover:shadow-md border border-white/60"
                        style={{ animationDelay: `${200 + index * 100}ms` }}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-gray-600 group-hover:text-teal-600 transition-colors">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-base font-semibold text-gray-700 group-hover:text-gray-900">{item.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                ))}

                <button
                    onClick={handleLogout}
                    className="w-full glass-button p-4 rounded-xl flex items-center justify-between hover:bg-red-50/80 transition-all duration-300 group mt-6 border border-red-100/50"
                >
                    <div className="flex items-center space-x-4">
                        <div className="bg-red-50 p-2 rounded-lg text-red-500 group-hover:bg-red-100 transition-colors">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <span className="text-base font-semibold text-gray-700 group-hover:text-red-700">Log Out</span>
                    </div>
                </button>
            </div>

            <div className="mt-8 text-center text-gray-400 text-xs">
                Version 1.1.0
            </div>

            {/* Redeem Modal */}
            {
                showRedeemModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                            <div className="bg-[#008080] p-4 flex justify-between items-center">
                                <h3 className="text-white font-bold text-lg">Scan at Gate</h3>
                                <button onClick={() => setShowRedeemModal(false)} className="bg-white/20 p-1 rounded-full text-white hover:bg-white/30">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-8 flex flex-col items-center">
                                <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 mb-4">
                                    <img
                                        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ThrivetripMetroRedeem"
                                        alt="QR Code"
                                        className="w-48 h-48"
                                    />
                                </div>
                                <p className="text-center text-gray-600 font-medium">
                                    travel 100 Miles for a special voucher.
                                </p>
                                <p className="text-center text-gray-400 text-xs mt-2">
                                    Valid for 1 hour from generation.
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
