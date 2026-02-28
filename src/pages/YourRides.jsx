import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment, arrayRemove, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Car, User, Navigation, Calendar, Clock, MapPin, XCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function YourRides() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('driving'); // 'booked' or 'driving'
    const [myRides, setMyRides] = useState([]);
    const [passengerDetails, setPassengerDetails] = useState({});

    // Fetch rides
    useEffect(() => {
        if (!currentUser) return;

        const q = query(collection(db, "rides"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allRides = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

            // Split and filter based on mode
            const filtered = allRides.filter(r => {
                if (r.status === 'completed' || r.status === 'cancelled') return false; // Hide completed/cancelled
                if (viewMode === 'driving') {
                    return r.driverId === currentUser.uid;
                } else {
                    return r.passengers && r.passengers.includes(currentUser.uid);
                }
            });

            setMyRides(filtered);

            // Fetch passenger details for driving mode
            if (viewMode === 'driving') {
                const fetchPassengers = async () => {
                    const details = {};
                    for (const ride of filtered) {
                        if (ride.passengers) {
                            for (const uid of ride.passengers) {
                                if (!details[uid]) {
                                    const userDoc = await getDoc(doc(db, 'users', uid));
                                    if (userDoc.exists()) {
                                        details[uid] = userDoc.data();
                                    } else {
                                        details[uid] = { displayName: 'Unknown Passenger' };
                                    }
                                }
                            }
                        }
                    }
                    setPassengerDetails(prev => ({ ...prev, ...details }));
                };
                fetchPassengers();
            }
        });

        return () => unsubscribe();
    }, [currentUser, viewMode]);

    const handleRemovePassenger = async (rideId, passengerUid) => {
        if (!window.confirm("Are you sure you want to remove this passenger?")) return;
        try {
            const rideRef = doc(db, "rides", rideId);
            await updateDoc(rideRef, {
                passengers: arrayRemove(passengerUid),
                seats: increment(1)
            });
            alert("Passenger removed successfully.");
        } catch (error) {
            console.error("Error removing passenger:", error);
            alert("Failed to remove passenger.");
        }
    };

    const handleCancelRide = async (rideId) => {
        if (!window.confirm("Are you sure? All booked passengers will be notified.")) return;
        try {
            const rideRef = doc(db, "rides", rideId);
            await updateDoc(rideRef, {
                status: 'cancelled'
            });
            alert("Ride has been cancelled.");
        } catch (error) {
            console.error("Error cancelling ride:", error);
            alert("Failed to cancel ride.");
        }
    };

    const handleRiderCancelBooking = async (rideId) => {
        if (!window.confirm("Are you sure you want to cancel your booking?")) return;
        try {
            const rideRef = doc(db, "rides", rideId);
            await updateDoc(rideRef, {
                passengers: arrayRemove(currentUser.uid),
                seats: increment(1)
            });
            alert("Booking cancelled.");
        } catch (error) {
            console.error("Error cancelling booking:", error);
            alert("Failed to cancel booking.");
        }
    };


    return (
        <div className="min-h-full pb-24 p-6 space-y-6">
            <div className="flex items-center space-x-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                    <XCircle className="w-6 h-6 text-gray-500" />
                </button>
                <h1 className="text-2xl font-black text-gray-800 tracking-tight">Manage Rides</h1>
            </div>

            {/* Toggle Switch */}
            <div className="bg-gray-100 p-1 rounded-xl flex relative mb-6">
                <div
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ${viewMode === 'driving' ? 'left-[calc(50%+2px)]' : 'left-1'}`}
                ></div>
                <button
                    onClick={() => setViewMode('booked')}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg relative z-10 transition-colors duration-300 ${viewMode === 'booked' ? 'text-teal-700' : 'text-gray-500'}`}
                >
                    Rides I Booked
                </button>
                <button
                    onClick={() => setViewMode('driving')}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg relative z-10 transition-colors duration-300 ${viewMode === 'driving' ? 'text-teal-700' : 'text-gray-500'}`}
                >
                    Rides I'm Driving
                </button>
            </div>

            {/* Ride List */}
            <div className="space-y-6">
                {myRides.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Car className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No active rides found in this category.</p>
                    </div>
                ) : (
                    myRides.map(ride => (
                        <div key={ride.id} className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold uppercase">
                                        {viewMode === 'driving' ? 'ME' : ride.driverName?.substring(0, 2) || 'DR'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{viewMode === 'driving' ? 'Your Ride' : ride.driverName}</p>
                                        <p className="text-xs text-gray-500 flex items-center mt-1">
                                            <Navigation className="w-3 h-3 mr-1" />
                                            {ride.price}₹
                                            {viewMode === 'driving' && <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{ride.seats} Seats Left</span>}
                                        </p>
                                    </div>
                                </div>
                                {viewMode === 'driving' && (
                                    <div className="text-right">
                                        <span className="text-xs font-bold uppercase text-gray-400">Total Earnings</span>
                                        <p className="text-lg font-black text-teal-600">₹{(ride.passengers?.length || 0) * ride.price}</p>
                                    </div>
                                )}
                            </div>

                            {/* Route */}
                            <div className="space-y-4 mb-6 relative">
                                <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gray-200"></div>
                                <div className="flex items-start space-x-4 relative z-10">
                                    <div className="w-6 h-6 rounded-full bg-white border-4 border-teal-500 shadow-sm mt-0.5"></div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 font-bold uppercase">Pickup</p>
                                        <p className="font-semibold text-gray-800">{ride.origin}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4 relative z-10">
                                    <div className="w-6 h-6 rounded-full bg-white border-4 border-red-500 shadow-sm mt-0.5"></div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 font-bold uppercase">Dropoff</p>
                                        <p className="font-semibold text-gray-800">{ride.destination}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Passenger Management (Driver Only) */}
                            {viewMode === 'driving' && (
                                <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center"><User className="w-4 h-4 mr-2" /> Passengers ({ride.passengers?.length || 0})</h4>
                                    {(!ride.passengers || ride.passengers.length === 0) ? (
                                        <p className="text-xs text-gray-500 italic">No passengers have booked yet.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {ride.passengers.map(uid => (
                                                <div key={uid} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-xs font-bold uppercase">
                                                            {passengerDetails[uid]?.displayName?.substring(0, 2) || 'PS'}
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-800">
                                                            {passengerDetails[uid]?.displayName || 'Loading...'}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemovePassenger(ride.id, uid)}
                                                        className="text-red-500 hover:text-white hover:bg-red-500 p-1.5 rounded-lg transition-colors"
                                                        aria-label="Remove passenger"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="pt-2">
                                {viewMode === 'driving' ? (
                                    <button
                                        onClick={() => handleCancelRide(ride.id)}
                                        className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl flex items-center justify-center transition-colors border border-red-100"
                                    >
                                        <ShieldAlert className="w-4 h-4 mr-2" /> Cancel Entire Ride
                                    </button>
                                ) : (
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => navigate('/ride-active')}
                                            className="flex-1 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center justify-center shadow-lg transition-colors"
                                        >
                                            <Navigation className="w-4 h-4 mr-2" /> Track Ride
                                        </button>
                                        <button
                                            onClick={() => handleRiderCancelBooking(ride.id)}
                                            className="py-3.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl flex items-center justify-center transition-colors border border-red-100"
                                        >
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
