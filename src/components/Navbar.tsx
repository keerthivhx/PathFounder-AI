import React from 'react';
import { 
  Compass, 
  Building2, 
  Mic, 
  QrCode, 
  Siren, 
  Accessibility, 
  Wrench, 
  Sparkles, 
  MapPin 
} from 'lucide-react';
import { BuildingGraph, RoutingMode } from '../types';

interface NavbarProps {
  buildings: BuildingGraph[];
  selectedBuilding: BuildingGraph;
  onSelectBuilding: (b: BuildingGraph) => void;
  routingMode: RoutingMode;
  onToggleRoutingMode: (mode: RoutingMode) => void;
  onOpenQRScanner: () => void;
  onOpenGeminiAI: () => void;
  onOpenAdmin: () => void;
  isEmergencyActive: boolean;
  onToggleEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  buildings,
  selectedBuilding,
  onSelectBuilding,
  routingMode,
  onToggleRoutingMode,
  onOpenQRScanner,
  onOpenGeminiAI,
  onOpenAdmin,
  isEmergencyActive,
  onToggleEmergency,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Building Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-cyan-500/20">
            <Compass className="w-6 h-6 animate-pulse" />
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
              PathFinder AI
            </span>
          </div>

          {/* Building Switcher */}
          <div className="relative flex items-center bg-slate-800/80 border border-slate-700/60 rounded-lg px-2 py-1 text-sm">
            <Building2 className="w-4 h-4 text-cyan-400 mr-2 shrink-0" />
            <select
              value={selectedBuilding.id}
              onChange={(e) => {
                const b = buildings.find(b => b.id === e.target.value);
                if (b) onSelectBuilding(b);
              }}
              className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer pr-2"
            >
              {buildings.map(b => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-slate-100">
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Gemini AI Assistant Button */}
          <button
            onClick={onOpenGeminiAI}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm transition-all shadow-md shadow-purple-500/20"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">AI Spatial Assistant</span>
          </button>

          {/* QR Anchor Calibrator */}
          <button
            onClick={onOpenQRScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-all"
            title="Scan wall QR to calibrate location"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Scan QR</span>
          </button>

          {/* Wheelchair Accessibility Toggle */}
          <button
            onClick={() => onToggleRoutingMode(routingMode === 'wheelchair' ? 'standard' : 'wheelchair')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
              routingMode === 'wheelchair'
                ? 'bg-blue-600/30 border-blue-500 text-blue-300 shadow-md shadow-blue-500/20'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="Toggle Wheelchair / Elevator Routing"
          >
            <Accessibility className="w-4 h-4 text-blue-400" />
            <span className="hidden lg:inline">Wheelchair Mode</span>
          </button>

          {/* Emergency SOS Evacuation Trigger */}
          <button
            onClick={onToggleEmergency}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-bold transition-all ${
              isEmergencyActive
                ? 'bg-red-600 text-white border-red-500 animate-pulse shadow-lg shadow-red-600/50'
                : 'bg-red-950/40 hover:bg-red-900/60 border-red-800/60 text-red-300'
            }`}
            title="Trigger 1-Click SOS Evacuation Route"
          >
            <Siren className="w-4 h-4" />
            <span>SOS EXIT</span>
          </button>

          {/* Admin Graph Studio */}
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title="Open Admin Building Map Studio"
          >
            <Wrench className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
