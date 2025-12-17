export interface IColor {
  id: string;
  name: string;
  hex: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}



export interface ISize {
  id: string;
  name: string;
  order: number | null;       // some rows may be null
  createdAt: string;         // ISO timestamp
  updatedAt: string;         // ISO timestamp
  isDeleted: boolean;
}
