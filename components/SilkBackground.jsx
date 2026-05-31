'use client';

export default function SilkBackground() {
  return (
    <>
      {/* Animated silk fabric layers */}
      <div className="silk-bg" aria-hidden="true">
        <div className="silk-layer" />
        <div className="silk-layer-2" />
      </div>

      {/* Film grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />
    </>
  );
}
