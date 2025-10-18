import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { FaChevronLeft, FaChevronRight, FaClock } from "react-icons/fa";
import { getAnnouncements } from "../api/announcementApi";
import defaultImage from "../assets/background/santol_hall.jpg";

// Memoized Navigation Arrows
const NavButton = memo(({ direction, onClick, children }) => (
  <button
    onClick={onClick}
    className={`
      opacity-100 sm:opacity-0 group-hover:opacity-100 
      transition-opacity duration-200 
      w-7 h-7 sm:w-8 sm:h-8 
      flex items-center justify-center 
      rounded-full 
      bg-black/40 hover:bg-black/60 
      text-white/90 hover:text-white 
      backdrop-blur-sm
      shadow-lg
    `}
  >
    {children}
  </button>
));

// Memoized Navigation Dots
const NavigationDots = memo(({ count, activeIndex, onDotClick }) => (
  <div className="flex justify-center items-center gap-2 mt-4">
    {Array.from({ length: count }, (_, i) => (
      <button
        key={i}
        onClick={() => onDotClick(i)}
        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
          i === activeIndex
            ? "w-6 bg-red-900"
            : "w-2 bg-gray-300 hover:bg-gray-400 hover:scale-125"
        }`}
      />
    ))}
  </div>
));

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedStates, setExpandedStates] = useState({});
  const scrollRefs = useRef({});

  const handleNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % announcements.length);
  }, [announcements.length]);

  const handlePrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  }, [announcements.length]);

  const handleDotClick = useCallback((i) => {
    setIndex(i);
  }, []);

  useEffect(() => {
    // Fetch announcements only once on mount
    let mounted = true;
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await getAnnouncements({
          per_page: 10,
          page: 1,
          sort_by: "created_at",
          order: "desc",
        });

        if (mounted && response.success && response.data.data) {
          setAnnouncements(response.data.data);
        }
      } catch (error) {
        if (mounted) {
          console.error("Failed to fetch announcements:", error);
          setAnnouncements([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAnnouncements();
    return () => {
      mounted = false;
    };
  }, []);

  // Auto-advance timer with cleanup
  useEffect(() => {
    if (announcements.length > 0 && !isPaused) {
      const timer = setInterval(handleNext, 5000);
      return () => clearInterval(timer);
    }
  }, [announcements.length, isPaused, handleNext]);

  // Add effect to reset scroll and expanded state when index changes
  useEffect(() => {
    setExpandedStates({});
    scrollRefs.current = {};
  }, [index]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getImageUrl = (announcement) => {
    if (!announcement || !announcement.images) return defaultImage;

    try {
      if (Array.isArray(announcement.images)) {
        const firstImage = announcement.images[0];
        return firstImage
          ? `${import.meta.env.VITE_API_STORAGE_URL}/${firstImage}`
          : defaultImage;
      }
      if (typeof announcement.images === "string") {
        return `${import.meta.env.VITE_API_STORAGE_URL}/${announcement.images}`;
      }
    } catch (error) {
      console.error("Error processing image URL:", error);
    }
    return defaultImage;
  };

  const TruncatedText = memo(({ text, maxLength = 200, announcementId }) => {
    const isExpanded = expandedStates[announcementId];
    const containerRef = useRef(null);
    const scrollPosRef = useRef(scrollRefs.current[announcementId] || 0);

    const handleScroll = (e) => {
      scrollPosRef.current = e.target.scrollTop;
      scrollRefs.current[announcementId] = scrollPosRef.current;
    };

    // Reset scroll position when collapsing
    useEffect(() => {
      if (!isExpanded && containerRef.current) {
        containerRef.current.scrollTop = 0;
        scrollPosRef.current = 0;
        scrollRefs.current[announcementId] = 0;
      }
    }, [isExpanded, announcementId]);

    useEffect(() => {
      if (isExpanded && containerRef.current) {
        containerRef.current.scrollTop = scrollPosRef.current;
      }
    }, [isExpanded]);

    if (!text || text.length <= maxLength) {
      return (
        <p className="text-[11px] sm:text-sm md:text-base text-gray-100 leading-relaxed break-words">
          {text}
        </p>
      );
    }

    return (
      <div className="relative">
        <div
          ref={containerRef}
          className={`${
            isExpanded
              ? "h-[100px] sm:h-[120px] md:h-[150px] overflow-y-auto custom-scrollbar"
              : "h-[40px] sm:h-[50px] md:h-[60px] overflow-hidden"
          } 
          transition-all duration-300`}
          onScroll={handleScroll}
        >
          <p className="text-[11px] sm:text-sm md:text-base text-gray-100 leading-relaxed break-words pb-6">
            {text}
          </p>
        </div>

        {/* Gradient Fade */}
        <div
          className={`
          absolute bottom-0 left-0 right-0 h-12
          bg-gradient-to-t from-black/90 to-transparent
          transition-all duration-300
        `}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpandedStates((prev) => ({
                ...prev,
                [announcementId]: !prev[announcementId],
              }));
              setIsPaused(true); // Pause carousel when expanding
            }}
            className="absolute bottom-0 left-0 text-[10px] sm:text-xs font-medium text-gray-300 hover:text-white transition-colors px-2 py-1"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        </div>
      </div>
    );
  });

  if (loading) {
    return (
      <div className="w-full max-w-[600px] aspect-[16/9] rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading announcements...</div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="w-full max-w-[600px] aspect-[16/9] rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 text-center">
        <div className="text-gray-500">No announcements available at the moment.</div>
      </div>
    );
  }

  const currentAnnouncement = announcements[index];

  return (
    <div className="w-full flex flex-col items-center space-y-4 group">
      <div className="relative w-full">
        <div className="w-full max-w-[800px] mx-auto aspect-[16/9] sm:aspect-[21/9] rounded-lg overflow-hidden shadow-lg">
          {/* Background Image */}
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500"
            style={{
              backgroundImage: `url(${getImageUrl(currentAnnouncement)})`,
              backgroundColor: "#1f2937",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent">
              {/* Content Container */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
                <div className="max-w-3xl space-y-2">
                  {/* Type Badge */}
                  <span
                    className={`
                    inline-block px-2 py-0.5 rounded-full 
                    text-[8px] sm:text-[10px] font-medium tracking-wide uppercase
                    ${
                      currentAnnouncement.type === "information"
                        ? "bg-blue-100 text-blue-900"
                        : currentAnnouncement.type === "warning"
                        ? "bg-amber-100 text-amber-900"
                        : "bg-red-100 text-red-900"
                    }
                  `}
                  >
                    {currentAnnouncement.type}
                  </span>

                  {/* Description */}
                  <div className="space-y-2">
                    <TruncatedText
                      text={currentAnnouncement.description}
                      announcementId={currentAnnouncement.id}
                    />

                    {/* Timestamp */}
                    <div className="flex items-center gap-1 mt-2 text-[9px] sm:text-[10px] md:text-xs text-gray-400">
                      <FaClock className="w-2.5 h-2.5" />
                      <span>{formatDate(currentAnnouncement.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modified Navigation Arrows - Show on all screens */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 sm:px-4">
          <NavButton direction="prev" onClick={handlePrev}>
            <FaChevronLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </NavButton>
          <NavButton direction="next" onClick={handleNext}>
            <FaChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </NavButton>
        </div>
      </div>

      {/* Dots Navigation */}
      {announcements.length > 1 && (
        <NavigationDots
          count={announcements.length}
          activeIndex={index}
          onDotClick={handleDotClick}
        />
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default memo(HeroCarousel);
