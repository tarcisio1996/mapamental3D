import { useCallback, useEffect, useRef, useState, DragEvent } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';

import { CustomNode } from './CustomNode';
import { Sidebar } from './Sidebar';
import { medievalGateTemplate, generateNodesAndEdges, NodeType, NodeData } from '@/lib/template';
import { getLayoutedElements } from '@/lib/layout';

const nodeTypes = {
  custom: CustomNode,
};

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onLayout = useCallback(
    (direction: string) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, setNodes, setEdges]
  );

  const generateTemplate = useCallback(() => {
    const { nodes: initialNodes, edges: initialEdges } = generateNodesAndEdges(medievalGateTemplate);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
      'LR'
    );
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  useEffect(() => {
    generateTemplate();
  }, [generateTemplate]);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: uuidv4(),
        type: 'custom',
        position,
        data: { label: `New ${type}`, type, status: 'todo' },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const onNodeClick = useCallback((_, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeData = (id: string, newData: Partial<NodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
    
    if (selectedNode && selectedNode.id === id) {
      setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, ...newData } } : null);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-50 flex-row">
      <Sidebar />
      <div className="flex-grow h-full relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
        >
          <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h1 className="text-lg font-bold mb-2">3D Workflow Mind Map</h1>
            <p className="text-sm text-gray-500 mb-4">
              Visualize and manage your 3D asset pipeline.
            </p>
            <div className="flex gap-2">
              <button
                onClick={generateTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                Load Template
              </button>
              <button
                onClick={() => onLayout('LR')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
              >
                Layout LR
              </button>
              <button
                onClick={() => onLayout('TB')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
              >
                Layout TB
              </button>
            </div>
          </Panel>
          <Controls />
          <MiniMap 
            nodeStrokeColor={(n) => {
              if (n.type === 'custom') return '#3b82f6';
              return '#eee';
            }}
            nodeColor={(n) => {
              if (n.type === 'custom') return '#eff6ff';
              return '#fff';
            }}
          />
          <Background color="#ccc" gap={16} />
        </ReactFlow>
      </div>

      {selectedNode && (
        <aside className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col h-full shadow-sm z-10 overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Properties</h2>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={selectedNode.data.label as string}
                onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={(selectedNode.data.status as string) || 'todo'}
                onChange={(e) => updateNodeData(selectedNode.id, { status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todo">To Do</option>
                <option value="wip">Work In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={(selectedNode.data.assignee as string) || ''}
                onChange={(e) => updateNodeData(selectedNode.id, { assignee: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
                  setSelectedNode(null);
                }}
                className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100 transition-colors font-medium"
              >
                Delete Node
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

export function MindMap() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
