import { useState } from 'react';
import { ChevronDown, ChevronUp, Phone, Mail, MessageCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FAQ() {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How do I book a ride?",
            answer: "Go to the 'Find Ride' tab, enter your pickup and drop-off locations, and browse available rides. Tap on a ride to view details and book your seat."
        },
        {
            question: "How can I offer a ride?",
            answer: "Navigate to the 'Offer Ride' tab. Fill in your trip details including origin, destination, date, time, and price per seat. Review and publish your ride."
        },
        {
            question: "Is my payment secure?",
            answer: "Yes, all payments are processed securely. You can pay via UPI, Credit/Debit cards, or use your MetroMiles wallet."
        },
        {
            question: "What is the MetroMiles Wallet?",
            answer: "MetroMiles is our reward system. You earn miles for every ride you take or offer. These miles can be redeemed for Metro tickets or discounts on future rides."
        },
        {
            question: "How does the Safety Badge work?",
            answer: "The Safe-Stream badge on the 'Ride Active' screen monitors your trip in real-time. It turns red if a route deviation is detected and allows you to share your live location or call SOS."
        },
        {
            question: "Can I cancel a booked ride?",
            answer: "Yes, you can cancel a ride from the 'My Rides' section. Cancellation charges may apply depending on how close to the departure time you cancel."
        }
    ];

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 relative">
            {/* Header */}
            <div className="bg-[#008080] pt-12 pb-8 px-6 rounded-b-3xl shadow-lg sticky top-0 z-10">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Help & Support</h1>
                        <p className="text-teal-100 text-sm">We're here to help you.</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">

                {/* Contact Support Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-2 hover:shadow-md transition">
                        <div className="bg-teal-50 p-3 rounded-full text-[#008080]">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-sm">Call Us</h3>
                        <p className="text-xs text-gray-500">+91 1800-123-4567</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-2 hover:shadow-md transition">
                        <div className="bg-teal-50 p-3 rounded-full text-[#008080]">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-sm">Email Us</h3>
                        <p className="text-xs text-gray-500">support@thrivetrip.com</p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between p-4 text-left"
                                >
                                    <span className="font-medium text-gray-700">{faq.question}</span>
                                    {openIndex === index ? (
                                        <ChevronUp className="w-5 h-5 text-[#008080]" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                                {openIndex === index && (
                                    <div className="px-4 pb-4 text-sm text-gray-500 animate-in fade-in slide-in-from-top-1">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Chat CTA */}
                <div className="bg-[#008080] rounded-2xl p-6 text-white text-center shadow-lg mt-8">
                    <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-90" />
                    <h3 className="text-lg font-bold">Still need help?</h3>
                    <p className="text-teal-100 text-sm mb-4">Our support team is available 24/7.</p>
                    <button className="bg-white text-[#008080] font-bold py-3 px-8 rounded-xl shadow-md hover:bg-teal-50 transition w-full">
                        Chat with Support
                    </button>
                </div>
            </div>
        </div>
    );
}
