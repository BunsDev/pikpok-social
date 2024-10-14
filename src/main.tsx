import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "@contexts/AuthContext.tsx";
import NavProvider from "@contexts/NavContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavProvider>
          <ReactQueryDevtools />
          <App />
        </NavProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
