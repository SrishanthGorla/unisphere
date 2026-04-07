import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Checkout from "../components/Checkout";
import { motion } from "framer-motion";

const CheckoutPage = ({ user }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const eventId = searchParams.get("eventId");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (!eventId) {
          setError("Event ID not found");
          setLoading(false);
          return;
        }

        if (!user) {
          setError("Please log in to proceed with checkout");
          setLoading(false);
          return;
        }

        const response = await axios.get(`/api/events/${eventId}`);
        setEvent(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, user]);

  const handlePaymentSuccess = (paymentData) => {
    navigate(paymentData.redirectUrl);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold mb-2">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => {
              navigate("/");
            }}
            className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold mb-2">Secure Checkout</h1>
          <p className="text-gray-400">Complete your payment to confirm your registration</p>
        </div>

        {/* Checkout Component */}
        <Checkout
          event={event}
          user={user}
          onSuccess={handlePaymentSuccess}
          onCancel={handleCancel}
        />

        {/* Security Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center"
        >
          <p className="text-blue-300 text-sm">
            🔒 Your payment information is secure and encrypted. We never store your card details.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
