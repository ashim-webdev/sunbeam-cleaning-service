import React from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from "react-redux";


const Pagination = ({ page, setPage, totalPages }) => {
  const { LightMode }  = useSelector((state) => state.auth);
  

  if (totalPages <= 1) return null;

  const generatePages = () => {
    const pages = [];

    // SHOW ALL IF SMALL
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, i) => i + 1
      );
    }

    // ALWAYS SHOW FIRST PAGE
    pages.push(1);

    // LEFT DOTS
    if (page > 4) {
      pages.push("left-dots");
    }

    // MIDDLE SECTION
    let middlePages = [];

    // START PAGES
    if (page <= 4) {
      middlePages = [2, 3, 4, 5];
    }

    // END PAGES
    else if (page >= totalPages - 3) {
      middlePages = [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
      ];
    }

    // NORMAL MIDDLE
    else {
      middlePages = [
        page - 1,
        page,
        page + 1,
      ];
    }

    // ADD MIDDLE PAGES
    middlePages.forEach((p) => {
      if (p > 1 && p < totalPages) {
        pages.push(p);
      }
    });

    // RIGHT DOTS
    if (page < totalPages - 3) {
      pages.push("right-dots");
    }

    // ALWAYS SHOW LAST PAGE
    pages.push(totalPages);

    return pages;
  };

  const pages = generatePages();

  return (
    <>
      <div className={`${LightMode ? "text-black" : "text-white"} flex flex-wrap items-center justify-center gap-4 mt-6 mb-4 transition-all duration-300 ease-in-out`}>
        {/* PREV */}
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`
            ${LightMode ? "shadow-darkSM" : "shadow-lightSM bg-black/80"}
            hidden sm:block cursor-pointer px-3 py-1 rounded-md text-sm hover:scale-103 active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:bg-blue-700 hover:text-white
            transition-all duration-300 
          `}
        >
          <span>Prev</span>
        </button>

        {/* PAGE BUTTONS */}
        {pages.map((p, index) =>
          p === "left-dots" || p === "right-dots" ? (
            <span
              key={index}
              className={`
                ${LightMode ? "text-black" : "text-white"}
                px-2
                select-none
              `}
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`
                w-8 h-8
                px-3 py-1 cursor-pointer text-sm flex justify-center items-center rounded-md
                transition-all duration-300
                ${
                  page === p
                    ? `${LightMode ? "shadow-darkSM" : "shadow-lightSM"}  bg-blue-700 text-white border border-white scale-105`
                    : "hover:bg-blue-700 hover:text-white hover:scale-105 active:scale-95"
                }
              `}
            >
              {p}
            </button>
          )
        )}

        {/* NEXT */}
        <button
          onClick={() =>
            setPage((p) => Math.min(p + 1, totalPages))
          }
          disabled={page === totalPages}
          className={`
            ${LightMode ? "shadow-darkSM" : "shadow-lightSM bg-black/80"}
            hidden sm:block cursor-pointer px-3 py-1 rounded-md text-sm hover:scale-103 active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:bg-blue-700 hover:text-white
            transition-all duration-300
          `}
        >
          <span>Next</span>
        </button>
      </div>


      <div className="flex flex-wrap items-center justify-center gap-16 mt-4  mb-4">
        {/* PREV */}
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`
            ${LightMode ? "shadow-darkSM text-black" : "shadow-lightSM bg-black/80 text-white"}
            sm:hidden cursor-pointer px-3 py-1 rounded-md text-sm hover:scale-103 active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:bg-blue-70
            transition-all duration-300 
          `}
        >
          <span className="sm:hidden"><ChevronLeft size={22} className="font-bold" /></span>
        </button>


        {/* NEXT */}
        <button
          onClick={() =>
            setPage((p) => Math.min(p + 1, totalPages))
          }
          disabled={page === totalPages}
          className={`
            ${LightMode ? "shadow-darkSM text-black" : "shadow-lightSM bg-black/80 text-white"}
            sm:hidden cursor-pointer px-3 py-1 rounded-md text-sm hover:scale-103 active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:bg-blue-700
            transition-all duration-300
          `}
        >
          <span className="sm:hidden"><ChevronRight size={22} className="font-bold" /></span>
        </button>
      </div>
    </>
  );
};

export default Pagination;