import Layout from "@/app/components/Layout";
import dbConnect from "@/lib/mongoose";
import { OrderType } from "@/types/types";
import { isAdminRequest } from "@/lib/auth";
import { Order } from "@/models/Order.model";
import { formatDateTime } from "@/lib/formatDateTime";

async function fetchOrders(): Promise<OrderType[]> {
  await isAdminRequest();
  await dbConnect();

  const orders = await Order.find().sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(orders, null, 2));
}

const OrdersPage = async () => {
  const orders = await fetchOrders();

  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic text-center">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{formatDateTime(order.createdAt)}</td>
                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "Yes" : "No"}
                </td>
                <td>
                  {order.customer.name} {order.customer.email} <br />
                  {order.customer.city} {order.customer.zip}{" "}
                  {order.customer.country}
                  <br />
                  {order.customer.street}
                </td>
                <td>
                  {order.line_items.map((item) => (
                    <div
                      key={item.price_data.product_data.name}
                      className="mx-auto grid max-w-[200px] grid-cols-2 justify-start"
                    >
                      <span className="mr-auto">
                        {item.price_data.product_data.name}
                      </span>
                      <span className="mr-auto">x {item.quantity}</span>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default OrdersPage;
