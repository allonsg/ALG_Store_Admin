export type ProductImageType = {
  id: string;
  url: string;
};

export type ProductType = {
  title: string;
  description: string;
  price: number;
  images: ProductImageType[];
  category: string;
  _id?: string;
};

export type IFormData = Omit<ProductType, "_id">;

export type ImageListProps = {
  linkList: ProductImageType[];
};

export type CategoryType = {
  categoryName: string;
  _id?: string;
  parentCategory?: CategoryType;
};
