export type ProductType = {
  title: string;
  description: string;
  price: number;
  _id?: string;
};

export type IFormData = Omit<ProductType, "_id">;
