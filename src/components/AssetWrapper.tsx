import React from 'react';

interface AssetWrapperProps {
  children: React.ReactNode;
  category: 'body' | 'eyes' | 'mouth' | 'accessory';
  isSelector?: boolean;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

// Dynamic padding based on content and context
const getPaddingConfig = (category: string, isSelector: boolean) => {
  if (isSelector) {
    // Consistent padding for selectors to ensure uniform appearance
    return {
      padding: '12px', // 12px padding for selectors
      minHeight: '80px',
      minWidth: '80px'
    };
  }
  
  // Canvas padding - varies by category for optimal visual balance
  switch (category) {
    case 'body':
      return { padding: '16px' };
    case 'eyes':
      return { padding: '20px' };
    case 'mouth':
      return { padding: '18px' };
    case 'accessory':
      return { padding: '24px' };
    default:
      return { padding: '16px' };
  }
};

// Scale constraints for different contexts
const getScaleConfig = (category: string, isSelector: boolean) => {
  if (isSelector) {
    // Selector scaling - scale down to fit, never up
    switch (category) {
      case 'body':
        return { maxScale: 0.8, minScale: 0.4 };
      case 'eyes':
        return { maxScale: 0.15, minScale: 0.08 };
      case 'mouth':
        return { maxScale: 0.12, minScale: 0.06 };
      case 'accessory':
        return { maxScale: 0.12, minScale: 0.06 };
      default:
        return { maxScale: 0.5, minScale: 0.2 };
    }
  }
  
  // Canvas scaling - 50% to 400% of wrapper bounds
  return { maxScale: 4.0, minScale: 0.5 };
};

export function AssetWrapper({ 
  children, 
  category, 
  isSelector = false, 
  className = '', 
  onClick,
  style = {}
}: AssetWrapperProps) {
  const paddingConfig = getPaddingConfig(category, isSelector);
  const scaleConfig = getScaleConfig(category, isSelector);
  
  const wrapperStyle = {
    // Clip content: OFF - this is crucial for transparent padding
    overflow: 'visible',
    // Auto Layout with padding
    padding: paddingConfig.padding,
    // Maintain aspect ratio and scaling constraints
    ...paddingConfig,
    // Center content
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Preserve transparent padding
    boxSizing: 'border-box',
    // Custom styles
    ...style
  };

  const contentStyle = {
    // Asset constraints: Scale, Maintain aspect ratio
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    // Ensure content doesn't exceed scale limits
    transform: isSelector ? `scale(${Math.min(scaleConfig.maxScale, 1)})` : undefined,
    transformOrigin: 'center',
    // Preserve aspect ratio
    objectFit: 'contain' as const,
    // Prevent image selection/dragging
    userSelect: 'none',
    pointerEvents: isSelector ? 'none' : 'auto'
  };

  return (
    <div
      className={`asset-wrapper ${className}`}
      style={wrapperStyle}
      onClick={onClick}
      data-category={category}
      data-is-selector={isSelector}
    >
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
}

// Higher-order component for consistent asset wrapping
export function withAssetWrapper<T extends object>(
  Component: React.ComponentType<T>,
  category: 'body' | 'eyes' | 'mouth' | 'accessory'
) {
  return React.forwardRef<HTMLDivElement, T & { 
    isSelector?: boolean; 
    wrapperClassName?: string;
    wrapperStyle?: React.CSSProperties;
    onClick?: () => void;
  }>((props, ref) => {
    const { isSelector, wrapperClassName, wrapperStyle, onClick, ...componentProps } = props;
    
    return (
      <AssetWrapper
        category={category}
        isSelector={isSelector}
        className={wrapperClassName}
        style={wrapperStyle}
        onClick={onClick}
      >
        <Component {...(componentProps as T)} />
      </AssetWrapper>
    );
  });
}

// Utility function to calculate row height based on tallest wrapper
export function calculateRowHeight(wrappers: HTMLElement[]): number {
  if (wrappers.length === 0) return 80; // Default minimum height
  
  const heights = wrappers.map(wrapper => {
    const rect = wrapper.getBoundingClientRect();
    return rect.height;
  });
  
  return Math.max(...heights, 80); // Ensure minimum 80px height
}

// Hook for dynamic row height management
export function useAutoRowHeight(isOpen: boolean, sectionRef: React.RefObject<HTMLElement>) {
  const [rowHeight, setRowHeight] = React.useState(80);
  
  React.useEffect(() => {
    if (!isOpen || !sectionRef.current) return;
    
    const updateRowHeight = () => {
      const wrappers = Array.from(sectionRef.current?.querySelectorAll('.asset-wrapper') || []) as HTMLElement[];
      const newHeight = calculateRowHeight(wrappers);
      setRowHeight(newHeight);
    };
    
    // Update on mount and when content changes
    updateRowHeight();
    
    // Use ResizeObserver for responsive updates
    const resizeObserver = new ResizeObserver(updateRowHeight);
    const wrappers = Array.from(sectionRef.current?.querySelectorAll('.asset-wrapper') || []);
    wrappers.forEach(wrapper => resizeObserver.observe(wrapper));
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen, sectionRef]);
  
  return rowHeight;
}