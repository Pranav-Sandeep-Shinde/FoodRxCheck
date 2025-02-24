import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import  supabase  from "../../Supabase/supabase";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../../components/SideBar";

type Class = {
  class_id: number;
  class_name: string;
  description: string;
  image: string;
};

const ClassList = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);


  const { data: classes, isLoading, error } = useQuery<Class[]>({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("class_name", { ascending: true });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const filteredClasses =
    classes?.filter((cls) =>
      cls.class_name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredClasses.length);
    setProgress(0);
  }, [filteredClasses]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredClasses.length) % filteredClasses.length);
    setProgress(0);
  }, [filteredClasses]);

  useEffect(() => {
    const disableCtrlZoom = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };
  
    window.addEventListener("wheel", disableCtrlZoom, { passive: false });
  
    return () => {
      window.removeEventListener("wheel", disableCtrlZoom);
    };
  }, []);  

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 100 / 50;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [currentIndex, filteredClasses, nextSlide]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-white-900 p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-black mb-6 text-center drop-shadow-lg mt-4">Classes</h1>
      {/* Search Bar */}
      <div className="w-full max-w-xs sm:max-w-md ">
        <input
          type="text"
          placeholder="Search for Classes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111111] focus:outline-none mb-4 sm:mb-6"
        />
      </div>

      {/* Carousel Container */}
      <div className="relative w-full max-w-xs sm:max-w-lg h-[300px] sm:h-[400px] mt-5">
        <div className="relative flex justify-center items-center perspective-1000 w-full h-full">
        {filteredClasses.map((cls, index) => {
            const offset = (index - currentIndex + filteredClasses.length) % filteredClasses.length;
            let transform = "";
            let zIndex = 0;
            let opacity = 1;
            const isCenter = offset === 0;

            if (isCenter) {
              transform = "translateX(0) scale(1)";
              zIndex = 3;
            } else if (offset === 1 || offset === -filteredClasses.length + 1) {
              transform = "translateX(90%) scale(0.8)";
              zIndex = 2;
              opacity = 0.6;
            } else if (offset === -1 || offset === filteredClasses.length - 1) {
              transform = "translateX(-90%) scale(0.8)";
              zIndex = 2;
              opacity = 0.6;
            } else {
              transform = "translateX(200%) scale(0.7)";
              zIndex = 1;
              opacity = 0;
            }

            return (
              <div
                key={cls.class_id}
                className="absolute w-[250px] sm:w-[300px] h-[300px] sm:h-[400px] transition-transform duration-700 ease-out "
                style={{ transform, zIndex, opacity }}
              >
                <div
                  onClick={async () => {
                    if (!isCenter) return;
                    try {
                      console.log("class_id now:", cls.class_id);
                      const { data: subClasses, error } = await supabase
                        .from("sub_classes")
                        .select("sub_class_id")
                        .eq("class_id", cls.class_id);

                      if (error) console.error("Error fetching subclasses:", error.message);

                      if (Array.isArray(subClasses) && subClasses.length > 0) {
                        navigate(`/sub-classes/${cls.class_id}`, {
                          state: { className: cls.class_name },
                        });
                      } else {
                        navigate(`/drugs/${cls.class_id}`, {
                          state: { className: cls.class_name },
                        });
                      }
                    } catch (err) {
                      console.error("Navigation error:", err);
                    }
                  }}
                  className={`w-full h-full bg-white rounded-lg shadow-lg flex flex-col items-center justify-center hover:shadow-[0_0_20px_4px_rgba(0,128,128,0.7)] ${
                    isCenter ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <img
                    src={`/class_images/${cls.class_name.toLowerCase().replace(/\s+/g, "_")}.jpg`}
                    alt={cls.class_name}
                    className="absolute w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute w-full h-full bg-black/20 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-gray-200/80 text-black text-sm sm:text-lg font-bold px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-lg">
                      {cls.class_name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-all z-50 "
        >
          <ChevronLeft className="text-white w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-all z-50"
        >
          <ChevronRight className="text-white w-6 h-6" />
        </button>
      </div>

        {/* Timer Circle - Below Carousel */}
        <div className="relative mt-16 h-12 w-12 bg-black/50 rounded-full p-1 backdrop-blur-sm flex items-center justify-center">
        <svg className="h-10 w-10 -rotate-90 transform">
          <circle className="stroke-white/30" fill="none" strokeWidth="2" r="16" cx="20" cy="20" />
          <circle
            className="stroke-white drop-shadow-lg"
            fill="none"
            strokeWidth="2"
            r="16"
            cx="20"
            cy="20"
            strokeDasharray={`${2 * Math.PI * 16}`}
            strokeDashoffset={`${2 * Math.PI * 16 * (1 - progress / 100)}`}
            style={{ transition: "stroke-dashoffset 100ms linear" }}
          />
        </svg>
      </div>

      {/* Navigation Dots - Below Timer */}
      <div className="mt-12 flex gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
 .       {classes?.map((slide, index) => (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => setHoveredDot(index)} // Show title on hover
            onMouseLeave={() => setHoveredDot(null)} // Hide title on mouse leave
          >
            <button
              onClick={() => {
                setCurrentIndex(index);
                setProgress(0);
              }}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === index ? "bg-white w-5" : "bg-white/50 w-1.5"
              }`}
               aria-label={`Go to slide ${index + 1}`}
            />
            {/* Tooltip for the dot */}
            {hoveredDot === index && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-2 py-1 rounded-md whitespace-nowrap">
                {slide.class_name}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassList;
