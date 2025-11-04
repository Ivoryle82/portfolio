import React, { useState, useRef } from 'react';

interface SelectorCardProps {
  option: any;
  category: 'body' | 'eyes' | 'mouth' | 'accessory';
  isSelected?: boolean;
  onSelect?: () => void;
  onAddToCanvas?: (part: any) => void;
  onViewDetails?: () => void;
  onTechnologyClick?: () => void;
  onGalleryClick?: () => void;
}

// Asset Wrapper component that goes inside each Selector Card
function AssetWrapperFrame({ children, category }: { children: React.ReactNode; category: string }) {
  // Calculate appropriate scale for different asset types to ensure they fit without cropping
  const getAssetScale = () => {
    switch (category) {
      case 'body':
        return 0.4; // Bodies need to fit in 192x160 with padding
      case 'eyes':
        return 0.08; // Eyes are typically large, need significant scale down
      case 'mouth':
        return 0.06; // Mouths can be wide, need to scale down
      case 'accessory':
        return 0.06; // Accessories vary, conservative scale
      default:
        return 0.1;
    }
  };

  const scale = getAssetScale();

  return (
    <div
      className="asset-wrapper-frame"
      style={{
        // No fill, no stroke, Clip content: OFF
        background: 'transparent',
        border: 'none',
        overflow: 'visible',
        // Constraints: Center / Center
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Resizing: Hug contents (both)
        width: 'fit-content',
        height: 'fit-content',
        // Internal padding 16px (expandable to prevent touching edges)
        padding: '16px',
        // Ensure wrapper doesn't exceed card bounds minus padding
        maxWidth: '160px', // 192 - 32 (16px padding on each side)
        maxHeight: '128px', // 160 - 32 (16px padding on each side)
      }}
    >
      <div
        className="asset-content"
        style={{
          // Maintain aspect ratio: ON, Scale down to fit, Never scale up
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          // Ensure content doesn't overflow
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function SelectorCard({ 
  option, 
  category, 
  isSelected = false, 
  onSelect, 
  onAddToCanvas,
  onViewDetails,
  onTechnologyClick,
  onGalleryClick 
}: SelectorCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    // Allow technologies (which don't have onViewDetails) to be dragged even if category is 'body'
    const isTechnology = category === 'body' && !onViewDetails;
    if (category === 'body' && !isTechnology) return; // Project bodies can't be dragged
    
    setIsDragging(true);
    // Create drag data with Asset Wrapper frame info (not rasterized crop)
    const dragData = {
      id: option.id,
      type: option.type,
      category: option.category,
      name: option.name,
      component: option.component,
      image: option.image,
      // Include wrapper frame data for canvas placement
      wrapperFrame: true,
      clipContent: false,
      transparentPadding: true
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    // If this is a gallery item, open the gallery page
    if (onGalleryClick && category === 'mouth') {
      onGalleryClick();
      return;
    }

    // If Shift key is pressed and onViewDetails exists, show details
    if (e.shiftKey && onViewDetails) {
      onViewDetails();
      return;
    }

    // If Alt key is pressed and onTechnologyClick exists, show technology projects modal
    if (e.altKey && onTechnologyClick) {
      onTechnologyClick();
      return;
    }

    if (onSelect) {
      onSelect();
      // Also call onTechnologyClick after onSelect if it exists (for technologies)
      if (onTechnologyClick) {
        onTechnologyClick();
      }
    } else if (onAddToCanvas) {
      // Pass full Asset Wrapper frame data
      const partData = {
        ...option,
        wrapperFrame: true,
        clipContent: false,
        transparentPadding: true
      };
      onAddToCanvas(partData);
    }
  };

  const renderAssetContent = () => {
    if (category === 'body' && option.image) {
      return (
        <img 
          src={option.image} 
          alt={option.name}
          style={{ 
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
            // Maintain aspect ratio: ON
            aspectRatio: 'auto'
          }}
        />
      );
    }
    
    // Text fallback for technologies without images
    if (category === 'body' && !option.image) {
      return (
        <div 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '12px',
            fontFamily: 'Space Grotesk',
            fontSize: '30px',
            fontWeight: 600,
            color: '#121417',
            lineHeight: '1.2',
            wordBreak: 'break-word',
            hyphens: 'auto',
          }}
        >
          {option.name}
        </div>
      );
    }
    
    if (option.component) {
      const Component = option.component;
      return <Component />;
    }
    
    return null;
  };

  // Allow technologies (which don't have onViewDetails) to be dragged even if category is 'body'
  const isTechnology = category === 'body' && !onViewDetails;
  const isDraggable = category !== 'body' || isTechnology;

  return (
    <div className="relative group" style={{ width: '192px', height: '160px' }}>
      <button
        ref={cardRef}
        draggable={isDraggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        className={`selector-card transition-all duration-200 hover:scale-105 hover:shadow-lg ${
          isDragging ? 'opacity-50 scale-110 rotate-2' : ''
        } ${isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
        style={{
          // Size: W 192 × H 160 (fixed)
          width: '192px',
          height: '160px',
          // Ensure card doesn't shrink to fit container
          flexShrink: 0,
          // Stroke #D9DEE5 2px, corner 16, fill #FFFFFF
          border: isSelected ? '2px solid #000000' : '2px solid #D9DEE5',
          borderRadius: '16px',
          backgroundColor: '#FFFFFF',
          // Clip content: OFF
          overflow: 'visible',
          // Auto layout: Center / Center (no text)
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0',
          // Additional styling for interaction
          boxShadow: isSelected ? '0 0 0 2px rgba(0, 0, 0, 0.1)' : 'none',
        }}
        title={option.name}
      >
        <AssetWrapperFrame category={category}>
          {renderAssetContent()}
        </AssetWrapperFrame>
      </button>
      
      {/* View Details Button for projects */}
      {category === 'body' && onViewDetails && (
        <>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-2xl pointer-events-none z-0" />
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-[#000000] text-white px-4 py-2 rounded-full text-[13px] opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-10 hover:bg-gray-800 shadow-lg"
            style={{ fontFamily: 'Space Grotesk', fontWeight: 500 }}
          >
            View Details
          </button>
        </>
      )}
    </div>
  );
}