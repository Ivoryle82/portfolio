import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, Move } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  image?: string;
  description?: string;
  websiteUrl?: string;
  pdfUrl?: string;
  technologies: string[];
}

interface TechnologyProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  technology: string | null;
  projects: Project[];
  onProjectClick?: (project: Project) => void;
}

export function TechnologyProjectsModal({ 
  isOpen, 
  onClose, 
  technology, 
  projects,
  onProjectClick
}: TechnologyProjectsModalProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsMinimized(false);
      setIsExpanded(false);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current) {
      setIsDragging(true);
      const rect = modalRef.current.getBoundingClientRect();
      setDragStart({
        x: e.clientX - (position.x !== 0 ? position.x : rect.left),
        y: e.clientY - (position.y !== 0 ? position.y : rect.top)
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const modalWidth = isMinimized ? 300 : isExpanded ? 600 : 400;
        const modalHeight = isMinimized ? 60 : isExpanded ? window.innerHeight * 0.8 : window.innerHeight;
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        setPosition({
          x: Math.max(0, Math.min(newX, window.innerWidth - modalWidth)),
          y: Math.max(0, Math.min(newY, window.innerHeight - 60))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, isExpanded, isMinimized, position]);

  if (!isOpen || !technology) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        style={{
          animation: 'fadeIn 0.2s ease-out'
        }}
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className={`fixed bg-white shadow-2xl z-50 overflow-hidden transition-all duration-300 ${
          isMinimized ? 'w-[300px] h-[60px]' : isExpanded ? 'w-[600px] h-[80vh]' : 'w-[400px] h-full'
        } ${position.x !== 0 || position.y !== 0 ? '' : 'left-0 top-0'}`}
        style={{
          animation: isMinimized ? 'none' : 'slideInFromLeft 0.3s ease-out',
          transform: position.x !== 0 || position.y !== 0 ? `translate(${position.x}px, ${position.y}px)` : undefined,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
      >
        {/* Header */}
        <div 
          className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between"
          onMouseDown={handleMouseDown}
          style={{ cursor: 'grab' }}
        >
          <div className="flex-1 flex items-center gap-2">
            <Move size={16} color="#6B7280" className="opacity-50" />
            <div className="flex-1">
              {!isMinimized && (
                <>
                  <h2 className="mb-2" style={{ fontWeight: 700, color: '#121417' }}>
                    {technology}
                  </h2>
                  <p style={{ color: '#6B7280' }}>
                    {projects.length} {projects.length === 1 ? 'project' : 'projects'} using this technology
                  </p>
                </>
              )}
              {isMinimized && (
                <h2 className="text-sm" style={{ fontWeight: 700, color: '#121417' }}>
                  {technology}
                </h2>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {!isMinimized && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 size={20} color="#121417" /> : <Maximize2 size={20} color="#121417" />}
              </button>
            )}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isMinimized ? "Expand" : "Minimize"}
            >
              <Minimize2 size={20} color="#121417" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X size={20} color="#121417" />
            </button>
          </div>
        </div>

        {/* Projects List */}
        {!isMinimized && (
          <div className="p-6 space-y-4 overflow-y-auto" style={{ height: isExpanded ? 'calc(80vh - 120px)' : 'calc(100vh - 120px)' }}>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <p style={{ color: '#6B7280' }}>
                No projects found using this technology
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white cursor-pointer"
                onClick={() => {
                  onProjectClick?.(project);
                  onClose();
                }}
              >
                {/* Project Image */}
                {project.image && (
                  <div className="w-full h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Project Info */}
                <div className="p-4">
                  <h3 
                    className="mb-2" 
                    style={{ 
                      fontWeight: 600,
                      color: '#121417' 
                    }}
                  >
                    {project.title}
                  </h3>
                  
                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 rounded-md"
                        style={{
                          backgroundColor: tech === technology ? '#121417' : '#F3F4F6',
                          color: tech === technology ? '#FFFFFF' : '#6B7280',
                          fontWeight: 500
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span
                        className="px-2 py-1 rounded-md"
                        style={{
                          backgroundColor: '#F3F4F6',
                          color: '#6B7280',
                          fontWeight: 500
                        }}
                      >
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
