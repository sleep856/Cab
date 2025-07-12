import React from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface SignUpSuccessModalProps {
  setShowSignUpSuccess: (show: boolean) => void;
  setShowLogin: (show: boolean) => void;
}

const SignUpSuccessModal: React.FC<SignUpSuccessModalProps> = ({ 
  setShowSignUpSuccess, 
  setShowLogin 
}) => (
  <div className="modal-overlay">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="modal-content p-8 max-w-md w-full mx-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
      </motion.div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Welcome to Veloxo!
      </h2>
      
      <p className="text-gray-600 mb-8">
        Your account has been created successfully. Please sign in to start your journey with us.
      </p>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setShowSignUpSuccess(false);
          setShowLogin(true);
        }}
        className="btn-primary w-full"
      >
        Sign In Now
      </motion.button>
    </motion.div>
  </div>
);

export default SignUpSuccessModal;