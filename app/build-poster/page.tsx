'use client';

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric'; // Fabric.js v6+
import { 
  Download, 
  Share2, 
  Type, 
  Image as ImageIcon, 
  Square, 
  Layout, 
  Layers, 
  Undo, 
  Redo, 
  Trash2,
  Move,
  Type as TypeIcon,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  ZoomIn,
  ZoomOut,
  Maximize,
  Hand,
  Shapes,
  Stamp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BACKGROUNDS, ASPECT_RATIOS, FONTS, SHAPES, ELEMENTS, WATERMARKS } from './data';
import Swal from 'sweetalert2';

export default function BuildPosterPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeTab, setActiveTab] = useState<'background' | 'text' | 'layers' | 'layout' | 'elements' | 'watermark'>('layout');
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [canvasColor, setCanvasColor] = useState('#ffffff');
  
  // History for Undo/Redo (Basic implementation)
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // Strict Mode Safety: Dispose if already exists
    if (canvasInstanceRef.current) {
        canvasInstanceRef.current.dispose();
    }

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 1080,
      height: 1080,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true, // Enable selection by default
    });

    canvasInstanceRef.current = fabricCanvas;
    setCanvas(fabricCanvas);

    // Event Listeners
    fabricCanvas.on('selection:created', (e) => setSelectedObject(e.selected?.[0] || null));
    fabricCanvas.on('selection:updated', (e) => setSelectedObject(e.selected?.[0] || null));
    fabricCanvas.on('selection:cleared', () => setSelectedObject(null));
    fabricCanvas.on('object:modified', () => { saveHistory(); updateLayers(fabricCanvas); });
    fabricCanvas.on('object:added', () => { saveHistory(); updateLayers(fabricCanvas); });
    fabricCanvas.on('object:removed', () => { saveHistory(); updateLayers(fabricCanvas); });
    
    // Zoom/Pan with Mouse Wheel
    fabricCanvas.on('mouse:wheel', (opt) => {
        if (opt.e.ctrlKey) {
            // Zoom
            opt.e.preventDefault();
            opt.e.stopPropagation();
        }
    });

    // Initial Fit
    setTimeout(() => fitToScreen(fabricCanvas), 100);
    console.log("Poster Builder v2 Loaded");

    return () => {
      fabricCanvas.dispose();
      canvasInstanceRef.current = null;
      setCanvas(null);
    };
  }, []);

  const fitToScreen = (c: fabric.Canvas = canvas!) => {
      if (!c || !containerRef.current) return;
      const container = containerRef.current;
      const padding = 64;
      const availableWidth = container.clientWidth - padding;
      const availableHeight = container.clientHeight - padding;
      
      const scale = Math.min(
          availableWidth / c.width!,
          availableHeight / c.height!
      );
      
      setZoom(scale);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.1));
  const handleResetZoom = () => fitToScreen();

  // Zoom Effect - Apply directly to DOM to avoid React Reconciliation issues with Fabric.js
  useEffect(() => {
      if (containerRef.current) {
          const wrapper = containerRef.current.querySelector('.canvas-transform-wrapper') as HTMLElement;
          if (wrapper) {
            wrapper.style.transform = `scale(${zoom})`;
            wrapper.style.transformOrigin = 'center center';
            wrapper.style.transition = isPanning ? 'none' : 'transform 0.2s ease-out';
            wrapper.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
          }
      }
  }, [zoom, isPanning]);

  // ... (keep existing methods)

  const [layers, setLayers] = useState<fabric.Object[]>([]);

  const updateLayers = (c: fabric.Canvas) => {
      setLayers([...c.getObjects()].reverse()); // Top to bottom
  };

  const saveHistory = () => {
    // Simple JSON history (Production would use more optimized approach)
    // Placeholder for now as deep history management in React + Fabric is complex
  };

  const resizeCanvas = (c: fabric.Canvas, width: number, height: number) => {
    if (!c) return;
    
    // Set Logical Size (The actual output size)
    c.setDimensions({ width, height });
    
    // Fit to screen initially
    fitToScreen(c);
  };

  // Re-calculate zoom on window resize
  useEffect(() => {
      const handleResize = () => {
          // Optional: Auto-fit on resize or keep zoom?
          // Keeping zoom is more standard for editors
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  const setAspectRatio = (width: number, height: number) => {
      if (!canvas) return;
      // We need to clear/reset or just resize?
      // Usually resizing canvas might cut off content or need content re-centering.
      // For now, just resize the canvas.
      resizeCanvas(canvas, width, height);
      
      // Add a background rect to show bounds if transparent? 
      // No, backgroundColor is set.
  };


  // --- Actions ---

  const addText = (text: string, options?: any) => {
    if (!canvas) return;
    const textBox = new fabric.Textbox(text, {
      left: 50,
      top: 50,
      fontSize: 40,
      fontFamily: 'Inter',
      fill: '#000000',
      textAlign: 'center',
      ...options
    });
    canvas.add(textBox);
    canvas.setActiveObject(textBox);
    canvas.renderAll();
  };

  const addShape = (shape: any) => {
    if (!canvas) return;
    let object;
    const commonOpts = { left: 100, top: 100, fill: '#3b82f6', width: 100, height: 100 };
    
    if (shape.type === 'rect') {
        object = new fabric.Rect(commonOpts);
    } else if (shape.type === 'circle') {
        object = new fabric.Circle({ ...commonOpts, radius: 50 });
    } else if (shape.type === 'triangle') {
        object = new fabric.Triangle(commonOpts);
    }
    
    if (object) {
        canvas.add(object);
        canvas.setActiveObject(object);
        canvas.renderAll();
    }
  };

  const addElement = async (element: any) => {
      if (!canvas) return;
      if (element.type === 'svg') {
          // This requires fabric.loadSVGFromString or similar
          // For now, simpler implementation for lines or just basic shapes
      } else if (element.type === 'line') {
          const line = new fabric.Line([50, 100, 200, 100], {
              left: 100,
              top: 100,
              stroke: 'black',
              strokeWidth: 5
          });
          canvas.add(line);
          canvas.setActiveObject(line);
          canvas.renderAll();
      }
  };

  const addWatermark = (wm: any) => {
      if (!canvas) return;
      if (wm.type === 'text') {
          const text = new fabric.Textbox(wm.value, {
              left: canvas.width! / 2,
              top: canvas.height! - 100,
              fontSize: 20,
              fill: '#000000',
              opacity: 0.5,
              originX: 'center',
              originY: 'center',
              ...wm.options
          });
          canvas.add(text);
          canvas.setActiveObject(text);
          canvas.renderAll();
      }
  };

  const setBackground = async (bg: any) => {
    if (!canvas) return;

    if (bg.type === 'color') {
      canvas.backgroundColor = bg.value;
    } else if (bg.type === 'image') {
       try {
        const img = await fabric.FabricImage.fromURL(bg.value, {
            crossOrigin: 'anonymous'
        });
        
        canvas.backgroundImage = img;
        
        const canvasWidth = canvas.width!;
        const canvasHeight = canvas.height!;
        
        // Scale image to cover canvas
        const scale = Math.max(
            canvasWidth / img.width!,
            canvasHeight / img.height!
        );
        
        img.scale(scale);
        
        // Center image
        img.set({
            left: (canvasWidth - img.width! * scale) / 2,
            top: (canvasHeight - img.height! * scale) / 2,
            originX: 'left',
            originY: 'top'
        });
        
        canvas.requestRenderAll();
       } catch (e) {
           console.error("Failed to load image", e);
       }
    } else if (bg.type === 'gradient') {
        // Gradient logic
    } else if (bg.type === 'solid') {
        canvas.backgroundColor = bg.value;
    }
    
    canvas.requestRenderAll();
  };

  // --- Properties Update ---
  
  const updateSelectedProperty = (key: string, value: any) => {
      if (!canvas) return;
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;

      try {
        activeObject.set(key, value);
        
        if (key === 'text' && activeObject instanceof fabric.Textbox) {
            // Special handling for text content if needed, though 'text' key usually works
        }

        canvas.requestRenderAll();
        // Force update state without destroying the object prototype
        setUpdateTrigger(prev => prev + 1);
      } catch (err) {
          console.error("Error updating property:", err);
      }
  };

  // --- Download ---

  const downloadPoster = (format: 'png' | 'jpeg' | 'webp' | 'svg' = 'png') => {
      if (!canvas) return;
      
      // Temporarily reset zoom to 1 to get full resolution export
      const originalZoom = canvas.getZoom();
      const originalWidth = canvas.width;
      const originalHeight = canvas.height;
      
      // We need to restore the true dimensions (un-scaled by zoom)
      // This part is tricky without tracking the "real" dimensions separately.
      // Let's assume 1080x1080 for now if we don't track it.
      
      // Simplified: Just download what we see for MVP, or better:
      const dataURL = canvas.toDataURL({
          format: format,
          quality: 1,
          multiplier: 1 / originalZoom // Compensate for the zoom scale
      });
      
      const link = document.createElement('a');
      link.download = `almoslem-poster-${Date.now()}.${format}`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpeg' | 'webp' | 'svg'>('png');

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
           <h1 className="text-xl font-bold text-slate-900 dark:text-white">Poster Builder</h1>
           <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">Beta</span>
        </div>
        
        <div className="flex items-center gap-2">
            <Select value={downloadFormat} onValueChange={(v: any) => setDownloadFormat(v)}>
                <SelectTrigger className="w-[100px] h-9">
                    <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPG</SelectItem>
                    <SelectItem value="webp">WEBP</SelectItem>
                    <SelectItem value="svg">SVG</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => downloadPoster(downloadFormat)}>
                <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button size="sm" onClick={async () => {
                if (!canvas) return;
                try {
                    const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 2 });
                    const blob = await (await fetch(dataUrl)).blob();
                    const file = new File([blob], 'poster.png', { type: 'image/png' });
                    
                    if (navigator.share) {
                        await navigator.share({
                            title: 'My Quran Poster',
                            text: 'Check out this poster I made on Al-Moslem!',
                            files: [file]
                        });
                    } else {
                        Swal.fire('Info', 'Web Share API not supported on this browser/device.', 'info');
                    }
                } catch (e) {
                    console.error(e);
                    Swal.fire('Error', 'Failed to share.', 'error');
                }
            }}>
                <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Toggle Sidebar Button (Mobile/Desktop) */}
        <Button
            variant="secondary"
            size="icon"
            className={`absolute top-1/2 z-30 h-16 w-5 -translate-y-1/2 rounded-r-lg rounded-l-none border-y border-r border-slate-200 shadow-md transition-all duration-300 ease-in-out dark:border-slate-700 ${isSidebarOpen ? 'left-80' : 'left-0'}`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
            {isSidebarOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>

        {/* Backdrop for Mobile Sidebar */}
        {isSidebarOpen && (
            <div 
                className="absolute inset-0 z-20 bg-black/50 md:hidden backdrop-blur-sm transition-opacity"
                onClick={() => setIsSidebarOpen(false)}
            />
        )}

        {/* Left Toolbar */}
        <div className={`absolute md:relative z-30 h-full flex-shrink-0 border-r bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col transition-all duration-300 ease-in-out shadow-xl md:shadow-none ${isSidebarOpen ? 'w-80 translate-x-0 opacity-100' : 'w-0 -translate-x-full opacity-0 overflow-hidden'}`}>
            <div className="flex border-b dark:border-slate-800 min-w-[20rem] overflow-x-auto scrollbar-hide">
                <button 
                    onClick={() => setActiveTab('layout')}
                    className={`flex-1 py-3 text-sm font-medium flex flex-col items-center gap-1 ${activeTab === 'layout' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Layout className="h-4 w-4" />
                    <span className="text-[10px]">Layout</span>
                </button>
                <button 
                    onClick={() => setActiveTab('background')}
                    className={`flex-1 py-3 text-sm font-medium flex flex-col items-center gap-1 ${activeTab === 'background' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-[10px]">Bg</span>
                </button>
                <button 
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 py-3 text-sm font-medium flex flex-col items-center gap-1 ${activeTab === 'text' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Type className="h-4 w-4" />
                    <span className="text-[10px]">Text</span>
                </button>
                <button 
                    onClick={() => setActiveTab('elements')}
                    className={`flex-1 py-3 text-sm font-medium flex flex-col items-center gap-1 ${activeTab === 'elements' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Shapes className="h-4 w-4" />
                    <span className="text-[10px]">Elements</span>
                </button>
                <button 
                    onClick={() => setActiveTab('watermark')}
                    className={`flex-1 py-3 text-sm font-medium flex flex-col items-center gap-1 ${activeTab === 'watermark' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Stamp className="h-4 w-4" />
                    <span className="text-[10px]">Watermark</span>
                </button>
                <button 
                    onClick={() => setActiveTab('layers')}
                    className={`flex-1 py-3 text-sm font-medium flex flex-col items-center gap-1 ${activeTab === 'layers' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Layers className="h-4 w-4" />
                    <span className="text-[10px]">Layers</span>
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'layout' && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Aspect Ratio</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {ASPECT_RATIOS.map((ratio) => (
                                <button
                                    key={ratio.id}
                                    className="flex flex-col items-center justify-center rounded-lg border p-4 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    onClick={() => setAspectRatio(ratio.width, ratio.height)}
                                >
                                    <ratio.icon className="mb-2 h-6 w-6 text-slate-500" />
                                    <span className="text-sm font-medium">{ratio.label}</span>
                                    <span className="text-xs text-slate-400">{ratio.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'background' && (
                    <div className="space-y-6">
                        <div>
                             <h3 className="mb-2 text-sm font-medium">Upload</h3>
                             <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <ImageIcon className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                                    </div>
                                    <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (f) => {
                                                setBackground({ type: 'image', value: f.target?.result });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }} />
                                </label>
                            </div> 
                        </div>

                        <div>
                            <h3 className="mb-2 text-sm font-medium">Solid Colors</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {['#ffffff', '#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(c => (
                                    <button 
                                        key={c}
                                        className="h-8 w-8 rounded-full border shadow-sm"
                                        style={{ backgroundColor: c }}
                                        onClick={() => setBackground({ type: 'solid', value: c })}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="mb-2 text-sm font-medium">Presets</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {BACKGROUNDS.map((bg) => (
                                    <button 
                                        key={bg.id}
                                        className="relative aspect-video overflow-hidden rounded-md border hover:ring-2 hover:ring-blue-500"
                                        onClick={() => setBackground(bg)}
                                    >
                                        {bg.type === 'image' && <img src={bg.value as string} alt={bg.name} className="h-full w-full object-cover" />}
                                        {bg.type === 'gradient' && <div className="h-full w-full" style={{ background: `linear-gradient(to bottom right, ${(bg.value as string[])[0]}, ${(bg.value as string[])[1]})` }} />}
                                        {bg.type === 'solid' && <div className="h-full w-full" style={{ backgroundColor: bg.value as string }} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'text' && (
                    <div className="space-y-4">
                        <Button className="w-full justify-start" variant="outline" onClick={() => addText('Add Heading', { fontSize: 60, fontWeight: 'bold' })}>
                            <h1 className="text-xl font-bold">Add Heading</h1>
                        </Button>
                        <Button className="w-full justify-start" variant="outline" onClick={() => addText('Add Subheading', { fontSize: 40, fontWeight: 'medium' })}>
                            <h2 className="text-lg font-medium">Add Subheading</h2>
                        </Button>
                        <Button className="w-full justify-start" variant="outline" onClick={() => addText('Add Body Text', { fontSize: 24 })}>
                            <p className="text-base">Add Body Text</p>
                        </Button>
                        
                        <Separator />
                        
                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                            <h3 className="mb-2 text-sm font-medium text-blue-800 dark:text-blue-200">Quran Verse</h3>
                            <p className="text-xs text-slate-500 mb-2">Insert a random verse for testing.</p>
                            <Button className="w-full" size="sm" onClick={() => {
                                addText("In the name of Allah, the Entirely Merciful, the Especially Merciful.", { 
                                    fontFamily: 'IndoPak', 
                                    fontSize: 32,
                                    textAlign: 'center',
                                    width: 400
                                });
                            }}>Insert Basmalah</Button>
                        </div>
                    </div>
                )}

                {activeTab === 'elements' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-2 text-sm font-medium">Shapes</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {SHAPES.map((shape) => (
                                    <button
                                        key={shape.id}
                                        className="flex flex-col items-center justify-center rounded-lg border p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        onClick={() => addShape(shape)}
                                    >
                                        <shape.icon className="h-8 w-8 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
                                        <span className="mt-1 text-xs text-slate-500">{shape.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                             <h3 className="mb-2 text-sm font-medium">Lines & Decorations</h3>
                             <div className="grid grid-cols-2 gap-2">
                                 {ELEMENTS.map((el) => (
                                     <button
                                        key={el.id}
                                        className="flex h-16 items-center justify-center rounded-lg border bg-white p-2 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700"
                                        onClick={() => addElement(el)}
                                     >
                                         {el.type === 'line' ? (
                                             <div className="h-1 w-full bg-slate-800 dark:bg-slate-200 rounded-full" />
                                         ) : (
                                             <div className="h-10 w-10 border-2 border-slate-800 dark:border-slate-200" />
                                         )}
                                     </button>
                                 ))}
                             </div>
                        </div>
                    </div>
                )}

                {activeTab === 'watermark' && (
                    <div className="space-y-4">
                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                             <h3 className="mb-2 text-sm font-medium text-blue-800 dark:text-blue-200">Preset Watermarks</h3>
                             <div className="space-y-2">
                                 {WATERMARKS.map((wm) => (
                                     <button
                                        key={wm.id}
                                        className="w-full rounded-md border bg-white px-3 py-2 text-left text-sm shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700"
                                        onClick={() => addWatermark(wm)}
                                     >
                                         {wm.label}
                                     </button>
                                 ))}
                             </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                            <h3 className="mb-2 text-sm font-medium">Custom Watermark</h3>
                            <div className="space-y-2">
                                <Input placeholder="Your Name / Brand" id="custom-wm-text" />
                                <Button className="w-full" variant="outline" onClick={() => {
                                    const input = document.getElementById('custom-wm-text') as HTMLInputElement;
                                    if (input.value) {
                                        addWatermark({ 
                                            type: 'text', 
                                            value: input.value, 
                                            options: { fontSize: 24, fontWeight: 'bold', opacity: 0.7 } 
                                        });
                                    }
                                }}>
                                    Add Text Watermark
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'layers' && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Layers</h3>
                        <div className="space-y-2">
                            {layers.length === 0 && <p className="text-sm text-slate-500">No layers yet.</p>}
                            {layers.map((obj, idx) => (
                                <div 
                                    key={idx} 
                                    className={`flex items-center justify-between rounded-md border p-2 ${selectedObject === obj ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-slate-800'}`}
                                    onClick={() => {
                                        canvas?.setActiveObject(obj);
                                        canvas?.renderAll();
                                    }}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        {obj.type === 'textbox' ? <TypeIcon className="h-4 w-4 text-slate-500" /> : <ImageIcon className="h-4 w-4 text-slate-500" />}
                                        <span className="truncate text-sm">
                                            {/* @ts-ignore */}
                                            {obj.text || obj.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                canvas?.remove(obj);
                                                canvas?.requestRenderAll();
                                                if (canvas) updateLayers(canvas);
                                            }}
                                        >
                                            <Trash2 className="h-3 w-3 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 relative bg-slate-100 dark:bg-slate-900 overflow-hidden flex flex-col">
            
            {/* Toolbar for Zoom/Pan */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 shadow-md backdrop-blur-sm dark:bg-slate-800/90 border dark:border-slate-700 max-w-[90vw] overflow-x-auto scrollbar-hide">
                <Button 
                    variant={isPanning ? "default" : "ghost"} 
                    size="icon" 
                    className="h-8 w-8 rounded-full flex-shrink-0"
                    onClick={() => setIsPanning(!isPanning)}
                    title="Pan Tool (Spacebar)"
                >
                    <Hand className="h-4 w-4" />
                </Button>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1 flex-shrink-0" />
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full flex-shrink-0" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs font-medium w-12 text-center select-none flex-shrink-0">{Math.round(zoom * 100)}%</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full flex-shrink-0" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full flex-shrink-0" onClick={handleResetZoom} title="Fit to Screen">
                    <Maximize className="h-4 w-4" />
                </Button>
            </div>

            {/* Scrollable Workspace */}
            <div 
                ref={containerRef}
                className={`flex-1 overflow-auto flex items-center justify-center p-8 md:p-16 ${isPanning ? 'cursor-grab active:cursor-grabbing' : ''}`}
                onMouseDown={(e) => {
                    if (isPanning && containerRef.current) {
                        const startX = e.pageX - containerRef.current.offsetLeft;
                        const startY = e.pageY - containerRef.current.offsetTop;
                        const scrollLeft = containerRef.current.scrollLeft;
                        const scrollTop = containerRef.current.scrollTop;
                        
                        const onMouseMove = (moveEvent: MouseEvent) => {
                            const x = moveEvent.pageX - containerRef.current!.offsetLeft;
                            const y = moveEvent.pageY - containerRef.current!.offsetTop;
                            const walkX = (x - startX) * 1.5; // Scroll-fast
                            const walkY = (y - startY) * 1.5;
                            containerRef.current!.scrollLeft = scrollLeft - walkX;
                            containerRef.current!.scrollTop = scrollTop - walkY;
                        };
                        
                        const onMouseUp = () => {
                            window.removeEventListener('mousemove', onMouseMove);
                            window.removeEventListener('mouseup', onMouseUp);
                        };
                        
                        window.addEventListener('mousemove', onMouseMove);
                        window.addEventListener('mouseup', onMouseUp);
                    }
                }}
            >
                <div className="canvas-transform-wrapper">
                    <canvas ref={canvasRef} />
                </div>
            </div>
        </div>

        {/* Right Properties Panel */}
        <div className={`
            fixed bottom-0 left-0 right-0 z-30 flex-shrink-0 border-t bg-white p-4 dark:border-slate-800 dark:bg-slate-900 transition-transform duration-300 ease-in-out shadow-2xl
            md:static md:w-72 md:border-l md:border-t-0 md:shadow-none md:h-auto md:translate-y-0
            ${selectedObject ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
        `} style={{ maxHeight: '40vh', height: 'auto' }}>
            {/* Mobile Drag Handle */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-700 md:hidden" />
            
            <div className="h-full overflow-y-auto pb-8 md:pb-0">
            {!selectedObject ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
                    <Layout className="mb-2 h-12 w-12 opacity-20" />
                    <p>Select an object to edit its properties</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between md:block">
                        <h3 className="mb-0 md:mb-4 font-medium flex items-center gap-2">
                            {selectedObject.type === 'textbox' ? <Type className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                            Properties
                        </h3>
                        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSelectedObject(null)}>
                             Done
                        </Button>
                    </div>
                        
                        {/* Common Properties */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" size="icon" onClick={() => {
                                    canvas?.remove(selectedObject);
                                    canvas?.renderAll();
                                    setSelectedObject(null);
                                }}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={async () => {
                                    if (selectedObject) {
                                        try {
                                            const cloned = await selectedObject.clone();
                                            canvas?.add(cloned);
                                            cloned.set({ left: cloned.left + 10, top: cloned.top + 10 });
                                            canvas?.setActiveObject(cloned);
                                            canvas?.requestRenderAll();
                                        } catch (e) {
                                            console.error("Clone failed", e);
                                        }
                                    }
                                }}>
                                    <Layers className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            <div>
                                <label className="text-xs font-medium mb-1 block">Opacity</label>
                                <Slider 
                                    defaultValue={[selectedObject.opacity || 1]} 
                                    max={1} 
                                    step={0.1}
                                    onValueChange={(val) => updateSelectedProperty('opacity', val[0])}
                                />
                            </div>
                        </div>

                        {/* Text Specific Properties */}
                        {selectedObject.type === 'textbox' && (
                            <div className="space-y-4 pt-4 border-t">
                                <div>
                                    <label className="text-xs font-medium mb-1 block">Color</label>
                                    <div className="flex gap-2">
                                        <Input 
                                            type="color" 
                                            value={selectedObject.fill as string} 
                                            onChange={(e) => updateSelectedProperty('fill', e.target.value)}
                                            className="h-8 w-8 p-0 border-none"
                                        />
                                        <Input 
                                            value={selectedObject.fill as string}
                                            onChange={(e) => updateSelectedProperty('fill', e.target.value)}
                                            className="h-8 flex-1"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-xs font-medium mb-1 block">Font Size</label>
                                    <Input 
                                        type="number" 
                                        value={selectedObject.fontSize}
                                        onChange={(e) => updateSelectedProperty('fontSize', parseInt(e.target.value))}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium mb-1 block">Font Family</label>
                                    <Select 
                                        value={selectedObject.fontFamily} 
                                        onValueChange={(val) => updateSelectedProperty('fontFamily', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Font" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {FONTS.map(f => (
                                                <SelectItem key={f.id} value={f.family}>{f.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="flex gap-1 bg-slate-100 p-1 rounded-md dark:bg-slate-800">
                                    <Button 
                                        variant={selectedObject.fontWeight === 'bold' ? 'secondary' : 'ghost'} 
                                        size="sm" 
                                        className="flex-1 h-8"
                                        onClick={() => updateSelectedProperty('fontWeight', selectedObject.fontWeight === 'bold' ? 'normal' : 'bold')}
                                    >
                                        <Bold className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                        variant={selectedObject.fontStyle === 'italic' ? 'secondary' : 'ghost'} 
                                        size="sm" 
                                        className="flex-1 h-8"
                                        onClick={() => updateSelectedProperty('fontStyle', selectedObject.fontStyle === 'italic' ? 'normal' : 'italic')}
                                    >
                                        <Italic className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                        variant={selectedObject.textAlign === 'left' ? 'secondary' : 'ghost'} 
                                        size="sm" 
                                        className="flex-1 h-8"
                                        onClick={() => updateSelectedProperty('textAlign', 'left')}
                                    >
                                        <AlignLeft className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                        variant={selectedObject.textAlign === 'center' ? 'secondary' : 'ghost'} 
                                        size="sm" 
                                        className="flex-1 h-8"
                                        onClick={() => updateSelectedProperty('textAlign', 'center')}
                                    >
                                        <AlignCenter className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                        variant={selectedObject.textAlign === 'right' ? 'secondary' : 'ghost'} 
                                        size="sm" 
                                        className="flex-1 h-8"
                                        onClick={() => updateSelectedProperty('textAlign', 'right')}
                                    >
                                        <AlignRight className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
}
