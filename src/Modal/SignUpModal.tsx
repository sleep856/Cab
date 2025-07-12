import React from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface SignUpModalProps {
  signUpData: {
    name: string;
    email: string;
    password: string;
  };
  handleSignUpChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSignUp: () => void;
  setShowSignUp: (show: boolean) => void;
  setSignUpData: (data: { name: string; email: string; password: string }) => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  signUpData,
  handleSignUpChange,
  handleSignUp,
  setShowSignUp,
  setSignUpData,
}) => (
  <div className="modal-overlay">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="modal-content p-8 max-w-md w-full mx-4"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Join Veloxo</h2>
        <button
          onClick={() => {
            setShowSignUp(false);
            setSignUpData({ name: "", email: "", password: "" });
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            className="input-field"
            value={signUpData.name}
            onChange={handleSignUpChange}
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="input-field"
            value={signUpData.email}
            onChange={handleSignUpChange}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            className="input-field"
            value={signUpData.password}
            onChange={handleSignUpChange}
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-3 mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignUp}
          className="btn-primary w-full"
        >
          Create Account
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setShowSignUp(false);
            setSignUpData({ name: "", email: "", password: "" });
          }}
          className="btn-secondary w-full"
        >
          Cancel
        </motion.button>
      </div>
    </motion.div>
  </div>
);

export default SignUpModal;