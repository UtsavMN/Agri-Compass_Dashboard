import React from 'react';

interface ScreenshotPlaceholderProps {
  feature: string;
  icon: string | React.ReactNode;
  color: string;
  description: string;
}

export const ScreenshotPlaceholder = ({
  feature, icon, color, 
}: ScreenshotPlaceholderProps) => (
  <div
    className="w-full rounded-b-xl overflow-hidden relative"
    style={{ minHeight: 320, background: "#111008" }}
  >
    {/* Simulated app UI */}
    <div className="p-6">
      {/* Mock header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="text-2xl">{icon}</div>
        <div>
          <div className="h-3 w-32 bg-[#F5F0E8]/8 rounded mb-1.5" />
          <div className="h-2 w-20 bg-[#F5F0E8]/5 rounded" />
        </div>
      </div>

      {/* Mock content blocks */}
      <div className="space-y-3">
        <div className="h-24 rounded-xl" style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
          <div className="p-4">
            <div className="h-2 w-1/3 bg-[#F5F0E8]/8 rounded mb-2" />
            <div className="h-6 w-1/2 rounded" style={{ background: `${color}25` }} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(n => (
            <div key={n} className="h-16 bg-[#191610] rounded-xl border border-[#2A2720]">
              <div className="p-3">
                <div className="h-2 w-full bg-[#F5F0E8]/5 rounded mb-2" />
                <div className="h-4 w-2/3 rounded" style={{ background: `${color}20` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="h-16 bg-[#191610] rounded-xl border border-[#2A2720]">
          <div className="p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: `${color}18` }} />
            <div className="flex-1">
              <div className="h-2 w-3/4 bg-[#F5F0E8]/8 rounded mb-1.5" />
              <div className="h-2 w-1/2 bg-[#F5F0E8]/5 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay message */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#111008]/60 backdrop-blur-sm rounded-b-xl z-10">
        <div className="text-center px-8">
          <p className="text-[#F5F0E8]/30 text-xs font-mono mb-1">Add screenshot to activate</p>
          <code className="text-[#E5D08F]/40 text-[10px]">
            /public/screenshots/{feature}.png
          </code>
        </div>
      </div>
    </div>
  </div>
);
