import React, { useState } from 'react';
import { 
  BuildingGraph, 
  SpatialNode, 
  NavigationRoute, 
  PathStep 
} from '../types';
import { 
  MapPin, 
  Navigation, 
  Volume2, 
  Layers, 
  Footprints, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  RotateCcw, 
  Accessibility, 
  Siren,
  Camera
} from 'lucide-react';
import { VoiceService } from '../services/voiceService';

interface MapCanvasProps {
  building: BuildingGraph;
  currentFloor: number;
  onSelectFloor: (floor: number) => void;
  startNode: SpatialNode | null;
  targetNode: SpatialNode | null;
  route: NavigationRoute | null;
  onNodeClick: (node: SpatialNode) => void;
  headingDegrees: number;
  onOpenAR: () => void;
  isEmergencyActive: boolean;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  building,
  currentFloor,
  onSelectFloor,
  startNode,
  targetNode,
  route,
  onNodeClick,
  headingDegrees,
  onOpenAR,
  isEmergencyActive,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const floorNodes = building.nodes.filter(n => n.floor === currentFloor);
  const floorEdges = building.edges.filter(e => {
    const fromNode = building.nodes.find(n => n.id === e.fromNodeId);
    const toNode = building.nodes.find(n => n.id === e.toNodeId);
    return fromNode?.floor === currentFloor && toNode?.floor === currentFloor;
  });

  // Extract path lines for current floor
  const floorPathNodes = route
    ? route.pathNodes.filter(n => n.floor === currentFloor)
    : [];

  const handleSpeakInstruction = (text: string) => {
    VoiceService.speak(text);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency_exit': return 'fill-red-500 stroke-red-300';
      case 'medical': return 'fill-emerald-500 stroke-emerald-300';
      case 'office': return 'fill-blue-500 stroke-blue-300';
      case 'washroom': return 'fill-cyan-500 stroke-cyan-300';
      case 'elevator': return 'fill-purple-500 stroke-purple-300';
      case 'stairs': return 'fill-amber-500 stroke-amber-300';
      case 'cafeteria': return 'fill-orange-500 stroke-orange-300';
      default: return 'fill-slate-400 stroke-slate-200';
    }
  };

  return (
    <div className="relative w-full flex flex-col lg:flex-row gap-4 h-full">
      {/* Left Column: Interactive Floor Map SVG */}
      <div className="relative flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col overflow-hidden shadow-2xl min-h-[480px]">
        {/* Top Overlay Bar: Floor Tabs & AR Mode */}
        <div className="flex items-center justify-between mb-4 z-10 flex-wrap gap-2">
          {/* Floor Selector */}
          <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700/80 rounded-xl p-1">
            <Layers className="w-4 h-4 text-cyan-400 ml-2" />
            {building.floors.map(f => (
              <button
                key={f.floorNumber}
                onClick={() => onSelectFloor(f.floorNumber)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  currentFloor === f.floorNumber
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                {f.floorName}
              </button>
            ))}
          </div>

          {/* Controls: AR View & Compass Indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-300">
              <Navigation
                className="w-3.5 h-3.5 text-cyan-400 transition-transform duration-300"
                style={{ transform: `rotate(${headingDegrees}deg)` }}
              />
              <span>{headingDegrees}°</span>
            </div>

            <button
              onClick={onOpenAR}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-cyan-300 transition-all"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>AR Camera HUD</span>
            </button>
          </div>
        </div>

        {/* SVG Canvas Workspace */}
        <div className="relative flex-1 bg-slate-950/70 border border-slate-800/60 rounded-xl overflow-hidden flex items-center justify-center p-2">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full max-h-[600px] object-contain cursor-crosshair select-none"
          >
            {/* Grid Lines */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />

            {/* Building Edges / Walkways */}
            {floorEdges.map(edge => {
              const from = building.nodes.find(n => n.id === edge.fromNodeId);
              const to = building.nodes.find(n => n.id === edge.toNodeId);
              if (!from || !to) return null;

              return (
                <line
                  key={edge.id}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={edge.isStairs ? '#f59e0b' : '#334155'}
                  strokeWidth="0.8"
                  strokeDasharray={edge.isStairs ? '1 1' : 'none'}
                />
              );
            })}

            {/* Calculated Navigation Route Path */}
            {floorPathNodes.length > 1 && (
              <polyline
                points={floorPathNodes.map(n => `${n.x},${n.y}`).join(' ')}
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />
            )}

            {/* Path Motion Dots Animation */}
            {floorPathNodes.length > 1 && (
              <polyline
                points={floorPathNodes.map(n => `${n.x},${n.y}`).join(' ')}
                fill="none"
                stroke="#67e8f9"
                strokeWidth="1.2"
                strokeDasharray="2 4"
                className="animate-[dash_2s_linear_infinite]"
              />
            )}

            {/* Floor Nodes */}
            {floorNodes.map(node => {
              const isStart = startNode?.id === node.id;
              const isTarget = targetNode?.id === node.id;
              const isEmergency = isEmergencyActive && node.category === 'emergency_exit';

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => onNodeClick(node)}
                  className="cursor-pointer group"
                >
                  {/* Outer aura pulse for start/target/emergency */}
                  {(isStart || isTarget || isEmergency) && (
                    <circle
                      r="4.5"
                      className={`animate-ping opacity-75 ${
                        isStart ? 'fill-emerald-400' : isEmergency ? 'fill-red-500' : 'fill-cyan-400'
                      }`}
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={isStart || isTarget ? '3.5' : '2.2'}
                    className={`transition-all ${getCategoryColor(node.category)} stroke-1 group-hover:scale-125`}
                  />

                  {/* Icon label text */}
                  <text
                    y="-4"
                    textAnchor="middle"
                    className="text-[2.2px] font-semibold fill-slate-200 pointer-events-none drop-shadow-md"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Instructions Footer Hint */}
        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
          <span>Click any node pin to set Start or Destination</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> Start
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span> Destination
          </span>
        </div>
      </div>

      {/* Right Column: Dynamic Guidance Card & Turn-by-Turn Carousel */}
      <div className="w-full lg:w-96 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-2xl">
        {route ? (
          <div className="flex flex-col h-full justify-between gap-4">
            {/* Header: Distance & ETA Summary */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100">Live Guidance</h3>
                    <p className="text-xs text-slate-400">
                      {route.isAccessible ? 'Wheelchair Accessible Route' : 'Standard Path'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-extrabold text-cyan-400">
                    {route.totalDistanceMeters} m
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    ~{Math.ceil(route.estimatedTimeSeconds / 60)} min
                  </div>
                </div>
              </div>

              {/* Step Navigation Carousel */}
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {route.steps.map((step, idx) => {
                  const isCurrent = idx === activeStepIndex;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveStepIndex(idx)}
                      className={`p-3 rounded-xl border text-sm transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-slate-800/90 border-cyan-500/80 text-slate-100 shadow-md shadow-cyan-500/10'
                          : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isCurrent ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-medium text-slate-200">{step.instruction}</p>
                            {step.landmarkHint && (
                              <p className="text-xs text-cyan-400/90 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Landmark: {step.landmarkHint}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeakInstruction(step.instruction);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-cyan-400 shrink-0"
                          title="Voice Readout"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Step Controls */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-300"
              >
                Previous Step
              </button>

              <button
                onClick={() => handleSpeakInstruction(route.steps[activeStepIndex]?.instruction || '')}
                className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
                title="Replay Voice"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              <button
                disabled={activeStepIndex === route.steps.length - 1}
                onClick={() => setActiveStepIndex(prev => Math.min(route.steps.length - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20"
              >
                Next Step
              </button>
            </div>
          </div>
        ) : (
          /* Empty State when no path is selected */
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-cyan-400">
              <Footprints className="w-10 h-10 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Ready to Navigate</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Select your starting position and destination, or click <span className="text-cyan-400 font-semibold">AI Spatial Assistant</span> to ask in plain English.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
