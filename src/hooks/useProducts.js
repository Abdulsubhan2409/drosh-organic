import { products as localProducts } from "@/lib/products";

export function useProducts() {
  return { products: localProducts, loading: false, error: "" };
}