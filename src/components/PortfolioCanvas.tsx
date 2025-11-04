import React, { useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { CanvasElement } from './CanvasElement';
import { SelectionOverlay } from './SelectionOverlay';
import { PDFViewer } from './PDFViewer';

interface PortfolioCanvasProps {
  canvasParts: any[];
  portfolioData: {
    body: any;
    color: any;
    background: any;
  };
  characterName?: string;
  selectedPart?: string | null;
  selectedProject?: { id: string; title: string; image?: string; pdfUrl?: string; technologies: string[] } | null;
  aboutMeImage?: string;
  onPartDrop: (part: any, position: { x: number; y: number }) => void;
  onPartMove: (partId: string, position: { x: number; y: number }) => void;
  onPartRemove: (partId: string) => void;
  onPartScale?: (partId: string, scale: number) => void;
  onPartSelect?: (partId: string) => void;
  onPartDeselect?: () => void;
}

// Item Wrapper for canvas elements
function ItemWrapper({ children, part }: { children: React.ReactNode; part: any }) {
  const currentScale = part.scale || 1.0;
  
  return (
    <div
      data-part-id={part.id}
      className="absolute"
      style={{
        left: part.x - 75,
        top: part.y - 75,
        zIndex: part.category === 'accessory' ? 20 : part.category === 'eyes' ? 15 : part.category === 'mouth' ? 12 : 10,
        transform: `scale(${currentScale})`,
        transformOrigin: 'center',
        overflow: 'visible'
      }}
    >
      <div
        className="canvas-asset-wrapper-frame"
        style={{
          overflow: 'visible',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'fit-content',
          height: 'fit-content',
          padding: part.transparentPadding ? '32px' : '16px',
          minWidth: '120px',
          minHeight: '120px',
        }}
      >
        <div
          className="canvas-asset-content"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformOrigin: 'center',
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function CanvasPart({ part, onSelect }: { part: any; onSelect: () => void }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'canvas-part',
    item: { id: part.id, part },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getAssetScale = () => {
    switch (part.category) {
      case 'body':
        return 1.0;
      case 'technology':
        return 1.0;
      default:
        return 0.5;
    }
  };

  const renderAssetContent = () => {
    const assetScale = getAssetScale();
    
    const contentStyle = {
      transform: `scale(${assetScale})`,
      transformOrigin: 'center',
    };

    if (part.category === 'technology') {
      if (part.image) {
        return (
          <div style={contentStyle}>
            <img 
              src={part.image} 
              alt={part.name}
              style={{ 
                width: 'auto',
                height: 'auto',
                maxWidth: '200px',
                maxHeight: '200px',
                objectFit: 'contain',
                pointerEvents: 'none'
              }}
            />
          </div>
        );
      } else {
        return (
          <div 
            style={{ 
              ...contentStyle,
              padding: '20px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '2px solid #D9DEE5',
              fontFamily: 'Space Grotesk',
              fontSize: '24px',
              fontWeight: 600,
              color: '#121417',
              textAlign: 'center',
              minWidth: '150px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            {part.name}
          </div>
        );
      }
    }
    
    return (
      <div style={contentStyle}>
        <CanvasElement part={part} />
      </div>
    );
  };

  return (
    <div
      ref={drag}
      className={`${isDragging ? 'opacity-50' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={{ cursor: 'pointer' }}
    >
      <ItemWrapper part={part}>
        {renderAssetContent()}
      </ItemWrapper>
    </div>
  );
}

export function PortfolioCanvas({ 
  canvasParts, 
  portfolioData, 
  characterName, 
  selectedPart,
  selectedProject,
  aboutMeImage,
  onPartDrop, 
  onPartMove, 
  onPartRemove,
  onPartScale,
  onPartSelect,
  onPartDeselect
}: PortfolioCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ['eyes', 'mouth', 'accessory', 'technology'],
    drop: (item: any, monitor) => {
      if (!canvasRef.current) return;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const dropPosition = monitor.getClientOffset();
      
      if (dropPosition) {
        const x = dropPosition.x - canvasRect.left;
        const y = dropPosition.y - canvasRect.top;
        onPartDrop(item, { x, y });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (!canvasRef.current) return;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      
      const partWithWrapperFrame = {
        ...dragData,
        wrapperFrame: true,
        clipContent: false,
        transparentPadding: true
      };
      
      onPartDrop(partWithWrapperFrame, { x, y });
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onPartDeselect) {
      onPartDeselect();
    }
  };

  const getColorFilter = () => {
    if (portfolioData.color && portfolioData.color.id !== 'default') {
      return `hue-rotate(${portfolioData.color.hue || 0}deg) saturate(${portfolioData.color.saturation || 1})`;
    }
    return undefined;
  };

  return (
    <div
      ref={(node) => {
        drop(node);
        canvasRef.current = node;
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleCanvasClick}
      data-canvas="portfolio-canvas"
      className={`bg-[#fefdfa] relative shrink-0 w-full rounded-lg h-[522px] transition-all duration-200 overflow-hidden border border-gray-200 ${
        isOver && canDrop ? 'ring-2 ring-[#121417] ring-opacity-20 scale-[1.01]' : ''
      }`}
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border overflow-clip relative w-full h-full">
        
        {/* Project Background Image */}
        {portfolioData.body && portfolioData.body.image && (
          <div
            className="absolute inset-0 z-0"
            style={{ 
              backgroundImage: `url('${portfolioData.body.image}')`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              filter: getColorFilter()
            }}
          />
        )}

        {/* About Me Image Display */}
        {aboutMeImage && (
          <div className="absolute inset-0 z-0 flex items-center justify-center p-6 gap-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-5xl">
              {/* Image */}
              <div className="relative flex-shrink-0">
                <img
                  src={aboutMeImage}
                  alt="About Me"
                  className="w-auto h-auto object-contain rounded-2xl shadow-2xl"
                  style={{
                    maxHeight: '470px',
                    maxWidth: '400px'
                  }}
                />
              </div>
              
              {/* Introduction Text */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-xl">
                <h2 className="text-3xl mb-4 text-gray-900">Hi! I'm Ivory.</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    You might've already seen my résumé or found me through LinkedIn, but welcome either way!
                  </p>
                  <p>
                    This platform started out as my personal photo gallery—you should definitely check it out! I'm passionate about street photography and love capturing moments with the people I care about. I also travel a lot, so this space helps me relive those memories.
                  </p>
                  <p>
                    If you toggle the "Technologies" button, you'll see the tools I use and the projects I've built with them—it's kind of like a "build-a-project-with-me" experience! There's also an archive of my previous work in case you're curious.
                  </p>
                  <p className="text-gray-900">
                    Let's get in touch if any of this sounds interesting!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Project Display */}
        {!aboutMeImage && selectedProject && (
          <div className="absolute inset-0 z-0 flex items-center justify-center p-8">
            <div className="relative w-full h-full flex items-center justify-center">
              {selectedProject.pdfUrl ? (
                // Display PDF if available
                <PDFViewer 
                  pdfUrl={selectedProject.pdfUrl}
                  title={selectedProject.title}
                />
              ) : selectedProject.image ? (
                // Fall back to image if no PDF
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-auto h-auto max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                  style={{
                    maxHeight: '450px',
                    maxWidth: '650px'
                  }}
                />
              ) : (
                // Placeholder if neither PDF nor image is available
                <div className="flex items-center justify-center h-full">
                  <p className="text-[#6b7280] font-['Space_Grotesk']">No preview available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Drop indicator */}
        {isOver && canDrop && (
          <div className="absolute inset-0 bg-[#f5f6f7] bg-opacity-50 rounded-lg flex items-center justify-center pointer-events-none z-30">
            <div className="bg-white/90 backdrop-blur-sm rounded px-6 py-4 shadow-lg border border-[#e5e8eb]">
              <p className="text-[#121417] font-['Space_Grotesk'] animate-pulse">
                Drop here! ✨
              </p>
            </div>
          </div>
        )}

        {/* Canvas Parts */}
        {canvasParts.map((part) => (
          <CanvasPart
            key={part.id}
            part={part}
            onSelect={() => onPartSelect && onPartSelect(part.id)}
          />
        ))}

        {/* Selection Overlay */}
        <SelectionOverlay
          selectedPartId={selectedPart}
          canvasParts={canvasParts}
          canvasRef={canvasRef}
          onPartMove={onPartMove}
          onPartScale={onPartScale || (() => {})}
          onPartDelete={onPartRemove}
          onDeselect={onPartDeselect || (() => {})}
        />

        {/* Character Name Display */}
        {characterName && (portfolioData.body || canvasParts.length > 0) && (
          <div className="absolute top-4 right-4 z-20">
            <p className="text-[rgba(0,0,0,1)] text-sm font-['Space_Grotesk'] font-medium text-[24px]">
              {characterName}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!portfolioData.body && canvasParts.length === 0 && !selectedProject && !aboutMeImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-gray-400 font-['Space_Grotesk'] text-lg">
                Select a technology to explore projects
              </p>
              <p className="text-gray-300 font-['Space_Grotesk'] text-sm mt-2">
                Or click "About Me" to learn more
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
