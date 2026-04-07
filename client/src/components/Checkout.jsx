import { useState } from "react";
import axios from "axios";

const Checkout = ({ event, user, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });
  const [error, setError] = useState("");

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setError("");
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16) {
      value = value.replace(/(\d{4})/g, "$1 ").trim();
      setCardDetails(prev => ({
        ...prev,
        cardNumber: value
      }));
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2);
      }
      setCardDetails(prev => ({
        ...prev,
        expiryDate: value
      }));
    }
  };

  const validateCardDetails = () => {
    if (paymentMethod === "stripe") {
      const cardNum = cardDetails.cardNumber.replace(/\s/g, "");
      if (cardNum.length !== 16) {
        setError("Card number must be 16 digits");
        return false;
      }
      if (!cardDetails.expiryDate || cardDetails.expiryDate.length !== 5) {
        setError("Expiry date is required (MM/YY)");
        return false;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
        setError("CVV must be 3 digits");
        return false;
      }
    }
    return true;
  };

  const handlePayment = async () => {
    setError("");

    if (!validateCardDetails()) return;

    setLoading(true);
    try {
      // Create payment intent
      const sessionRes = await axios.post("/api/payments/create-session", {
        userId: user._id || user.id,
        eventId: event._id || event.id,
        amount: event.price,
        paymentMethod
      });

      if (!sessionRes.data.success) {
        throw new Error(sessionRes.data.message || "Failed to create payment session");
      }

      // Process payment
      const paymentRes = await axios.post("/api/payments/process", {
        transactionId: sessionRes.data.transactionId,
        paymentDetails: {
          method: paymentMethod,
          amount: event.price
        },
        cardToken: cardDetails
      });

      if (paymentRes.data.success) {
        onSuccess({
          transactionId: paymentRes.data.transactionId,
          paymentId: paymentRes.data.paymentId,
          redirectUrl: paymentRes.data.redirectUrl
        });
      } else {
        setError(paymentRes.data.message || "Payment failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Payment processing error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-gray-900 rounded-xl p-6 h-fit">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <div>
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-gray-400">{event.date}</p>
              </div>
              <p className="font-bold text-purple-400">₹{event.price}</p>
            </div>

            <div className="space-y-2 py-3 border-b border-white/10">
              <p className="text-sm text-gray-400">{event.description?.substring(0, 100)}</p>
              {event.category && (
                <p className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded w-fit">
                  {event.category}
                </p>
              )}
            </div>

            <div className="flex justify-between pt-3">
              <p className="font-semibold">Total Amount:</p>
              <p className="text-2xl font-bold text-cyan-400">₹{event.price}</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="space-y-3">
              {["stripe", "paypal", "upi"].map(method => (
                <label key={method} className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                  style={{
                    borderColor: paymentMethod === method ? "#8b5cf6" : "rgba(255,255,255,0.1)",
                    backgroundColor: paymentMethod === method ? "rgba(139,92,246,0.1)" : ""
                  }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                    className="w-4 h-4 accent-purple-500 cursor-pointer"
                  />
                  <span className="ml-3 font-semibold capitalize">{method === "upi" ? "UPI" : method.charAt(0).toUpperCase() + method.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Card Details Form */}
          {paymentMethod === "stripe" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength="19"
                  className="w-full bg-gray-900 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={handleExpiryChange}
                    className="w-full bg-gray-900 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleCardInputChange}
                    maxLength="3"
                    className="w-full bg-gray-900 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* UPI Details */}
          {paymentMethod === "upi" && (
            <div>
              <label className="block text-sm font-semibold mb-2">UPI ID</label>
              <input
                type="email"
                placeholder="yourname@upi"
                disabled
                className="w-full bg-gray-800 border border-white/20 rounded-lg px-4 py-2 text-gray-400 opacity-50"
              />
              <p className="text-xs text-gray-400 mt-2">Coming soon - UPI payment integration</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-white/20 text-white rounded-lg hover:bg-white/5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : `Pay ₹${event.price}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
