import React from 'react';
import { SortStep, BarState } from '../types';

interface VisualizerProps {
  step: SortStep;
  arraySize: number;
  speed: number;
}

const Visualizer: React.FC<VisualizerProps> = ({ step, arraySize, speed }) => {
  const { array, comparing, swapping, sorted, pivot } = step;

  const getBarState = (index: number): BarState => {
    if (pivot === index) return BarState.PIVOT;
    if (swapping.includes(index)) return BarState.SWAPPING;
    if (comparing.includes(index)) return BarState.COMPARING;
    if (sorted.includes(index)) return BarState.SORTED;
    return BarState.DEFAULT;
  };

  const getBarColor = (state: BarState): string => {
    switch (state) {
      case BarState.PIVOT:
        return 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]';
      case BarState.SWAPPING:
        return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]';
      case BarState.COMPARING:
        return 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]';
      case BarState.SORTED:
        return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]';
      default:
        return 'bg-indigo-500 hover:bg-indigo-400';
    }
  };

  // Calculate transition duration based on speed
  // We want the movement to be slightly faster than the full step time to allow a small pause
  const transitionDuration = Math.max(speed * 0.8, 50);

  return (
    <div className="flex-1 w-full min-h-[400px] bg-slate-800/50 rounded-xl border border-slate-700 shadow-xl overflow-hidden relative">
      {/* Background Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10 flex flex-col justify-between p-4 z-0">
        <div className="w-full h-px bg-slate-400"></div>
        <div className="w-full h-px bg-slate-400"></div>
        <div className="w-full h-px bg-slate-400"></div>
        <div className="w-full h-px bg-slate-400"></div>
        <div className="w-full h-px bg-slate-400"></div>
      </div>

      {/* Bars Container - using absolute to contain bars */}
      <div className="absolute inset-x-4 bottom-8 top-8 z-10">
        {array.map((item, index) => {
          const state = getBarState(index);
          const colorClass = getBarColor(state);
          const heightPercent = item.value; // Values are 10-100

          // Calculate width and position
          const widthPercent = 100 / arraySize;
          const leftPos = index * widthPercent;

          return (
            <div
              key={item.id} // Key by ID, not index, to enable move animation
              className={`absolute bottom-0 rounded-t-md transition-all ease-in-out shadow-sm ${colorClass}`}
              style={{
                height: `${heightPercent}%`,
                width: `calc(${widthPercent}% + 1px)`,
                left: `${leftPos}%`,
                transitionDuration: `${transitionDuration}ms`,
                transitionProperty: 'left, height, background-color'
              }}
              title={`Value: ${item.value}`}
            >
              {/* Only show text if bars are wide enough */}
              {arraySize <= 20 && (
                <span className="block text-center text-[10px] sm:text-xs font-bold text-white/90 pt-1 w-full truncate">
                  {item.value}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Visualizer;