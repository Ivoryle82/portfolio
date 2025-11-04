import React from 'react';

interface CanvasElementProps {
  part: any;
  size?: 'small' | 'normal';
}

export function CanvasElement({ part, size = 'normal' }: CanvasElementProps) {
  const scale = size === 'small' ? 0.5 : 1;
  const baseSize = 120 * scale;

  // For technology elements with images
  const renderTechnologyImage = () => {
    if (part.image) {
      const imageSize = baseSize * 2.4;
      return (
        <div className="relative drop-shadow-lg">
          <img 
            src={part.image} 
            alt={part.name || 'Technology'}
            width={imageSize}
            height={imageSize}
            className="object-contain rounded-lg"
            style={{ 
              maxWidth: imageSize,
              maxHeight: imageSize
            }}
          />
        </div>
      );
    }
    
    return null;
  };

  // Render custom component if available
  const renderComponent = () => {
    if (part.component) {
      const Component = part.component;
      return <Component />;
    }
    
    return null;
  };

  return (
    <div className="flex items-center justify-center">
      {part.image ? renderTechnologyImage() : renderComponent()}
    </div>
  );
}
