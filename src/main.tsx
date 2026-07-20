import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import "./i18n"; // Import i18n initialization
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { TenantProvider } from "./context/TenantContext.tsx";
import Loader from "./components/common/Loader";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <TenantProvider>
          <Suspense fallback={<Loader className="flex h-screen items-center justify-center" />}>
            <App />
          </Suspense>
        </TenantProvider>
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>,
);
