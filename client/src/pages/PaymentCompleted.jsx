import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const PaymentCompleted = () => {
  const [searchParams] = useSearchParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const transactionId = searchParams.get("txnId");

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        if (!transactionId) {
          setError("Transaction ID not found");
          setLoading(false);
          return;
        }

        const response = await axios.get(`/api/payments/${transactionId}`);
        setPayment(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [transactionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-400">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold mb-2">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = "/"}
            className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Success Message */}
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-4xl">✓</span>
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-400 text-lg">Your registration is confirmed</p>
          </div>

          {payment && (
            <>
              {/* Transaction Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-white/10"
              >
                <h2 className="text-xl font-bold mb-6">Transaction Details</h2>
                
                <div className="space-y-4">
                  {/* Transaction ID */}
                  <div className="flex justify-between items-start pb-4 border-b border-white/10">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Transaction ID</p>
                      <p className="font-mono text-lg font-semibold text-cyan-400">{payment.transactionId}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(payment.transactionId);
                        alert("Transaction ID copied to clipboard!");
                      }}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
                    >
                      Copy
                    </button>
                  </div>

                  {/* Event Details */}
                  <div className="pb-4 border-b border-white/10">
                    <p className="text-sm text-gray-400 mb-2">Event Registered</p>
                    <p className="text-lg font-semibold">{payment.eventTitle}</p>
                    <p className="text-sm text-gray-400 mt-1">{payment.eventDate}</p>
                  </div>

                  {/* Amount Table */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount</span>
                      <span>₹{payment.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment Method</span>
                      <span className="capitalize">{payment.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Paid At</span>
                      <span>{formatDate(payment.completedAt || payment.createdAt)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-4">
                    <span className="font-semibold">Total Paid</span>
                    <span className="text-2xl font-bold text-cyan-400">₹{payment.amount}</span>
                  </div>
                </div>
              </motion.div>

              {/* Receipt Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-900 rounded-xl p-6 border border-white/10"
              >
                <h3 className="text-lg font-bold mb-4">Next Steps</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="font-semibold">Confirmation Email</p>
                      <p className="text-sm text-gray-400">A confirmation email has been sent to your registered email address with event details.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="font-semibold">Add to Calendar</p>
                      <p className="text-sm text-gray-400">Add this event to your calendar to get reminders before the event starts.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎟️</span>
                    <div>
                      <p className="font-semibold">Event Ticket</p>
                      <p className="text-sm text-gray-400">Your ticket will be available in your dashboard. Present it at the event entrance.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4"
              >
                <button
                  onClick={() => window.location.href = "/"}
                  className="flex-1 px-6 py-3 border-2 border-white/20 text-white rounded-lg hover:bg-white/5 transition-all font-semibold"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => window.location.href = "/dashboard"}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all font-semibold"
                >
                  Go to Dashboard
                </button>
              </motion.div>

              {/* Receipt Download */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <button
                  onClick={() => {
                    // Create receipt content
                    const receipt = `
TRANSACTION RECEIPT
==================
Transaction ID: ${payment.transactionId}
Event: ${payment.eventTitle}
Date: ${payment.eventDate}
Amount: ₹${payment.amount}
Payment Method: ${payment.paymentMethod}
Status: ${payment.status}
Completed At: ${formatDate(payment.completedAt || payment.createdAt)}
                    `;
                    
                    // Create and download file
                    const element = document.createElement("a");
                    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(receipt));
                    element.setAttribute("download", `Receipt_${payment.transactionId}.txt`);
                    element.style.display = "none";
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="text-purple-400 hover:text-purple-300 underline transition-colors"
                >
                  📥 Download Receipt
                </button>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentCompleted;
