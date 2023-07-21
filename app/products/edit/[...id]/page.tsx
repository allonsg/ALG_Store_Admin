"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import Layout from "@/app/components/Layout";
import { IFormData, ProductType } from "@/Types/types";
import ProductForm from "@/app/components/ProductForm";
import { SubmitHandler } from "react-hook-form";

const EditProduct = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const [productInfo, setProductInfo] = useState<ProductType | null>(null);

  useEffect(() => {
    if (!params.id) return;

    try {
      axios
        .get<ProductType>("/api/products?id=" + params.id)
        .then((res) => setProductInfo(res.data));
    } catch (error: any) {
      console.log(error?.response?.data?.message || "ERROR");
    }
  }, [params.id]);

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    try {
      await axios.put("/api/products", { ...data, _id: params.id });
      router.push("/products");
    } catch (error: any) {
      console.log(error?.response?.data?.message || "ERROR");
    }
  };

  return (
    <Layout>
      {productInfo && (
        <>
          <h1>Edit Product</h1>
          <ProductForm
            onSubmit={onSubmit}
            price={productInfo.price}
            title={productInfo.title}
            description={productInfo?.description}
            images={productInfo?.images}
          />
        </>
      )}
    </Layout>
  );
};

export default EditProduct;
