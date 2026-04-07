import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const PaymentHistory = ({ user }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (!user) {
          setError("User not found");
          setLoading(false);
          return;
        }

        const response = await axios.get(`/api/payments/user/${user._id || user.id}`);
        setPayments(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load payment history");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-500/20";
      case "pending":
        return "text-yellow-400 bg-yellow-500/20";
      case "failed":
        return "text-red-400 bg-red-500/20";
      case "refunded":
        return "text-blue-400 bg-blue-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✓";
      case "pending":
        return "⏳";
      case "failed":
        return "✗";
      case "refunded":
        return "↩️";
      default:
        return "•";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-400">Loading payment history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">No payment history yet</p>
        <p className="text-sm text-gray-500">Your purchases will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Transaction ID</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Event</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <motion.tr
                key={payment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/10 hover:bg-white/5 transition-colors"
              >
                <td className="py-3 px-4 text-sm font-mono text-cyan-400">{payment.transactionId}</td>
                <td className="py-3 px-4 text-sm">{payment.eventTitle}</td>
                <td className="py-3 px-4 text-sm font-semibold">₹{payment.amount}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(payment.status)}`}>
                    {getStatusIcon(payment.status)} {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-400">{formatDate(payment.createdAt)}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => setSelectedPayment(payment)}
                    className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors"
                  >
                    View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedPayment(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Payment Details</h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Transaction ID</p>
                <p className="font-mono font-bold text-cyan-400">{selectedPayment.transactionId}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Amount</p>
                  <p className="font-bold">₹{selectedPayment.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <span className={`px-2 py-1 rounded text-xs font-semibold inline-block ${getStatusColor(selectedPayment.status)}`}>
                    {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Event</p>
                <p className="font-semibold">{selectedPayment.eventTitle}</p>
                {selectedPayment.eventDate && (
                  <p className="text-sm text-gray-400">{selectedPayment.eventDate}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Method</p>
                  <p className="text-sm capitalize">{selectedPayment.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Date</p>
                  <p className="text-sm">{formatDate(selectedPayment.createdAt)}</p>
                </div>
              </div>

              {selectedPayment.refundedAmount > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-xs text-blue-400 mb-1">Refund Info</p>
                  <p className="text-sm">Refunded: ₹{selectedPayment.refundedAmount}</p>
                  <p className="text-xs text-gray-400 mt-1">{selectedPayment.refundReason}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedPayment(null)}
              className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PaymentHistory;
