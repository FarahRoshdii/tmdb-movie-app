import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import MovieDetails from "./components/MovieDetail/MovieDetails";
import Watchlist from "./pages/WatchList";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
    </Layout>
  );
}
