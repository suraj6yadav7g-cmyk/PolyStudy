import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Maximize2,
  Minimize2,
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { PDFMaterial, Subject, SiteSettings } from '../types';
import { generatePolytechnicPDFBlob, downloadBlobAsFile } from '../lib/pdf-generator';
import { copyToClipboard } from '../lib/clipboard';
import { PDFBookPageContent } from './PDFBookPageContent';

interface PDFViewerModalProps {
  pdf: PDFMaterial | null;
  subject?: Subject;
  relatedPdfs?: PDFMaterial[];
  settings: SiteSettings;
  onClose: () => void;
  onSelectPdf: (pdf: PDFMaterial) => void;
  onViewSubject?: (slug: string) => void;
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  pdf,
  subject,
  relatedPdfs = [],
  settings,
  onClose,
  onSelectPdf,
  onViewSubject,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [animatingPage, setAnimatingPage] = useState<number | null>(null);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
    setAnimatingPage(null);
    setFlipDirection(null);
  }, [pdf?.id]);

  if (!pdf) return null;

  const totalPages = 4;

  const turnPage = (direction: 'next' | 'prev') => {
    if (animatingPage !== null) return;
    if (direction === 'next' && currentPage < totalPages) {
      setFlipDirection('next');
      setAnimatingPage(currentPage);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setAnimatingPage(null);
        setFlipDirection(null);
      }, 360);
    } else if (direction === 'prev' && currentPage > 1) {
      setFlipDirection('prev');
      setAnimatingPage(currentPage);
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setAnimatingPage(null);
        setFlipDirection(null);
      }, 360);
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const blob = generatePolytechnicPDFBlob({
        title: pdf.title,
        subjectName: subject?.name || 'Polytechnic Engineering',
        chapter: pdf.chapter,
        description: pdf.description,
      });
      downloadBlobAsFile(blob, `${pdf.slug}.pdf`);
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setTimeout(() => setIsDownloading(false), 600);
    }
  };

  const handleShare = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/85 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto"
    >
      <div
        className={`bg-white rounded-xl shadow-2xl flex flex-col transition-all overflow-hidden border border-slate-200 ${
          isFullscreen
            ? 'w-full h-full rounded-none'
            : 'w-full max-w-5xl h-[92vh] max-h-[900px]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h2 className="text-sm font-semibold truncate leading-tight text-white">
                {pdf.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{subject?.name || 'Polytechnic Material'}</span>
                <span>·</span>
                <span>{pdf.chapter}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Copy share link"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
              title={isFullscreen ? 'Exit full screen' : 'Full screen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout: Pure Full-Width PDF Reader Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/10 p-2 sm:p-5 items-center justify-between relative book-perspective select-none">
          {/* Quick Interactive Side Flip Click Zones */}
          {currentPage > 1 && (
            <button
              type="button"
              onClick={() => turnPage('prev')}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-xl items-center justify-center border border-slate-200 transition-transform hover:scale-110 active:scale-95 cursor-pointer group"
              title="Turn to previous page"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}

          {currentPage < totalPages && (
            <button
              type="button"
              onClick={() => turnPage('next')}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-xl items-center justify-center border border-slate-200 transition-transform hover:scale-110 active:scale-95 cursor-pointer group"
              title="Turn to next page"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Realistic Book Frame: maximized view */}
          <div className="relative w-full max-w-3xl flex-1 flex flex-col items-center justify-center py-1">
            <div
              className={`relative w-full bg-white rounded-r-md rounded-l-sm book-page-edge flex-1 overflow-y-auto max-h-[720px] text-slate-800 transition-all duration-300 ${
                flipDirection === 'next'
                  ? 'animate-page-flip-next'
                  : flipDirection === 'prev'
                  ? 'animate-page-flip-prev'
                  : 'animate-page-arrive-next'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Book Spine Shadow Overlay */}
              <div className="absolute inset-y-0 left-0 w-8 book-spine-gradient pointer-events-none z-10" />

              {/* Corner Curl Clickable Badge */}
              <div
                onClick={() => (currentPage < totalPages ? turnPage('next') : turnPage('prev'))}
                className="absolute top-0 right-0 w-10 h-10 overflow-hidden cursor-pointer z-20 group"
                title={currentPage < totalPages ? "Click to flip forward" : "Click to flip backward"}
              >
                <div className="absolute transform rotate-45 bg-indigo-600/90 text-[8px] text-white font-mono text-center w-14 py-0.5 right-[-14px] top-[10px] shadow-sm group-hover:bg-indigo-700 transition-colors">
                  Flip 📖
                </div>
              </div>

              {/* Inner Page Content Padding */}
              <div className="p-4 sm:p-8 md:p-10 font-serif">
                {/* Header on page */}
                <div className="border-b-2 border-slate-900 pb-3 mb-6 flex justify-between items-end font-sans">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-700">
                      POLYSTUDY DIPLOMA ENGINEERING REPOSITORY
                    </span>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                      {pdf.title}
                    </h1>
                    <p className="text-xs text-slate-600 mt-1">
                      Subject: <strong>{subject?.name}</strong> | Chapter: {pdf.chapter}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-500 font-mono">
                    <span>Page {currentPage} of {totalPages}</span>
                  </div>
                </div>

                {/* Dynamic Subject & Unit Aware Pages */}
                <PDFBookPageContent pdf={pdf} subject={subject} page={currentPage} />

                {/* Watermark in viewer */}
                <div className="mt-8 text-center text-[10px] text-slate-400 font-mono tracking-wider border-t border-slate-100 pt-3">
                  POLYSTUDY.EDU · DIPLOMA STUDY REPOSITORY
                </div>
              </div>
            </div>
          </div>

          {/* Paging controls & Flip Instructions */}
          <div className="flex items-center gap-3 sm:gap-4 bg-white/95 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg border border-slate-300 mt-2 z-20">
            <button
              type="button"
              onClick={() => turnPage('prev')}
              disabled={currentPage === 1 || animatingPage !== null}
              className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded text-slate-700 hover:text-indigo-600 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev Page</span>
              <span className="sm:hidden">Prev</span>
            </button>
            <div className="h-4 w-px bg-slate-300" />
            <span className="text-xs font-mono font-bold text-slate-800">
              Page {currentPage} / {totalPages}
            </span>
            <div className="h-4 w-px bg-slate-300" />
            <button
              type="button"
              onClick={() => turnPage('next')}
              disabled={currentPage === totalPages || animatingPage !== null}
              className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded text-slate-700 hover:text-indigo-600 disabled:opacity-30 cursor-pointer"
            >
              <span className="hidden sm:inline">Next Page</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
