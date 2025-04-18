export interface iProduct {
    _id?: string;
    productName: string;
    description: string;
    price: number;
    category: string;
    brand: {
      _id: string;
      brandName: string;
      brandLogo: string;
      categories: string[];
    };
    productImage?: string;
    addedBy: {
      _id: string;
      name: string;
      email: string;
    };
  }
  