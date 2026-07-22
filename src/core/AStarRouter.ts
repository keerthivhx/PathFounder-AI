import { SpatialNode, SpatialEdge, NavigationRoute, PathStep, RoutingMode } from '../types';
import { PathFinderGraph } from './PathFinderGraph';

interface PriorityQueueItem {
  nodeId: string;
  priority: number;
}

export class AStarRouter {
  private graph: PathFinderGraph;

  constructor(graph: PathFinderGraph) {
    this.graph = graph;
  }

  // Heuristic function: Euclidean distance between node coordinates (scaled approximately)
  private calculateHeuristic(nodeA: SpatialNode, nodeB: SpatialNode): number {
    const dx = nodeA.x - nodeB.x;
    const dy = nodeA.y - nodeB.y;
    const floorDiff = Math.abs(nodeA.floor - nodeB.floor);
    // Floor changes add roughly 15 meters of elevator/stair traversal time weight
    return Math.sqrt(dx * dx + dy * dy) * 1.5 + floorDiff * 15;
  }

  public findRoute(
    startNodeId: string,
    targetNodeId: string,
    mode: RoutingMode = 'standard'
  ): NavigationRoute | null {
    const startNode = this.graph.getNode(startNodeId);
    const targetNode = this.graph.getNode(targetNodeId);

    if (!startNode || !targetNode) return null;
    if (startNodeId === targetNodeId) {
      return {
        pathNodes: [startNode],
        steps: [{
          stepIndex: 1,
          fromNode: startNode,
          toNode: startNode,
          distanceMeters: 0,
          instruction: 'You have arrived at your destination.',
          action: 'arrive'
        }],
        totalDistanceMeters: 0,
        estimatedTimeSeconds: 0,
        isAccessible: true,
        floorsVisited: [startNode.floor]
      };
    }

    const openSet: Map<string, number> = new Map();
    const gScore: Map<string, number> = new Map();
    const fScore: Map<string, number> = new Map();
    const cameFromNode: Map<string, string> = new Map();
    const cameFromEdge: Map<string, SpatialEdge> = new Map();

    gScore.set(startNodeId, 0);
    fScore.set(startNodeId, this.calculateHeuristic(startNode, targetNode));
    openSet.set(startNodeId, fScore.get(startNodeId)!);

    while (openSet.size > 0) {
      // Get node in openSet with lowest fScore
      let currentId = '';
      let lowestF = Infinity;
      for (const [id, f] of openSet.entries()) {
        if (f < lowestF) {
          lowestF = f;
          currentId = id;
        }
      }

      if (currentId === targetNodeId) {
        return this.reconstructPath(startNodeId, targetNodeId, cameFromNode, cameFromEdge, mode);
      }

      openSet.delete(currentId);
      const currentNode = this.graph.getNode(currentId)!;
      const neighbors = this.graph.getNeighbors(currentId);

      for (const edge of neighbors) {
        // Filter edges based on routing mode
        if (mode === 'wheelchair') {
          if (!edge.isAccessible || edge.isStairs) continue;
        }

        const neighborNode = this.graph.getNode(edge.toNodeId);
        if (!neighborNode) continue;

        if (mode === 'wheelchair' && !neighborNode.isAccessible) continue;

        const currentG = gScore.get(currentId) ?? Infinity;
        const tentativeG = currentG + edge.distanceMeters;

        if (tentativeG < (gScore.get(neighborNode.id) ?? Infinity)) {
          cameFromNode.set(neighborNode.id, currentId);
          cameFromEdge.set(neighborNode.id, edge);
          gScore.set(neighborNode.id, tentativeG);
          fScore.set(neighborNode.id, tentativeG + this.calculateHeuristic(neighborNode, targetNode));

          if (!openSet.has(neighborNode.id)) {
            openSet.set(neighborNode.id, fScore.get(neighborNode.id)!);
          }
        }
      }
    }

    return null; // Path not found
  }

  // Emergency Mode: Find route to the closest Emergency Exit from current location
  public findEmergencyRoute(startNodeId: string): NavigationRoute | null {
    const emergencyExits = this.graph.findNodesByCategory('emergency_exit');
    if (emergencyExits.length === 0) return null;

    let bestRoute: NavigationRoute | null = null;
    let shortestDistance = Infinity;

    for (const exitNode of emergencyExits) {
      const route = this.findRoute(startNodeId, exitNode.id, 'standard');
      if (route && route.totalDistanceMeters < shortestDistance) {
        shortestDistance = route.totalDistanceMeters;
        bestRoute = route;
      }
    }

    return bestRoute;
  }

  private reconstructPath(
    startNodeId: string,
    targetNodeId: string,
    cameFromNode: Map<string, string>,
    cameFromEdge: Map<string, SpatialEdge>,
    mode: RoutingMode
  ): NavigationRoute {
    const pathNodes: SpatialNode[] = [];
    let currentId: string | undefined = targetNodeId;

    while (currentId) {
      const node = this.graph.getNode(currentId);
      if (node) pathNodes.unshift(node);
      currentId = cameFromNode.get(currentId);
    }

    let totalDistance = 0;
    const steps: PathStep[] = [];
    const floorsVisitedSet = new Set<number>();

    for (let i = 0; i < pathNodes.length - 1; i++) {
      const from = pathNodes[i];
      const to = pathNodes[i + 1];
      const edge = cameFromEdge.get(to.id);
      const dist = edge ? edge.distanceMeters : 5;
      totalDistance += dist;

      floorsVisitedSet.add(from.floor);
      floorsVisitedSet.add(to.floor);

      let action: PathStep['action'] = 'straight';
      let instruction = `Walk ${dist}m towards ${to.name}.`;

      if (from.floor !== to.floor) {
        if (to.floor > from.floor) {
          action = edge?.isStairs ? 'stairs-up' : 'elevator-up';
          instruction = `Take ${edge?.isStairs ? 'stairs' : 'elevator'} to Floor ${to.floor}.`;
        } else {
          action = edge?.isStairs ? 'stairs-down' : 'elevator-down';
          instruction = `Take ${edge?.isStairs ? 'stairs' : 'elevator'} down to Floor ${to.floor}.`;
        }
      } else {
        // Calculate direction angle change if possible
        if (i > 0) {
          const prev = pathNodes[i - 1];
          const vector1 = { x: from.x - prev.x, y: from.y - prev.y };
          const vector2 = { x: to.x - from.x, y: to.y - from.y };
          const cross = vector1.x * vector2.y - vector1.y * vector2.x;

          if (cross > 5) {
            action = 'turn-right';
            instruction = `Turn right after ${from.landmarkHint || from.name} towards ${to.name}.`;
          } else if (cross < -5) {
            action = 'turn-left';
            instruction = `Turn left after ${from.landmarkHint || from.name} towards ${to.name}.`;
          } else {
            action = 'straight';
            instruction = `Continue straight past ${from.name} for ${dist}m.`;
          }
        } else {
          instruction = `Start walking from ${from.name} towards ${to.name} (${dist}m).`;
        }
      }

      steps.push({
        stepIndex: i + 1,
        fromNode: from,
        toNode: to,
        distanceMeters: dist,
        instruction,
        landmarkHint: to.landmarkHint || from.landmarkHint,
        action
      });
    }

    // Add final arrival step
    const finalNode = pathNodes[pathNodes.length - 1];
    steps.push({
      stepIndex: steps.length + 1,
      fromNode: finalNode,
      toNode: finalNode,
      distanceMeters: 0,
      instruction: `You have arrived at ${finalNode.name}.`,
      action: 'arrive'
    });

    // Average human walking speed: ~1.2 m/s (72 m/min)
    const estimatedTimeSeconds = Math.round((totalDistance / 1.2) + (floorsVisitedSet.size > 1 ? 30 : 0));

    return {
      pathNodes,
      steps,
      totalDistanceMeters: Math.round(totalDistance),
      estimatedTimeSeconds,
      isAccessible: mode === 'wheelchair' || pathNodes.every(n => n.isAccessible),
      floorsVisited: Array.from(floorsVisitedSet)
    };
  }
}
