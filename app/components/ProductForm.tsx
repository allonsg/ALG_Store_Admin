"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";

import { IFormData, ProductType } from "@/Types/types";

interface ProductFormProps extends Partial<ProductType> {
  onSubmit: SubmitHandler<IFormData>;
  images: string[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  title = "",
  description = "",
  price = 0,
  onSubmit,
  images,
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

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const imageList = e.target.files;

    if (imageList.length) {
      const data = new FormData();
      const imageListArray = Array.from(imageList);
      imageListArray.forEach((image) => data.append("image", image));

      try {
        const res = await axios.post("/api/upload", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res.data);
      } catch (error: any) {
        console.log(error?.response?.data?.message || "ERROR");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <label>Product name</label>
      <input type="text" placeholder="product name" {...register("title")} />

      <label>Photos</label>
      <div className="mb-2">
        <label className="w-24 h-24 text-center cursor-pointer flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={uploadImage}
            multiple
          />
        </label>
        {!images?.length && <div>No photos in this product</div>}
      </div>

      <label>Description</label>
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
