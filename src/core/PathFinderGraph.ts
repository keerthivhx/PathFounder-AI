import { SpatialNode, SpatialEdge, BuildingGraph, NodeType } from '../types';

export class PathFinderGraph {
  private nodesMap: Map<string, SpatialNode> = new Map();
  private adjacencyList: Map<string, SpatialEdge[]> = new Map();
  private building: BuildingGraph;

  constructor(building: BuildingGraph) {
    this.building = building;
    this.initGraph();
  }

  private initGraph() {
    this.nodesMap.clear();
    this.adjacencyList.clear();

    for (const node of this.building.nodes) {
      this.nodesMap.set(node.id, node);
      this.adjacencyList.set(node.id, []);
    }

    for (const edge of this.building.edges) {
      const fromEdges = this.adjacencyList.get(edge.fromNodeId) || [];
      fromEdges.push(edge);
      this.adjacencyList.set(edge.fromNodeId, fromEdges);

      // Bi-directional edge
      const toEdges = this.adjacencyList.get(edge.toNodeId) || [];
      toEdges.push({
        ...edge,
        id: `${edge.id}_reverse`,
        fromNodeId: edge.toNodeId,
        toNodeId: edge.fromNodeId
      });
      this.adjacencyList.set(edge.toNodeId, toEdges);
    }
  }

  public getBuilding(): BuildingGraph {
    return this.building;
  }

  public getNode(id: string): SpatialNode | undefined {
    return this.nodesMap.get(id);
  }

  public getAllNodes(): SpatialNode[] {
    return Array.from(this.nodesMap.values());
  }

  public getNodesByFloor(floor: number): SpatialNode[] {
    return this.getAllNodes().filter(n => n.floor === floor);
  }

  public getNeighbors(nodeId: string): SpatialEdge[] {
    return this.adjacencyList.get(nodeId) || [];
  }

  public findNodesByCategory(category: NodeType): SpatialNode[] {
    return this.getAllNodes().filter(n => n.category === category);
  }

  public findNodesByQuery(query: string): SpatialNode[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return this.getAllNodes().filter(node => {
      const nameMatch = node.name.toLowerCase().includes(q);
      const descMatch = node.description?.toLowerCase().includes(q);
      const landmarkMatch = node.landmarkHint?.toLowerCase().includes(q);
      const aliasMatch = node.aliases?.some(alias => alias.toLowerCase().includes(q));
      return nameMatch || descMatch || landmarkMatch || aliasMatch;
    });
  }

  public findClosestNodeByQR(qrCodeId: string): SpatialNode | undefined {
    return this.getAllNodes().find(n => n.qrCodeId.toLowerCase() === qrCodeId.toLowerCase());
  }
}
