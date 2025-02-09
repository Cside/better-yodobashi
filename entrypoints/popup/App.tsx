import { storage } from "wxt/storage";
import "./App.css";
// Sonnet
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import "./App.css";

function App() {
  const queryClient = useQueryClient();

  // PR商品の設定を取得
  const { data: showsPrProducts, isLoading: isLoadingPr } = useQuery({
    queryKey: ["settings", "showsPrProducts"],
    queryFn: async () => {
      const value = await storage.getItem<boolean>("local:showsPrProducts");
      return value ?? false;
    },
  });

  // 在庫商品の設定を取得
  const { data: showsOutOfStockProducts, isLoading: isLoadingStock } = useQuery(
    {
      queryKey: ["settings", "showsOutOfStockProducts"],
      queryFn: async () => {
        const value = await storage.getItem<"show" | "dim" | "hide">(
          "local:showsOutOfStockProducts"
        );
        return value ?? "dim";
      },
    }
  );

  // PR商品の設定を更新
  const updatePrProductsMutation = useMutation({
    mutationFn: async (newValue: boolean) => {
      await storage.setItem("local:showsPrProducts", newValue);
      return newValue;
    },
    onSuccess: (newValue) => {
      queryClient.setQueryData(["settings", "showsPrProducts"], newValue);
    },
  });

  // 在庫商品の設定を更新
  const updateStockProductsMutation = useMutation({
    mutationFn: async (newValue: "show" | "dim" | "hide") => {
      await storage.setItem("local:showsOutOfStockProducts", newValue);
      return newValue;
    },
    onSuccess: (newValue) => {
      queryClient.setQueryData(
        ["settings", "showsOutOfStockProducts"],
        newValue
      );
    },
  });

  if (isLoadingPr || isLoadingStock) {
    return <div>Loading...</div>;
  }

  return (
    <table>
      <tbody>
        <tr>
          <th>PR商品</th>
          <td>
            <select
              value={showsPrProducts ? "show" : "hide"}
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
  );
}

const queryClient = new QueryClient();

function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

export default AppWrapper;
