import axios from "axios";
import React, { useEffect, useState } from "react";
// import { serverURL } from "../App";
import toast from "react-hot-toast";

const ListProducts = ({ token }) => {
  const [listProduct, setListProduct] = useState([]);

  const fetchListProducts = async () => {
    try {
      const res = await axios.get(
        process.meta.env.VITE_BACKEND_URL + "/api/product/all"
      );

      if (res.data.success) {
        setListProduct(res.data.payload);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        process.meta.env.VITE_BACKEND_URL + "/api/product/" + id,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchListProducts();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchListProducts();
  }, []);
  return (
    <main className="flex flex-col gap-2 ">
      <p className="mb-2">All products List</p>

      <div className=" hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border border-gray-100 text-sm">
        <b>Images</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b className="text-center">Action</b>
      </div>

      <div>
        {listProduct.map((product) => (
          <div
            key={product._id}
            className="  md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border border-gray-100 text-sm"
          >
            <img className="w-12" src={product.image[0]} alt={product.name} />
            <p>{product.name}</p>
            <p>{product.category}</p>
            <p>{product.price}</p>
            <p
              onClick={() => handleDelete(product._id)}
              className="text-right md:text-center cursor-pointer text-lg"
            >
              {" "}
              X
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ListProducts;
