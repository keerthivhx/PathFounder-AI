export type NodeType = 
  | 'office'
  | 'medical'
  | 'washroom'
  | 'emergency_exit'
  | 'entrance'
  | 'elevator'
  | 'stairs'
  | 'ramp'
  | 'cafeteria'
  | 'counter'
  | 'transit'
  | 'landmark';

export interface SpatialNode {
  id: string;
  name: string;
  category: NodeType;
  floor: number;
  x: number; // Percentage relative to floorplan 0-100
  y: number; // Percentage relative to floorplan 0-100
  description?: string;
  landmarkHint?: string;
  qrCodeId: string;
  isAccessible: boolean;
  aliases?: string[]; // Natural language search aliases
}

export interface SpatialEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  distanceMeters: number;
  isAccessible: boolean; // Accessible for wheelchair/ramps/elevators
  isStairs?: boolean;
  description?: string;
}

export interface BuildingFloor {
  floorNumber: number;
  floorName: string;
  svgPath?: string;
  imageOverlayUrl?: string;
  gridWidth: number;
  gridHeight: number;
}

export interface BuildingGraph {
  id: string;
  name: string;
  category: 'university' | 'hospital' | 'airport' | 'mall' | 'office';
  description: string;
  address: string;
  floors: BuildingFloor[];
  nodes: SpatialNode[];
  edges: SpatialEdge[];
}

export interface PathStep {
  stepIndex: number;
  fromNode: SpatialNode;
  toNode: SpatialNode;
  distanceMeters: number;
  instruction: string;
  landmarkHint?: string;
  action: 'straight' | 'turn-left' | 'turn-right' | 'elevator-up' | 'elevator-down' | 'stairs-up' | 'stairs-down' | 'arrive';
}

export interface NavigationRoute {
  pathNodes: SpatialNode[];
  steps: PathStep[];
  totalDistanceMeters: number;
  estimatedTimeSeconds: number;
  isAccessible: boolean;
  floorsVisited: number[];
}

export interface UserPosition {
  currentNodeId: string | null;
  floor: number;
  headingDegrees: number;
  isCalibrated: boolean;
  lastMethod: 'qr' | 'vision' | 'manual' | 'pdr';
  lastUpdated: Date;
}

export type RoutingMode = 'standard' | 'wheelchair' | 'emergency';
