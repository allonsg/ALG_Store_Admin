"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { withSwal } from "react-sweetalert2";

import Layout from "@/app/components/Layout";
import { ArrayPropertyType, CategoryType, PropertyType } from "@/types/types";

const Categories = ({ swal }: any) => {
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [editedCategory, setEditedCategory] = useState<CategoryType | null>(
    null,
  );
  const [properties, setProperties] = useState<
    PropertyType[] | ArrayPropertyType[]
  >([]);

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
      const formData = {
        ...data,
        properties: properties.map((p) => ({
          name: p.name,
          values:
            typeof p.values === "string"
              ? p.values.split(",").map((el) => el.trim())
              : p.values,
        })),
      };
      if (editedCategory) {
        await axios.put(`/api/categories`, {
          ...formData,
          _id: editedCategory._id,
        });

        setEditedCategory(null);
      } else {
        await axios.post("/api/categories", formData);
      }
    } catch (error: any) {
      console.log(error.message || "ERROR");
    }
    reset();
    setProperties([]);
    await fetchCategories();
  };

  const separatedProperties = useCallback((properties: ArrayPropertyType[]) => {
    return properties.map((property) => {
      return {
        ...property,
        values: property.values.join(", "),
      };
    });
  }, []);

  const onClickEditCategory = async (category: CategoryType) => {
    setEditedCategory(category);
    setProperties(
      category.properties ? separatedProperties(category.properties) : [],
    );
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

  const addProperty = () => {
    setProperties((prev) => [...prev, { name: "", values: "" }]);
  };

  const handlePropertyNameChange = ({
    newName,
    index,
  }: {
    newName: string;
    index: number;
  }) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  };

  const handlePropertyValuesChange = ({
    newValues,
    index,
  }: {
    newValues: string;
    index: number;
  }) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  };

  const removeProperty = (indexToRemove: number) => {
    setProperties((prev) =>
      prev.filter((p, pIndex) => pIndex !== indexToRemove),
    );
  };

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.categoryName}`
          : "Create new category"}
      </label>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="flex gap-1">
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
        </div>

        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            type="button"
            onClick={addProperty}
            className="btn-default mb-2 py-0 text-sm"
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="mb-2 flex gap-1">
                <input
                  type="text"
                  value={property.name}
                  className="mb-0"
                  onChange={(event) =>
                    handlePropertyNameChange({
                      newName: event.target.value,
                      index,
                    })
                  }
                  placeholder="property name (exmple: color)"
                />
                <input
                  className="mb-0"
                  type="text"
                  onChange={(event) =>
                    handlePropertyValuesChange({
                      newValues: event.target.value,
                      index,
                    })
                  }
                  value={property.values}
                  placeholder="values, comma separated"
                />
                <button
                  type="button"
                  className="btn-red"
                  onClick={() => removeProperty(index)}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        <div className="flex gap-1">
          {editedCategory && (
            <button
              className="btn-default"
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setProperties([]);
                reset();
              }}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
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
                      className="btn-default mr-1"
                      onClick={() => onClickEditCategory(category)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onClickDeleteCategory(category)}
                      className="btn-red"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default withSwal(({ swal }: any) => <Categories swal={swal} />);
