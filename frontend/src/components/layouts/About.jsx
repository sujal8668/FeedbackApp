import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import One from "../../assets/Excited.png";
import Two from "../../assets/Happy.png";
import Three from "../../assets/Neutral.png";
import Four from "../../assets/Mad.png";
import Five from "../../assets/Sad.png";

gsap.registerPlugin(SplitText);

const About = () => {
  const containerRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const images = [One, Two, Three, Four, Five];
  const defaultLabel = "Feed Back";
  const labels = ["very clean", "clean", "average", "dirty", "very dirty",];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const activeIndex = hoverIndex === null ? "default" : hoverIndex;
      const heading = document.querySelector(`.profile-name-${activeIndex}`)?.querySelector("h1");

      if (heading) {
        const split = new SplitText(heading, { type: "chars" });
        split.chars.forEach((char) => char.classList.add("letter"));

        gsap.set(split.chars, { y: "100%" });

        gsap.to(split.chars, {
          y: "0%",
          duration: 0.75,
          ease: "power4.out",
          stagger: { each: 0.025, from: "center" },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [hoverIndex]);

  return (
    <section
      ref={containerRef}
      id="about"
      className="h-screen bg-[#0f0f0f] text-[#e3e3db] flex flex-col justify-center items-center gap-10 overflow-hidden"
      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
    >
      
      {/* Profile Images */}
      <div className="profile-images flex justify-center items-center gap-2 flex-wrap max-w-[90%]">
        {images.map((imgSrc, i) => (
          <div
            key={i}
            className="img relative p-[5px] cursor-pointer transition-all duration-300 ease-in-out"
            style={{
              width: hoverIndex === i ? "140px" : "70px",
              height: hoverIndex === i ? "140px" : "70px",
              willChange: "width, height",
            }}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <img
              src={imgSrc}
              alt={`Profile ${i}`}
              className="rounded-md w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Profile Names */}
      <div
        className="profile-names w-full h-[20rem] overflow-hidden relative"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        {/* Default label */}
        <div
          className="profile-name profile-name-default absolute w-full text-center top-0"
          style={{
            opacity: hoverIndex === null ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        >
          <h1
            className="uppercase text-[7rem] md:text-[12rem] lg:text-[20rem] font-extrabold leading-none tracking-tighter text-[#e3e3db]"
            style={{

              letterSpacing: "-0.5rem",
              position: "absolute",
              width: "100%",
              lineHeight: "1",
              userSelect: "none",
            }}
          >
            {defaultLabel}
          </h1>
        </div>

        {/* Hover labels */}
        {labels.map((label, i) => (
          <div
            key={i}
            className={`profile-name profile-name-${i} absolute w-full text-center top-0`}
            style={{
              opacity: hoverIndex === i ? 1 : 0,
              transition: "opacity 0.3s ease",
              pointerEvents: "none",
            }}
          >
            <h1
              className="uppercase text-[7rem] md:text-[12rem] lg:text-[20rem] font-extrabold leading-none tracking-tighter text-[#f93535]"
              style={{

                letterSpacing: "-0.5rem",
                position: "absolute",
                width: "100%",
                lineHeight: "1",
                userSelect: "none",
              }}
            >
              {label}
            </h1>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;
