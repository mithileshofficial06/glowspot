import FacePreview from '@/components/FacePreview';
import { Eye, Sparkles, Camera, Shield } from 'lucide-react';

export const metadata = {
  title: 'Face Style Preview — GlowSpot Hyderabad',
  description: 'Upload a selfie and let AI analyze your face shape, skin tone, and features to recommend perfect hairstyles, makeup looks, and hair colors.',
};

export default function Preview() {
  return (
    <div className="min-h-screen pt-20 bg-cream">
      {/* Header */}
      <div className="bg-gradient-to-r from-plum-deep via-purple-900 to-plum py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-4">
            <Camera className="w-4 h-4 text-gold-light" />
            Powered by Llama 3.2 90B Vision
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">
            AI Face Style Preview
          </h1>
          <p className="text-white/60 max-w-xl mx-auto mb-6">
            Upload a selfie and our Vision AI will analyze your face shape, skin tone, and features — then recommend perfect hairstyles, makeup looks, and hair colors.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Your photo is processed securely
            </span>
            <span>•</span>
            <span>Images are never stored</span>
            <span>•</span>
            <span>100% server-side AI processing</span>
          </div>
        </div>
      </div>

      {/* Preview Component */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FacePreview />
      </div>
    </div>
  );
}
