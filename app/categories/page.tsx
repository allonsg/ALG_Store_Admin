"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { withSwal } from "react-sweetalert2";

import Layout from "@/app/components/Layout";
import { CategoryType } from "@/types/types";

const Categories = ({ swal }: any) => {
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [editedCategory, setEditedCategory] = useState<CategoryType | null>(
    null,
  );

  const { register, handleSubmit, reset, setValue } = useForm<CategoryType>();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get<CategoryType[]>("/api/categories");
      setCategoryList(data);
    } catch (error: any) {
      console.log(error.message || "ERROR");
    }
  };

  const onSubmitForm = async (data: CategoryType) => {
    try {
      if (editedCategory) {
        await axios.put(`/api/categories`, {
          ...data,
          _id: editedCategory._id,
        });

        setEditedCategory(null);
      } else {
        await axios.post("/api/categories", data);
      }
    } catch (error: any) {
      console.log(error.message || "ERROR");
    }
    reset();
    await fetchCategories();
  };

  const onClickEditCategory = async (category: CategoryType) => {
    setEditedCategory(category);
    setValue("categoryName", category.categoryName);
    setValue(
      "parentCategory",
      category.parentCategory?._id as unknown as CategoryType,
    );
  };

  const onClickDeleteCategory = async (category: CategoryType) => {
    try {
      const { isConfirmed } = await swal.fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.categoryName}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        reverseButtons: true,
        confirmButtonColor: "red",
      });

      if (isConfirmed) {
        await axios.delete(`/api/categories?id=${category._id}`);
        await fetchCategories();
      }
    } catch (error: any) {
      console.log(error.message || "ERROR");
    }
  };

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.categoryName}`
          : "Create new category"}
      </label>
      <form className="flex gap-1" onSubmit={handleSubmit(onSubmitForm)}>
        <input
          className="mb-0"
          type="text"
          placeholder="Category name"
          {...register("categoryName")}
        />
        <select className="mb-0" {...register("parentCategory")}>
          <option value="">No parent category</option>
          {categoryList.length > 0 &&
            categoryList.map((category) => (
              <option key={category._id} value={category._id}>
                {category.categoryName}
              </option>
            ))}
        </select>
        <button type="submit" className="btn-primary py-1">
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categoryList.length > 0 &&
            categoryList.map((category) => (
              <tr key={category._id}>
                <td>{category.categoryName}</td>
                <td>{category.parentCategory?.categoryName}</td>
                <td>
                  <button
                    className="btn-primary mr-1"
                    onClick={() => onClickEditCategory(category)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onClickDeleteCategory(category)}
                    className="btn-primary"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default withSwal(({ swal }: any) => <Categories swal={swal} />);
