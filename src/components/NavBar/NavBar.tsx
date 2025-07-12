import React from "react";
import { motion } from "framer-motion";

interface NavBarProps {
  setShowLogin?: (show: boolean) => void;
  setShowSignUp?: (show: boolean) => void;
  children?: React.ReactNode;
}

const NavBar: React.FC<NavBarProps> = ({ setShowLogin, setShowSignUp, children }) => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Veloxo
            </span>
          </motion.div>

          <div className="flex items-center space-x-4">
            {children || (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogin?.(true)}
                  className="px-6 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSignUp?.(true)}
                  className="btn-primary"
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default NavBar;