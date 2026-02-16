import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PlusCircle, MapPin, Calendar, Clock, DollarSign, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HUBS = [
    "JNTU Metro Station",
    "Hitech City Mindspace",
    "Secunderabad Station"
];

export default function OfferRide() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        date: '',
        time: '',
        price: '',
        seats: 3
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, "rides"), {
                driverId: currentUser.uid,
                driverName: currentUser.displayName || currentUser.email.split('@')[0],
                origin: formData.origin,
                destination: formData.destination,
                date: formData.date,
                time: formData.time, // Storing time separately for display
                price: Number(formData.price),
                seats: Number(formData.seats),
                passengers: [],
                createdAt: serverTimestamp()
            });

            alert("Ride Offered Successfully!");
            navigate('/'); // Redirect to Find Ride
        } catch (error) {
            console.error("Error adding ride: ", error);
            alert("Error offering ride: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 pb-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <PlusCircle className="w-6 h-6 mr-2 text-[#008080]" />
                Offer a Ride
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Origin */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" /> Origin
                    </label>
                    <input
                        type="text"
                        name="origin"
                        required
                        placeholder="e.g. My Home"
                        value={formData.origin}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#008080] focus:border-[#008080] outline-none"
                    />
                </div>

                {/* Destination */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-[#008080]" /> Destination
                    </label>
                    <input
                        type="text"
                        name="destination"
                        required
                        placeholder="e.g. Office, Mall, etc."
                        value={formData.destination}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#008080] focus:border-[#008080] outline-none"
                    />
                </div>

                {/* Date & Time */}
                <div className="flex space-x-4">
                    <div className="flex-1 space-y-1">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" /> Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#008080] focus:border-[#008080] outline-none"
                        />
                    </div>
                    <div className="flex-1 space-y-1">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Clock className="w-4 h-4 mr-1" /> Time
                        </label>
                        <input
                            type="time"
                            name="time"
                            required
                            value={formData.time}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#008080] focus:border-[#008080] outline-none"
                        />
                    </div>
                </div>

                {/* Price & Seats */}
                <div className="flex space-x-4">
                    <div className="flex-1 space-y-1">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" /> Price (₹)
                        </label>
                        <input
                            type="number"
                            name="price"
                            required
                            min="0"
                            placeholder="50"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#008080] focus:border-[#008080] outline-none"
                        />
                    </div>
                    <div className="flex-1 space-y-1">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Users className="w-4 h-4 mr-1" /> Seats
                        </label>
                        <input
                            type="number"
                            name="seats"
                            required
                            min="1"
                            max="6"
                            value={formData.seats}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#008080] focus:border-[#008080] outline-none"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#008080] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-teal-700 transition-colors mt-4 disabled:opacity-50"
                >
                    {loading ? 'Publishing...' : 'Post Ride'}
                </button>
            </form>
        </div>
    );
}
