import React, { useRef, useEffect, useState } from 'react';

interface SelectorRowProps {
  children?: React.ReactNode;
  isOpen: boolean;
  sectionName: string;
}

export function SelectorRow({ children = null, isOpen, sectionName }: SelectorRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = useState(160);

  // Calculate row height = max(160, tallest child)
  useEffect(() => {
    if (!isOpen || !rowRef.current) return;

    const updateRowHeight = () => {
      const cards = Array.from(rowRef.current?.querySelectorAll('.selector-card') || []) as HTMLElement[];
      if (cards.length === 0) {
        setRowHeight(160);
        return;
      }

      // Get the tallest card height
      const heights = cards.map(card => {
        const rect = card.getBoundingClientRect();
        return rect.height;
      });
      
      // Row height = max(160, tallest child)
      const maxHeight = Math.max(...heights, 160);
      setRowHeight(maxHeight);
    };

    // Update on mount and when content changes
    updateRowHeight();
    
    // Use ResizeObserver for responsive updates
    const resizeObserver = new ResizeObserver(updateRowHeight);
    const cards = Array.from(rowRef.current?.querySelectorAll('.selector-card') || []);
    cards.forEach(card => resizeObserver.observe(card));
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="selector-row-container"
      style={{
        marginTop: '16px',
        // Frame styling to match Figma specs
        borderRadius: '20px',
        backgroundColor: '#F7F8FA',
        // Allow overflow on container level for proper scrolling
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        // Constrain width to parent container
        width: '100%'
      }}
    >
      <div
        ref={rowRef}
        className="selector-row scrollbar-hide"
        data-section={sectionName}
        style={{
          // Auto layout: Horizontal, gap 24, padding 24/24/24/24
          display: 'flex',
          flexDirection: 'row',
          gap: '24px',
          padding: '24px',
          // Enable horizontal scrolling
          overflowX: 'auto',
          overflowY: 'hidden',
          // Prevent flex wrapping - this is crucial for horizontal scroll
          flexWrap: 'nowrap',
          // Row height management - cards center vertically
          minHeight: `${rowHeight}px`,
          alignItems: 'center',
          // Force the content to extend beyond container width
          width: '100%',
          // Smooth scrolling
          scrollBehavior: 'smooth',
          // Hide scrollbar on webkit browsers for cleaner look
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Custom hook for managing selector row state
export function useSelectorRowHeight(isOpen: boolean, sectionRef: React.RefObject<HTMLElement>) {
  const [height, setHeight] = useState(160);

  useEffect(() => {
    if (!isOpen || !sectionRef.current) return;

    const updateHeight = () => {
      const cards = Array.from(sectionRef.current?.querySelectorAll('.selector-card') || []) as HTMLElement[];
      if (cards.length === 0) {
        setHeight(160);
        return;
      }

      const heights = cards.map(card => card.getBoundingClientRect().height);
      const maxHeight = Math.max(...heights, 160);
      setHeight(maxHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    const cards = Array.from(sectionRef.current?.querySelectorAll('.selector-card') || []);
    cards.forEach(card => resizeObserver.observe(card));

    return () => resizeObserver.disconnect();
  }, [isOpen, sectionRef]);

  return height;
}