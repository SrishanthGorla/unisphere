# Paid Events System Documentation

## Overview
The UniSphere app now includes a complete paid events system with secure payment processing, transaction tracking, and payment history management.

## Features

### 1. **Paid Event Creation**
- Admin can mark events as paid and set prices
- Support for multiple payment methods (Stripe, PayPal, UPI)
- Event capacity management for paid events

### 2. **Checkout Process**
- Secure checkout page with event details
- Multiple payment method options
- Card validation and error handling
- Order summary display

### 3. **Payment Processing**
- Unique transaction IDs for every payment (`TXN` + timestamp + random hex)
- Payment status tracking (pending, completed, failed, refunded)
- Simulated payment processing (replace with actual gateway)
- Event registration linked to payment status

### 4. **Payment Completed Page**
- Confirmation with success message
- Transaction details display
- Receipt download functionality
- Next steps guidance
- Link to dashboard and home

### 5. **Payment History**
- View all transactions in tabular format
- Filter by status (completed, pending, failed, refunded)
- Transaction details popup
- Copy transaction ID to clipboard
- Event information tied to each transaction

## Database Models

### Payment Schema
```javascript
{
  transactionId: String (unique),
  userId: ObjectId (ref: User),
  eventId: ObjectId (ref: Event),
  registrationId: ObjectId (ref: Registration),
  amount: Number,
  currency: String (default: 'INR'),
  status: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
  paymentMethod: ['stripe', 'paypal', 'upi', 'offline'],
  eventTitle: String,
  eventDate: String,
  userName: String,
  userEmail: String,
  createdAt: Date,
  completedAt: Date,
  refundedAmount: Number,
  refundedAt: Date,
  refundReason: String
}
```

### Updated Registration Schema
```javascript
{
  // Existing fields...
  isPaid: Boolean,
  paymentAmount: Number,
  paymentStatus: ['pending', 'completed', 'failed', 'cancelled'],
  transactionId: String,
  paymentMethod: String,
  paidAt: Date
}
```

## API Endpoints

### Payment Creation & Processing
- `POST /api/payments/create-session` - Initialize payment session
- `POST /api/payments/process` - Process payment
- `GET /api/payments/:transactionId` - Get payment details
- `GET /api/payments/user/:userId` - Get user's payment history
- `POST /api/payments/refund/:transactionId` - Refund a payment
- `GET /api/payments/stats/overview` - Get payment statistics (admin)

## Frontend Components

### 1. **Checkout Component** (`src/components/Checkout.jsx`)
- Payment method selection
- Card details form
- Real-time validation
- Order summary sidebar
- Error handling

### 2. **CheckoutPage** (`src/pages/CheckoutPage.jsx`)
- Full page checkout experience
- Loading states
- Error handling
- Navigation support

### 3. **PaymentCompleted** (`src/pages/PaymentCompleted.jsx`)
- Success confirmation
- Transaction details display
- Receipt download
- Next steps information
- Navigation buttons

### 4. **PaymentHistory** (`src/components/PaymentHistory.jsx`)
- Transaction table
- Status indicators
- Payment details modal
- Copy transaction ID functionality

## User Flow

### For Paid Events:
1. User views event with "💰 ₹Price" badge
2. Clicks "Buy Ticket 🎫" button
3. Redirected to checkout page (`/checkout?eventId=...`)
4. Selects payment method
5. Enters card details (Stripe example)
6. System processes payment
7. On success:
   - Transaction created with unique ID
   - Registration recorded as paid
   - Redirected to success page (`/payment-completed?txnId=...`)
   - Receipt can be downloaded
   - Payment appears in history

### For Free Events:
- User clicks "Register 🚀" button
- Instant registration without payment
- Appears in dashboard and registered events

## Testing Payment System

### Test Card Numbers (for Stripe simulation):
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### Test Credentials:
- Expiry: Any future date (MM/YY)
- CVV: Any 3 digits
- Card Number: 16 digits (auto-formatted)

## Integration Points

### EventCard Component
- Updated to show pricing badges
- "Buy Ticket" button for paid events
- Capacity display for paid events

### Dashboard
- New "Payment History" tab
- Separate from "My Events" tab
- Shows all transactions with details

### API Integration
- New payment-related API functions in `src/api.js`
- Automated transaction ID generation
- Payment status synchronization

## Production Considerations

### 1. **Real Payment Gateway Integration**
```javascript
// Replace the simulated processing in paymentRoutes.js with:
// - Stripe: Use Stripe SDK for charge creation
// - PayPal: Use PayPal REST API
// - UPI: Integrate with UPI provider
```

### 2. **Security**
- Always process payments on backend (✓ Done)
- Use HTTPS for all transactions
- Never log card details
- Implement PCI compliance
- Use verified payment gateways

### 3. **Database**
- Implement transaction logging
- Backup payment records
- Archive old transactions
- Set up payment recovery procedures

### 4. **Admin Features**
- Payment analytics dashboard
- Refund management interface
- Transaction reports
- Revenue tracking

## Customization

### Modify Payment Methods:
Edit `server/routes/paymentRoutes.js` line 16:
```javascript
const { userId, eventId, amount, paymentMethod } = req.body;
// Add custom methods as needed
```

### Adjust Transaction ID Format:
Edit `server/routes/paymentRoutes.js` line 14:
```javascript
const generateTransactionId = () => {
  return "TXN" + Date.now() + crypto.randomBytes(4).toString("hex").toUpperCase();
};
```

### Customize Currency:
Edit in multiple files - currently set to "INR"
- `server/routes/paymentRoutes.js`: Change default currency
- Update UI to reflect new currency symbol

## Error Handling

The system handles:
- Invalid card details
- Network failures
- Payment gateway errors
- Duplicate payment attempts
- Missing user/event data
- Expired sessions

All errors are logged and reported to users with friendly messages.

## Future Enhancements

1. **Multiple Currency Support** - Add USD, EUR, etc.
2. **Subscription Events** - Recurring payments
3. **Group Discounts** - Bulk registration discounts
4. **Payment Schedules** - Installment payments
5. **Invoice Generation** - Professional invoices
6. **Payment Analytics** - Revenue reports
7. **Automated Refunds** - Scheduled refund policies
8. **Email Receipts** - Automatic email invoicing

## Support

For issues or questions about the payment system:
1. Check transaction details in payment history
2. Review server logs for error details
3. Verify payment gateway credentials
4. Check database records for transaction data

---

**Last Updated:** April 7, 2026
**Version:** 1.0
**Maintained by:** UniSphere Development Team
