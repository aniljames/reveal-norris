import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * BikeReveal - High-end scroll-driven reveal hero section.
 * 
 * Dependencies required:
 * npm install framer-motion tailwindcss
 * 
 * Note: To achieve the perfect "masking" effect, both images should ideally
 * have the identical proportions and positioning. For true overlay magic, 
 * using transparent PNGs or perfectly matched solid backgrounds is recommended.
 */
const BikeReveal = () => {
  // Reference for the outer scroll container wrapping the 200vh section
  const containerRef = useRef(null);

  // useScroll tracks progress relative to the containerRef.
  // "start start" = top of container hits top of viewport
  // "end end" = bottom of container hits bottom of viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Animating the right inset of the mask from 0% (fully visible) to 100% (hidden).
  // This creates a right-to-left horizontal scan line wipe.
  const clipPathInset = useTransform(
    scrollYProgress, 
    [0, 1], 
    ["inset(0% 0% 0% 0%)", "inset(0% 100% 0% 0%)"]
  );
  
  // Background text parallax / fade effect for extra depth
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [0.8, 0.05]);
  const textScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Glow line position - moves from 100% (right) to 0% (left) matching the clip mask
  const scanlineLeft = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);
  // Fade in the scanline right after scroll starts, fade out right before it ends
  const scanlineOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  return (
    // Parent container provides the scrollable height.
    <div ref={containerRef} className="relative h-[200vh] bg-zinc-950 font-sans">
      
      {/* Sticky container stays in view while the user scrolls down through the parent */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Dynamic Background Typography */}
        <motion.div 
          style={{ opacity: textOpacity, scale: textScale }}
          className="absolute z-0 w-full flex justify-center pointer-events-none select-none"
        >
          <h1 className="text-[12vw] font-black text-zinc-800 tracking-tighter uppercase whitespace-nowrap">
            Engineering Precision
          </h1>
        </motion.div>

        {/* Image Content Container */}
        <div className="relative z-10 w-full max-w-7xl px-4 h-full max-h-[80vh] flex items-center justify-center">
          
          {/* 
            Layer 1: The Blueprint / Schematic 
            Positioned at the bottom, revealed as top layer masks away.
          */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <img 
              // Blueprint placeholder
              src="https://images.unsplash.com/photo-1620803450917-8e6bfed62ef5?q=80&w=2000&auto=format&fit=crop" 
              alt="Motorcycle Blueprint"
              className="w-full h-full object-cover md:object-contain opacity-50 filter grayscale contrast-150 sepia-[.2] hue-rotate-[180deg]"
            />
          </div>

          {/* 
            Layer 2: The Real Bike
            Positioned on top. The clipPath style animates to wipe it away.
          */}
          <motion.div 
            style={{ clipPath: clipPathInset }}
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
          >
            <img 
              // Realistic bike overlay placeholder
              src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2000&auto=format&fit=crop" 
              alt="Realistic Motorcycle"
              className="w-full h-full object-cover md:object-contain shadow-2xl"
            />
          </motion.div>
          
          {/* 
            Layer 3: The Scanline Holographic Effect
            A vertical laser line that explicitly marks the boundary of the transition.
          */}
          <motion.div 
            className="absolute z-20 top-0 bottom-0 w-[2px] bg-cyan-400"
            style={{ 
              left: scanlineLeft,
              opacity: scanlineOpacity,
              boxShadow: "0 0 15px 2px rgba(34, 211, 238, 0.6)"
            }}
          >
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[20px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent blur-sm hidden md:block" />
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
        >
          <span className="text-zinc-500 text-xs tracking-widest uppercase font-semibold">Scroll to scan</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-500 to-transparent" />
        </motion.div>

      </div>
    </div>
  );
};

export default BikeReveal;
