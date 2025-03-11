import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import Loading from "../../utils/Loading";
import OrderBox from "./OrderBox";

import axiosInstanceOrder from "../../utils/axiosInstanceOrder";

import "../../style/orders.css";

const Orders = () => {
  const userId = useSelector((state) => state.auth.userId);

  // sends a request to fetch user orders history
  const {
    data: ordersData,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["orders", userId],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      const response = await axiosInstanceOrder.get(`/order/${id}`);
      return response.data;
    },
  });

  return (
    <section className="orders_container">
      <div className="order_headers">
        <h1>Orders History</h1>
        <p>A quick look back at everything you’ve ordered</p>
      </div>

      {isPending && <Loading />}
      {isError && (
        <p className="error_msg">Something went wrong fetching your orders.</p>
      )}

      <div className="order_box_container">
        {ordersData?.data?.length === 0 && (
          <p className="no_order error_msg">
            Empty for now, but not for long! Time to discover something great.
          </p>
        )}

        {ordersData?.data?.map((order) => (
          <OrderBox key={order.orderId} {...order} />
        ))}
      </div>
    </section>
  );
};

export default Orders;
