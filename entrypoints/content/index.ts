import { storage } from "wxt/storage";
import "./style.css";

export default defineContentScript({
  matches: ["https://www.yodobashi.com/*"],

  async main() {
    document.body.setAttribute(
      "data-by-shows-pr-products",
      String((await storage.getItem<boolean>("local:showsPrProducts")) ?? false)
    ); // TODO 定数化

    document.body.setAttribute(
      "data-by-shows-out-of-stock-products",
      (await storage.getItem<"show" | "dim" | "hide">(
        "local:showsOutOfStockProducts"
      )) ?? "dim"
    ); // TODO 定数化
  },
});
