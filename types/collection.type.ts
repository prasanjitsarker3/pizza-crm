export interface ICollection {
  id: string;
  name: string;
  description: string;
  slug: string;
  isDisplay: boolean;
  bannerUrl: string,
  promoVideourl: string,
  createdAt: string;
  updatedAt: string; // or Date
  isDeleted: boolean;
  subCategories: ISubCategory[]; // define if needed, else `any[]`
  MappedCollectionBrand: IMappedCollectionBrand[]; // define if needed, else `any[]`
}

// Optional sub-interfaces
export interface ISubCategory {
  id: string;
  name: string;
  slug: string;
  collectionId: string;
  collection: {
    id: string,
    name: string
  }
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface IMappedCollectionBrand {
  id: string;
  brandName: string;
  // add other fields if available
}
