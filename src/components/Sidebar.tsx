import { DragEvent } from 'react';
import { Folder, File, Image, Box, Layers, MonitorPlay, BookImage } from 'lucide-react';
import { NodeType } from '@/lib/template';

const nodeTypes: { type: NodeType; label: string; icon: any; color: string }[] = [
  { type: 'folder', label: 'Folder', icon: Folder, color: 'text-blue-500 bg-blue-500/10' },
  { type: 'file', label: 'File', icon: File, color: 'text-gray-500 bg-gray-500/10' },
  { type: 'concept', label: 'Concept Art', icon: Image, color: 'text-purple-500 bg-purple-500/10' },
  { type: 'model', label: '3D Model', icon: Box, color: 'text-orange-500 bg-orange-500/10' },
  { type: 'texture', label: 'Texture', icon: Layers, color: 'text-green-500 bg-green-500/10' },
  { type: 'engine', label: 'Engine Asset', icon: MonitorPlay, color: 'text-red-500 bg-red-500/10' },
  { type: 'reference', label: 'Reference', icon: BookImage, color: 'text-yellow-500 bg-yellow-500/10' },
];

export function Sidebar() {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col h-full shadow-sm z-10">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">Assets</h2>
        <p className="text-xs text-gray-500 mt-1">Drag and drop nodes to the canvas.</p>
      </div>
      
      <div className="flex flex-col gap-3">
        {nodeTypes.map((nt) => {
          const Icon = nt.icon;
          return (
            <div
              key={nt.type}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-grab hover:shadow-md transition-shadow bg-white"
              onDragStart={(event) => onDragStart(event, nt.type)}
              draggable
            >
              <div className={`p-2 rounded-md ${nt.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">{nt.label}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
