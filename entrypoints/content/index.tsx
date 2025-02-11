import ReactDOMServer from "react-dom/server";
import type { JSX } from "react/jsx-runtime";
import { storage } from "wxt/storage";
import { getOutOfStockProductsDisplay } from "../storageForSettings";
import "./style.css";

export default defineContentScript({
  matches: ["https://www.yodobashi.com/*"],

  async main() {
    // ==================================================
    // 設定値を body に書く
    // ==================================================
    document.body.setAttribute(
      "data-by-shows-pr-products",
      String(
        (await storage.getItem<boolean>("local:PrProductsDisplay")) ?? false
      )
    ); // TODO 定数化

    document.body.setAttribute(
      "data-by-shows-out-of-stock-products",
      (await storage.getItem<"show" | "dim" | "hide">(
        "local:outOfStockProductsDisplay"
      )) ?? "dim"
    ); // TODO 定数化

    // ==================================================
    // 在庫状況を表示
    // ==================================================
    const shouldDimOutOfStockProducts =
      (await getOutOfStockProductsDisplay()) === "dim";

    for (const $product of document.querySelectorAll<HTMLElement>(
      ".js_productBox" // .productListTile でも良い
    )) {
      const stockInfo = $product.querySelector<HTMLElement>(
        ".js_addLatestSalesOrder" // この親の .pInfo でも良い
      )?.innerText;
      if (stockInfo === undefined) {
        console.error(
          "在庫情報(.js_addLatestSalesOrder) is not found",
          $product
        );
        continue;
      }
      if (stockInfo.includes("お取り寄せ")) {
        if (shouldDimOutOfStockProducts)
          appendStockStatus($product, "在庫なし", "お取り寄せ");
        $product.setAttribute("data-by-stock-status", "out-of-stock");
      } else if (stockInfo.includes("販売を終了")) {
        if (shouldDimOutOfStockProducts)
          appendStockStatus($product, "販売終了");
        $product.setAttribute("data-by-stock-status", "discontinued");
      } else if (stockInfo.includes("店頭でのみ販売しています")) {
        if (shouldDimOutOfStockProducts)
          appendStockStatus($product, "在庫なし", "店頭でのみ販売");
        $product.setAttribute("data-by-stock-status", "in-stores-only");
      } else if (!/在庫(あり|残少)/.test(stockInfo)) {
        // なんも無いやつもある。これとか https://www.yodobashi.com/product/200000000100177517/
        console.warn("Unknown stock info", stockInfo);
      }
    }
  },
});

const appendStockStatus = (
  $product: HTMLElement,
  stockStatus: string,
  secondaryMessage?: string
) => {
  $product.append(
    jsxToHtmlElement(
      <div className="by-stock-status-container">
        <div className="by-stock-status-message">{stockStatus}</div>
        {secondaryMessage && (
          <div className="by-stock-status-secondary-message">
            （{secondaryMessage}）
          </div>
        )}
      </div>
    )
  );
};

const jsxToHtmlElement = (jsx: JSX.Element): HTMLElement => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = ReactDOMServer.renderToStaticMarkup(jsx);
  return tempDiv.firstChild as HTMLElement;
};
