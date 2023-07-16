"use client";

import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { IFormData, ProductType } from "@/Types/types";

interface ProductFormProps extends Partial<ProductType> {
  onSubmit: SubmitHandler<IFormData>;
}

const ProductForm: React.FC<ProductFormProps> = ({
  title = "",
  description = "",
  price = 0,
  onSubmit,
}) => {
  const { register, handleSubmit, reset, setValue } = useForm<IFormData>();

  useEffect(() => {
    setValue("title", title);
    setValue("description", description);
    setValue("price", price);
  }, [description, price, setValue, title]);

  const onSubmitForm = (data: IFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
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
  );
};

export default ProductForm;
