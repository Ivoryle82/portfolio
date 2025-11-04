import React, { useState, useEffect, useCallback } from 'react';
import { Move, Trash2 } from 'lucide-react';

interface SelectionOverlayProps {
  selectedPartId: string | null;
  canvasParts: any[];
  canvasRef: React.RefObject<HTMLDivElement>;
  onPartMove: (partId: string, position: { x: number; y: number }) => void;
  onPartScale: (partId: string, scale: number) => void;
  onPartDelete: (partId: string) => void;
  onDeselect: () => void;
}

interface BoundingBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Handle {
  position: string;
  cursor: string;
  x: number;
  y: number;
}

const CORNER_HANDLES: Handle[] = [
  { position: 'nw', cursor: 'nw-resize', x: -6, y: -6 },
  { position: 'ne', cursor: 'ne-resize', x: 0, y: -6 },
  { position: 'sw', cursor: 'sw-resize', x: -6, y: 0 },
  { position: 'se', cursor: 'se-resize', x: 0, y: 0 },
];

export function SelectionOverlay({
  selectedPartId,
  canvasParts,
  canvasRef,
  onPartMove,
  onPartScale,
  onPartDelete,
  onDeselect
}: SelectionOverlayProps) {
  const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScaling, setIsScaling] = useState(false);
  const [dragStart, setDragStart] = useState({ pointerScene: { x: 0, y: 0 }, wrapperStart: { x: 0, y: 0 } });

  // Find the selected part
  const selectedPart = canvasParts.find(part => part.id === selectedPartId);

  // Calculate bounding box from absolute wrapper bounds
  const calculateBoundingBox = useCallback((): BoundingBox | null => {
    if (!selectedPart || !canvasRef.current) return null;

    // Find the wrapper element for this part
    const wrapperElement = canvasRef.current.querySelector(`[data-part-id="${selectedPartId}"]`);
    if (!wrapperElement) return null;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const wrapperRect = wrapperElement.getBoundingClientRect();

    // Convert to canvas-relative coordinates (scene → viewport)
    return {
      left: wrapperRect.left - canvasRect.left,
      top: wrapperRect.top - canvasRect.top,
      width: wrapperRect.width,
      height: wrapperRect.height
    };
  }, [selectedPart, selectedPartId, canvasRef]);

  // Update bounding box when selection changes or parts move
  useEffect(() => {
    if (selectedPartId) {
      const updateBoundingBox = () => {
        const bbox = calculateBoundingBox();
        setBoundingBox(bbox);
      };

      updateBoundingBox();

      // Update on animation frames for smooth tracking
      const intervalId = setInterval(updateBoundingBox, 16);
      return () => clearInterval(intervalId);
    } else {
      setBoundingBox(null);
    }
  }, [selectedPartId, canvasParts, calculateBoundingBox]);

  // Convert viewport coordinates to scene coordinates
  const viewportToScene = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const canvasRect = canvasRef.current.getBoundingClientRect();
    return {
      x: clientX - canvasRect.left,
      y: clientY - canvasRect.top
    };
  }, [canvasRef]);

  // Handle dragging for 1:1 pointer tracking
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!selectedPart || !canvasRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);

    const pointerScene = viewportToScene(e.clientX, e.clientY);
    const wrapperStart = { x: selectedPart.x, y: selectedPart.y };

    setDragStart({ pointerScene, wrapperStart });

    const handleMouseMove = (e: MouseEvent) => {
      const currentPointerScene = viewportToScene(e.clientX, e.clientY);
      const delta = {
        x: currentPointerScene.x - dragStart.pointerScene.x,
        y: currentPointerScene.y - dragStart.pointerScene.y
      };

      // Update ItemWrapper position with exact delta
      const newPosition = {
        x: dragStart.wrapperStart.x + delta.x,
        y: dragStart.wrapperStart.y + delta.y
      };

      onPartMove(selectedPartId!, newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Capture pointer
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [selectedPart, selectedPartId, canvasRef, viewportToScene, dragStart, onPartMove]);

  // Handle corner scaling
  const handleScaleStart = useCallback((e: React.MouseEvent, handle: Handle) => {
    if (!selectedPart || !boundingBox) return;

    e.preventDefault();
    e.stopPropagation();

    setIsScaling(true);

    const startPointer = viewportToScene(e.clientX, e.clientY);
    const startScale = selectedPart.scale || 1.0;
    const centerX = boundingBox.left + boundingBox.width / 2;
    const centerY = boundingBox.top + boundingBox.height / 2;

    const startDistance = Math.sqrt(
      Math.pow(startPointer.x - centerX, 2) + Math.pow(startPointer.y - centerY, 2)
    );

    const handleMouseMove = (e: MouseEvent) => {
      const currentPointer = viewportToScene(e.clientX, e.clientY);
      const currentDistance = Math.sqrt(
        Math.pow(currentPointer.x - centerX, 2) + Math.pow(currentPointer.y - centerY, 2)
      );

      const scaleFactor = currentDistance / startDistance;
      let newScale = startScale * scaleFactor;

      // Apply constraints: Min 50%, Max 400%
      newScale = Math.max(0.5, Math.min(4.0, newScale));

      onPartScale(selectedPartId!, newScale);
    };

    const handleMouseUp = () => {
      setIsScaling(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [selectedPart, selectedPartId, boundingBox, viewportToScene, onPartScale]);

  // Handle ESC key for deselection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDeselect();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onDeselect]);

  // Don't render if no selection or no bounding box
  if (!selectedPartId || !boundingBox) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1000 }}
    >
      {/* Bounding Box */}
      <div
        className="absolute border-2 border-dashed border-blue-500 pointer-events-auto"
        style={{
          left: boundingBox.left,
          top: boundingBox.top,
          width: boundingBox.width,
          height: boundingBox.height,
          borderRadius: '4px'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Background highlight */}
        <div className="absolute inset-0 bg-blue-50 opacity-10 rounded pointer-events-none" />
        
        {/* Corner Handles */}
        {CORNER_HANDLES.map((handle) => (
          <div
            key={handle.position}
            className="absolute w-3 h-3 bg-[#121417] border-2 border-white rounded-sm shadow-lg hover:bg-[#2a2d31] transition-colors pointer-events-auto"
            style={{
              left: handle.position.includes('e') ? boundingBox.width + handle.x : handle.x,
              top: handle.position.includes('s') ? boundingBox.height + handle.y : handle.y,
              cursor: handle.cursor
            }}
            onMouseDown={(e) => handleScaleStart(e, handle)}
            title={`Scale from ${handle.position}`}
          />
        ))}
      </div>

      {/* Controls - Fixed size, 8px offset from top-right */}
      <div
        className="absolute flex gap-2 pointer-events-auto"
        style={{
          left: boundingBox.left + boundingBox.width + 8,
          top: boundingBox.top - 32,
          zIndex: 1001
        }}
      >
        {/* Move button - 20px fixed size */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg border border-gray-200">
          <Move className="w-3 h-3 text-blue-500" />
          <span className="text-xs text-gray-600 font-medium">Move</span>
        </div>
        
        {/* Delete button - 20px fixed size */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPartDelete(selectedPartId);
          }}
          className="w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center shadow-lg transition-colors border border-red-600"
          title="Delete (or press ESC)"
          style={{ fontSize: '12px' }}
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}