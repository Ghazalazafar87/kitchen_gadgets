import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ProductTutorial } from '../types';

interface InteractiveVideoPlayerProps {
  tutorial: ProductTutorial;
  productName: string;
  posterImage?: string;
}

export const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({
  tutorial,
  productName,
  posterImage,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [useSimulatedMode, setUseSimulatedMode] = useState(!tutorial.videoUrl);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSteps = tutorial.steps.length;

  // Simulation timer for dynamic video clip playback
  useEffect(() => {
    let interval: any;
    if (isPlaying && useSimulatedMode) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          const next = prev + 1.2;
          const nextStep = Math.min(
            totalSteps - 1,
            Math.floor((next / 100) * totalSteps)
          );
          setCurrentStepIndex(nextStep);
          return next;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, useSimulatedMode, totalSteps]);

  const handlePlayPause = () => {
    if (progress >= 100) {
      setProgress(0);
      setCurrentStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setProgress(0);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handleSeek = (newProgress: number) => {
    setProgress(newProgress);
    const stepIdx = Math.min(
      totalSteps - 1,
      Math.floor((newProgress / 100) * totalSteps)
    );
    setCurrentStepIndex(stepIdx);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative rounded-xl overflow-hidden bg-stone-950 border border-stone-800 shadow-xl group text-white"
    >
      {/* Video Mode Selector Tabs */}
      {tutorial.videoUrl && (
        <div className="absolute top-3 right-3 z-30 flex items-center bg-black/70 backdrop-blur-md rounded-lg p-0.5 border border-white/10 text-[11px]">
          <button
            onClick={() => {
              setUseSimulatedMode(false);
              setIsPlaying(false);
            }}
            className={`px-2.5 py-1 rounded transition-colors ${
              !useSimulatedMode 
                ? 'bg-[#2D5A46] text-white font-semibold' 
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Video Stream
          </button>
          <button
            onClick={() => {
              setUseSimulatedMode(true);
              setIsPlaying(true);
            }}
            className={`px-2.5 py-1 rounded transition-colors ${
              useSimulatedMode 
                ? 'bg-[#2D5A46] text-white font-semibold' 
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Interactive Clip Demo
          </button>
        </div>
      )}

      {/* Main Video Screen */}
      <div className="relative aspect-16/9 w-full bg-stone-900 flex items-center justify-center overflow-hidden">
        {!useSimulatedMode && tutorial.videoUrl ? (
          /* Real Video Stream Embed (Responsive iframe) */
          <iframe
            src={`${tutorial.videoUrl}?autoplay=0&rel=0&modestbranding=1`}
            title={tutorial.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          /* Interactive Animated Video Clip Studio */
          <div className="relative w-full h-full flex flex-col justify-between p-6">
            {/* Background Visualizer with ambient motion */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 filter brightness-40"
              style={{ 
                backgroundImage: posterImage ? `url(${posterImage})` : undefined,
                transform: isPlaying ? 'scale(1.05)' : 'scale(1)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

            {/* Top Bar: Title & Duration */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
                  Step-by-Step Demo Clip
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-xs font-mono text-stone-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{tutorial.duration}</span>
              </div>
            </div>

            {/* Center Stage: Active Step Content */}
            <div className="relative z-10 max-w-lg mx-auto text-center space-y-3 my-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <span>Phase {currentStepIndex + 1} of {totalSteps}</span>
              </div>

              <h4 className="text-base sm:text-lg lg:text-xl font-serif font-bold text-white tracking-wide leading-snug drop-shadow-md">
                {tutorial.steps[currentStepIndex]}
              </h4>

              <p className="text-xs text-stone-300 max-w-md mx-auto line-clamp-2">
                💡 <em>Pro Chef Tip:</em> {tutorial.quickTips[currentStepIndex % tutorial.quickTips.length]}
              </p>
            </div>

            {/* Bottom: Chapter Indicators & Progress Scrub Bar */}
            <div className="relative z-10 space-y-2 pt-2">
              <div className="grid grid-cols-4 gap-1.5">
                {tutorial.steps.map((st, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const targetProgress = (i / totalSteps) * 100;
                      handleSeek(targetProgress);
                    }}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i <= currentStepIndex
                        ? 'bg-emerald-400'
                        : 'bg-white/20 hover:bg-white/40'
                    }`}
                    title={`Jump to Step ${i + 1}`}
                  />
                ))}
              </div>

              {/* Progress Bar with Slider */}
              <div className="flex items-center gap-3 text-xs font-mono text-stone-400">
                <button
                  onClick={handlePlayPause}
                  className="p-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 transition-colors shadow-sm"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <div className="flex-1 relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRestart}
                    className="p-1 text-stone-400 hover:text-white transition-colors"
                    title="Restart Clip"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 text-stone-400 hover:text-white transition-colors"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-1 text-stone-400 hover:text-white transition-colors"
                    title="Fullscreen"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-3.5 h-3.5" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tutorial Summary Bar underneath player */}
      <div className="p-3.5 bg-stone-900 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-stone-400 block text-[11px]">Demonstration Topic</span>
          <strong className="text-white font-medium">{tutorial.title}</strong>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>HD Cooking Demonstration</span>
          </span>
        </div>
      </div>
    </div>
  );
};
