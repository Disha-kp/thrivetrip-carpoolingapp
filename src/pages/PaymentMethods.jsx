import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Wallet,
    CreditCard,
    Plus,
    Banknote,
    Check,
    Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PaymentMethods() {
    const navigate = useNavigate();
    const { metroMiles } = useAuth();
    const [selectedMethod, setSelectedMethod] = useState('cash');

    const handleSelect = (methodId) => {
        setSelectedMethod(methodId);
    };

    const PaymentOption = ({ id, icon: Icon, title, subtitle, isSelected, onClick }) => (
        <button
            onClick={() => onClick(id)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${isSelected ? 'border-[#008080] bg-teal-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
        >
            <div className="flex items-center">
                <div className={`p-3 rounded-full mr-4 ${isSelected ? 'bg-[#008080] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                    <h3 className={`font-bold ${isSelected ? 'text-[#008080]' : 'text-gray-900'}`}>{title}</h3>
                    {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {isSelected && (
                <div className="bg-[#008080] rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                </div>
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white px-4 py-4 sticky top-0 z-10 shadow-sm flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900 ml-2">Payment Methods</h1>
            </div>

            <div className="px-4 space-y-6">

                {/* MetroMiles Wallet */}
                <div className="bg-gradient-to-r from-[#008080] to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 mb-2">
                            <Wallet className="w-5 h-5 text-teal-200" />
                            <span className="text-sm font-medium text-teal-100 uppercase tracking-wider">MetroMiles Balance</span>
                        </div>
                        <h2 className="text-4xl font-bold mb-4">{metroMiles} <span className="text-lg font-normal opacity-80">Miles</span></h2>
                        <button className="bg-white/20 hover:bg-white/30 text-white text-sm font-bold py-2 px-4 rounded-lg transition border border-white/30">
                            + Add Money
                        </button>
                    </div>
                </div>

                {/* Section Title */}
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Select Payment Mode</h2>

                <div className="space-y-3">
                    {/* UPI */}
                    <PaymentOption
                        id="upi"
                        icon={Smartphone}
                        title="UPI"
                        subtitle="Google Pay, PhonePe, Paytm"
                        isSelected={selectedMethod === 'upi'}
                        onClick={handleSelect}
                    />

                    {/* Cards */}
                    <PaymentOption
                        id="card"
                        icon={CreditCard}
                        title="Credit / Debit Card"
                        subtitle="Visa, Mastercard, RuPay"
                        isSelected={selectedMethod === 'card'}
                        onClick={handleSelect}
                    />

                    {/* Cash */}
                    <PaymentOption
                        id="cash"
                        icon={Banknote}
                        title="Cash"
                        subtitle="Pay directly to the driver"
                        isSelected={selectedMethod === 'cash'}
                        onClick={handleSelect}
                    />
                </div>

                {/* Add New Method */}
                <button className="w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-[#008080] hover:text-[#008080] transition">
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Card or UPI ID
                </button>

                <p className="text-center text-xs text-gray-400 pt-4">
                    Your payment information is encrypted and secure.
                </p>
            </div>
        </div>
    );
}
