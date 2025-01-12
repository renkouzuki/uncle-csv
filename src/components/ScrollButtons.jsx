import { ChevronRight, ChevronLeft } from "lucide-react";

const ScrollButtons = ({ scrollContainer }) => {
  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <>
      <button
        onClick={scrollLeft}
        className="fixed left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white
                   rounded-full p-2 shadow-lg border border-gray-200 z-50"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollRight}
        className="fixed right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white
                   rounded-full p-2 shadow-lg border border-gray-200 z-50"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </>
  );
};

export default ScrollButtons;
