"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  className?: string;
}

export function ImageUploader({ onUpload, className }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, sube un archivo de imagen válido.");
      return;
    }

    setIsUploading(true);
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir la imagen");
      
      const data = await res.json();
      onUpload(data.url); // Send URL back to parent
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al subir la imagen.");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload(""); // Clear parent state
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {preview ? (
        <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-video group flex items-center justify-center">
          <Image src={preview} alt="Vista previa" fill className="object-contain" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handleRemove}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
              <span className="text-sm text-indigo-400 font-medium">Subiendo diseño...</span>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300",
            isDragging 
              ? "border-indigo-500 bg-indigo-500/10" 
              : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700"
          )}
        >
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-indigo-400">
            <Upload className="w-8 h-8" />
          </div>
          <h4 className="text-white font-medium mb-1">Sube tu diseño para sublimar</h4>
          <p className="text-sm text-zinc-500 mb-4">Arrastra una imagen o haz clic para seleccionar</p>
          <div className="flex gap-4 text-xs text-zinc-600">
            <span className="flex items-center gap-1"><ImageIcon className="w-4 h-4" /> PNG, JPG, WEBP</span>
            <span>Max 5MB</span>
          </div>
        </div>
      )}
    </div>
  );
}
