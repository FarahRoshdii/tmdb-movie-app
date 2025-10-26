import SearchModal from "./SearchModal/SearchModal";

export default function HeroSection() {
  return (
    <section className="relative bg-[#0a0a0a] text-gray-100 py-20 overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
          Discover New films in one place.
        </h1>
        <p className="text-gray-400  mb-8">
          Dive into cinematic worlds and uncover what’s trending right now.
        </p>
        <SearchModal />
      </div>
    </section>
  );
}
