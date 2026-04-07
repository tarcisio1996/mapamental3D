import { Handle, Position } from '@xyflow/react';
import { Folder, File, Image, Box, Layers, MonitorPlay, BookImage } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NodeData } from '@/lib/template';

const iconMap = {
  folder: Folder,
  file: File,
  concept: Image,
  model: Box,
  texture: Layers,
  engine: MonitorPlay,
  reference: BookImage,
};

const colorMap = {
  folder: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  file: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  concept: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  model: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  texture: 'bg-green-500/10 text-green-500 border-green-500/20',
  engine: 'bg-red-500/10 text-red-500 border-red-500/20',
  reference: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
};

const statusColors = {
  todo: 'bg-gray-300',
  wip: 'bg-yellow-400',
  review: 'bg-blue-400',
  done: 'bg-green-500',
};

export function CustomNode({ data, isConnectable }: { data: NodeData, isConnectable: boolean }) {
  const Icon = iconMap[data.type] || File;

  return (
    <div className={cn(
      "px-4 py-2 shadow-md rounded-md bg-white border-2 min-w-[200px] flex items-center gap-3 relative group",
      colorMap[data.type] || colorMap.file
    )}>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2 h-2 !bg-gray-400"
      />
      
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50">
        <Icon className="w-4 h-4" />
      </div>
      
      <div className="flex flex-col">
        <div className="text-sm font-bold truncate max-w-[150px]" title={data.label}>
          {data.label}
        </div>
        <div className="text-xs opacity-70 capitalize">
          {data.type}
        </div>
      </div>

      {data.status && (
        <div 
          className={cn("absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white", statusColors[data.status])}
          title={`Status: ${data.status}`}
        />
      )}

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2 h-2 !bg-gray-400"
      />
    </div>
  );
}
