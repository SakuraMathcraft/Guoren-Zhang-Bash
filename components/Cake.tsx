
import React from 'react';
import Lottie from 'lottie-react';
import { cakeLottieData } from '../data/cakeLottie';

interface CakeProps {
  isBlown: boolean;
}

const Cake: React.FC<CakeProps> = ({ isBlown }) => {
  return (
    <div className={`relative transition-all duration-[2000ms] ${isBlown ? 'opacity-30 grayscale-[0.6] scale-75' : 'scale-100'}`}>
      <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] flex items-center justify-center">
        <Lottie 
          animationData={cakeLottieData} 
          loop={!isBlown} 
          autoplay={!isBlown}
          className="w-full h-full"
        />
      </div>
      
      {/* Smoke overlay for blowout effect */}
      {isBlown && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-1/2 h-1/2 flex flex-wrap justify-center gap-4 opacity-50">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="w-4 h-12 bg-white/20 blur-xl rounded-full animate-smoke-rise"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes smoke-rise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(-100px) scale(3); opacity: 0; }
        }
        .animate-smoke-rise {
          animation: smoke-rise 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Cake;
