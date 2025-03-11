import "../../style/orderbox.css";

const OrderBox = (props) => {
  const { orderId, orderPlacedDate, products, shippingAddress } = props;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

  return (
    <>
      <div className="order_box">
        <div className="order_box_header">
          <p>
            <strong>Order ID:</strong> #{orderId}
          </p>
          <p>
            <strong>Placed on:</strong> {formatDate(orderPlacedDate)}
          </p>
        </div>

        <div className="products_in_order">
          {products.map((product, idx) => (
            <div key={idx} className="product_in_order">
              <img
                src={product.images[0]}
                alt={product.title}
                className="order_product_image"
              />
              <div className="product_details">
                <div className="product_details_1">
                  <strong>{product.title}</strong>
                  <strong>Quantity: {product.quantity}</strong>
                  <strong>Price: ₹{product.totalPrice}</strong>
                </div>
                <div className="shipping_address">
                  <strong>Shipping Address: </strong>
                  <p>
                    {shippingAddress.fullName}, {shippingAddress.addressLineOne}
                    , {shippingAddress.addressLineTwo}, {shippingAddress.city},{" "}
                    {shippingAddress.state}, {shippingAddress.pincode} ,
                    {shippingAddress.country}
                  </p>
                  <p>Phone: {shippingAddress.phoneNumber}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OrderBox;
