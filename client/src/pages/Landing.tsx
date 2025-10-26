import HeroSection from "../components/HeroSection";
import ScrollableMoviesRow from "../components/ScrollableMoviesRow";

export default function Landing() {
  return (
    <div className="bg-[#0a0a0a] text-gray-100 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-12 flex-1 w-full">
        <HeroSection />
        <ScrollableMoviesRow category="now_playing" title="Now Playing" />
        <ScrollableMoviesRow category="popular" title="Popular Movies" />
      </div>
    </div>
  );
}
