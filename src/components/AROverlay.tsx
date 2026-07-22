import React, { useRef, useEffect } from 'react';
import { Navigation, X, Camera, MapPin, Compass } from 'lucide-react';
import { NavigationRoute, SpatialNode } from '../types';

interface AROverlayProps {
  route: NavigationRoute | null;
  targetNode: SpatialNode | null;
  headingDegrees: number;
  onClose: () => void;
}

export const AROverlay: React.FC<AROverlayProps> = ({
  route,
  targetNode,
  headingDegrees,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera access denied or unavailable in AR overlay:', err);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const currentStep = route?.steps[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-between p-4 overflow-hidden">
      {/* Background Video Stream / Camera Feed */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80"></div>
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center gap-2 text-cyan-400">
          <Camera className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-sm">PathFinder AR View</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-slate-300">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>{headingDegrees}°</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* AR HUD Center Target Beacon */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-4">
        {/* Animated Directional AR Arrow */}
        <div className="relative p-6 rounded-full bg-cyan-500/20 border-2 border-cyan-400/80 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.5)] animate-bounce">
          <Navigation
            className="w-16 h-16 text-cyan-300 transition-transform duration-500"
            style={{ transform: `rotate(${headingDegrees}deg)` }}
          />
        </div>

        {/* Live Distance & Landmark Indicator */}
        {targetNode && (
          <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-4 text-center max-w-xs shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-cyan-400 font-extrabold text-lg">
              <MapPin className="w-5 h-5" />
              <span>{targetNode.name}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Floor {targetNode.floor} • {targetNode.landmarkHint || targetNode.description}
            </p>

            {route && (
              <div className="mt-2 pt-2 border-t border-slate-800/80 text-cyan-300 font-semibold text-sm">
                {route.totalDistanceMeters} meters remaining
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom AR Guidance HUD */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-center">
        <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-1">
          Current Direction
        </p>
        <p className="text-sm font-bold text-slate-100">
          {currentStep ? currentStep.instruction : 'Hold device camera upright and follow HUD arrow'}
        </p>
      </div>
    </div>
  );
};
