import React, { useState } from 'react';
import { 
  BuildingGraph, 
  SpatialNode, 
  SpatialEdge, 
  NodeType 
} from '../types';
import { 
  Wrench, 
  X, 
  Plus, 
  Trash2, 
  Download, 
  QrCode, 
  Save, 
  Layers, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface AdminMapBuilderProps {
  building: BuildingGraph;
  onSaveBuilding: (updated: BuildingGraph) => void;
  onClose: () => void;
}

export const AdminMapBuilder: React.FC<AdminMapBuilderProps> = ({
  building,
  onSaveBuilding,
  onClose,
}) => {
  const [currentBuilding, setCurrentBuilding] = useState<BuildingGraph>(building);
  const [selectedNode, setSelectedNode] = useState<SpatialNode | null>(null);
  const [activeFloor, setActiveFloor] = useState(0);
  const [isConnectingEdge, setIsConnectingEdge] = useState<string | null>(null);
  const [showQRGrid, setShowQRGrid] = useState(false);

  // Add new node on canvas click
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newNode: SpatialNode = {
      id: `node-${Date.now().toString().slice(-4)}`,
      name: `New Point ${currentBuilding.nodes.length + 1}`,
      category: 'landmark',
      floor: activeFloor,
      x,
      y,
      qrCodeId: `QR-${currentBuilding.id.toUpperCase()}-${currentBuilding.nodes.length + 1}`,
      isAccessible: true,
      landmarkHint: 'Near corridor intersection'
    };

    setCurrentBuilding(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));

    setSelectedNode(newNode);
  };

  const handleNodeClick = (node: SpatialNode, e: React.MouseEvent) => {
    e.stopPropagation();

    if (isConnectingEdge) {
      if (isConnectingEdge !== node.id) {
        // Create new edge
        const newEdge: SpatialEdge = {
          id: `edge-${Date.now()}`,
          fromNodeId: isConnectingEdge,
          toNodeId: node.id,
          distanceMeters: 15,
          isAccessible: true
        };

        setCurrentBuilding(prev => ({
          ...prev,
          edges: [...prev.edges, newEdge]
        }));
      }
      setIsConnectingEdge(null);
    } else {
      setSelectedNode(node);
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    setCurrentBuilding(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      edges: prev.edges.filter(e => e.fromNodeId !== nodeId && e.toNodeId !== nodeId)
    }));
    setSelectedNode(null);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentBuilding, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentBuilding.id}-graph.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col p-4 overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-100">Building Spatial Graph Studio</h2>
            <p className="text-xs text-slate-400">Click canvas to plot nodes, connect edges, and print QR badges</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQRGrid(!showQRGrid)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>{showQRGrid ? 'Hide QR Badges' : 'Print QR Badges'}</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => {
              onSaveBuilding(currentBuilding);
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      {showQRGrid ? (
        /* QR Badge Generator Print View */
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-y-auto">
          <h3 className="font-bold text-slate-100 text-base mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-cyan-400" /> Printable Building QR Anchors
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentBuilding.nodes.map(node => (
              <div key={node.id} className="p-4 bg-white rounded-2xl text-slate-900 flex flex-col items-center justify-between text-center space-y-2 shadow-xl">
                <p className="font-extrabold text-sm uppercase tracking-wide">{currentBuilding.name}</p>
                <div className="p-2 bg-slate-100 rounded-xl border">
                  <QRCodeSVG value={node.qrCodeId} size={130} />
                </div>
                <div>
                  <p className="font-bold text-base text-slate-950">{node.name}</p>
                  <p className="text-xs text-slate-600">Floor {node.floor} • ID: {node.qrCodeId}</p>
                  <p className="text-[10px] text-cyan-700 font-semibold mt-1">Scan with PathFinder AI</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Visual Graph Editor View */
        <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
          {/* Left Canvas */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col relative overflow-hidden">
            {/* Floor bar */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Layers className="w-4 h-4 text-cyan-400" /> Floor:
              </span>
              {currentBuilding.floors.map(f => (
                <button
                  key={f.floorNumber}
                  onClick={() => setActiveFloor(f.floorNumber)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    activeFloor === f.floorNumber ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {f.floorName}
                </button>
              ))}
            </div>

            {/* SVG Canvas */}
            <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative">
              <svg
                viewBox="0 0 100 100"
                onClick={handleCanvasClick}
                className="w-full h-full object-contain cursor-crosshair"
              >
                {/* Edges */}
                {currentBuilding.edges.map(e => {
                  const from = currentBuilding.nodes.find(n => n.id === e.fromNodeId);
                  const to = currentBuilding.nodes.find(n => n.id === e.toNodeId);
                  if (!from || !to || from.floor !== activeFloor || to.floor !== activeFloor) return null;

                  return (
                    <line
                      key={e.id}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#06b6d4"
                      strokeWidth="1.2"
                    />
                  );
                })}

                {/* Nodes */}
                {currentBuilding.nodes.filter(n => n.floor === activeFloor).map(node => (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={(e) => handleNodeClick(node, e)}
                    className="cursor-pointer"
                  >
                    <circle
                      r="3"
                      className={`fill-cyan-500 stroke-2 ${
                        selectedNode?.id === node.id ? 'stroke-white fill-cyan-400 scale-150' : 'stroke-slate-900'
                      }`}
                    />
                    <text y="-4" textAnchor="middle" className="text-[2.5px] fill-slate-200 font-bold">
                      {node.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Right Properties Sidebar */}
          <div className="w-full lg:w-80 bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-y-auto space-y-4">
            <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">
              Node Properties
            </h3>

            {selectedNode ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    value={selectedNode.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setSelectedNode({ ...selectedNode, name });
                      setCurrentBuilding(prev => ({
                        ...prev,
                        nodes: prev.nodes.map(n => n.id === selectedNode.id ? { ...n, name } : n)
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={selectedNode.category}
                    onChange={(e) => {
                      const category = e.target.value as NodeType;
                      setSelectedNode({ ...selectedNode, category });
                      setCurrentBuilding(prev => ({
                        ...prev,
                        nodes: prev.nodes.map(n => n.id === selectedNode.id ? { ...n, category } : n)
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="office">Office</option>
                    <option value="medical">Medical / Hospital</option>
                    <option value="washroom">Washroom</option>
                    <option value="emergency_exit">Emergency Exit</option>
                    <option value="entrance">Entrance</option>
                    <option value="elevator">Elevator</option>
                    <option value="stairs">Stairs</option>
                    <option value="cafeteria">Cafeteria</option>
                    <option value="counter">Counter / Billing</option>
                    <option value="transit">Transit / Gate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Landmark Hint</label>
                  <input
                    type="text"
                    value={selectedNode.landmarkHint || ''}
                    onChange={(e) => {
                      const landmarkHint = e.target.value;
                      setSelectedNode({ ...selectedNode, landmarkHint });
                      setCurrentBuilding(prev => ({
                        ...prev,
                        nodes: prev.nodes.map(n => n.id === selectedNode.id ? { ...n, landmarkHint } : n)
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">QR Anchor ID</label>
                  <input
                    type="text"
                    value={selectedNode.qrCodeId}
                    onChange={(e) => {
                      const qrCodeId = e.target.value;
                      setSelectedNode({ ...selectedNode, qrCodeId });
                      setCurrentBuilding(prev => ({
                        ...prev,
                        nodes: prev.nodes.map(n => n.id === selectedNode.id ? { ...n, qrCodeId } : n)
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => setIsConnectingEdge(selectedNode.id)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold transition-all"
                  >
                    {isConnectingEdge === selectedNode.id ? 'Click second node on map' : 'Connect Edge Path'}
                  </button>

                  <button
                    onClick={() => handleDeleteNode(selectedNode.id)}
                    className="w-full py-2 bg-red-950/60 hover:bg-red-900 border border-red-800 rounded-lg text-red-300 font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Node
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Click any node on the map to edit properties or connect paths.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
