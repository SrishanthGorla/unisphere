import { useState } from "react";
import { fetchEvents, processPayment } from "../api";

export default function Checkout({ eventId, userId, onPaymentComplete, onCancel }) {
  const [events, setEvents] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: ""
  });

  // Load event details
  useState(() => {
    const loadEvent = async () => {
      try {
        const response = await fetchEvents();
        setEvents(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    loadEvent();
  }, []);

  const event = events.find((e) => e.id === eventId);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 16);
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardDetails({ ...cardDetails, cardNumber: value });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setCardDetails({ ...cardDetails, expiry: value });
  };

  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCardDetails({ ...cardDetails, cvv: value });
  };

  const validateCardDetails = () => {
    if (!cardDetails.cardNumber.replace(/\s/g, "")) {
      alert("Card number is required");
      return false;
    }
    if (cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
      alert("Card number must be 16 digits");
      return false;
    }
    if (!cardDetails.cardHolder.trim()) {
      alert("Card holder name is required");
      return false;
    }
    if (!cardDetails.expiry || cardDetails.expiry.length !== 5) {
      alert("Expiry date must be MM/YY");
      return false;
    }
    if (cardDetails.cvv.length !== 3) {
      alert("CVV must be 3 digits");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (selectedMethod === "stripe" || selectedMethod === "paypal") {
      if (!validateCardDetails()) {
        return;
      }
    }

    setIsProcessing(true);

    try {
      const response = await processPayment({
        userId,
        eventId,
        amount: event.price,
        paymentMethod: selectedMethod,
        cardDetails: selectedMethod !== "offline" ? cardDetails : null
      });

      alert("Payment successful! ✅");
      if (onPaymentComplete) {
        onPaymentComplete(response.data);
      }
    } catch (error) {
      alert("Payment failed: " + (error.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-purple-950 p-4">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

            <div className="bg-gray-800/50 p-4 rounded-xl mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{event.description}</p>

              <div className="space-y-2 text-sm text-gray-400 border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="text-white">{event.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Venue:</span>
                  <span className="text-white">{event.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="text-white">{event.category}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Event Price:</span>
                <span>₹{event.price}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Platform Fee:</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between text-white text-lg font-bold border-t border-white/10 pt-4 mt-4">
                <span>Total Amount:</span>
                <span>₹{event.price}</span>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="w-full mt-6 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>

          {/* Payment Form */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>

            {/* Payment Method Selection */}
            <div className="space-y-3 mb-6">
              {["stripe", "paypal", "upi", "offline"].map((method) => (
                <label key={method} className="flex items-center p-3 border border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={selectedMethod === method}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="w-4 h-4 accent-purple-500"
                  />
                  <span className="ml-3 text-white font-medium capitalize">
                    {method === "upi" ? "UPI" : method.charAt(0).toUpperCase() + method.slice(1)}
                  </span>
                </label>
              ))}
            </div>

            {/* Card Details for Stripe/PayPal */}
            {(selectedMethod === "stripe" || selectedMethod === "paypal") && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Card Number</label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Card Holder Name</label>
                  <input
                    type="text"
                    value={cardDetails.cardHolder}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={handleExpiryChange}
                      placeholder="12/25"
                      maxLength="5"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">CVV</label>
                    <input
                      type="text"
                      value={cardDetails.cvv}
                      onChange={handleCVVChange}
                      placeholder="123"
                      maxLength="3"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === "upi" && (
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg mb-6">
                <p className="text-blue-300 text-sm">📱 UPI payment will open in your UPI app</p>
              </div>
            )}

            {selectedMethod === "offline" && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg mb-6">
                <p className="text-yellow-300 text-sm">💰 You will receive payment instructions after completing this registration</p>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg transition"
            >
              {isProcessing ? "Processing Payment..." : `Pay ₹${event.price}`}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              🔒 Your payment is secured and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
