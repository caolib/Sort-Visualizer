import React from 'react';
import { Play, Pause, RotateCcw, FastForward, SkipBack } from 'lucide-react';

interface ControlPanelProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  progress: number;
  maxProgress: number;
  onProgressChange: (step: number) => void;
  disabled: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  onPlayPause,
  onReset,
  onStepForward,
  onStepBackward,
  arraySize,
  onArraySizeChange,
  speed,
  onSpeedChange,
  progress,
  maxProgress,
  onProgressChange,
  disabled
}) => {
  return (
    <div className="w-full bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg space-y-6">
      
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>Progress</span>
            <span>{Math.round((progress / maxProgress) * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max={maxProgress}
          value={progress}
          onChange={(e) => onProgressChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
          disabled={isPlaying}
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
           <button
            onClick={onStepBackward}
            disabled={isPlaying || progress === 0 || disabled}
            className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Step Backward"
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={onPlayPause}
            disabled={disabled || (progress === maxProgress && !isPlaying)}
            className={`p-4 rounded-full text-white font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center ${
              isPlaying 
                ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-900/20' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/30'
            }`}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>

          <button
            onClick={onStepForward}
            disabled={isPlaying || progress === maxProgress || disabled}
            className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Step Forward"
          >
            <FastForward size={20} />
          </button>

          <button
            onClick={onReset}
            disabled={disabled}
            className="ml-2 p-3 rounded-full bg-slate-700 hover:bg-red-500/20 text-slate-200 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-red-500/30"
            title="Reset Array"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        {/* Configuration */}
        <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
            
            {/* Array Size Config */}
            <div className="flex-1 space-y-2 min-w-[150px]">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-300">Array Size</label>
                    <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">{arraySize}</span>
                </div>
                <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={arraySize}
                    onChange={(e) => onArraySizeChange(Number(e.target.value))}
                    disabled={isPlaying}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
            </div>

            {/* Speed Config */}
            <div className="flex-1 space-y-2 min-w-[150px]">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-300">Speed</label>
                    <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">{speed}ms</span>
                </div>
                <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    // Reverse value logic: slider right = faster (lower delay)
                    value={510 - speed} 
                    onChange={(e) => onSpeedChange(510 - Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Slow</span>
                    <span>Fast</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;