
import React, { useState, useEffect } from 'react';
import { TimeLeft } from '../types';

interface CountdownTimerProps {
  targetDate: Date;
  onTenSecondsLeft: () => void;
  onFinished: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onTenSecondsLeft, onFinished }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +targetDate - +new Date();
    const totalSeconds = Math.max(0, Math.floor(difference / 1000));
    
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, totalSeconds: 0 };
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
      totalSeconds
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTime = calculateTimeLeft();
      setTimeLeft(updatedTime);
      
      if (updatedTime.totalSeconds <= 10 && updatedTime.totalSeconds > 0) {
        onTenSecondsLeft();
      }
      
      if (updatedTime.isExpired) {
        clearInterval(timer);
        onFinished();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, onFinished, onTenSecondsLeft]);

  const TimeUnit = ({ label, value, accentColor, glowColor }: { label: string; value: number; accentColor: string; glowColor: string }) => (
    <div className="group relative flex flex-col items-center justify-center p-3 md:p-8 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-default hover:scale-110">
      <div className={`absolute inset-0 rounded-[1.5rem] md:rounded-[3rem] bg-white/[0.03] opacity-0 group-hover:opacity-100 backdrop-blur-xl border border-white/10 transition-all duration-700 scale-90 group-hover:scale-100 -z-10`} />
      <div className={`absolute inset-0 ${glowColor} opacity-0 group-hover:opacity-10 blur-[80px] rounded-full transition-all duration-1000`} />
      
      <div className={`text-4xl sm:text-7xl md:text-9xl font-semibold tracking-tighter tabular-nums text-white/40 transition-all duration-500 group-hover:text-white group-hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] ${accentColor}`}>
        {value.toString().padStart(2, '0')}
      </div>
      
      <div className="text-[8px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/20 mt-3 md:mt-6 font-black transition-all duration-500 group-hover:text-white group-hover:tracking-[0.5em]">
        {label}
      </div>
      
      <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full mt-4 md:mt-6 opacity-0 transition-all duration-700 group-hover:opacity-100 ${accentColor.replace('group-hover:', '')} shadow-[0_0_15px_currentColor]`} />
    </div>
  );

  return (
    <div className="flex flex-col items-center select-none w-full max-w-6xl mx-auto px-4 text-center">
      <div className="relative flex flex-col items-center mb-6 md:mb-16 w-full">
        <h2 className="text-xl sm:text-3xl md:text-5xl font-semibold tracking-tight text-center">
          <span className="opacity-20 block text-[9px] md:text-sm uppercase tracking-[0.8em] md:tracking-[1em] mb-3 md:mb-4">Journey to</span>
          <span className="text-white font-black tracking-[-0.04em] text-4xl sm:text-6xl md:text-8xl hover:scale-105 transition-transform duration-700 cursor-default block">2026</span>
        </h2>
        <div className="mt-6 md:mt-12 w-16 md:w-32 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 md:w-2 h-1.5 md:h-2 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1)] animate-pulse" />
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-1 md:gap-8 w-full animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <TimeUnit label="Days" value={timeLeft.days} accentColor="group-hover:text-blue-400" glowColor="bg-blue-500" />
        <TimeUnit label="Hours" value={timeLeft.hours} accentColor="group-hover:text-purple-400" glowColor="bg-purple-500" />
        <TimeUnit label="Minutes" value={timeLeft.minutes} accentColor="group-hover:text-pink-400" glowColor="bg-pink-500" />
        <TimeUnit label="Seconds" value={timeLeft.seconds} accentColor="group-hover:text-orange-400" glowColor="bg-orange-500" />
      </div>
    </div>
  );
};

export default CountdownTimer;
