"use client";

import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";

import Layout from "@/app/components/Layout";
import ProductForm from "@/app/components/ProductForm";
import { IFormData } from "@/types/types";

const NewProduct = () => {
  const router = useRouter();

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    try {
      await axios.post("/api/products", data);
      router.push("/products");
    } catch (error: any) {
      console.log(error.message || "ERROR");
    }
  };

  return (
    <Layout>
      <h1>New Product</h1>
      <ProductForm onSubmit={onSubmit} />
    </Layout>
  );
};

export default NewProduct;
