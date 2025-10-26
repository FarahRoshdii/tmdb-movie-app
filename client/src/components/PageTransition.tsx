import { useEffect, useState } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [fadeClass, setFadeClass] = useState("opacity-0 translate-y-4");

  useEffect(() => {
    const timer = setTimeout(() => setFadeClass("opacity-100 translate-y-0"), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transition-all duration-700 ease-in-out transform ${fadeClass}`}
    >
      {children}
    </div>
  );
}
