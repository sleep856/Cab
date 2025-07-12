import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface FindDriverModalProps {
  onCancel: () => void;
}

const FindDriverModal: React.FC<FindDriverModalProps> = ({ onCancel }) => {
  const [countdown, setCountdown] = useState(30);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      setProgress((prev) => (prev < 100 ? prev + 100 / 30 : 100));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="modal-content p-8 max-w-md w-full mx-4 text-center"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Finding Your Driver</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center"
        >
          <span className="text-3xl">🚖</span>
        </motion.div>

        <p className="text-gray-600 mb-6">
          We're connecting you with the nearest available driver. This usually takes just a few seconds.
        </p>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
          />
        </div>

        <p className="text-sm text-gray-500 mb-6">
          {countdown}s remaining
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className="w-full py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors duration-200"
        >
          Cancel Ride
        </motion.button>
      </motion.div>
    </div>
  );
};

export default FindDriverModal;