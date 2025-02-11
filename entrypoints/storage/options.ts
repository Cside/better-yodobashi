import { storage } from "wxt/storage";

export type DisplayStatusForOutOfStockProducts = "show" | "dim" | "hide";

export const getPrProductsDisplay = async (): Promise<boolean> =>
  (await storage.getItem<boolean>("local:pr-products-display")) ?? false;

export const getOutOfStockProductsDisplay =
  async (): Promise<DisplayStatusForOutOfStockProducts> =>
    (await storage.getItem<DisplayStatusForOutOfStockProducts>(
      "local:out-of-stock-products-display"
    )) ?? "dim";

export const setPrProductsDisplay = async (
  newValue: boolean
): Promise<void> => {
  await storage.setItem("local:pr-products-display", newValue);
};

export const setOutOfStockProductsDisplay = async (
  newValue: DisplayStatusForOutOfStockProducts
): Promise<void> => {
  await storage.setItem("local:out-of-stock-products-display", newValue);
};
