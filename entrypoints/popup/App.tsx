import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Suspense } from "react";
import {
  getOutOfStockProductsDisplay,
  getPrProductsDisplay,
  setOutOfStockProductsDisplay,
  setPrProductsDisplay,
} from "../storage/settings";
import "./App.css";

function App() {
  const queryClient = useQueryClient();

  // PR商品の設定を取得
  const { data: prProductsDisplay } = useSuspenseQuery({
    queryKey: ["settings", "PrProductsDisplay"],
    queryFn: getPrProductsDisplay,
  });

  // 在庫商品の設定を取得
  const { data: showsOutOfStockProducts } = useSuspenseQuery({
    queryKey: ["settings", "showsOutOfStockProducts"],
    queryFn: getOutOfStockProductsDisplay,
  });

  // PR商品の設定を更新
  const updatePrProductsMutation = useMutation({
    mutationFn: setPrProductsDisplay,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settings", "PrProductsDisplay"],
      });
    },
  });

  // 在庫商品の設定を更新
  const updateStockProductsMutation = useMutation({
    mutationFn: setOutOfStockProductsDisplay,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settings", "showsOutOfStockProducts"],
      });
    },
  });

  return (
    <>
      <h1>設定</h1>
      <table>
        <tbody>
          <tr>
            <th>PR商品</th>
            <td>
              <select
                value={prProductsDisplay ? "show" : "hide"}
                onChange={(e) =>
                  updatePrProductsMutation.mutate(e.target.value === "show")
                }
              >
                <option value="show">表示する</option>
                <option value="hide">表示しない</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>在庫がない（お取り寄せ）商品</th>
            <td>
              <select
                value={showsOutOfStockProducts}
                onChange={(e) =>
                  updateStockProductsMutation.mutate(
                    e.target.value as "show" | "dim" | "hide"
                  )
                }
              >
                <option value="show">表示する</option>
                <option value="dim">薄く表示する</option>
                <option value="hide">表示しない</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>販売終了した商品</th>
            <td>表示しない</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

const queryClient = new QueryClient();

function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </QueryClientProvider>
  );
}

export default AppWrapper;
