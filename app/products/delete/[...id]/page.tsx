"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import Layout from "@/app/components/Layout";
import { ProductType } from "@/Types/types";

const DeleteProduct = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const [productInfo, setProductInfo] = useState<ProductType | null>(null);

  useEffect(() => {
    if (!params.id) return;

    try {
      axios
        .get<ProductType>("/api/products?id=" + params.id)
        .then((res) => setProductInfo(res.data));
    } catch (error: any) {
      console.log(error.message || "ERROR");
    }
  }, [params.id]);

  const goBack = () => {
    router.push("/products");
  };

  const handleOnDeleteClick = async () => {
    try {
      await axios.delete("/api/products?id=" + params.id);
      goBack();
    } catch (error: any) {
      console.log(error.message || "ERROR");
    }
  };

  return (
    <Layout>
      {productInfo && (
        <>
          <h1 className="text-center">
            Do you really want to delete &nbsp;&ldquo;{productInfo.title}
            &ldquo;?
          </h1>
          <div className="flex justify-center gap-2">
            <button className="btn-red" onClick={handleOnDeleteClick}>
              Yes
            </button>
            <button className="btn-default" onClick={() => goBack()}>
              No
            </button>
          </div>
        </>
      )}
    </Layout>
  );
};

export default DeleteProduct;
