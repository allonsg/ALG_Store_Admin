export type ProductImageType = {
  id: string;
  url: string;
};

export type ProductType = {
  title: string;
  description: string;
  price: number;
  images: ProductImageType[];
  _id?: string;
};

export type IFormData = Omit<ProductType, "_id">;

export type ImageListProps = {
  linkList: ProductImageType[];
};
