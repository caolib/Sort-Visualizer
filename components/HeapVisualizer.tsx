import React from 'react';
import { SortStep, BarState } from '../types';

interface HeapVisualizerProps {
    step: SortStep;
}

const HeapVisualizer: React.FC<HeapVisualizerProps> = ({ step }) => {
    const { array, comparing, swapping, sorted, pivot } = step;
    const n = array.length;

    // Calculate tree depth
    const depth = Math.floor(Math.log2(n));

    // Layout constants
    const levelHeight = 60; // px
    const containerHeight = (depth + 1) * levelHeight + 60;

    const getBarState = (index: number): BarState => {
        if (pivot === index) return BarState.PIVOT;
        if (swapping.includes(index)) return BarState.SWAPPING;
        if (comparing.includes(index)) return BarState.COMPARING;
        if (sorted.includes(index)) return BarState.SORTED;
        return BarState.DEFAULT;
    };

    const getNodeColor = (state: BarState): string => {
        switch (state) {
            case BarState.PIVOT: return 'bg-purple-500 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.6)]';
            case BarState.SWAPPING: return 'bg-red-500 border-red-300 shadow-[0_0_10px_rgba(239,68,68,0.6)]';
            case BarState.COMPARING: return 'bg-yellow-400 border-yellow-200 shadow-[0_0_10px_rgba(250,204,21,0.6)]';
            case BarState.SORTED: return 'bg-emerald-500 border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]';
            default: return 'bg-indigo-500 border-indigo-300';
        }
    };

    // Helper to get coordinates
    const getPosition = (index: number) => {
        const level = Math.floor(Math.log2(index + 1));
        const maxNodesInLevel = Math.pow(2, level);
        const positionInLevel = index - (maxNodesInLevel - 1);

        // X: Distribute evenly across the width
        // We use percentages for responsiveness
        const xPercent = ((positionInLevel + 0.5) / maxNodesInLevel) * 100;
        const y = level * levelHeight + 40;

        return { x: xPercent, y };
    };

    return (
        <div className="w-full bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 overflow-hidden relative transition-all duration-300" style={{ height: `${containerHeight}px` }}>
            <h3 className="absolute top-2 left-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Heap Structure</h3>

            {/* SVG for Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {array.map((_, index) => {
                    const leftChild = 2 * index + 1;
                    const rightChild = 2 * index + 2;
                    const edges = [];

                    const start = getPosition(index);

                    if (leftChild < n) {
                        const end = getPosition(leftChild);
                        edges.push(
                            <line
                                key={`edge-${index}-${leftChild}`}
                                x1={`${start.x}%`} y1={start.y}
                                x2={`${end.x}%`} y2={end.y}
                                stroke="#475569"
                                strokeWidth="2"
                                className="transition-all duration-300"
                            />
                        );
                    }

                    if (rightChild < n) {
                        const end = getPosition(rightChild);
                        edges.push(
                            <line
                                key={`edge-${index}-${rightChild}`}
                                x1={`${start.x}%`} y1={start.y}
                                x2={`${end.x}%`} y2={end.y}
                                stroke="#475569"
                                strokeWidth="2"
                                className="transition-all duration-300"
                            />
                        );
                    }

                    return edges;
                })}
            </svg>

            {/* Nodes */}
            {array.map((item, index) => {
                const pos = getPosition(index);
                const state = getBarState(index);
                const colorClass = getNodeColor(state);

                return (
                    <div
                        key={item.id}
                        className={`absolute flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold text-white shadow-md transition-all duration-200 z-10 ${colorClass}`}
                        style={{
                            left: `${pos.x}%`,
                            top: `${pos.y}px`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        {item.value}
                    </div>
                );
            })}
        </div>
    );
};

export default HeapVisualizer;
