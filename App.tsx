
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AppState } from './types';
import CountdownTimer from './components/CountdownTimer';
import Cake from './components/Cake';
import VinylRecord from './components/VinylRecord';
import Lottie from 'lottie-react';
import { audioService } from './services/AudioService';
import { giftLottieData } from './data/giftLottie';
import { Mic, FlaskConical, Sparkles, Timer, Heart, Users, ChevronLeft } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.COUNTDOWN);
  const [targetDate] = useState(new Date('2026-01-01T00:00:00'));
  const [finalSeconds, setFinalSeconds] = useState(10);
  const [showLetters, setShowLetters] = useState(false);
  const [showBirthday, setShowBirthday] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [isBlown, setIsBlown] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showFriends, setShowFriends] = useState(false);

  // Mouse interaction state for text
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // Big Countdown Logic & Sound
  useEffect(() => {
    let interval: number;
    if (appState === AppState.FINAL_COUNTDOWN) {
      interval = window.setInterval(() => {
        setFinalSeconds((prev) => {
          audioService.playCountdownTick(prev === 1);
          if (prev <= 1) {
            clearInterval(interval);
            setAppState(AppState.CAKE_REVEAL);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const startTestMode = () => setAppState(AppState.CAKE_REVEAL);
  const startFinalPreview = () => {
    audioService.init();
    setFinalSeconds(10);
    setAppState(AppState.FINAL_COUNTDOWN);
  };

  const handleCountdownFinished = useCallback(() => {
    setAppState(AppState.CAKE_REVEAL);
  }, []);

  const handleTenSecondsLeft = useCallback(() => {
    if (appState === AppState.COUNTDOWN) {
      setAppState(AppState.FINAL_COUNTDOWN);
    }
  }, [appState]);

  const handleBlowing = useCallback(() => {
    setIsBlown(true);
    setAppState(AppState.BLOWN);
    audioService.playTrack(0);
    // Smooth sequence
    setTimeout(() => setShowLetters(true), 500);
    setTimeout(() => setShowBirthday(true), 2500);
  }, []);

  const startMic = async () => {
    setMicActive(true);
    await audioService.startMicMonitoring(handleBlowing);
  };

  const handleBack = () => {
    // Immediate state cleanup to prevent ghosts
    setShowLetters(false);
    setShowBirthday(false);
    setShowFriends(false);
    audioService.stop();

    if (appState === AppState.BLOWN) {
      setIsBlown(false);
      setMicActive(false);
      setAppState(AppState.CAKE_REVEAL);
    } else if (appState === AppState.CAKE_REVEAL) {
      setAppState(AppState.COUNTDOWN);
      setMicActive(false);
    } else if (appState === AppState.FINAL_COUNTDOWN) {
      setAppState(AppState.COUNTDOWN);
      setFinalSeconds(10);
    }
  };

  const changeTrack = (index: number) => {
    setCurrentTrack(index);
    audioService.playTrack(index);
  };

  const companions = ["Zhengyu Xu", "Zhiheng Du", "Yang Zheng"];

  const particles = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${Math.random() * 5 + 5}s`,
      size: Math.random() * 10 + 4,
      type: i % 3 === 0 ? 'snow' : 'ribbon',
      color: ['#FFFFFF', '#60A5FA', '#F472B6', '#FBBF24', '#34D399', '#A78BFA'][Math.floor(Math.random() * 6)]
    }));
  }, []);

  const tiltStyle = {
    '--mouse-x': `${mousePos.x}%`,
    '--mouse-y': `${mousePos.y}%`,
    transform: `perspective(1000px) rotateX(${(mousePos.y - 50) * -0.25}deg) rotateY(${(mousePos.x - 50) * 0.25}deg)`,
  } as React.CSSProperties;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`min-h-screen transition-all duration-[3000ms] ${isBlown ? 'bg-[#00000a]' : 'bg-[#030303]'} flex flex-col items-center relative px-6 overflow-x-hidden overflow-y-auto pb-48 md:pb-64`}
    >
      
      {/* Back Button */}
      {appState !== AppState.COUNTDOWN && (
        <button 
          onClick={handleBack}
          className="fixed top-6 left-6 z-[100] p-3 md:p-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all duration-500 hover:scale-110 active:scale-90 group animate-in fade-in slide-in-from-left-4"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-x-1" />
        </button>
      )}

      {/* Atmosphere Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-900/15 blur-[180px] rounded-full animate-pulse transition-opacity duration-3000 ${appState !== AppState.COUNTDOWN ? 'opacity-100' : 'opacity-40'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-purple-900/15 blur-[180px] rounded-full animate-pulse transition-opacity duration-3000 ${appState !== AppState.COUNTDOWN ? 'opacity-100' : 'opacity-40'}`} style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      {/* Confetti & Snow Particles */}
      {isBlown && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {particles.map((p) => (
            <div 
              key={p.id} 
              className={`absolute top-[-100px] ${p.type === 'snow' ? 'rounded-full' : 'rounded-sm'} ${p.type === 'snow' ? 'animate-fall-snow' : 'animate-fall-ribbon'}`}
              style={{
                left: p.left,
                width: p.type === 'snow' ? `${p.size}px` : `${p.size * 0.4}px`,
                height: p.type === 'snow' ? `${p.size}px` : `${p.size * 1.5}px`,
                backgroundColor: p.type === 'snow' ? '#FFFFFF' : p.color,
                animationDelay: p.delay,
                animationDuration: p.duration,
                opacity: p.type === 'snow' ? 0.35 : 0.7,
                filter: p.type === 'snow' ? 'blur(1px)' : 'none',
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center pt-8">
        
        {appState === AppState.COUNTDOWN && (
          <div className="w-full flex flex-col items-center animate-ios-entry text-center">
            <CountdownTimer 
              targetDate={targetDate} 
              onTenSecondsLeft={handleTenSecondsLeft}
              onFinished={handleCountdownFinished} 
            />
            <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-3">
              <button 
                onClick={startFinalPreview}
                className="group relative px-5 py-2.5 md:px-10 md:py-4 bg-white/5 border border-white/10 rounded-full text-[9px] md:text-[11px] tracking-[0.15em] uppercase font-black text-white/30 hover:text-white/80 hover:bg-white/10 transition-all duration-700 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <div className="relative flex items-center gap-2">
                  <Timer className="w-3 h-3 md:w-3.5 md:h-3.5 transition-transform group-hover:rotate-12" />
                  <span>Final 10s Preview</span>
                </div>
              </button>
              <button 
                onClick={startTestMode}
                className="group relative px-5 py-2.5 md:px-10 md:py-4 bg-white/5 border border-white/10 rounded-full text-[9px] md:text-[11px] tracking-[0.15em] uppercase font-black text-white/30 hover:text-white/80 hover:bg-white/10 transition-all duration-700 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <div className="relative flex items-center gap-2">
                  <FlaskConical className="w-3 h-3 md:w-3.5 md:h-3.5 transition-transform group-hover:rotate-12" />
                  <span>Simulate Arrival</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {appState === AppState.FINAL_COUNTDOWN && (
          <div className="flex flex-col items-center justify-center animate-in fade-in duration-500 w-full text-center">
            <div 
              key={finalSeconds}
              className="text-[12rem] sm:text-[18rem] md:text-[25rem] font-black tabular-nums tracking-tighter animate-big-timer text-white drop-shadow-[0_0_80px_rgba(255,255,255,0.4)]"
            >
              {finalSeconds}
            </div>
            <div className="text-sm md:text-xl font-bold tracking-[0.5em] md:tracking-[0.8em] uppercase opacity-30 animate-pulse mt-[-2rem] md:mt-[-4rem] px-4">
              Seconds to 2026
            </div>
          </div>
        )}

        {(appState === AppState.CAKE_REVEAL || appState === AppState.BLOWN) && (
          <div className="w-full flex flex-col items-center relative h-full justify-center min-h-[450px]">
            {/* Cake element moves down when blown to make space for text */}
            <div className={`transition-all duration-[2500ms] ease-ios ${isBlown ? 'translate-y-32 scale-[0.6] opacity-10 blur-[20px] pointer-events-none' : 'translate-y-[-18%] scale-75 md:scale-[0.67]'}`}>
              <Cake isBlown={isBlown} />
            </div>

            {appState === AppState.CAKE_REVEAL && !isBlown && (
              <div className="absolute bottom-[8vh] md:bottom-[-20px] left-0 right-0 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 z-[70] pointer-events-none">
                {!micActive ? (
                   <button 
                    onClick={startMic}
                    className="group relative px-10 py-5 md:px-20 md:py-8 bg-white text-black text-[12px] md:text-[14px] tracking-[0.5em] font-black rounded-full overflow-hidden transition-all duration-500 hover:scale-110 hover:-translate-y-2 active:scale-95 flex items-center gap-4 shadow-[0_20px_60px_-15px_rgba(255,255,255,0.5)] pointer-events-auto"
                   >
                     <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 -translate-x-full group-hover:animate-shimmer" />
                     <Mic className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6" />
                     <span className="relative z-10">START SENSORS</span>
                   </button>
                ) : (
                  <div className="flex flex-col items-center bg-black/60 backdrop-blur-3xl border border-white/10 px-10 py-6 md:px-16 md:py-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl animate-pulse ring-1 ring-white/5 pointer-events-auto">
                    <span className="text-xl md:text-3xl font-black tracking-[0.2em] text-white text-center">Blow Gently</span>
                    <div className="mt-5 flex gap-3">
                       {[...Array(5)].map((_, i) => (
                         <div key={i} className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-full bg-blue-400/70 shadow-[0_0_20px_#60A5FA]" style={{ animation: `pulse-scale 1.2s infinite ${i * 0.15}s` }} />
                       ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Celebration Text Container */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50 overflow-visible text-center pb-[5vh] md:pb-0 md:scale-50`}>
              <div className={`flex flex-col items-center transition-all duration-[1500ms] ease-ios ${showBirthday ? 'translate-y-[-4vh] md:translate-y-[-15vh]' : 'translate-y-[12vh] md:translate-y-0'}`}>
                
                {/* Hello 2026! */}
                <div 
                  className={`group transition-all duration-1000 ease-ios pointer-events-auto cursor-default px-4 
                    ${showLetters ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-90 blur-2xl'}
                  `} 
                  style={tiltStyle}
                >
                  <h1 className="interactive-text text-5xl sm:text-8xl md:text-[15rem] font-artistic text-white leading-none tracking-tight transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_40px_rgba(255,255,255,0.8)]">
                    Hello 2026!
                  </h1>
                </div>
                
                {/* Birthday Text */}
                <div 
                  className={`group mt-4 md:mt-12 flex flex-col items-center transition-all duration-[1200ms] ease-ios pointer-events-auto cursor-default px-4 
                    ${showBirthday ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-20 blur-xl'}
                  `} 
                  style={tiltStyle}
                >
                  <h2 className="interactive-text text-2xl sm:text-5xl md:text-8xl font-elegant italic text-white/95 leading-tight max-w-6xl transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_0_35px_rgba(255,255,255,0.7)]">
                    Happy Birthday, Guoren Zhang!
                  </h2>

                  {!showFriends && (
                    <div className="mt-2 mb-2 md:mt-8 md:mb-8 flex items-center gap-6 md:gap-16 opacity-40 transition-opacity duration-700">
                      <div className="h-[1px] w-12 md:w-48 bg-gradient-to-r from-transparent via-white to-transparent" />
                      <Sparkles className="w-6 h-6 md:w-16 md:h-16 text-yellow-100 animate-pulse" />
                      <div className="h-[1px] w-12 md:w-48 bg-gradient-to-l from-transparent via-white to-transparent" />
                    </div>
                  )}
                  
                  {/* Companion Card */}
                  <div className={`mt-4 md:mt-12 transition-all duration-1000 ${showFriends ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}>
                    <div className="relative group/card">
                       <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 blur-[50px] opacity-50 animate-pulse" />
                       <div className="relative px-8 py-6 md:px-16 md:py-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_80px_rgba(0,0,0,0.5)] hover:bg-white/10 hover:scale-105 hover:border-white/20 transition-all duration-700 cursor-pointer group">
                          <div className="flex items-center justify-center gap-4 mb-3 md:mb-6">
                            <Users className="w-4 h-4 md:w-5 md:h-5 text-white/40 group-hover:text-white transition-colors" />
                            <span className="text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.5em] uppercase font-bold text-white/30 group-hover:text-white/60">Companion Circle</span>
                            <Users className="w-4 h-4 md:w-5 md:h-5 text-white/40 group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-12">
                            {companions.map((name) => (
                              <div key={name} className="flex flex-col items-center">
                                <span className="text-xl md:text-4xl font-elegant italic text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-all">
                                  {name}
                                </span>
                                <div className="w-0 h-[1px] bg-white/30 group-hover:w-full transition-all duration-1000 mt-1" />
                              </div>
                            ))}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[2rem] md:rounded-[3rem] pointer-events-none" />
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gift Lottie Area */}
      {isBlown && (
         <div className="absolute bottom-[40px] md:bottom-[60px] left-1/2 -translate-x-1/2 flex flex-col items-center z-40">
           <div 
             onClick={() => setShowFriends(!showFriends)}
             className="w-[140px] h-[140px] md:w-[200px] md:h-[200px] cursor-pointer group animate-in zoom-in slide-in-from-bottom-10 duration-[2500ms] relative"
           >
             <div className="absolute inset-0 bg-white/0 rounded-full group-hover:bg-white/5 transition-colors duration-500 scale-110" />
             <Lottie 
               animationData={giftLottieData}
               loop={true}
               className="w-full h-full drop-shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-4"
             />
             {!showFriends && (
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full animate-bounce shadow-xl">
                  <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-white/80 whitespace-nowrap">Check Companions</span>
               </div>
             )}
           </div>
         </div>
      )}

      {/* Footer */}
      <footer className={`fixed bottom-6 left-0 right-0 flex justify-center transition-all duration-2000 ${appState !== AppState.COUNTDOWN ? 'opacity-50' : 'opacity-15'} z-50 pointer-events-none`}>
        <div className="flex items-center gap-6 px-8 py-2.5 bg-white/5 backdrop-blur-3xl border border-white/5 rounded-full shadow-2xl">
           <span className="text-[9px] md:text-[11px] tracking-[0.4em] md:tracking-[0.8em] uppercase font-black text-white/80 text-center">A New Journey in 2026</span>
        </div>
      </footer>

      {isBlown && (
        <VinylRecord 
          isPlaying={true} 
          onTrackChange={changeTrack} 
        />
      )}

      <style>{`
        .ease-ios { transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1); }
        
        .interactive-text {
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), text-shadow 0.5s ease-out, opacity 1s, filter 1s;
          text-shadow: 0 0 40px rgba(255,255,255,0.1);
          position: relative;
          will-change: transform, text-shadow, opacity, filter;
        }

        .interactive-text::after {
          content: '';
          position: absolute;
          inset: -150px;
          background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.15) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.8s;
          pointer-events: none;
          z-index: -1;
        }

        .group:hover .interactive-text::after {
          opacity: 1;
        }

        @keyframes fall-snow {
          0% { transform: translateY(-10vh) translateX(0) rotate(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(110vh) translateX(20px) rotate(360deg); opacity: 0; }
        }

        @keyframes fall-ribbon {
          0% { transform: translateY(-10vh) translateX(0) rotate(0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(110vh) translateX(-30px) rotate(720deg); opacity: 0; }
        }

        .animate-fall-snow {
          animation: fall-snow 10s linear infinite;
          will-change: transform, opacity;
        }

        .animate-fall-ribbon {
          animation: fall-ribbon 7s linear infinite;
          will-change: transform, opacity;
        }

        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;
