import React, { useState, useMemo, useEffect } from 'react';
import { SAMPLE_BUILDINGS } from './data/sampleBuildings';
import { BuildingGraph, SpatialNode, NavigationRoute, RoutingMode } from './types';
import { PathFinderGraph } from './core/PathFinderGraph';
import { AStarRouter } from './core/AStarRouter';
import { useSensors } from './hooks/useSensors';

import { Navbar } from './components/Navbar';
import { MapCanvas } from './components/MapCanvas';
import { AROverlay } from './components/AROverlay';
import { QRScannerModal } from './components/QRScannerModal';
import { GeminiAssistantModal } from './components/GeminiAssistantModal';
import { AdminMapBuilder } from './components/AdminMapBuilder';

import { 
  MapPin, 
  Navigation, 
  Sparkles, 
  Siren, 
  Accessibility, 
  RotateCcw, 
  Building2, 
  Share2, 
  Footprints,
  ShieldCheck
} from 'lucide-react';
import { VoiceService } from './services/voiceService';

export default function App() {
  const [buildings, setBuildings] = useState<BuildingGraph[]>(SAMPLE_BUILDINGS);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingGraph>(SAMPLE_BUILDINGS[0]);
  const [currentFloor, setCurrentFloor] = useState<number>(0);

  const [startNode, setStartNode] = useState<SpatialNode | null>(SAMPLE_BUILDINGS[0].nodes[0]);
  const [targetNode, setTargetNode] = useState<SpatialNode | null>(null);
  const [routingMode, setRoutingMode] = useState<RoutingMode>('standard');
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);

  // Modals state
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [isAROverlayOpen, setIsAROverlayOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const { sensors, simulateStep } = useSensors();

  // Initialize Spatial Graph & Router
  const graph = useMemo(() => new PathFinderGraph(selectedBuilding), [selectedBuilding]);
  const router = useMemo(() => new AStarRouter(graph), [graph]);

  // Recalculate route whenever start, target, mode, or emergency changes
  const route: NavigationRoute | null = useMemo(() => {
    if (isEmergencyActive && startNode) {
      return router.findEmergencyRoute(startNode.id);
    }
    if (!startNode || !targetNode) return null;
    return router.findRoute(startNode.id, targetNode.id, routingMode);
  }, [startNode, targetNode, routingMode, isEmergencyActive, router]);

  // Handle node selection on map
  const handleNodeClick = (node: SpatialNode) => {
    if (!startNode || (startNode && targetNode)) {
      setStartNode(node);
      setTargetNode(null);
      setIsEmergencyActive(false);
    } else {
      setTargetNode(node);
      if (node.floor !== currentFloor) {
        setCurrentFloor(node.floor);
      }
    }
  };

  const handleSelectBuilding = (building: BuildingGraph) => {
    setSelectedBuilding(building);
    setCurrentFloor(building.floors[0].floorNumber);
    setStartNode(building.nodes[0] || null);
    setTargetNode(null);
    setIsEmergencyActive(false);
  };

  const handleToggleEmergency = () => {
    const nextState = !isEmergencyActive;
    setIsEmergencyActive(nextState);
    if (nextState) {
      setRoutingMode('emergency');
      VoiceService.speak('Emergency evacuation mode activated! Generating fastest route to nearest emergency exit.');
    } else {
      setRoutingMode('standard');
    }
  };

  const handleQRCalibrate = (calibratedNode: SpatialNode) => {
    setStartNode(calibratedNode);
    setCurrentFloor(calibratedNode.floor);
    setIsQRModalOpen(false);
    VoiceService.speak(`Position calibrated to ${calibratedNode.name} on Floor ${calibratedNode.floor}.`);
  };

  const handleGeminiTargetSelect = (node: SpatialNode) => {
    setTargetNode(node);
    if (node.floor !== currentFloor) {
      setCurrentFloor(node.floor);
    }
    setIsGeminiModalOpen(false);
  };

  const handleSaveBuilding = (updatedBuilding: BuildingGraph) => {
    setBuildings(prev => prev.map(b => b.id === updatedBuilding.id ? updatedBuilding : b));
    setSelectedBuilding(updatedBuilding);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        buildings={buildings}
        selectedBuilding={selectedBuilding}
        onSelectBuilding={handleSelectBuilding}
        routingMode={routingMode}
        onToggleRoutingMode={setRoutingMode}
        onOpenQRScanner={() => setIsQRModalOpen(true)}
        onOpenGeminiAI={() => setIsGeminiModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isEmergencyActive={isEmergencyActive}
        onToggleEmergency={handleToggleEmergency}
      />

      {/* Emergency Evacuation Alert Banner */}
      {isEmergencyActive && (
        <div className="bg-red-600 text-white px-4 py-2 text-center text-xs font-extrabold tracking-wider uppercase flex items-center justify-center gap-2 animate-pulse">
          <Siren className="w-4 h-4" />
          <span>Emergency Evacuation Routing Active — Follow illuminated green exit path</span>
        </div>
      )}

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col space-y-4">
        {/* Navigation Selector Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center flex-wrap gap-4 flex-1">
            {/* Start Origin Selector */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex-1 min-w-[200px]">
              <span className="w-3 h-3 rounded-full bg-emerald-400 shrink-0"></span>
              <div className="w-full">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Origin (You are here)</p>
                <select
                  value={startNode?.id || ''}
                  onChange={(e) => {
                    const node = selectedBuilding.nodes.find(n => n.id === e.target.value);
                    if (node) {
                      setStartNode(node);
                      if (node.floor !== currentFloor) setCurrentFloor(node.floor);
                    }
                  }}
                  className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none w-full cursor-pointer"
                >
                  {selectedBuilding.nodes.map(n => (
                    <option key={n.id} value={n.id} className="bg-slate-900 text-slate-100">
                      Floor {n.floor}: {n.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Destination Selector */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex-1 min-w-[200px]">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shrink-0"></span>
              <div className="w-full">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Destination</p>
                <select
                  value={targetNode?.id || ''}
                  onChange={(e) => {
                    const node = selectedBuilding.nodes.find(n => n.id === e.target.value);
                    if (node) {
                      setTargetNode(node);
                      setIsEmergencyActive(false);
                    }
                  }}
                  className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none w-full cursor-pointer"
                >
                  <option value="">Select Destination...</option>
                  {selectedBuilding.nodes.map(n => (
                    <option key={n.id} value={n.id} className="bg-slate-900 text-slate-100">
                      Floor {n.floor}: {n.name} ({n.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => simulateStep()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700"
              title="Simulate step dead reckoning for desktop testing"
            >
              <Footprints className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Step ({sensors.stepCount})</span>
            </button>

            <button
              onClick={() => {
                setStartNode(selectedBuilding.nodes[0]);
                setTargetNode(null);
                setIsEmergencyActive(false);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
              title="Reset Path"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Map Workspace Canvas & Turn-by-Turn Guidance */}
        <div className="flex-1">
          <MapCanvas
            building={selectedBuilding}
            currentFloor={currentFloor}
            onSelectFloor={setCurrentFloor}
            startNode={startNode}
            targetNode={targetNode}
            route={route}
            onNodeClick={handleNodeClick}
            headingDegrees={sensors.headingDegrees}
            onOpenAR={() => setIsAROverlayOpen(true)}
            isEmergencyActive={isEmergencyActive}
          />
        </div>
      </main>

      {/* Modals & Overlays */}
      {isQRModalOpen && (
        <QRScannerModal
          nodes={selectedBuilding.nodes}
          onCalibrateNode={handleQRCalibrate}
          onClose={() => setIsQRModalOpen(false)}
        />
      )}

      {isGeminiModalOpen && (
        <GeminiAssistantModal
          nodes={selectedBuilding.nodes}
          onSelectTargetNode={handleGeminiTargetSelect}
          onClose={() => setIsGeminiModalOpen(false)}
        />
      )}

      {isAROverlayOpen && (
        <AROverlay
          route={route}
          targetNode={targetNode}
          headingDegrees={sensors.headingDegrees}
          onClose={() => setIsAROverlayOpen(false)}
        />
      )}

      {isAdminOpen && (
        <AdminMapBuilder
          building={selectedBuilding}
          onSaveBuilding={handleSaveBuilding}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Modern Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-4 px-6 text-center text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold">PathFinder AI</span> — Powered by Google Gemini Vision & Spatial Intelligence
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Zero-Hardware Beaconless Navigation</span>
          <span>•</span>
          <span>Google Meet the Builders Project</span>
        </div>
      </footer>
    </div>
  );
}
