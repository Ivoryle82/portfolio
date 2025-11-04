import React, { useState, useRef, useEffect } from 'react';
import { Move, Trash2 } from 'lucide-react';

interface InteractiveBoundingBoxProps {
  isSelected: boolean;
  onMove: (deltaX: number, deltaY: number) => void;
  onScale: (scale: number) => void;
  onDelete: () => void;
  onDeselect: () => void;
  children: React.ReactNode;
  currentScale: number;
  minScale?: number;
  maxScale?: number;
  // New props for absolute positioning
  absolutePosition?: { x: number; y: number };
  objectDimensions?: { width: number; height: number };
}

type HandleType = 'corner' | 'edge';
type HandlePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'right' | 'bottom' | 'left';

interface Handle {
  type: HandleType;
  position: HandlePosition;
  cursor: string;
  x: string;
  y: string;
}

const handles: Handle[] = [
  // Corner handles
  { type: 'corner', position: 'top-left', cursor: 'nw-resize', x: '-6px', y: '-6px' },
  { type: 'corner', position: 'top-right', cursor: 'ne-resize', x: 'calc(100% - 6px)', y: '-6px' },
  { type: 'corner', position: 'bottom-left', cursor: 'sw-resize', x: '-6px', y: 'calc(100% - 6px)' },
  { type: 'corner', position: 'bottom-right', cursor: 'se-resize', x: 'calc(100% - 6px)', y: 'calc(100% - 6px)' },
  // Edge midpoint handles
  { type: 'edge', position: 'top', cursor: 'n-resize', x: 'calc(50% - 6px)', y: '-6px' },
  { type: 'edge', position: 'right', cursor: 'e-resize', x: 'calc(100% - 6px)', y: 'calc(50% - 6px)' },
  { type: 'edge', position: 'bottom', cursor: 's-resize', x: 'calc(50% - 6px)', y: 'calc(100% - 6px)' },
  { type: 'edge', position: 'left', cursor: 'w-resize', x: '-6px', y: 'calc(50% - 6px)' },
];

export function InteractiveBoundingBox({
  isSelected,
  onMove,
  onScale,
  onDelete,
  onDeselect,
  children,
  currentScale,
  minScale = 0.5,
  maxScale = 4.0,
  absolutePosition,
  objectDimensions
}: InteractiveBoundingBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isScaling, setIsScaling] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Calculate absolute bounding box dimensions and position
  const getBoundingBoxMetrics = () => {
    if (!containerRef.current || !absolutePosition || !objectDimensions) {
      return null;
    }

    // Find the canvas container (the element with the canvas bounds)
    let canvasContainer = containerRef.current;
    while (canvasContainer && !canvasContainer.classList.contains('bg-[#fefdfa]')) {
      canvasContainer = canvasContainer.parentElement;
    }

    if (!canvasContainer) return null;

    // Get the object's position relative to the canvas
    const canvasRect = canvasContainer.getBoundingClientRect();
    const objectRect = containerRef.current.getBoundingClientRect();

    // Calculate where the bounding box should be in canvas-relative coordinates
    const canvasRelativeX = objectRect.left - canvasRect.left;
    const canvasRelativeY = objectRect.top - canvasRect.top;

    // Get the actual size of the object considering current scale
    const actualWidth = objectRect.width;
    const actualHeight = objectRect.height;

    return {
      left: canvasRelativeX,
      top: canvasRelativeY,
      width: actualWidth,
      height: actualHeight
    };
  };

  // Handle ESC key deselection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSelected) {
        onDeselect();
      }
    };

    if (isSelected) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isSelected, onDeselect]);

  // Handle moving (dragging inside bounding box)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isSelected) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      onMove(deltaX, deltaY);
      
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle scaling from handles
  const handleScaleStart = (e: React.MouseEvent, handlePosition: HandlePosition) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsScaling(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startScale = currentScale;
    
    // Find the canvas container for proper coordinate system
    let canvasContainer = containerRef.current;
    while (canvasContainer && !canvasContainer.classList.contains('bg-[#fefdfa]')) {
      canvasContainer = canvasContainer.parentElement;
    }

    if (!canvasContainer) return;

    const canvasRect = canvasContainer.getBoundingClientRect();
    const centerX = canvasRect.left + absolutePosition!.x;
    const centerY = canvasRect.top + absolutePosition!.y;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate distance from center for proportional scaling
      const currentDistanceFromCenter = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      
      const startDistanceFromCenter = Math.sqrt(
        Math.pow(startX - centerX, 2) + Math.pow(startY - centerY, 2)
      );
      
      // Calculate scale factor based on distance change
      const scaleFactor = currentDistanceFromCenter / startDistanceFromCenter;
      let newScale = startScale * scaleFactor;
      
      // Apply constraints
      newScale = Math.max(minScale, Math.min(maxScale, newScale));
      
      onScale(newScale);
    };

    const handleMouseUp = () => {
      setIsScaling(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle click on object for selection
  const handleObjectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Hit testing - only select if we actually clicked on the object
    if (!isSelected) {
      // This click is handled by the parent component
    }
  };

  if (!isSelected) {
    return (
      <div ref={containerRef} onClick={handleObjectClick}>
        {children}
      </div>
    );
  }

  const boundingBox = getBoundingBoxMetrics();

  return (
    <>
      {/* Object content - no transforms applied to bounding box */}
      <div ref={containerRef} onClick={handleObjectClick}>
        {children}
      </div>
      
      {/* Overlay layer for bounding box and controls - rendered at canvas level */}
      {boundingBox && isSelected && (
        <div
          ref={overlayRef}
          className="fixed pointer-events-none"
          style={{
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1000
          }}
        >
          {/* Find canvas and render overlay relative to it */}
          <CanvasBoundingBoxOverlay
            boundingBox={boundingBox}
            isDragging={isDragging}
            isScaling={isScaling}
            currentScale={currentScale}
            minScale={minScale}
            maxScale={maxScale}
            onMouseDown={handleMouseDown}
            onScaleStart={handleScaleStart}
            onDelete={onDelete}
          />
        </div>
      )}
    </>
  );
}

// Separate component for the canvas overlay
function CanvasBoundingBoxOverlay({
  boundingBox,
  isDragging,
  isScaling,
  currentScale,
  minScale,
  maxScale,
  onMouseDown,
  onScaleStart,
  onDelete
}: {
  boundingBox: { left: number; top: number; width: number; height: number };
  isDragging: boolean;
  isScaling: boolean;
  currentScale: number;
  minScale: number;
  maxScale: number;
  onMouseDown: (e: React.MouseEvent) => void;
  onScaleStart: (e: React.MouseEvent, position: HandlePosition) => void;
  onDelete: () => void;
}) {
  const [canvasPosition, setCanvasPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    // Find the canvas element and get its position
    // Use a more reliable method - look for the canvas container by traversing up
    let currentElement = document.querySelector('[data-canvas="portfolio-canvas"]');
    if (!currentElement) {
      // Fallback: look for elements with the specific background color
      const allElements = document.querySelectorAll('*');
      for (const elem of allElements) {
        const computedStyle = window.getComputedStyle(elem);
        if (computedStyle.backgroundColor === 'rgb(254, 253, 250)') {
          currentElement = elem;
          break;
        }
      }
    }
    
    if (currentElement) {
      const rect = currentElement.getBoundingClientRect();
      setCanvasPosition({ left: rect.left, top: rect.top });
    }
  }, [boundingBox]);

  return (
    <div
      className="absolute"
      style={{
        left: canvasPosition.left + boundingBox.left,
        top: canvasPosition.top + boundingBox.top,
        width: boundingBox.width,
        height: boundingBox.height,
        pointerEvents: 'auto'
      }}
    >
      {/* Dashed blue bounding box outline */}
      <div 
        className="absolute inset-0 border-2 border-dashed border-blue-500 pointer-events-none"
        style={{ 
          borderRadius: '4px',
          animation: isScaling ? 'pulse 0.5s ease-in-out infinite alternate' : 'none'
        }} 
      />
      
      {/* Drag area - covers the entire bounding box */}
      <div 
        onMouseDown={onMouseDown}
        className="absolute inset-0 cursor-move"
        style={{ 
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      />
      
      {/* Control buttons - Fixed size above top-right corner in screen space */}
      <div className="absolute flex gap-2" style={{ 
        top: '-32px', 
        right: '-8px',
        zIndex: 1001,
        transform: 'none' // Fixed in screen space
      }}>
        {/* Move button */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg border border-gray-200">
          <Move className="w-3 h-3 text-blue-500" />
          <span className="text-xs text-gray-600 font-medium">Move</span>
        </div>
        
        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center shadow-lg transition-colors border border-red-600"
          title="Delete (or press Delete/ESC key)"
          style={{ 
            fontSize: '16px',
            transform: 'none' // Fixed in screen space
          }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Scaling handles - Fixed in screen space */}
      {handles.map((handle) => (
        <div
          key={handle.position}
          className={`absolute w-3 h-3 bg-[#121417] border-2 border-white rounded-sm shadow-lg hover:bg-[#2a2d31] transition-colors ${
            handle.type === 'corner' ? 'z-[1002]' : 'z-[1001]'
          }`}
          style={{
            left: handle.x,
            top: handle.y,
            cursor: handle.cursor,
            transform: 'none' // Fixed in screen space
          }}
          onMouseDown={(e) => onScaleStart(e, handle.position)}
          title={`Scale from ${handle.position}`}
        />
      ))}
      
      {/* Scale indicator - Fixed in screen space */}
      <div 
        className="absolute bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded shadow-lg border border-gray-200"
        style={{ 
          bottom: '-28px', 
          left: '50%', 
          transform: 'translateX(-50%)', // Only center horizontally
          whiteSpace: 'nowrap',
          zIndex: 1001
        }}
      >
        {Math.round(currentScale * 100)}% • Scale: {Math.round(minScale * 100)}%-{Math.round(maxScale * 100)}%
      </div>

      {/* Background highlight for selected state */}
      <div className="absolute inset-0 bg-blue-50 opacity-10 rounded pointer-events-none" />
    </div>
  );
}

// CSS for pulse animation
const styles = `
@keyframes pulse {
  0% { opacity: 1; }
  100% { opacity: 0.5; }
}
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('bounding-box-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'bounding-box-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}