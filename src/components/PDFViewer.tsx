import React, { useState } from 'react';
import { ExternalLink, Download, X } from 'lucide-react';

interface PDFViewerProps {
  pdfUrl: string;
  title: string;
}

export function PDFViewer({ pdfUrl, title }: PDFViewerProps) {
  const [hasError, setHasError] = useState(false);

  const handleOpenInNewTab = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
        <div className="text-6xl">📄</div>
        <p className="text-[#121417] font-['Space_Grotesk'] text-center">
          Unable to display PDF in browser
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleOpenInNewTab}
            className="flex items-center gap-2 bg-[#121417] hover:bg-[#2a2d31] text-white px-4 py-2 rounded transition-colors font-['Space_Grotesk']"
          >
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 border border-[#e5e8eb] bg-white hover:bg-[#f5f6f7] text-[#121417] px-4 py-2 rounded transition-colors font-['Space_Grotesk']"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* PDF Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={handleOpenInNewTab}
          className="bg-white border border-[#e5e8eb] hover:bg-[#f5f6f7] text-[#121417] p-2 rounded transition-colors"
          title="Open in new tab"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
        <button
          onClick={handleDownload}
          className="bg-white border border-[#e5e8eb] hover:bg-[#f5f6f7] text-[#121417] p-2 rounded transition-colors"
          title="Download PDF"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* PDF Embed */}
      <iframe
        src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
        className="w-full h-full border-0"
        title={title}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
