import ReactDOMServer from "react-dom/server";
import type { JSX } from "react/jsx-runtime";
import {
  getOutOfStockProductsDisplay,
  getPrProductsDisplay,
} from "../storage/options";
import "./style.css";

const isRankingPage = location.pathname.endsWith("/ranking/");

const main = async () => {
  const prProductsDisplay = await getPrProductsDisplay();
  const outOfStockProductsDisplay = await getOutOfStockProductsDisplay();

  // ==================================================
  // 設定値を body に書く
  // ==================================================
  document.body.setAttribute(
    "data-by-shows-pr-products",
    String(prProductsDisplay)
  );

  document.body.setAttribute(
    "data-by-shows-out-of-stock-products",
    outOfStockProductsDisplay
  );

  // ==================================================
  // 在庫状況を表示
  // ==================================================

  // セレクタ：
  // https://www.notion.so/196cb33a6a1f80bdb8dec63cc1bb70b2#196cb33a6a1f80b58812c768532d5239

  for (const $product of document.querySelectorAll<HTMLElement>(
    isRankingPage ? ".js_productBlock" : ".js_productBox"
  )) {
    const stockInfo = $product.querySelector<HTMLElement>(
      ".pInfo" // だいぶ広いが⋯。.js_addLatestSalesOrder はランキングの「在庫なし」では存在しないため
    )?.innerText;
    if (stockInfo === undefined) {
      console.error("在庫情報(.js_addLatestSalesOrder) is not found", $product);
      continue;
    }

    const shouldDimOutOfStockProducts = outOfStockProductsDisplay === "dim";

    if (stockInfo.includes("お取り寄せ")) {
      if (shouldDimOutOfStockProducts)
        appendStockStatus($product, "在庫なし", "お取り寄せ");
      $product.setAttribute("data-by-stock-status", "out-of-stock");
    } else if (stockInfo.includes("販売を終了")) {
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
};

export default defineContentScript({
  matches: ["https://www.yodobashi.com/*"],

  async main() {
    await main();
    if (isRankingPage) {
      const $listContainer = document.querySelector(
        ".js_mainCateRankContainer"
      );
      if ($listContainer === null) {
        console.error(".js-mainCateRankContainer is not found");
        return;
      }
      new MutationObserver(main).observe($listContainer, { childList: true });
    }
  },
});

// ==================================================
// Utils
// ==================================================

const appendStockStatus = (
  $product: HTMLElement,
  stockStatus: string,
  secondaryMessage?: string
) => {
  const $href =
    $product.querySelector<HTMLAnchorElement>(`a[href^="/product/"]`)?.href;
  if ($href === undefined) {
    console.error("href is not found", $product);
    return;
  }
  $product.append(
    jsxToHtmlElement(
      <a
        href={$href}
        target="_blank"
        rel="noreferrer"
        className="by-stock-status-container-link"
      >
        <div className="by-stock-status-message">{stockStatus}</div>
        {secondaryMessage && (
          <div className="by-stock-status-secondary-message">
            （{secondaryMessage}）
          </div>
        )}
      </a>
    )
  );
};

const jsxToHtmlElement = (jsx: JSX.Element): HTMLElement => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = ReactDOMServer.renderToStaticMarkup(jsx);
  return tempDiv.firstChild as HTMLElement;
};

// デバッグ用・写真撮影用
function prepend_DEBUG() {
  document.querySelector(".js_productBox")?.parentElement?.prepend(
    (() => {
      const div = document.createElement("div");
      div.innerHTML = `<div data-criteo-onview-beacon="" data-criteo-onload-beacon="" data-salesinformationcode="S0002" data-arealimitsalesdisable="false" data-atpscaleindex="0" data-sku="100000001007452601" class="srcResultItem_block pListBlock hznBox js_productBox js_smpClickable js_latestSalesOrderProduct  productListTile">
  <div class="imgBody">
    <div style="display:none;" class="imgOverlay js_overlay">
      <span class="Overlay_txt">明日中にお届けできます</span>
    </div>
  </div>
  <a data-criteo-onclick-beacon="" target="_blank" class="js_productListPostTag js-clicklog js-clicklog_OPT_CALLBACK_POST js-taglog-schRlt js_smpClickableFor cImg js-clicklog-check" href="/product/100000001007452601/">
    <div class="pImg mb15 ">
      <img alt="iPad（第10世代） 10.9インチ Wi-Fiモデル 64GB シルバー MPQ03J/A" onerror="this.src='https://image.yodobashi.com/product/NoImage_180x180.jpg';" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOgyseg8ch1hdktD8IHmmPCSirS8r3Qck1FAmuoplLHTROrnG3w-te42IGhD628G1vuUEqiz2RYRFVieisjvj8krKfXim3k7TRuoOgKBCM4YeZC4oYFXZ8Kfx_i9U-6Ok4YVnDKuyRKzm-/s800/computer_tablet1_icon.png">
    </div>
    <div class="pName fs14">
      <p>◯△️電機</p>
      <p>タブレット 10.9インチ Wi-Fiモデル 64GB シルバー</p>
    </div>
  </a>
  <!-- maker and release date -->
  <div class="pSubInfo pcParts">
    <span class="mr10">
      <a style="" href="/category/157851/165107/165132/165139/165140/m0000000373/?word=%E3%82%BF%E3%83%96%E3%83%AC%E3%83%83%E3%83%88">◯△電機</a>
    </span>
    <span class="gray">2022/10/26</span>
  </div>
  <div class="pInfo">
    <ul class="js_addLatestSalesOrder">
      <li></li>
      <li>
        <span class="productPrice">￥52,800</span>
      </li>
      <li>
        <span class="goldPoint orange">528 <span class="unitPointSpace">&nbsp;</span>
          <span class="orange unitPoint">ゴールドポイント</span>
          <span class="spNone">（1％還元）</span>
        </span>
      </li>
      <li>
        <span class="red">お取り寄せ</span>
      </li>
    </ul>
  </div>
  <div class="avgCR spNone">
    <div class="valueAvg">
      <a target="_blank" class="js_productListPostTag iconStarM rate4_5 js-clicklog  js-clicklog_OPT_CALLBACK_POST js-clicklog-check" href="/product/100000001007452601/#productSet6Opened--userEvaluation"></a>
      <!--
					-->
      <span class="fs11 alignM">（ <a target="_blank" class="js_productListPostTag js-clicklog  js-clicklog_OPT_CALLBACK_POST js-clicklog-check" href="/product/100000001007452601/#productSet6Opened--userEvaluation">25</a>） </span>
    </div>
  </div>
  <div class="pcNone">
    <span class="iconStarS rate4_25"></span>
    <span class="alignM">（25）</span>
  </div>
  <div class="storeStockLink spNone mt05">
    <a target="_blank" href="/ec/product/stock/100000001007452601/" class="stockOpen">在庫のある店舗</a>（0）
  </div>
  <div class="listBC mt10 pcParts">
    <ul>
      <li>パソコン・タブレットPC</li>
      <li>&gt;</li>
      <li>
        <a href="/category/19531/11970/172565/172566/?word=%E3%82%BF%E3%83%96%E3%83%AC%E3%83%83%E3%83%88">タブレットPC</a>
      </li>
    </ul>
  </div>
</div>
`;
      return div.firstChild as HTMLElement;
    })()
  );
}
