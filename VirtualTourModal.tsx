import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  RotateCw,
  Play,
  Pause,
  Compass,
  Volume2,
  VolumeX,
  Flame,
  Sparkles,
  Calendar,
  Tag,
  Info,
  Layers,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ShieldCheck,
  Zap,
  Activity,
  Gauge
} from 'lucide-react';
import { HeroVehicle } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getVehiclePriceEstimate, formatINR } from '../utils/finance';
import { getVehicleTourHotspots, VehicleTourHotspot } from '../data/tourHotspots';
import { engineAudio, getEngineTypeForVehicle } from '../utils/engineAudio';

interface VirtualTourModalProps {
  vehicle: HeroVehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onContactBestPrice: (vehicle: HeroVehicle) => void;
  onViewDetails: (vehicle: HeroVehicle) => void;
}

type StudioEnvironment = 'showroom' | 'neon' | 'sunset';

export const VirtualTourModal: React.FC<VirtualTourModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onContactBestPrice,
  onViewDetails,
}) => {
  const { language } = useLanguage();

  // Rotation state (0 to 359 degrees)
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [rotationDirection, setRotationDirection] = useState<1 | -1>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartAngle, setDragStartAngle] = useState<number>(0);

  // Customization state
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedEnv, setSelectedEnv] = useState<StudioEnvironment>('showroom');
  const [activeHotspot, setActiveHotspot] = useState<VehicleTourHotspot | null>(null);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);

  // Audio simulation state
  const [isEngineRunning, setIsEngineRunning] = useState<boolean>(false);
  const [currentRpm, setCurrentRpm] = useState<number>(0);
  const [isRevving, setIsRevving] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const autoRotateTimerRef = useRef<number | null>(null);

  // Reset when vehicle changes or modal opens
  useEffect(() => {
    if (vehicle) {
      setRotationAngle(0);
      setIsAutoRotating(true);
      setSelectedColor(vehicle.specs.colours[0] || 'Official Hero Livery');
      setActiveHotspot(null);
      setIsEngineRunning(false);
      engineAudio.stopEngine();
    }
    return () => {
      engineAudio.stopEngine();
    };
  }, [vehicle, isOpen]);

  // Subscribe to RPM updates from audio synthesizer
  useEffect(() => {
    const unsubscribe = engineAudio.subscribeRpm((rpm) => {
      setCurrentRpm(rpm);
    });
    return () => {
      unsubscribe();
      engineAudio.stopEngine();
    };
  }, []);

  // Auto-rotation turntable loop
  useEffect(() => {
    if (isAutoRotating && !isDragging) {
      autoRotateTimerRef.current = window.setInterval(() => {
        setRotationAngle((prev) => (prev + rotationDirection * 0.75 + 360) % 360);
      }, 30);
    } else {
      if (autoRotateTimerRef.current) {
        clearInterval(autoRotateTimerRef.current);
        autoRotateTimerRef.current = null;
      }
    }
    return () => {
      if (autoRotateTimerRef.current) {
        clearInterval(autoRotateTimerRef.current);
      }
    };
  }, [isAutoRotating, isDragging, rotationDirection]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        setIsAutoRotating(false);
        setRotationAngle((prev) => (prev - 10 + 360) % 360);
      } else if (e.key === 'ArrowRight') {
        setIsAutoRotating(false);
        setRotationAngle((prev) => (prev + 10 + 360) % 360);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoRotating((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    engineAudio.stopEngine();
    setIsEngineRunning(false);
    onClose();
  };

  // Drag interaction handlers (Mouse & Touch)
  const handlePointerDown = (clientX: number) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setDragStartX(clientX);
    setDragStartAngle(rotationAngle);
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartX;
    const sensitivity = 0.5; // degrees per pixel
    const newAngle = (dragStartAngle + deltaX * sensitivity + 3600) % 360;
    setRotationAngle(Math.round(newAngle));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const setCardinalAngle = (targetDeg: number) => {
    setIsAutoRotating(false);
    setRotationAngle(targetDeg % 360);
  };

  // Hotspots for this vehicle
  const hotspots = useMemo(() => {
    if (!vehicle) return [];
    return getVehicleTourHotspots(vehicle);
  }, [vehicle]);

  // Determine which hotspots are currently in visual range of the camera
  const visibleHotspots = useMemo(() => {
    if (!showHotspots) return [];
    return hotspots.filter((h) => {
      if (h.angleMin <= h.angleMax) {
        return rotationAngle >= h.angleMin && rotationAngle <= h.angleMax;
      } else {
        // Wraps around 360 (e.g. 315 to 45)
        return rotationAngle >= h.angleMin || rotationAngle <= h.angleMax;
      }
    });
  }, [hotspots, rotationAngle, showHotspots]);

  // Audio controls
  const toggleEngineAudio = async () => {
    if (!vehicle) return;
    if (isEngineRunning) {
      engineAudio.stopEngine();
      setIsEngineRunning(false);
    } else {
      const type = getEngineTypeForVehicle(vehicle.category, vehicle.id, vehicle.specs.engine);
      const success = await engineAudio.startEngine(type);
      if (success) {
        setIsEngineRunning(true);
      }
    }
  };

  const handleRevThrottle = () => {
    if (!vehicle) return;
    setIsRevving(true);
    const type = getEngineTypeForVehicle(vehicle.category, vehicle.id, vehicle.specs.engine);
    engineAudio.revEngine(type);
    setTimeout(() => setIsRevving(false), 1400);
  };

  if (!isOpen || !vehicle) return null;

  const pricing = getVehiclePriceEstimate(vehicle);

  // Compute 3D Perspective and Visual Lighting based on rotation angle
  // Normalized angle between 0 and 360
  const normAngle = ((rotationAngle % 360) + 360) % 360;
  
  // Turntable perspective math:
  // As the bike rotates around Y-axis, we calculate:
  // - rotation transform
  // - side mirror flip when viewing from the reverse angle (90 to 270)
  // - dynamic shadow offset and skewing
  const rad = (normAngle * Math.PI) / 180;
  const shadowOffsetX = Math.sin(rad) * 45;
  const shadowScaleX = 0.85 + Math.abs(Math.cos(rad)) * 0.25;
  const shadowOpacity = 0.65 + Math.abs(Math.sin(rad)) * 0.25;

  // Perspective compression along the Z axis
  const scaleZ = Math.cos(rad);
  const isFacingRight = normAngle >= 0 && normAngle < 180;
  const viewPerspectiveSkew = Math.sin(rad) * 6; // subtle tilt angle

  // Determine angle label description
  const getAngleLabel = (deg: number) => {
    const d = Math.round(deg) % 360;
    if (d >= 340 || d < 20) return language === 'hi' ? 'सामने का व्यू (0° Front)' : 'Frontal View (0°)';
    if (d >= 20 && d < 70) return language === 'hi' ? 'दायां सामने का 3/4 व्यू (45° Right)' : 'Front-Right 3/4 View';
    if (d >= 70 && d < 110) return language === 'hi' ? 'दायां साइड प्रोफाइल (90° Profile)' : 'Right Side Profile (90°)';
    if (d >= 110 && d < 160) return language === 'hi' ? 'दायां पिछला 3/4 व्यू (135°)' : 'Rear-Right 3/4 View';
    if (d >= 160 && d < 200) return language === 'hi' ? 'पिछला व्यू (180° Rear)' : 'Direct Rear View (180°)';
    if (d >= 200 && d < 250) return language === 'hi' ? 'बायां पिछला 3/4 व्यू (225°)' : 'Rear-Left 3/4 View';
    if (d >= 250 && d < 290) return language === 'hi' ? 'बायां साइड प्रोफाइल (270° Profile)' : 'Left Side Profile (270°)';
    return language === 'hi' ? 'बायां सामने का 3/4 व्यू (315°)' : 'Front-Left 3/4 View';
  };

  // Studio lighting background gradient
  const getStudioBackground = () => {
    if (selectedEnv === 'neon') {
      return 'radial-gradient(ellipse at 50% 30%, #151025 0%, #080811 60%, #030306 100%)';
    }
    if (selectedEnv === 'sunset') {
      return 'radial-gradient(ellipse at 50% 30%, #2a150c 0%, #140b07 60%, #050302 100%)';
    }
    // Default Showroom daylight
    return 'radial-gradient(ellipse at 50% 25%, #222222 0%, #111111 55%, #080808 100%)';
  };

  const getStudioAccentGlow = () => {
    if (selectedEnv === 'neon') return 'rgba(0, 255, 170, 0.25)';
    if (selectedEnv === 'sunset') return 'rgba(255, 120, 40, 0.25)';
    return 'rgba(214, 24, 31, 0.28)'; // Hero Red
  };

  return (
    <AnimatePresence>
      <div
        id="virtual-tour-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-xl overflow-y-auto select-none"
        onClick={handleClose}
      >
        <motion.div
          id="virtual-tour-modal-container"
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl bg-[#0c0c0c] border border-white/15 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden my-auto max-h-[96vh] flex flex-col"
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#080808] z-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F]">
                <RotateCw className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white font-['Rajdhani'] uppercase tracking-wider">
                    {vehicle.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-[#D6181F] text-white">
                    360° TOUR
                  </span>
                  {vehicle.category === 'ev' && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40">
                      EV
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400">
                  {language === 'hi'
                    ? '360° इंटरैक्टिव वर्चुअल शोरूम • ड्रैग करके किसी भी कोण से देखें'
                    : 'Interactive 360° Showroom Experience • Drag to inspect engineering & design'}
                </p>
              </div>
            </div>

            {/* Right: Studio controls & Close */}
            <div className="flex items-center gap-2">
              {/* Hotspot Toggle */}
              <button
                id="tour-btn-toggle-hotspots"
                type="button"
                onClick={() => setShowHotspots((prev) => !prev)}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors border cursor-pointer ${
                  showHotspots
                    ? 'bg-[#D6181F]/20 text-[#D6181F] border-[#D6181F]/40'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                }`}
                title="Toggle feature inspection hotspots"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'हॉटस्पॉट' : 'Hotspots'}</span>
              </button>

              {/* Engine Audio Synthesizer */}
              <button
                id="tour-btn-engine-audio"
                type="button"
                onClick={toggleEngineAudio}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  isEngineRunning
                    ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/30'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
                title={isEngineRunning ? 'Stop Engine Audio' : 'Start Engine Sound'}
              >
                {isEngineRunning ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span className="hidden xs:inline">{language === 'hi' ? 'इंजन चालू' : 'Engine On'}</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                    <span className="hidden xs:inline">{language === 'hi' ? 'इंजन ध्वनि' : 'Engine Sound'}</span>
                  </>
                )}
              </button>

              <button
                id="tour-btn-close-modal"
                type="button"
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close virtual tour"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Interactive 3D Turntable Stage */}
          <div
            ref={stageRef}
            id="tour-interactive-stage"
            style={{ background: getStudioBackground() }}
            onMouseDown={(e) => handlePointerDown(e.clientX)}
            onMouseMove={(e) => handlePointerMove(e.clientX)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={(e) => {
              if (e.touches[0]) handlePointerDown(e.touches[0].clientX);
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) handlePointerMove(e.touches[0].clientX);
            }}
            onTouchEnd={handlePointerUp}
            className={`relative flex-1 min-h-[340px] sm:min-h-[420px] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 cursor-grab ${
              isDragging ? 'cursor-grabbing' : ''
            }`}
          >
            {/* Showroom Overhead Spotlights */}
            <div
              className="absolute top-0 inset-x-0 h-48 pointer-events-none opacity-40 blur-3xl"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${getStudioAccentGlow()} 0%, transparent 70%)`
              }}
            />

            {/* Top Stage Overlay: Angle Counter & Preset Cardinal Views */}
            <div className="absolute top-4 inset-x-4 sm:inset-x-6 flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <Compass className="w-3.5 h-3.5 text-[#D6181F]" />
                <span className="text-xs font-mono font-bold text-white">
                  {Math.round(rotationAngle)}°
                </span>
                <span className="text-[10px] text-gray-400 font-medium border-l border-white/15 pl-2">
                  {getAngleLabel(rotationAngle)}
                </span>
              </div>

              {/* Cardinal Preset View Buttons */}
              <div className="hidden sm:flex items-center gap-1.5 pointer-events-auto bg-black/60 backdrop-blur-md p-1 rounded-lg border border-white/10 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setCardinalAngle(0)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    Math.round(rotationAngle) === 0 ? 'bg-[#D6181F] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  0° Front
                </button>
                <button
                  type="button"
                  onClick={() => setCardinalAngle(90)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    Math.round(rotationAngle) === 90 ? 'bg-[#D6181F] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  90° Right
                </button>
                <button
                  type="button"
                  onClick={() => setCardinalAngle(180)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    Math.round(rotationAngle) === 180 ? 'bg-[#D6181F] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  180° Rear
                </button>
                <button
                  type="button"
                  onClick={() => setCardinalAngle(270)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    Math.round(rotationAngle) === 270 ? 'bg-[#D6181F] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  270° Left
                </button>
              </div>
            </div>

            {/* Engine Tachometer HUD (When Engine Audio is Running) */}
            {isEngineRunning && (
              <div className="absolute top-16 right-4 sm:right-6 z-20 bg-black/75 backdrop-blur-md border border-amber-500/40 rounded-xl p-2.5 sm:p-3 pointer-events-auto shadow-xl max-w-[170px] space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-gray-400">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Activity className="w-3 h-3" />
                    LIVE TACHO
                  </span>
                  <span className="font-mono text-white text-xs">{currentRpm} RPM</span>
                </div>

                {/* Simulated RPM Gauge Bar */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-75 ${
                      currentRpm > 6000 ? 'bg-red-500' : currentRpm > 3500 ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(10, (currentRpm / 9000) * 100))}%` }}
                  />
                </div>

                {/* Rev Button */}
                <button
                  id="tour-btn-rev-throttle"
                  type="button"
                  onClick={handleRevThrottle}
                  disabled={isRevving}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md ${
                    isRevving
                      ? 'bg-amber-500 text-black scale-95'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  <Flame className={`w-3.5 h-3.5 ${isRevving ? 'animate-bounce text-red-600' : 'text-amber-400'}`} />
                  <span>{isRevving ? 'REVVING!' : 'Rev Throttle'}</span>
                </button>
              </div>
            )}

            {/* Turntable Floor Disc with Compass Markings */}
            <div className="relative w-full max-w-xl h-64 sm:h-80 flex items-center justify-center">
              {/* Studio Rotating Ring Floor Platform */}
              <div
                className="absolute bottom-6 sm:bottom-8 w-72 sm:w-96 h-28 sm:h-36 rounded-[100%] border border-white/10 pointer-events-none transition-transform"
                style={{
                  transform: `rotateX(68deg) rotateZ(${rotationAngle}deg)`,
                  boxShadow: `0 0 45px ${getStudioAccentGlow()}, inset 0 0 35px ${getStudioAccentGlow()}`,
                  background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 70%)'
                }}
              >
                {/* 4 Cardinal Marks on the turntable ring */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-[#D6181F] rounded-full" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-white/40 rounded-full" />
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-1.5 bg-white/40 rounded-full" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-1.5 bg-white/40 rounded-full" />
              </div>

              {/* Dynamic Tire Contact Shadow */}
              <div
                className="absolute bottom-8 sm:bottom-10 h-7 rounded-full bg-black blur-md pointer-events-none transition-all duration-100"
                style={{
                  width: `${260 * shadowScaleX}px`,
                  transform: `translateX(${shadowOffsetX * 0.4}px)`,
                  opacity: shadowOpacity
                }}
              />

              {/* The 3D Rotating Vehicle Image Element */}
              <div
                className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none transition-transform"
                style={{
                  perspective: '900px',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div
                  className="relative transition-transform duration-75 ease-out"
                  style={{
                    transform: `
                      rotateY(${Math.sin(rad) * 28}deg)
                      scale(${1 + Math.abs(Math.cos(rad)) * 0.05})
                      scaleX(${isFacingRight ? 1 : -0.96})
                      skewY(${viewPerspectiveSkew * 0.5}deg)
                    `
                  }}
                >
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    referrerPolicy="no-referrer"
                    className="max-h-52 sm:max-h-72 max-w-[90vw] sm:max-w-md object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.85)]"
                    draggable={false}
                  />

                  {/* Specular Dynamic Light Sheen across vehicle */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay transition-opacity"
                    style={{
                      background: `linear-gradient(${normAngle}deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)`
                    }}
                  />
                </div>
              </div>

              {/* Interactive Hotspot Pins */}
              {visibleHotspots.map((hotspot) => (
                <div
                  key={hotspot.id}
                  id={`tour-hotspot-${hotspot.id}`}
                  style={{
                    left: `${hotspot.xPercent}%`,
                    top: `${hotspot.yPercent}%`
                  }}
                  className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspot(hotspot);
                      setIsAutoRotating(false);
                    }}
                    className="relative group p-1 cursor-pointer flex items-center justify-center"
                    aria-label={`Inspect ${hotspot.title}`}
                  >
                    {/* Pulsing Beacon Ring */}
                    <span className="absolute inset-0 rounded-full bg-[#D6181F] opacity-75 animate-ping" />
                    <span className="relative w-6 h-6 rounded-full bg-[#D6181F] text-white flex items-center justify-center font-bold text-[11px] shadow-lg border border-white/50 group-hover:scale-125 transition-transform">
                      +
                    </span>

                    {/* Hover tooltip label */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 rounded bg-black/90 text-white text-[10px] font-bold whitespace-nowrap border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                      {hotspot.title}
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {/* Stage Footer Drag Tip */}
            <div className="absolute bottom-2 text-center pointer-events-none">
              <span className="text-[10px] text-gray-400 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                {language === 'hi' ? '👈 माउस या उंगली से ड्रैग करके घुमाएं 👉' : '👈 Click & drag horizontally to rotate vehicle 360° 👉'}
              </span>
            </div>

            {/* Hotspot Inspection Detail Card (Modal/Drawer over stage) */}
            <AnimatePresence>
              {activeHotspot && (
                <motion.div
                  id="tour-hotspot-detail-card"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:w-80 z-30 bg-[#161616]/95 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl space-y-2 pointer-events-auto"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#D6181F]/20 text-[#D6181F] border border-[#D6181F]/30">
                        {activeHotspot.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1 font-['Rajdhani'] uppercase tracking-wide">
                        {activeHotspot.title}
                      </h4>
                      <p className="text-[10px] text-gray-400">{activeHotspot.subtitle}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveHotspot(null)}
                      className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/10 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed pt-1">
                    {activeHotspot.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      {activeHotspot.metricLabel}:
                    </span>
                    <span className="font-bold text-white font-mono bg-black/60 px-2 py-0.5 rounded border border-white/10">
                      {activeHotspot.metricValue}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Interactive Controls Panel */}
          <div className="bg-[#111111] border-t border-white/10 p-4 sm:p-5 space-y-4">
            {/* Turntable Slider Scrub & Playback Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Turntable Playback & Rotation Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="tour-btn-toggle-play"
                  type="button"
                  onClick={() => setIsAutoRotating((prev) => !prev)}
                  className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                    isAutoRotating
                      ? 'bg-[#D6181F] text-white border-[#D6181F] shadow-md shadow-[#D6181F]/30'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                  }`}
                >
                  {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isAutoRotating ? (language === 'hi' ? 'रोकें' : 'Pause') : (language === 'hi' ? 'ऑटो घुमाएं' : 'Auto Rotate')}</span>
                </button>

                <button
                  id="tour-btn-reverse-direction"
                  type="button"
                  onClick={() => setRotationDirection((prev) => (prev === 1 ? -1 : 1))}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="Reverse rotation direction"
                >
                  <RotateCw className={`w-4 h-4 ${rotationDirection === -1 ? '-scale-x-100 text-[#D6181F]' : ''}`} />
                </button>

                <button
                  id="tour-btn-reset-angle"
                  type="button"
                  onClick={() => setCardinalAngle(0)}
                  className="px-2.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold border border-white/10 transition-colors cursor-pointer"
                  title="Reset to 0 degrees"
                >
                  0° Reset
                </button>
              </div>

              {/* 360 Degree Dial Scrubber */}
              <div className="flex-1 w-full max-w-md flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-400">0°</span>
                <input
                  id="tour-angle-slider"
                  type="range"
                  min="0"
                  max="359"
                  value={Math.round(rotationAngle)}
                  onChange={(e) => {
                    setIsAutoRotating(false);
                    setRotationAngle(Number(e.target.value));
                  }}
                  className="flex-1 accent-[#D6181F] h-1.5 bg-white/20 rounded-lg cursor-pointer"
                  aria-label="Vehicle 360 degree rotation angle"
                />
                <span className="text-[10px] font-mono text-gray-400">360°</span>
              </div>

              {/* Studio Lighting Environment Picker */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                <span className="text-[10px] font-bold text-gray-400 uppercase hidden md:inline">
                  {language === 'hi' ? 'स्टूडियो:' : 'Studio:'}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedEnv('showroom')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    selectedEnv === 'showroom' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Day
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEnv('neon')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    selectedEnv === 'neon' ? 'bg-[#00FF88] text-black font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Cyber
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEnv('sunset')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    selectedEnv === 'sunset' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sunset
                </button>
              </div>
            </div>

            {/* Color Palette Selector Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {language === 'hi' ? 'उपलब्ध रंग:' : 'Official Colours:'}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {vehicle.specs.colours.map((colorName, idx) => {
                    const isSelected = selectedColor === colorName;
                    return (
                      <button
                        key={idx}
                        id={`tour-color-${idx}`}
                        type="button"
                        onClick={() => setSelectedColor(colorName)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#D6181F] text-white border-[#D6181F] shadow-sm shadow-[#D6181F]/40'
                            : 'bg-black/50 text-gray-300 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            colorName.toLowerCase().includes('red')
                              ? 'bg-red-500'
                              : colorName.toLowerCase().includes('black')
                              ? 'bg-zinc-800 border border-white/30'
                              : colorName.toLowerCase().includes('blue')
                              ? 'bg-blue-500'
                              : colorName.toLowerCase().includes('grey') || colorName.toLowerCase().includes('gray')
                              ? 'bg-slate-400'
                              : colorName.toLowerCase().includes('gold') || colorName.toLowerCase().includes('yellow')
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                        />
                        <span>{colorName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Callout */}
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-gray-400 uppercase">Price:</span>
                <span className="text-[#D6181F] font-bold font-['Rajdhani'] text-sm sm:text-base tracking-wide">
                  Price = Best Price
                </span>
              </div>
            </div>

            {/* CTAs Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 text-[11px] text-gray-400 text-center sm:text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {language === 'hi'
                    ? '5 वर्ष की आधिकारिक हीरो वारंटी व 5 निःशुल्क सर्विसिंग शामिल'
                    : '5-Year Official Hero Warranty & 5 Free Periodic Services Included'}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  id="tour-btn-view-specs"
                  type="button"
                  onClick={() => {
                    handleClose();
                    onViewDetails(vehicle);
                  }}
                  className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors cursor-pointer text-center"
                >
                  {language === 'hi' ? 'पूर्ण विनिर्देश' : 'Full Specs'}
                </button>

                <button
                  id="tour-btn-best-price"
                  type="button"
                  onClick={() => {
                    handleClose();
                    onContactBestPrice(vehicle);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/30 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'सर्वश्रेष्ठ ऑफर प्राप्त करें' : 'Get Best Offer'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
