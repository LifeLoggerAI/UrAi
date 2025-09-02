'use client';

import React, { useState } from 'react';
import TiltScene from '@/components/tilt-scene';

export default function TiltDemoPage() {
  const [currentMode, setCurrentMode] = useState<'sky' | 'horizon' | 'ground'>('horizon');
  const [enableBattery, setEnableBattery] = useState(true);
  const [enablePerformance, setEnablePerformance] = useState(true);

  return (
    <div className="relative w-full h-screen">
      {/* TiltScene Component */}
      <TiltScene
        skyCategory="neutral"
        groundCategory="neutral"
        skyIndex={1}
        groundIndex={1}
        skyVariant="a"
        groundVariant="a"
        persona="gentle"
        onModeChange={setCurrentMode}
        enableBatteryOptimization={enableBattery}
        enablePerformanceOptimization={enablePerformance}
      />

      {/* Control Panel */}
      <div className="absolute top-4 right-4 bg-black/80 text-white p-4 rounded-lg space-y-3 z-[300]">
        <h2 className="text-lg font-bold">Tilt Scene Demo</h2>
        
        <div className="space-y-2">
          <div className="text-sm">
            <strong>Current Mode:</strong> {currentMode}
          </div>
          
          <div className="text-xs opacity-80">
            Tilt your device up to see sky mode, down for ground mode, or keep level for horizon mode.
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={enableBattery}
              onChange={(e) => setEnableBattery(e.target.checked)}
            />
            <span>Battery Optimization</span>
          </label>
          
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={enablePerformance}
              onChange={(e) => setEnablePerformance(e.target.checked)}
            />
            <span>Performance Optimization</span>
          </label>
        </div>

        <div className="text-xs opacity-60">
          Note: Device orientation permission may be required on iOS devices.
        </div>
      </div>

      {/* Instructions Overlay */}
      <div className="absolute bottom-4 left-4 bg-black/60 text-white p-3 rounded-lg max-w-xs z-[300]">
        <h3 className="font-semibold mb-2">How to Use:</h3>
        <ul className="text-sm space-y-1">
          <li>• Tilt device up (-30°) → Sky mode</li>
          <li>• Keep level (±15°) → Horizon mode</li>
          <li>• Tilt down (+30°) → Ground mode</li>
          <li>• Watch layer opacity changes</li>
        </ul>
      </div>
    </div>
  );
}