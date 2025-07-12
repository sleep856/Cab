import React from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface LoginModalProps {
  loginData: {
    email: string;
    password: string;
  };
  handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: () => void;
  setShowLogin: (show: boolean) => void;
  setLoginData: (data: { email: string; password: string }) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  loginData,
  handleLoginChange,
  handleLogin,
  setShowLogin,
  setLoginData,
}) => (
  <div className="modal-overlay">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="modal-content p-8 max-w-md w-full mx-4"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <button
          onClick={() => {
            setShowLogin(false);
            setLoginData({ email: "", password: "" });
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="input-field"
            value={loginData.email}
            onChange={handleLoginChange}
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="input-field"
            value={loginData.password}
            onChange={handleLoginChange}
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-3 mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          className="btn-primary w-full"
        >
          Sign In
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setShowLogin(false);
            setLoginData({ email: "", password: "" });
          }}
          className="btn-secondary w-full"
        >
          Cancel
        </motion.button>
      </div>
    </motion.div>
  </div>
);

export default LoginModal;