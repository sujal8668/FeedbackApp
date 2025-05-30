import React, { useState, useEffect } from "react";
import p1 from "../../assets/p1.jpg";
import p2 from "../../assets/p2.jpg";
import p3 from "../../assets/p3.jpg";
import p4 from "../../assets/p4.jpg";

const reviews = [
  {
    name: "Apalamil",
    date: "02 February",
    title: "A Cut Above Rest",
    description:
      "From start to finish, the experience was amazing. The staff was warm and attentive. I felt pampered and walked out feeling confident. Highly recommend their service!",
    image: p1,
    rating: 4,
  },
  {
    name: "John Doe",
    date: "15 March",
    title: "Excellent Service",
    description:
      "Fantastic experience! Will definitely come back again. The team is very professional and made me feel at ease.",
    image: p2,
    rating: 5,
  },
  {
    name: "Jane Smith",
    date: "20 April",
    title: "Loved Every Bit",
    description:
      "Truly exceptional! They know how to treat a customer. Warm welcome and top-notch service throughout.",
    image: p3,
    rating: 5,
  },
  {
    name: "Michael King",
    date: "05 May",
    title: "Highly Satisfied",
    description:
      "They exceeded my expectations. I walked out feeling fresh and confident. Great team!",
    image: p4,
    rating: 4,
  },
];

const ReviewCard = ({ review }) => (
  <div className="flex flex-col p-6 sm:p-7 gap-4 sm:gap-6 w-full sm:w-[500px] min-h-[270px] rounded-3xl bg-[#e3e3db] shadow-md transition-all">
    {/* Top */}
    <div className="flex items-center justify-between flex-wrap md:flex-nowrap">
      <div className="flex items-center gap-3">
        <img
          src={review.image}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
          alt={review.name}
        />
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg sm:text-2xl font-medium text-black">{review.name}</h1>
          <p className="text-gray-700 text-sm">{review.date}</p>
        </div>
      </div>
      <div className="text-yellow-500 text-lg">
        {[...Array(review.rating)].map((_, i) => (
          <i key={i} className="ri-star-fill"></i>
        ))}
      </div>
    </div>
    {/* Bottom */}
    <div className="w-full">
      <h1 className="text-base sm:text-lg font-medium">{review.title}</h1>
      <p className="text-gray-800 text-sm sm:text-base">{review.description}</p>
    </div>
  </div>
);

const Review = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);

  // Adjust number of visible cards based on screen size
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else {
        setVisibleCount(2);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      prev + visibleCount < reviews.length ? prev + 1 : prev
    );
  };

  const visibleReviews = reviews.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e3e3db] flex items-center px-4 py-10">
      <div className="w-full flex flex-col items-center gap-20 md:gap-32">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-center">
          Our happy clients
        </h1>

        <div className="flex items-center justify-between gap-4 w-full max-w-7xl">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="text-3xl disabled:opacity-30 text-white"
          >
            <i className="ri-arrow-left-double-line"></i>
          </button>

          <div className="flex justify-center items-stretch gap-4 w-full overflow-hidden">
            {visibleReviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={startIndex + visibleCount >= reviews.length}
            className="text-3xl disabled:opacity-30 text-white"
          >
            <i className="ri-arrow-right-double-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
