import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const submitHandle = async (e) => {
    e.preventDefault();
    try {
      if (currentState === "Sign Up") {
        const res = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (res.data.success) {
          setToken(res.data.payload);
          localStorage.setItem("token", res.data.payload);
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (res.data.success) {
          setToken(res.data.payload);
          localStorage.setItem("token", res.data.payload);
          navigate("/");
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      onSubmit={(e) => submitHandle(e)} // Pass the event object correctly
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
        ></input>
      )}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="Email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      ></input>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="Password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      ></input>
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your Password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login account
          </p>
        )}
      </div>
      <button className="bg-black cursor-pointer text-white font-light px-8 py-2 mt-4">
        {currentState}
      </button>
    </form>
  );
};

export default Login;
