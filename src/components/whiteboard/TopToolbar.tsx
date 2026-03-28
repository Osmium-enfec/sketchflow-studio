import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Type, ArrowRight, Highlighter, Trash2, User, Smile, Smartphone, ArrowDown, CornerDownRight, FileText, Monitor, PersonStanding, BookOpen, Layout, Download, FileVideo, FileImage, FileCode2, Shapes, Film } from 'lucide-react';
import { useWhiteboardStore, CanvasType } from '@/store/whiteboardStore';
import { Button } from '@/components/ui/button';

const TopToolbar: React.FC = () => {
  const { addComponent, isPlaying, setPlaying, selectedId, removeComponent, canvasType, setCanvasType } = useWhiteboardStore();
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [docSubOpen, setDocSubOpen] = useState(false);
  const [textOpen, setTextOpen] = useState(false);
  const [mdSubOpen, setMdSubOpen] = useState(false);
  const [elementsOpen, setElementsOpen] = useState(false);
  const [boxSubOpen, setBoxSubOpen] = useState(false);
  const [arrowSubOpen, setArrowSubOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [charsOpen, setCharsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);
  const docsRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const closeAll = () => {
    setCanvasOpen(false); setDocSubOpen(false);
    setTextOpen(false); setMdSubOpen(false);
    setElementsOpen(false); setBoxSubOpen(false); setArrowSubOpen(false);
    setDocsOpen(false); setCharsOpen(false); setExportOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (canvasRef.current && !canvasRef.current.contains(t)) { setCanvasOpen(false); setDocSubOpen(false); }
      if (textRef.current && !textRef.current.contains(t)) { setTextOpen(false); setMdSubOpen(false); }
      if (elementsRef.current && !elementsRef.current.contains(t)) { setElementsOpen(false); setBoxSubOpen(false); setArrowSubOpen(false); }
      if (docsRef.current && !docsRef.current.contains(t)) setDocsOpen(false);
      if (charsRef.current && !charsRef.current.contains(t)) setCharsOpen(false);
      if (exportRef.current && !exportRef.current.contains(t)) setExportOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 5l3 3 3-3" />
    </svg>
  );

  const SubChevron = () => (
    <svg className="h-3 w-3 -rotate-90" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5l3 3 3-3" /></svg>
  );

  return (
    <div className="h-14 toolbar-bg border-b flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        {/* Canvas type selector */}
        <div className="relative" ref={canvasRef}>
          <Button variant="ghost" size="sm" onClick={() => { closeAll(); setCanvasOpen(!canvasOpen); }} className="gap-1.5">
            <Layout className="h-4 w-4" />
            {canvasType === 'whiteboard' ? 'Whiteboard' : canvasType === 'doc-white' ? 'Doc (Light)' : 'Doc (Dark)'}
            <ChevronIcon open={canvasOpen} />
          </Button>
          {canvasOpen && (
            <div className="absolute top-full left-0 mt-1 bg-card border rounded-lg shadow-lg z-50 min-w-[180px] py-1">
              <button onClick={() => { setCanvasType('whiteboard'); setCanvasOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors ${canvasType === 'whiteboard' ? 'bg-muted font-medium' : ''}`}>
                ✏️ Whiteboard
              </button>
              <div className="relative" onMouseEnter={() => setDocSubOpen(true)} onMouseLeave={() => setDocSubOpen(false)}>
                <button className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors ${canvasType.startsWith('doc') ? 'bg-muted font-medium' : ''}`}>
                  <span className="flex items-center gap-3">📄 Documentation (A4)</span>
                  <SubChevron />
                </button>
                {docSubOpen && (
                  <div className="absolute left-full top-0 ml-1 bg-card border rounded-lg shadow-lg z-50 min-w-[140px] py-1">
                    <button onClick={() => { setCanvasType('doc-white'); closeAll(); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors ${canvasType === 'doc-white' ? 'font-medium' : ''}`}>
                      ☀️ White
                    </button>
                    <button onClick={() => { setCanvasType('doc-dark'); closeAll(); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors ${canvasType === 'doc-dark' ? 'font-medium' : ''}`}>
                      🌙 Dark
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-border" />
        <span className="font-semibold text-lg tracking-tight mr-4">✏️ WhiteBoard</span>
        <div className="h-6 w-px bg-border" />

        {/* Text dropdown */}
        <div className="relative" ref={textRef}>
          <Button variant="ghost" size="sm" onClick={() => { closeAll(); setTextOpen(!textOpen); }} className="gap-1.5">
            <Type className="h-4 w-4" /> Text <ChevronIcon open={textOpen} />
          </Button>
          {textOpen && (
            <div className="absolute top-full left-0 mt-1 bg-card border rounded-lg shadow-lg z-50 min-w-[180px] py-1">
              <button onClick={() => { addComponent('title'); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <Type className="h-4 w-4 text-muted-foreground" /> Title
              </button>
              <button onClick={() => { addComponent('content'); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <FileCode2 className="h-4 w-4 text-muted-foreground" /> Content
              </button>
              <div className="border-t my-1" />
              <div className="relative" onMouseEnter={() => setMdSubOpen(true)} onMouseLeave={() => setMdSubOpen(false)}>
                <button className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                  <span className="flex items-center gap-3"><FileCode2 className="h-4 w-4 text-muted-foreground" /> Markdown</span>
                  <SubChevron />
                </button>
                {mdSubOpen && (
                  <div className="absolute left-full top-0 ml-1 bg-card border rounded-lg shadow-lg z-50 min-w-[140px] py-1">
                    <button onClick={() => { addComponent('markdown', { variant: 'light' }); closeAll(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                      ☀️ Light
                    </button>
                    <button onClick={() => { addComponent('markdown', { variant: 'dark' }); closeAll(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                      🌙 Dark
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Elements dropdown (Box + Arrow + Highlight) */}
        <div className="relative" ref={elementsRef}>
          <Button variant="ghost" size="sm" onClick={() => { closeAll(); setElementsOpen(!elementsOpen); }} className="gap-1.5">
            <Shapes className="h-4 w-4" /> Elements <ChevronIcon open={elementsOpen} />
          </Button>
          {elementsOpen && (
            <div className="absolute top-full left-0 mt-1 bg-card border rounded-lg shadow-lg z-50 min-w-[180px] py-1">
              {/* Box sub-menu */}
              <div className="relative" onMouseEnter={() => setBoxSubOpen(true)} onMouseLeave={() => setBoxSubOpen(false)}>
                <button className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                  <span className="flex items-center gap-3"><Square className="h-4 w-4 text-muted-foreground" /> Box</span>
                  <SubChevron />
                </button>
                {boxSubOpen && (
                  <div className="absolute left-full top-0 ml-1 bg-card border rounded-lg shadow-lg z-50 min-w-[160px] py-1">
                    <button onClick={() => { addComponent('box'); closeAll(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                      <Square className="h-4 w-4 text-muted-foreground" /> Sketch Box
                    </button>
                    <button onClick={() => { addComponent('foldedBox'); closeAll(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                      <FileText className="h-4 w-4 text-muted-foreground" /> Folded Box
                    </button>
                    <button onClick={() => { addComponent('codeBox'); closeAll(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                      <Monitor className="h-4 w-4 text-muted-foreground" /> Code Box
                    </button>
                  </div>
                )}
              </div>
              {/* Arrow sub-menu */}
              <div className="relative" onMouseEnter={() => setArrowSubOpen(true)} onMouseLeave={() => setArrowSubOpen(false)}>
                <button className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                  <span className="flex items-center gap-3"><ArrowRight className="h-4 w-4 text-muted-foreground" /> Arrow</span>
                  <SubChevron />
                </button>
                {arrowSubOpen && (
                  <div className="absolute left-full top-0 ml-1 bg-card border rounded-lg shadow-lg z-50 min-w-[180px] py-1">
                    <button onClick={() => { addComponent('arrow'); closeAll(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" /> Simple Arrow
                    </button>
                    <button onClick={() => { addComponent('gradientArrow'); closeAll(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                      <ArrowDown className="h-4 w-4 text-muted-foreground" /> Gradient Arrow
                    </button>
                    <button onClick={() => { addComponent('curvedArrow'); closeAll(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                      <CornerDownRight className="h-4 w-4 text-muted-foreground" /> Curved Arrow
                    </button>
                  </div>
                )}
              </div>
              <div className="border-t my-1" />
              {/* Highlight direct */}
              <button onClick={() => { addComponent('highlight'); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <Highlighter className="h-4 w-4 text-muted-foreground" /> Highlight
              </button>
            </div>
          )}
        </div>

        {/* Documentation dropdown */}
        <div className="relative" ref={docsRef}>
          <Button variant="ghost" size="sm" onClick={() => { closeAll(); setDocsOpen(!docsOpen); }} className="gap-1.5">
            <BookOpen className="h-4 w-4" /> Doc <ChevronIcon open={docsOpen} />
          </Button>
          {docsOpen && (
            <div className="absolute top-full left-0 mt-1 bg-card border rounded-lg shadow-lg z-50 min-w-[160px] py-1">
              <button onClick={() => { addComponent('documentation', { variant: 'white' }); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <div className="w-4 h-4 border rounded bg-white" /> White Page
              </button>
              <button onClick={() => { addComponent('documentation', { variant: 'black' }); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <div className="w-4 h-4 border rounded bg-gray-900" /> Dark Page
              </button>
              <div className="border-t my-1" />
              <div className="px-4 py-1 text-xs text-muted-foreground font-semibold uppercase">Note</div>
              <button onClick={() => { addComponent('noteBox', { variant: 'light' }); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <div className="w-4 h-4 rounded border-l-[3px] border-l-green-600 bg-green-50" /> Light Note
              </button>
              <button onClick={() => { addComponent('noteBox', { variant: 'dark' }); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <div className="w-4 h-4 rounded border-l-[3px] border-l-green-400 bg-green-950" /> Dark Note
              </button>
              <div className="border-t my-1" />
              <div className="px-4 py-1 text-xs text-muted-foreground font-semibold uppercase">Code</div>
              <button onClick={() => { addComponent('docCodeBlock', { variant: 'light' }); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <div className="w-4 h-4 rounded border bg-green-50 flex items-center justify-center text-[6px] font-mono text-green-800">{'{}'}</div> Light Code
              </button>
              <button onClick={() => { addComponent('docCodeBlock', { variant: 'dark' }); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <div className="w-4 h-4 rounded border bg-slate-900 flex items-center justify-center text-[6px] font-mono text-blue-400">{'{}'}</div> Dark Code
              </button>
            </div>
          )}
        </div>

        {/* Characters dropdown (now includes Android/Device) */}
        <div className="relative" ref={charsRef}>
          <Button variant="ghost" size="sm" onClick={() => { closeAll(); setCharsOpen(!charsOpen); }} className="gap-1.5">
            <User className="h-4 w-4" /> Character <ChevronIcon open={charsOpen} />
          </Button>
          {charsOpen && (
            <div className="absolute top-full left-0 mt-1 bg-card border rounded-lg shadow-lg z-50 min-w-[180px] py-1">
              <button onClick={() => { addComponent('character'); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <User className="h-4 w-4 text-muted-foreground" /> Doodle Character
              </button>
              <button onClick={() => { addComponent('indianCharacter'); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <Smile className="h-4 w-4 text-muted-foreground" /> Indian Face
              </button>
              <div className="border-t my-1" />
              <div className="px-4 py-1 text-xs text-muted-foreground font-semibold uppercase">Open Peeps</div>
              <button onClick={() => { addComponent('openPeep', { variant: 'explaining' }); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <PersonStanding className="h-4 w-4 text-muted-foreground" /> Explaining
              </button>
              <button onClick={() => { addComponent('openPeep', { variant: 'coffee' }); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <PersonStanding className="h-4 w-4 text-muted-foreground" /> Coffee
              </button>
              <button onClick={() => { addComponent('openPeep', { variant: 'pointing' }); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <PersonStanding className="h-4 w-4 text-muted-foreground" /> Pointing
              </button>
              <button onClick={() => { addComponent('openPeep', { variant: 'gaming' }); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <PersonStanding className="h-4 w-4 text-muted-foreground" /> Gaming
              </button>
              <button onClick={() => { addComponent('openPeep', { variant: 'hoodie' }); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <PersonStanding className="h-4 w-4 text-muted-foreground" /> Hoodie
              </button>
              <button onClick={() => { addComponent('openPeep', { variant: 'blazer' }); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <PersonStanding className="h-4 w-4 text-muted-foreground" /> Blazer
              </button>
              <button onClick={() => { addComponent('openPeep', { variant: 'buttonShirt', scale: 1 }); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <PersonStanding className="h-4 w-4 text-muted-foreground" /> Button Shirt
              </button>
              <div className="border-t my-1" />
              <div className="px-4 py-1 text-xs text-muted-foreground font-semibold uppercase">Walking</div>
              <button onClick={() => { addComponent('walkingCharacter'); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <PersonStanding className="h-4 w-4 text-muted-foreground" /> Female Walking
              </button>
              <div className="border-t my-1" />
              <div className="px-4 py-1 text-xs text-muted-foreground font-semibold uppercase">Devices</div>
              <button onClick={() => { addComponent('device', { variant: 'phone' }); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <Smartphone className="h-4 w-4 text-muted-foreground" /> Phone
              </button>
              <button onClick={() => { addComponent('device', { variant: 'tablet' }); closeAll(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <Smartphone className="h-4 w-4 text-muted-foreground" /> Tablet
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {selectedId && (
          <Button variant="ghost" size="sm" onClick={() => removeComponent(selectedId)} className="gap-1.5 text-destructive">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        )}
        <div className="h-6 w-px bg-border" />

        {/* Export dropdown */}
        <div className="relative" ref={exportRef}>
          <Button variant="ghost" size="sm" onClick={() => { closeAll(); setExportOpen(!exportOpen); }} className="gap-1.5">
            <Download className="h-4 w-4" /> Export <ChevronIcon open={exportOpen} />
          </Button>
          {exportOpen && (
            <div className="absolute top-full right-0 mt-1 bg-card border rounded-lg shadow-lg z-50 min-w-[160px] py-1">
              <button onClick={() => { window.dispatchEvent(new CustomEvent('whiteboard-export-pdf')); setExportOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <FileImage className="h-4 w-4 text-muted-foreground" /> PDF
              </button>
              <button onClick={() => { window.dispatchEvent(new CustomEvent('whiteboard-export-mp4')); setExportOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <FileVideo className="h-4 w-4 text-muted-foreground" /> Record
              </button>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-border" />
        <Button
          size="sm"
          onClick={() => {
            const event = new CustomEvent('whiteboard-play');
            window.dispatchEvent(event);
          }}
          className="gap-1.5"
        >
          <Play className="h-4 w-4" /> Play
        </Button>
      </div>
    </div>
  );
};

export default TopToolbar;
