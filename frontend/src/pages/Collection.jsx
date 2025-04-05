import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const Collection = () => {
  const { products } = useContext(ShopContext);

  return <div>Collection</div>;
};

export default Collection;
