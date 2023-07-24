"use client";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ReactSortable } from "react-sortablejs";
import axios from "axios";

import Spinner from "@/app/components/Spinner";
import {
  CategoryType,
  IFormData,
  ImageListProps,
  ProductImageType,
  ProductType,
} from "@/types/types";

interface ProductFormProps extends Partial<ProductType> {
  onSubmit: SubmitHandler<IFormData>;
}

const ProductForm: React.FC<ProductFormProps> = ({
  title = "",
  description = "",
  price = 0,
  category = "",
  onSubmit,
  images: existingImages = [],
}) => {
  const { register, handleSubmit, reset, setValue } = useForm<IFormData>();
  const [images, setImages] = useState<ProductImageType[]>(existingImages);
  const [isUploading, setIsUploading] = useState(false);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);

  useEffect(() => {
    setValue("title", title);
    setValue("category", category);
    setValue("description", description);
    setValue("price", price);
  }, [description, price, setValue, title, category, categoryList]);

  useEffect(() => {
    axios
      .get<CategoryType[]>("/api/categories")
      .then((res) => setCategoryList(res.data));
  }, []);

  const onSubmitForm = (data: IFormData) => {
    onSubmit({ ...data, images });
    reset();
  };

  const uploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const imageList = e.target.files;

    if (imageList.length) {
      setIsUploading(true);
      const fomrData = new FormData();
      const imageListArray = Array.from(imageList);
      imageListArray.forEach((image) => fomrData.append("image", image));
      try {
        const { data } = await axios.post<ImageListProps>(
          "/api/upload",
          fomrData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        setIsUploading(false);
        setImages((prev) => [...prev, ...data.linkList]);
      } catch (error: any) {
        console.log(error.message || "ERROR");
      }
    }
  };

  const updateImagesOrder = (images: ProductImageType[]) => {
    setImages(images);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <label>Product name</label>
      <input type="text" placeholder="product name" {...register("title")} />

      <label>Category</label>
      <select
        {...register("category")}
        onChange={(e) => console.log(e.target.value)}
      >
        <option value="">Uncategorized</option>
        {categoryList.length > 0 &&
          categoryList.map((category) => (
            <option key={category._id} value={category._id}>
              {category.categoryName}
            </option>
          ))}
      </select>

      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          setList={updateImagesOrder}
          className="flex flex-wrap gap-1"
        >
          {!!images?.length &&
            images.map((img) => (
              <div key={img.id} className="inline-block h-24">
                <img src={img.url} alt="Product Image" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        <label className="flex h-24 w-24 cursor-pointer items-center justify-center gap-1 rounded-lg bg-gray-200 text-center text-sm text-gray-500">
          {isUploading ? (
            <Spinner />
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <div>Upload</div>
            </>
          )}

          <input
            type="file"
            className="hidden"
            accept="image/*"
            disabled={isUploading}
            onChange={uploadImages}
            multiple
          />
        </label>
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
