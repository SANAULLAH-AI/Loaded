import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Check,
  Upload,
  Sliders,
  Sun,
  Contrast,
  Palette,
  Eye,
  Download,
  Scissors,
  Wand2,
  RefreshCw,
} from 'lucide-react';

interface ImageCropStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialImageUrl?: string;
  onApply: (dataUrl: string) => void;
  title?: string;
  defaultAspectRatio?: '1:1' | '16:9' | '4:3' | 'free';
}

export const ImageCropStudioModal: React.FC<ImageCropStudioModalProps> = ({
  isOpen,
  onClose,
  initialImageUrl = '',
  onApply,
  title = 'Image Crop & Beauty Filter Studio',
  defaultAspectRatio = '1:1',
}) => {
  const [imageSrc, setImageSrc] = useState<string>(initialImageUrl);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3' | 'free'>(defaultAspectRatio);

  // Transform / Crop states
  const [zoom, setZoom] = useState<number>(100);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Beauty & Color Filter states
  const [skinSmooth, setSkinSmooth] = useState<number>(20);
  const [brightness, setBrightness] = useState<number>(100); // 100% normal
  const [contrast, setContrast] = useState<number>(100); // 100% normal
  const [saturation, setSaturation] = useState<number>(105); // 105% slightly vibrant
  const [warmth, setWarmth] = useState<number>(0); // -50 to 50
  const [blur, setBlur] = useState<number>(0);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'crop' | 'beauty' | 'presets'>('beauty');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (initialImageUrl) {
      setImageSrc(initialImageUrl);
    }
  }, [initialImageUrl]);

  // Load Image when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imageObjRef.current = img;
      renderCanvas();
    };
  }, [imageSrc]);

  // Re-render canvas whenever controls change
  useEffect(() => {
    if (imageObjRef.current) {
      renderCanvas();
    }
  }, [zoom, offsetX, offsetY, rotation, flipH, flipV, skinSmooth, brightness, contrast, saturation, warmth, blur, aspectRatio]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          // reset params
          setZoom(100);
          setOffsetX(0);
          setOffsetY(0);
          setRotation(0);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderCanvas = () => {
    const img = imageObjRef.current;
    if (!img) return;

    const canvas = canvasRef.current || document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Determine target canvas dimensions based on Aspect Ratio
    let targetWidth = 600;
    let targetHeight = 600;

    if (aspectRatio === '16:9') {
      targetHeight = 337;
    } else if (aspectRatio === '4:3') {
      targetHeight = 450;
    } else if (aspectRatio === 'free') {
      targetWidth = img.naturalWidth || 600;
      targetHeight = img.naturalHeight || 600;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.clearRect(0, 0, targetWidth, targetHeight);

    ctx.save();

    // Move to center
    ctx.translate(targetWidth / 2 + offsetX, targetHeight / 2 + offsetY);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply scale / zoom and flip
    const scaleX = (flipH ? -1 : 1) * (zoom / 100);
    const scaleY = (flipV ? -1 : 1) * (zoom / 100);
    ctx.scale(scaleX, scaleY);

    // Draw Image centered
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = targetWidth / targetHeight;

    let drawW = targetWidth;
    let drawH = targetHeight;

    if (imgAspect > canvasAspect) {
      drawH = targetHeight;
      drawW = targetHeight * imgAspect;
    } else {
      drawW = targetWidth;
      drawH = targetWidth / imgAspect;
    }

    // Apply CSS Filters directly to canvas context
    const sepiaVal = warmth > 0 ? warmth / 2 : 0;
    const hueVal = warmth < 0 ? warmth / 3 : 0;
    const filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) sepia(${sepiaVal}%) hue-rotate(${hueVal}deg)`;
    ctx.filter = filterString;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    // Apply skin smooth overlay / beauty bloom if enabled
    if (skinSmooth > 0) {
      ctx.globalAlpha = (skinSmooth / 100) * 0.25;
      ctx.filter = `blur(${Math.max(2, skinSmooth / 10)}px) brightness(${brightness + 5}%)`;
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    }

    ctx.restore();

    // Export preview Data URL
    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setPreviewUrl(dataUrl);
    } catch (e) {
      console.error('Canvas export error:', e);
    }
  };

  const applyPreset = (preset: 'glow' | 'studio' | 'amber' | 'noir' | 'reset') => {
    if (preset === 'glow') {
      setSkinSmooth(60);
      setBrightness(108);
      setContrast(102);
      setSaturation(110);
      setWarmth(15);
      setBlur(0);
    } else if (preset === 'studio') {
      setSkinSmooth(30);
      setBrightness(105);
      setContrast(115);
      setSaturation(105);
      setWarmth(5);
      setBlur(0);
    } else if (preset === 'amber') {
      setSkinSmooth(20);
      setBrightness(102);
      setContrast(120);
      setSaturation(125);
      setWarmth(35);
      setBlur(0);
    } else if (preset === 'noir') {
      setSkinSmooth(10);
      setBrightness(100);
      setContrast(130);
      setSaturation(0);
      setWarmth(0);
      setBlur(0);
    } else if (preset === 'reset') {
      setSkinSmooth(0);
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setWarmth(0);
      setBlur(0);
      setZoom(100);
      setOffsetX(0);
      setOffsetY(0);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
    }
  };

  const handleSave = () => {
    if (previewUrl) {
      onApply(previewUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-amber-500/30 flex flex-col my-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-900 dark:bg-black border-b border-slate-200 dark:border-amber-500/20 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black">
              <Wand2 className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                <span>{title}</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-400 text-black">
                  AI Canvas
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Crop, resize, rotate, and apply beauty filters before saving
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Left / Top: Interactive Live Preview Canvas */}
          <div className="lg:col-span-7 bg-slate-100 dark:bg-black p-4 sm:p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-amber-500/20 relative min-h-[300px]">
            <canvas ref={canvasRef} className="hidden" />

            {previewUrl ? (
              <div className="relative max-w-full max-h-[380px] rounded-xl overflow-hidden shadow-xl border-2 border-slate-300 dark:border-amber-400/50 bg-black flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Cropped Beautified Preview"
                  className="max-h-[360px] object-contain transition-all"
                />
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/80 text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest border border-amber-500/30">
                  {aspectRatio} Preview
                </span>
              </div>
            ) : (
              <div className="p-8 text-center space-y-3">
                <Upload className="w-10 h-10 text-slate-400 dark:text-amber-400 mx-auto" />
                <p className="text-xs text-slate-600 dark:text-zinc-300 font-medium">
                  Select or upload an image to start cropping & applying beauty filters
                </p>
              </div>
            )}

            {/* Upload Button overlay */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <label className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-slate-900 dark:bg-amber-400 dark:text-black hover:opacity-90 transition cursor-pointer flex items-center gap-1.5 shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                type="button"
                onClick={() => applyPreset('reset')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-amber-500/20 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5 text-red-500" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Right: Controls & Filter Panel */}
          <div className="lg:col-span-5 flex flex-col bg-white dark:bg-neutral-950 overflow-y-auto p-4 sm:p-5 space-y-5">
            {/* Tabs Header */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-black p-1 rounded-xl border border-slate-200 dark:border-amber-500/20 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('beauty')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'beauty'
                    ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-black font-extrabold shadow-2xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-amber-400'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Beauty Filters</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('crop')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'crop'
                    ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-black font-extrabold shadow-2xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-amber-400'
                }`}
              >
                <Scissors className="w-3 h-3" />
                <span>Crop & Zoom</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'presets'
                    ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-black font-extrabold shadow-2xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-amber-400'
                }`}
              >
                <Wand2 className="w-3 h-3" />
                <span>Presets</span>
              </button>
            </div>

            {/* TAB CONTENT: BEAUTY & ENHANCEMENT */}
            {activeTab === 'beauty' && (
              <div className="space-y-4 animate-fade-in">
                {/* Skin Smoothing / Soft Beauty */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-amber-500/20">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className="text-slate-800 dark:text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-red-500" />
                      Skin Smoothing / Beauty Glow
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white">{skinSmooth}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skinSmooth}
                    onChange={(e) => setSkinSmooth(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Brightness */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className="text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      Brightness
                    </span>
                    <span className="font-mono text-slate-900 dark:text-zinc-200">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="160"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className="text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Contrast className="w-3.5 h-3.5 text-red-500" />
                      Contrast
                    </span>
                    <span className="font-mono text-slate-900 dark:text-zinc-200">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="160"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className="text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-amber-400" />
                      Color Saturation
                    </span>
                    <span className="font-mono text-slate-900 dark:text-zinc-200">{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Warmth */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className="text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-red-500" />
                      Tone Warmth
                    </span>
                    <span className="font-mono text-slate-900 dark:text-zinc-200">{warmth}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={warmth}
                    onChange={(e) => setWarmth(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: CROP & TRANSFORM */}
            {activeTab === 'crop' && (
              <div className="space-y-4 animate-fade-in">
                {/* Aspect Ratio Options */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-amber-400/80">
                    Target Aspect Ratio
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: '1:1', label: '1:1 Square (Avatar)' },
                      { id: '16:9', label: '16:9 Banner' },
                      { id: '4:3', label: '4:3 Card' },
                      { id: 'free', label: 'Original' },
                    ].map((ar) => (
                      <button
                        key={ar.id}
                        type="button"
                        onClick={() => setAspectRatio(ar.id as any)}
                        className={`p-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition cursor-pointer text-center ${
                          aspectRatio === ar.id
                            ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-black border-slate-900 dark:border-amber-400 font-extrabold'
                            : 'bg-slate-50 dark:bg-black text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-amber-500/20 hover:border-amber-400'
                        }`}
                      >
                        {ar.id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zoom */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className="text-slate-700 dark:text-zinc-300">Zoom / Scale</span>
                    <span className="font-mono text-slate-900 dark:text-zinc-200">{zoom}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="250"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Pan Offset X */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className="text-slate-700 dark:text-zinc-300">Horizontal Pan Position</span>
                    <span className="font-mono text-slate-900 dark:text-zinc-200">{offsetX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-200"
                    max="200"
                    value={offsetX}
                    onChange={(e) => setOffsetX(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Pan Offset Y */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className="text-slate-700 dark:text-zinc-300">Vertical Pan Position</span>
                    <span className="font-mono text-slate-900 dark:text-zinc-200">{offsetY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-200"
                    max="200"
                    value={offsetY}
                    onChange={(e) => setOffsetY(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Rotate & Flip Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-amber-500/20 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200 flex items-center justify-center gap-1 hover:border-amber-400 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Rotate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFlipH((prev) => !prev)}
                    className={`p-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer ${
                      flipH
                        ? 'bg-amber-400 text-black border-amber-400'
                        : 'bg-slate-50 dark:bg-black border-slate-200 dark:border-amber-500/20 text-slate-800 dark:text-zinc-200 hover:border-amber-400'
                    }`}
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                    <span>Flip H</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFlipV((prev) => !prev)}
                    className={`p-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer ${
                      flipV
                        ? 'bg-amber-400 text-black border-amber-400'
                        : 'bg-slate-50 dark:bg-black border-slate-200 dark:border-amber-500/20 text-slate-800 dark:text-zinc-200 hover:border-amber-400'
                    }`}
                  >
                    <FlipVertical className="w-3.5 h-3.5" />
                    <span>Flip V</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PRESETS */}
            {activeTab === 'presets' && (
              <div className="space-y-2.5 animate-fade-in">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-amber-400/80">
                  Instant One-Touch Enhancement Filters
                </p>

                {[
                  {
                    id: 'glow',
                    title: '✨ Glow Portrait (Skin Smooth & Soft Light)',
                    desc: 'Enhances skin tone, smooths texture, and adds warm studio glow.',
                  },
                  {
                    id: 'studio',
                    title: '📸 Studio Professional (Balanced & Sharp)',
                    desc: 'Clean contrast, balanced warmth, ideal for professional CV / portfolio.',
                  },
                  {
                    id: 'amber',
                    title: '💎 Cinematic Amber (Rich Warm Tone)',
                    desc: 'Deep warm amber tones and high-contrast professional look.',
                  },
                  {
                    id: 'noir',
                    title: '🖤 Monochrome Noir (Sleek B&W)',
                    desc: 'Classic high-contrast black & white style.',
                  },
                  {
                    id: 'reset',
                    title: '🌿 Reset All Settings',
                    desc: 'Restore original unedited image parameters.',
                  },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p.id as any)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-amber-500/20 hover:border-amber-400 text-left transition cursor-pointer group"
                  >
                    <div className="text-xs font-extrabold uppercase text-slate-900 dark:text-amber-400 group-hover:text-amber-300">
                      {p.title}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-normal mt-0.5">
                      {p.desc}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Bottom Actions Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-amber-500/20 flex items-center justify-end gap-2 mt-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-neutral-900 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!previewUrl}
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-400 dark:text-black dark:hover:bg-amber-300 transition flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4 text-red-600" />
                <span>Apply to Portfolio</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
