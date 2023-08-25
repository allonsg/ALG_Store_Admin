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
  properties: ProductPropertyType;
  _id?: string;
  createdAt: string;
  updatedAt: string;
};

export type IFormData = Omit<ProductType, "_id">;

export type ImageListProps = {
  linkList: ProductImageType[];
};

export type PropertyType = {
  name: string;
  values: string;
};

export type ProductPropertyType = {
  [key: string]: string;
};

export type ArrayPropertyType = PropertyType & {
  values: string[];
};

export type CategoryType = {
  categoryName: string;
  _id?: string;
  parentCategory?: CategoryType;
  properties?: ArrayPropertyType[];
};

export interface LineItem {
  quantity: number;
  price_data: {
    currency: string;
    unit_amount: number;
    product_data: {
      name: string;
    };
  };
}

export interface OrderType {
  line_items: LineItem[];
  customer: {
    name: string;
    email: string;
    city: string;
    country: string;
    zip: string;
    street: string;
  };
  paid: boolean;
  createdAt: string;
  updatedAt: string;
  _id: string;
}
