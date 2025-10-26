import { Suspense } from "react";
import Header from "./Header";
import PageTransition from "../PageTransition";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-[#0a0a0a]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <PageTransition>{children}</PageTransition>
        </Suspense>
      </main>
    </div>
  );
}
