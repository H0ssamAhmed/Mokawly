import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ThemeProvider } from './components/theme-provider.tsx';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      staleTime: 1000 * 60 * 5
    }

  }
})

createRoot(document.getElementById("root")!).render(
  <ConvexProvider client={convex}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="painting-app-theme">
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </ConvexProvider>

);
