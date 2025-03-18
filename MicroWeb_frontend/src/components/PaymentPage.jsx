import { BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";

import "../style/paymentPage.css";

function PaymentPage() {
  return (
    <div className="payment_container">
      <div className="payment_logo">
        <BadgeCheck size={80} color="green" />
      </div>
      <h1>Order Confirmed. Payment Complete!</h1>
      <div className="payment_btn">
        <Link to="/orders" className="btn">
          View Order History
        </Link>
        <Link to="/products" className="btn">
          Explore More Products
        </Link>
      </div>
    </div>
  );
}

export default PaymentPage;
