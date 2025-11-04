import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { CanvasElement } from './CanvasElement';
import { Move, Sparkles } from 'lucide-react';

interface DraggablePartProps {
  part: any;
}

export function DraggablePart({ part }: DraggablePartProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const [{ isDragging }, drag] = useDrag({
    type: part.category,
    item: part,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`cursor-grab active:cursor-grabbing transition-all duration-300 ${
        isDragging ? 'opacity-50 scale-110 rotate-6' : 'hover:scale-105'
      }`}
    >
      <div className={`relative bg-white rounded-xl border-2 transition-all duration-300 shadow-md overflow-hidden ${
        isHovered 
          ? 'border-[#121417] shadow-lg' 
          : 'border-gray-200 hover:border-gray-300'
      }`}>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 relative">
              <div className="w-16 h-16 flex items-center justify-center">
                <CanvasElement part={part} size="small" />
              </div>
              {isDragging && (
                <div className="absolute inset-0 bg-[#121417] opacity-20 animate-pulse rounded-lg" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-800 truncate font-['Space_Grotesk']">
                {part.name}
              </h4>
              <p className="text-xs text-gray-500 capitalize font-['Space_Grotesk']">
                {part.category}
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <Move className={`w-4 h-4 transition-colors duration-200 ${
                isHovered ? 'text-[#121417]' : 'text-gray-400'
              }`} />
              {isHovered && (
                <Sparkles className="w-3 h-3 text-[#121417] animate-pulse" />
              )}
            </div>
          </div>
        </div>
        
        {/* Animated border */}
        {isHovered && (
          <div className="absolute inset-0 bg-[#121417] opacity-5 animate-pulse rounded-xl pointer-events-none" />
        )}
        
        {/* Drag hint */}
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-xl">
            <div className="text-center">
              <div className="text-2xl mb-1">🎨</div>
              <p className="text-xs font-['Space_Grotesk'] text-gray-600">
                Drop on canvas
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}