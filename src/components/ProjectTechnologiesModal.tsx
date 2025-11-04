import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  image?: string;
  description?: string;
  websiteUrl?: string;
  pdfUrl?: string;
  technologies: string[];
}

interface ProjectTechnologiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export function ProjectTechnologiesModal({ 
  isOpen, 
  onClose, 
  project 
}: ProjectTechnologiesModalProps) {
  if (!isOpen || !project) return null;

  return (
    <>
      {/* Floating Modal */}
      <div 
        className="fixed right-8 top-1/2 -translate-y-1/2 w-[420px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border-2 border-gray-200"
        style={{
          animation: 'floatIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          maxHeight: '85vh'
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-[#121417] to-[#2a2d35] p-6 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
          
          <div className="relative flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="inline-block px-3 py-1 bg-white/10 rounded-full mb-3">
                <span className="text-white/80 text-xs font-medium">
                  {project.technologies.length} Technologies
                </span>
              </div>
              <h2 className="text-white text-xl font-bold leading-tight">
                {project.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X size={20} color="#ffffff" />
            </button>
          </div>
        </div>

        {/* Technologies Floating Box */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          {/* Project Description */}
          {project.description && (
            <div className="mb-6 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
              <p className="text-[#121417] text-sm leading-relaxed font-['Space_Grotesk']">
                {project.description}
              </p>
              {project.websiteUrl && (
                <div className="mt-4">
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#121417] text-sm leading-relaxed font-['Space_Grotesk'] background-color-[#121417]"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-6 border border-gray-200/50 shadow-inner">
            {/* Floating Tags Container */}
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech, index) => (
                <div
                  key={index}
                  className="group relative"
                  style={{
                    animation: `tagFloat 0.5s ease-out ${index * 0.05}s both`,
                  }}
                >
                  {/* Tag */}
                  <div className="relative bg-white rounded-lg px-4 py-2.5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/80 hover:border-[#121417] hover:-translate-y-1 cursor-default">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full bg-gradient-to-br from-[#121417] to-[#4a4d55]"
                        style={{ 
                          boxShadow: '0 0 8px rgba(18, 20, 23, 0.3)'
                        }}
                      />
                      <span className="text-[#121417] font-medium text-sm whitespace-nowrap">
                        {tech}
                      </span>
                    </div>
                    
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#121417]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative elements */}
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#121417]/10" />
            <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-[#121417]/10" />
          </div>

          {/* Optional small project image */}
          {project.image && (
            <div className="mt-6">
              <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(100px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0) scale(1);
          }
        }

        @keyframes tagFloat {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
