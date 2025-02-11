import { storage } from "wxt/storage";
import "./App.css";
// Sonnet
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Suspense } from "react";
import "./App.css";

function App() {
  const queryClient = useQueryClient();

  // PR商品の設定を取得
  const { data: PrProductsDisplay } = useSuspenseQuery({
    queryKey: ["settings", "PrProductsDisplay"],
    queryFn: async () => {
      const value = await storage.getItem<boolean>("local:PrProductsDisplay");
      return (
        value ??
        // TODO 定数化
        false
      );
    },
  });

  // 在庫商品の設定を取得
  const { data: showsOutOfStockProducts } = useSuspenseQuery({
    queryKey: ["settings", "showsOutOfStockProducts"],
    queryFn: async () => {
      const value = await storage.getItem<"show" | "dim" | "hide">(
        "local:showsOutOfStockProducts"
      );
      return (
        value ??
        // TODO 定数化
        "dim"
      );
    },
  });

  // PR商品の設定を更新
  const updatePrProductsMutation = useMutation({
    mutationFn: async (newValue: boolean) => {
      await storage.setItem("local:PrProductsDisplay", newValue);
      return newValue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settings", "PrProductsDisplay"],
      });
    },
  });

  // 在庫商品の設定を更新
  const updateStockProductsMutation = useMutation({
    mutationFn: async (newValue: "show" | "dim" | "hide") => {
      await storage.setItem("local:showsOutOfStockProducts", newValue);
      return newValue;
    },
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
                value={PrProductsDisplay ? "show" : "hide"}
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
