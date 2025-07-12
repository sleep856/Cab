import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MapPinIcon, 
  CreditCardIcon,
  MagnifyingGlassIcon 
} from "@heroicons/react/24/outline";
import { getTokenFromCookie } from "../../../utils/tokenUtils";
import { requestRide, getRideRequestStatus } from "../../../api/riderApi";
import { reverseGeocode } from "../../../api/locationApi";
import RideMap from "../../../components/Map/RideMap";
import FindDriverModal from "../../../Modal/FindDriverModal";
import SelectVehicle from "../../../Modal/SelectVehicle";

// Fetch location suggestions from OpenStreetMap
const fetchLocationSuggestions = async (query: string) => {
  if (query.length < 2) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await response.json();

    return data.slice(0, 5).map((place: any) => ({
      name: place.display_name,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
    }));
  } catch (error) {
    console.error("Error fetching location suggestions:", error);
    return [];
  }
};

const BookingRide: React.FC = () => {
  const navigate = useNavigate();

  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [pickupLocation, setPickupLocation] = useState<[number, number] | null>(null);
  const [dropLocation, setDropLocation] = useState<[number, number] | null>(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("WALLET");
  const [rideDetails, setRideDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isSelectingVehicle, setIsSelectingVehicle] = useState(false);
  const [isFindingDriver, setIsFindingDriver] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);

  // Location Suggestions
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<any[]>([]);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Prevent scrolling when modals are open
  useEffect(() => {
    if (isSelectingVehicle || isFindingDriver) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [isSelectingVehicle, isFindingDriver]);

  // Fetch suggestions dynamically with debounce
  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(async () => {
      if (pickupAddress.length >= 2 && !pickupLocation) {
        setPickupSuggestions(await fetchLocationSuggestions(pickupAddress));
      } else {
        setPickupSuggestions([]);
      }

      if (dropAddress.length >= 2 && !dropLocation) {
        setDropSuggestions(await fetchLocationSuggestions(dropAddress));
      } else {
        setDropSuggestions([]);
      }
    }, 500);

    setTypingTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [pickupAddress, dropAddress, pickupLocation, dropLocation]);

  // Handle selecting a pickup suggestion
  const handleSelectPickupSuggestion = (suggestion: any) => {
    setPickupAddress(suggestion.name);
    setPickupLocation([suggestion.lon, suggestion.lat]);
    setPickupSuggestions([]);
  };

  // Handle selecting a drop suggestion
  const handleSelectDropSuggestion = (suggestion: any) => {
    setDropAddress(suggestion.name);
    setDropLocation([suggestion.lon, suggestion.lat]);
    setDropSuggestions([]);
  };

  // Handle ride request
  const handleRequestRide = async () => {
    if (!pickupLocation || !dropLocation) {
      alert("Please select both pickup and drop locations");
      return;
    }

    const token = getTokenFromCookie();
    if (!token) {
      alert("No token found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await requestRide({
        pickupLocation: { coordinates: pickupLocation },
        dropOffLocation: { coordinates: dropLocation },
        paymentMethod,
      });

      if (response?.data) {
        setRideDetails({
          rideRequestId: response.data.rideRequestId,
          pickupAddress,
          dropAddress,
          paymentMethod,
          fare: response.data.fare,
        });
        setIsSelectingVehicle(true);
      } else {
        alert("Failed to request ride");
      }
    } catch (error) {
      console.error("Error requesting ride:", error);
      alert("Error requesting ride");
    } finally {
      setLoading(false);
    }
  };

  // Handle proceeding with vehicle selection
  const handleProceedWithVehicle = async (vehicle: number) => {
    setSelectedVehicle(vehicle);
    setIsSelectingVehicle(false);
    setIsFindingDriver(true);

    if (!rideDetails?.rideRequestId) {
      console.error("🚨 Missing rideRequestId! Cannot proceed.");
      setIsFindingDriver(false);
      return;
    }

    let polling = true;
    while (polling) {
      try {
        const rideResponse = await getRideRequestStatus(
          rideDetails.rideRequestId
        );
        if (rideResponse?.data) {
          console.log("✅ Driver Found:", rideResponse.data);
          polling = false;
          setIsFindingDriver(false);
          navigate("/ridePage");
        } else {
          console.log("🔄 Waiting for driver to accept...");
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      } catch (error) {
        console.error("❌ Error checking ride status:", error);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isSelectingVehicle && (
        <SelectVehicle
          rideDetails={rideDetails}
          onClose={() => setIsSelectingVehicle(false)}
          onProceed={handleProceedWithVehicle}
        />
      )}
      {isFindingDriver && (
        <FindDriverModal onCancel={() => setIsFindingDriver(false)} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPinIcon className="w-6 h-6 mr-2 text-primary-600" />
                Book Your Ride
              </h2>

              <div className="space-y-6">
                {/* Pickup Location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={pickupAddress}
                      onChange={(e) => {
                        setPickupAddress(e.target.value);
                        if (e.target.value === "") {
                          setPickupLocation(null);
                        }
                      }}
                      placeholder="Where are you?"
                      className="input-field pl-10"
                    />
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  
                  {pickupSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                    >
                      {pickupSuggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          onClick={() => handleSelectPickupSuggestion(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="text-sm text-gray-900 truncate">
                            {suggestion.name}
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Drop Location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={dropAddress}
                      onChange={(e) => {
                        setDropAddress(e.target.value);
                        if (e.target.value === "") {
                          setDropLocation(null);
                        }
                      }}
                      placeholder="Where to?"
                      className="input-field pl-10"
                    />
                    <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  
                  {dropSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                    >
                      {dropSuggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          onClick={() => handleSelectDropSuggestion(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="text-sm text-gray-900 truncate">
                            {suggestion.name}
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="relative">
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="input-field pl-10 appearance-none"
                    >
                      <option value="WALLET">Wallet</option>
                      <option value="CARD">Card</option>
                      <option value="CASH">Cash</option>
                    </select>
                    <CreditCardIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRequestRide}
                  disabled={loading || !pickupLocation || !dropLocation}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Requesting...</span>
                    </div>
                  ) : (
                    "Request Ride"
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="card overflow-hidden"
          >
            <div className="h-96 lg:h-full min-h-[400px]">
              <RideMap
                currentLocation={currentLocation}
                setCurrentLocation={setCurrentLocation}
                pickupLocation={pickupLocation}
                setPickupLocation={setPickupLocation}
                dropLocation={dropLocation}
                setDropLocation={setDropLocation}
                setPickupAddress={setPickupAddress}
                setDropAddress={setDropAddress}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingRide;