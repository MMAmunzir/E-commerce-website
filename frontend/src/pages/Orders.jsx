import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "./../context/ShopContext.jsx";
import Title from "./../components/Title.jsx";
import axios from "axios";
const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }
      const res = await axios.get(backendUrl + "/api/order/user-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        let allOrdersItem = [];
        res.data.payload.map((order) => {
          order.items.map((item) => {
            item["status"] = order.status;
            item["address"] = order.address;
            item["date"] = order.date;
            item["paymentMethod"] = order.paymentMethod;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);
  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex  flex-col md:flex-row md:items-between md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img src={item.image[0]} className="w-16 sm:w-20" />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                  <p>
                    {currency}
                    {item.price}
                  </p>
                  <p>Quantity:{item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p>
                  Date:
                  <span className="text-gray-400 ml-2">
                    {new Date(item.date).toDateString()}
                  </span>
                </p>
                <p>
                  Payment:
                  <span className="text-gray-400 ml-2">
                    {item.paymentMethod}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center ">
              <div className="md:w-auto flex justify-between">
                <div className="flex items-center gap-2">
                  <p className="min-w-2  h-2 rounded-full bg-green-500"></p>
                  <p className="text-sm w-30 md:text-base">{item.status}</p>
                </div>
                <button
                  onClick={() => {
                    loadOrderData();
                  }}
                  className="border ml-14 px-4 text-sm font-medium rounded-sm"
                >
                  Track Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
