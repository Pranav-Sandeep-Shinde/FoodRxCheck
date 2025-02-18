import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import supabase from "../../Supabase/supabase";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [subclassMap, setSubclassMap] = useState<Record<number, boolean>>({});

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

  useEffect(() => {
    const fetchSubclassData = async () => {
      if (!classes) return;
      const subclassStatuses: Record<number, boolean> = {};

      for (const cls of classes) {
        const { data } = await supabase
          .from("sub_classes")
          .select("sub_class_id")
          .eq("class_id", cls.class_id)
          .limit(1);

        subclassStatuses[cls.class_id] = data?.length > 0;
      }
      setSubclassMap(subclassStatuses);
    };

    fetchSubclassData();
  }, [classes]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % classes.length);
    setProgress(0);
  }, [classes]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + classes.length) % classes.length);
    setProgress(0);
  }, [classes]);

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
  }, [currentIndex, classes, nextSlide]);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white-900 p-6">
      {/* Carousel Container */}
      <div className="relative w-full max-w-lg h-[400px]">
        {/* Slides */}
        <div className="relative flex justify-center items-center perspective-1000 w-full h-full">
          {classes.map((cls, index) => {
            const offset = (index - currentIndex + classes.length) % classes.length;
            let transform = "";
            let zIndex = 0;
            let opacity = 1;
            let isClickable = false;

            if (offset === 0) {
              transform = "translateX(0) scale(1)";
              zIndex = 3;
              isClickable = true;
            } else if (offset === 1 || offset === -classes.length + 1) {
              transform = "translateX(120%) scale(0.8)";
              zIndex = 2;
              opacity = 0.6;
            } else if (offset === -1 || offset === classes.length - 1) {
              transform = "translateX(-120%) scale(0.8)";
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
                className="absolute w-[300px] h-[400px] transition-transform duration-700 ease-out"
                style={{ transform, zIndex, opacity }}
              >
                <div
                  onClick={() => {
                    if (isClickable) {
                      if (subclassMap[cls.class_id]) {
                        navigate(`/sub-classes/${cls.class_id}`, {
                          state: { className: cls.class_name },
                        });
                      } else {
                        navigate(`/interactions/${cls.class_id}`, {
                          state: { className: cls.class_name },
                        });
                      }
                    }
                  }}
                  className={`relative w-full h-full rounded-lg shadow-lg cursor-pointer overflow-hidden 
                  ${isClickable ? "hover:shadow-[0_0_20px_4px_rgba(0,128,128,0.7)] transition-all duration-300" : "pointer-events-none opacity-50"}`}
                >
                  <img
                    src={`/class_images/${cls.class_name.toLowerCase().replace(/\s+/g, "_")}.jpg`}
                    alt={cls.class_name}
                    className="absolute w-full h-full object-cover"
                  />
                  <div className="absolute w-full h-full bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-gray-200/80 text-black text-lg font-bold px-4 py-2 rounded-lg shadow-lg">
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
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-all z-50"
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

      {/* Dots Navigation */}
      <div className="mt-20 flex gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
        {classes?.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setProgress(0);
            }}
            className={`h-1.5 rounded-full transition-all ${
              currentIndex === index ? "bg-white w-5" : "bg-white/50 w-1.5"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ClassList;
