"use client";

import React from "react";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";

import Layout from "@/app/components/Layout";

interface IFormData {
  title: string;
  description: string;
  price: number;
}

const NewProduct = () => {
  const { register, handleSubmit, reset } = useForm<IFormData>();

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    reset();
    await axios.post("/api/products", data);
  };

  return (
    <Layout>
      <h1>New Product</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Product name</label>
        <input type="text" placeholder="product name" {...register("title")} />

        <label>Product description</label>
        <textarea
          placeholder="description"
          {...register("description")}
        ></textarea>

        <label>Price (in USD)</label>
        <input type="number" placeholder="price" {...register("price")} />

        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
    </Layout>
  );
};

export default NewProduct;
