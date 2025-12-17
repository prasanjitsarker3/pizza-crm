export interface IBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string | null;
  video: string | null;
  link: string;
  type: "IMAGE" | "VIDEO";
  order: number;
  isDeleted: boolean;
  isActive: boolean;
  meta: any | null;
  createdAt: string;
  updatedAt: string;
}