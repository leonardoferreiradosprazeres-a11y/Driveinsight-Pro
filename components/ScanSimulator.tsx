import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Loader2 } from 'lucide-react';

interface Props {
  onImageSelected: (base64: string) => void;
  loading: boolean;
}

const ScanSimulator: React.FC<Props> = ({ onImageSelected, loading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      // Remove data URL prefix for API
      const base64Data = base64.split(',')[1];
      setPreview(base64);
      onImageSelected(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) processFile(file);
      }
    }
  };

  return (
    <div 
        className="flex flex-col items-center justify-center h-full min-h-[60vh] p-6 relative"
        onPaste={handlePaste}
    >
      <div 
        className="border-2 border-dashed border-gray-300 rounded-3xl p-8 w-full max-w-xs text-center hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-4 cursor-pointer relative overflow-hidden bg-gray-100"
        onClick={() => fileInputRef.current?.click()}
        style={{ aspectRatio: '9/16' }}
      >
        {preview ? (
            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        ) : (
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        )}

        <div className="z-10 bg-white/80 p-6 rounded-2xl backdrop-blur-sm shadow-lg">
            {loading ? (
                <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-2" />
                    <p className="text-sm font-semibold text-gray-700">Analisando Card...</p>
                    <p className="text-xs text-gray-500">Extraindo dados via OCR</p>
                </div>
            ) : (
                <>
                    <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Simular Captura</p>
                    <p className="text-xs text-gray-500 mt-1">Clique para upload ou cole (Ctrl+V) um print do Uber/99</p>
                </>
            )}
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      {!loading && !preview && (
          <p className="mt-4 text-xs text-gray-400 text-center max-w-xs">
              Simulação: No app real (Android), isso ocorre automaticamente via Serviço de Acessibilidade quando um card aparece.
          </p>
      )}
    </div>
  );
};

export default ScanSimulator;