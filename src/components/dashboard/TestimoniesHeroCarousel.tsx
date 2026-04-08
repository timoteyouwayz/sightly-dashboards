import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Testimonial {
  name: string;
  location: string;
  statement: string;
  image: string;
  fullStory: string;
}

interface TestimoniesHeroCarouselProps {
  testimonials: Testimonial[];
  autoPlayInterval?: number;
  onReadMore?: (testimonial: Testimonial) => void;
}

export function TestimoniesHeroCarousel({ 
  testimonials, 
  autoPlayInterval = 7000,
  onReadMore
}: TestimoniesHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const maxIndex = testimonials.length - 1;

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
    }),
    center: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    }),
  };

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (newDirection > 0) {
        return prev === maxIndex ? 0 : prev + 1;
      } else {
        return prev === 0 ? maxIndex : prev - 1;
      }
    });
  }, [maxIndex]);

  useEffect(() => {
    const interval = setInterval(() => paginate(1), autoPlayInterval);
    return () => clearInterval(interval);
  }, [paginate, autoPlayInterval]);

  const current = testimonials[currentIndex];

  return (
    <section className="relative w-full overflow-hidden">
      <div className="space-y-6">
        <div className="relative h-[420px] sm:h-[500px] md:h-[560px] overflow-hidden rounded-[32px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={`bg-${currentIndex}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <img
                src={current.image}
                alt={current.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 px-4 pb-6 md:px-8 md:pb-8">
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.7 }}
                  className="mx-auto max-w-3xl p-6"
                >
                  <div className="flex flex-col gap-3">
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em] text-sky-200"
                    >
                      <span>{current.location}</span>
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="text-2xl sm:text-3xl font-semibold text-white"
                    >
                      {current.name}
                    </motion.h3>

                    <motion.blockquote
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-1 border-l-4 border-sky-400/80 pl-4 text-lg sm:text-xl font-light text-white italic"
                    >
                      "{current.statement}"
                    </motion.blockquote>

                    <motion.p
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      className="mt-4 text-sm leading-6 text-slate-200"
                    >
                      {current.fullStory}
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={() => paginate(-1)}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors backdrop-blur-sm"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          
          <button
            onClick={() => paginate(1)}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors backdrop-blur-sm"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2 px-4">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`transition-all rounded-full ${
                  index === currentIndex
                    ? 'bg-white w-8 h-2'
                    : 'bg-white/50 w-2 h-2 hover:bg-white/70'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
