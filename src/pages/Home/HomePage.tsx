import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  SparklesIcon, 
  BoltIcon, 
  GlobeAltIcon,
  ArrowRightIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import NavBar from "../../components/NavBar/NavBar";
import { roleApi } from "../../api/authApi";
import { loginApi, signUpApi } from "../../api/authApi";
import LoginModal from "../../Modal/LoginModal";
import SignUpModal from "../../Modal/SignUpModal";
import SignUpSuccessModal from "../../Modal/SignUpSuccessModal";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showSignUpSuccess, setShowSignUpSuccess] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignUp = async () => {
    if (!isValidEmail(signUpData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await signUpApi(signUpData);
      if (response) {
        console.log("Sign up successful, navigating to login...");
        setShowSignUp(false);
        setSignUpData({ name: "", email: "", password: "" });
        setShowSignUpSuccess(true);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert("Sign Up failed. Please try again.");
    }
  };

  const handleLogin = async () => {
    if (!isValidEmail(loginData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const loginPayload = {
      email: loginData.email,
      password: loginData.password,
    };

    try {
      const response = await loginApi(loginPayload);
      if (response) {
        console.log("Login successful, navigating to dashboard...");
        setLoginData({ email: "", password: "" });

        const email = loginPayload.email;
        const { data } = await roleApi(email);

        if (data?.includes("DRIVER") && data?.includes("RIDER")) {
          navigate("/driverdashboard");
        } else if (data?.includes("ADMIN") && data?.includes("RIDER")) {
          navigate("/admin");
        } else if (data?.includes("RIDER")) {
          navigate("/riderdashboard");
        }
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please try again.");
    }
  };

  const features = [
    {
      icon: BoltIcon,
      title: "Lightning Fast",
      description: "Get to your destination faster with our AI-optimized routes and instant driver matching.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: SparklesIcon,
      title: "Premium Experience",
      description: "Enjoy luxury rides with top-rated drivers and premium vehicles at affordable prices.",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: GlobeAltIcon,
      title: "Global Coverage",
      description: "Available in 100+ cities worldwide with 24/7 support in your local language.",
      color: "from-blue-400 to-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <NavBar setShowLogin={setShowLogin} setShowSignUp={setShowSignUp} />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center px-4 py-2 bg-primary-50 border border-primary-200 rounded-full text-primary-700 text-sm font-medium"
                >
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Now available in your city
                </motion.div>
                
                <h1 className="text-5xl md:text-7xl font-bold">
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    Your Ride,
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Reimagined
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Experience the future of transportation with Veloxo. 
                  Premium rides, instant booking, and unmatched reliability.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
                >
                  <span>Book Your Ride</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg px-8 py-4"
                  onClick={() => console.log("Handle Become a driver")}
                >
                  Become a Driver
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-center space-x-6 text-sm text-gray-500"
              >
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span>1M+ Happy Riders</span>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span>Available 24/7</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Veloxo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're not just another ride-sharing app. We're your premium transportation partner.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="card p-8 text-center group"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Experience Veloxo?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Join millions of satisfied riders and discover why Veloxo is the future of transportation.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      {showLogin && (
        <LoginModal
          loginData={loginData}
          handleLoginChange={handleLoginChange}
          handleLogin={handleLogin}
          setShowLogin={setShowLogin}
          setLoginData={setLoginData}
        />
      )}

      {showSignUp && (
        <SignUpModal
          signUpData={signUpData}
          handleSignUpChange={handleSignUpChange}
          handleSignUp={handleSignUp}
          setShowSignUp={setShowSignUp}
          setSignUpData={setSignUpData}
        />
      )}

      {showSignUpSuccess && (
        <SignUpSuccessModal
          setShowSignUpSuccess={setShowSignUpSuccess}
          setShowLogin={setShowLogin}
        />
      )}
    </div>
  );
};

export default HomePage;