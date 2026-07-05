import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, RotateCw } from "lucide-react";

interface ImageCropperDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  aspect: number;
  cropShape?: "rect" | "round";
  title?: string;
  outputWidth?: number;
  onCropComplete: (blob: Blob) => void | Promise<void>;
}

async function getCroppedBlob(
  imageSrc: string,
  cropPixels: Area,
  rotation: number,
  outputWidth?: number,
): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const rad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const bBoxWidth = image.width * cos + image.height * sin;
  const bBoxHeight = image.width * sin + image.height * cos;

  const rotatedCanvas = document.createElement("canvas");
  rotatedCanvas.width = bBoxWidth;
  rotatedCanvas.height = bBoxHeight;
  const rCtx = rotatedCanvas.getContext("2d")!;
  rCtx.translate(bBoxWidth / 2, bBoxHeight / 2);
  rCtx.rotate(rad);
  rCtx.drawImage(image, -image.width / 2, -image.height / 2);

  const finalCanvas = document.createElement("canvas");
  const scale = outputWidth ? outputWidth / cropPixels.width : 1;
  finalCanvas.width = Math.round(cropPixels.width * scale);
  finalCanvas.height = Math.round(cropPixels.height * scale);
  const fCtx = finalCanvas.getContext("2d")!;
  fCtx.drawImage(
    rotatedCanvas,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    finalCanvas.width,
    finalCanvas.height,
  );

  return new Promise((resolve, reject) => {
    finalCanvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed to crop"))), "image/jpeg", 0.92);
  });
}

export const ImageCropperDialog = ({
  open,
  onOpenChange,
  imageSrc,
  aspect,
  cropShape = "rect",
  title = "Adjust image",
  outputWidth,
  onCropComplete,
}: ImageCropperDialogProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [cropPixels, setCropPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropChangeComplete = useCallback((_: Area, pixels: Area) => {
    setCropPixels(pixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !cropPixels) return;
    try {
      setSaving(true);
      const blob = await getCroppedBlob(imageSrc, cropPixels, rotation, outputWidth);
      await onCropComplete(blob);
      onOpenChange(false);
      // reset
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[420px] bg-muted rounded-md overflow-hidden">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              cropShape={cropShape}
              showGrid
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropChangeComplete}
              restrictPosition
            />
          )}
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <ZoomIn className="h-4 w-4 text-muted-foreground shrink-0" />
            <Slider
              value={[zoom]}
              min={1}
              max={4}
              step={0.05}
              onValueChange={(v) => setZoom(v[0])}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10 text-right">{zoom.toFixed(1)}x</span>
          </div>
          <div className="flex items-center gap-3">
            <RotateCw className="h-4 w-4 text-muted-foreground shrink-0" />
            <Slider
              value={[rotation]}
              min={0}
              max={360}
              step={1}
              onValueChange={(v) => setRotation(v[0])}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10 text-right">{rotation}°</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !cropPixels}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
