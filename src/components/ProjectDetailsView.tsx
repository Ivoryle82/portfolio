import React from 'react';
import { X } from 'lucide-react';

export interface ProjectDetails {
  id: string;
  title: string;
  technologies: string;
  accomplishments: string[];
  narrative: string;
  type?: string;
  timeline?: string;
}

interface ProjectDetailsViewProps {
  project: ProjectDetails;
  onClose: () => void;
}

export function ProjectDetailsView({ project, onClose }: ProjectDetailsViewProps) {
  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#e5e8eb]">
          <h2 className="text-[24px] font-['Space_Grotesk']">{project.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-full">
            {/* Left Side - Tools & Accomplishments */}
            <div className="bg-[#f8f9fa] p-8 border-r border-[#e5e8eb]">
              <div className="space-y-6">
                {/* Technologies */}
                <div>
                  <h3 className="text-[14px] text-[#61758a] mb-3 uppercase tracking-wide">Technologies Used</h3>
                  <p className="text-[16px] text-[#121417] leading-relaxed">
                    {project.technologies}
                  </p>
                </div>

                {/* Accomplishments */}
                <div>
                  <h3 className="text-[14px] text-[#61758a] mb-3 uppercase tracking-wide">Key Accomplishments</h3>
                  <ul className="space-y-3">
                    {project.accomplishments.map((accomplishment, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-[#121417] mt-1.5">•</span>
                        <span className="text-[16px] text-[#121417] leading-relaxed flex-1">
                          {accomplishment}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Side - Project Narrative */}
            <div className="bg-white p-8">
              <div className="space-y-4">
                <h3 className="text-[14px] text-[#61758a] uppercase tracking-wide">Project Overview</h3>
                <div className="text-[16px] text-[#121417] leading-relaxed whitespace-pre-line">
                  {project.narrative}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
