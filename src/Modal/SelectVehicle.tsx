import React, { useState } from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cancelRideRequest } from "../api/riderApi";

interface Vehicle {
  id: number;
  name: string;
  emoji: string;
}

interface RideDetails {
  rideRequestId: string;
  pickupAddress: string;
  dropAddress: string;
  paymentMethod: string;
  fare: number;
}

interface SelectVehicleProps {
  rideDetails: RideDetails;
  onProceed: (vehicleId: number) => void;
  onClose: () => void;
}

const vehicles: Vehicle[] = [
  { id: 1, name: "Standard Car", emoji: "🚗" },
  { id: 2, name: "Luxury Car", emoji: "🚙" },
  { id: 3, name: "SUV", emoji: "🚘" },
];

const SelectVehicle: React.FC<SelectVehicleProps> = ({ rideDetails, onProceed, onClose }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);

  const estimatedFare = rideDetails?.fare ?? 0;
  const formattedFare = Number(estimatedFare).toFixed(2);
  const rideRequestId = rideDetails?.rideRequestId;

  const handleCancelRide = async () => {
    if (!rideRequestId) {
      console.error("❌ No rideRequestId found. Cannot cancel ride.");
      return;
    }

    try {
      await cancelRideRequest(rideRequestId);
      console.log("✅ Ride request canceled successfully.");
    } catch (error) {
      console.error("❌ Error canceling ride request:", error);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="modal-content p-8 max-w-lg w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Ride</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Select the perfect vehicle for your journey
        </p>

        <div className="grid grid-cols-1 gap-4 mb-6">
          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedVehicle === vehicle.id
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedVehicle(vehicle.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{vehicle.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                    <p className="text-sm text-gray-600">
                      Estimated fare: <span className="font-semibold">${formattedFare}</span>
                    </p>
                  </div>
                </div>
                {selectedVehicle === vehicle.id && (
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col space-y-3">
          {selectedVehicle && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full"
              onClick={() => onProceed(selectedVehicle)}
            >
              Confirm & Find Driver
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors duration-200"
            onClick={handleCancelRide}
          >
            Cancel Ride
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SelectVehicle;