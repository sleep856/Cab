import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserCircleIcon, 
  CreditCardIcon, 
  ClockIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";
import { getRiderProfile } from "../../../api/riderApi";
import { logOutApi } from "../../../api/authApi";
import BookingRide from "../BookingRide/BookingRide";

const RiderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await getRiderProfile();
        if (response?.data?.user?.name) {
          setUserName(response.data.user.name);
        } else {
          setUserName("Unknown User");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setUserName("Error");
      }
    };

    fetchUserName();
  }, []);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleRideButton = () => {
    navigate("/ridePage");
  };

  const handleWallet = () => {
    navigate("/riderWallet");
  };

  const handleManageProfile = () => {
    navigate("/userprofile");
  };

  const handleSignOut = async () => {
    try {
      const response = await logOutApi();
      if (response) {
        console.log("User logged out successfully");
        navigate("/");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred while logging out.");
    }
  };

  const menuItems = [
    { icon: ClockIcon, label: "Rides", action: handleRideButton },
    { icon: UserCircleIcon, label: "Profile", action: handleManageProfile },
    { icon: CreditCardIcon, label: "Wallet", action: handleWallet },
    { icon: ArrowRightOnRectangleIcon, label: "Sign Out", action: handleSignOut },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleOptions}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors duration-200"
              >
                <UserCircleIcon className="w-6 h-6 text-primary-600" />
                <span className="font-medium text-primary-700">{userName}</span>
                <ChevronDownIcon className={`w-4 h-4 text-primary-600 transition-transform duration-200 ${showOptions ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {showOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                  >
                    {menuItems.map((item, index) => (
                      <motion.button
                        key={item.label}
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        onClick={() => {
                          item.action();
                          setShowOptions(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:text-gray-900 transition-colors duration-200"
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="pt-16">
        <BookingRide />
      </main>
    </div>
  );
};

export default RiderDashboard;