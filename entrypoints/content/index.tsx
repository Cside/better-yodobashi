import { JSX } from "react";
import ReactDOMServer from "react-dom/server";
import { storage } from "wxt/storage";
import "./style.css";

export default defineContentScript({
  matches: ["https://www.yodobashi.com/*"],

  async main() {
    // ==================================================
    // 設定値を body に書く
    // ==================================================
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

    // ==================================================
    // 在庫状況を取得
    // ==================================================
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
      // お取り寄せ
      if (stockInfo.includes("お取り寄せ")) {
        console.log("お取り寄せ");
        // TODO dim ならやらない
        appendStockStatus($product, "在庫なし", "お取り寄せ");
        $product.setAttribute("data-by-stock-status", "out-of-stock");
      } else if (stockInfo.includes("販売を終了")) {
        console.log("販売終了");
        appendStockStatus($product, "販売終了");
        $product.setAttribute("data-by-stock-status", "discontinued");
      } else if (stockInfo.includes("店頭でのみ販売しています")) {
        console.log("店頭でのみ販売しています");
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
