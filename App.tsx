import React, { useState, useEffect, useCallback, useRef } from 'react';
import ControlPanel from './components/ControlPanel';
import Visualizer from './components/Visualizer';
import HeapVisualizer from './components/HeapVisualizer';
import {
  generateRandomArray,
  generateBubbleSortTrace,
  generateQuickSortTrace,
  generateSelectionSortTrace,
  generateInsertionSortTrace,
  generateMergeSortTrace,
  generateHeapSortTrace
} from './utils/sorting';
import { SortStep, SortableItem } from './types';
import { Info, Code, ChevronDown } from 'lucide-react';

const DEFAULT_SIZE = 20;
const DEFAULT_SPEED = 100;

type AlgorithmType = 'Bubble Sort' | 'Quick Sort' | 'Selection Sort' | 'Insertion Sort' | 'Merge Sort' | 'Heap Sort';

const ALGORITHM_INFO: Record<AlgorithmType, { description: string; code: string; complexity: string }> = {
  'Bubble Sort': {
    description: "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. It is known for its simplicity but generally poor performance (O(n²)) on large datasets.",
    complexity: "O(n²)",
    code: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
}`
  },
  'Quick Sort': {
    description: "Quick Sort is a highly efficient, divide-and-conquer sorting algorithm. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.",
    complexity: "O(n log n)",
    code: `function quickSort(arr, low, high) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = (low - 1);
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      swap(arr, i, j);
    }
  }
  swap(arr, i + 1, high);
  return (i + 1);
}`
  },
  'Selection Sort': {
    description: "Selection Sort divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items that occupy the rest of the list.",
    complexity: "O(n²)",
    code: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      swap(arr, i, minIdx);
    }
  }
}`
  },
  'Insertion Sort': {
    description: "Insertion Sort builds the final sorted array (or list) one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.",
    complexity: "O(n²)",
    code: `function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
}`
  },
  'Merge Sort': {
    description: "Merge Sort is an efficient, stable, comparison-based, divide and conquer sorting algorithm. Most implementations produce a stable sort, meaning that the implementation preserves the input order of equal elements in the sorted output.",
    complexity: "O(n log n)",
    code: `function mergeSort(arr, l, r) {
  if (l >= r) return;
  let m = l + parseInt((r - l) / 2);
  mergeSort(arr, l, m);
  mergeSort(arr, m + 1, r);
  merge(arr, l, m, r);
}

function merge(arr, l, m, r) {
  let n1 = m - l + 1;
  let n2 = r - m;
  let L = new Array(n1);
  let R = new Array(n2);
  for (let i = 0; i < n1; i++) L[i] = arr[l + i];
  for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
  let i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) arr[k++] = L[i++];
    else arr[k++] = R[j++];
  }
  while (i < n1) arr[k++] = L[i++];
  while (j < n2) arr[k++] = R[j++];
}`
  },
  'Heap Sort': {
    description: "Heap Sort is a comparison-based sorting algorithm. Heap sort can be thought of as an improved selection sort: like selection sort, heap sort divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element from it and inserting it into the sorted region.",
    complexity: "O(n log n)",
    code: `function heapSort(arr) {
  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    swap(arr, 0, i);
    heapify(arr, i, 0);
  }
}

function heapify(arr, n, i) {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest != i) {
    swap(arr, i, largest);
    heapify(arr, n, largest);
  }
}`
  }
};

const App: React.FC = () => {
  // Application State
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('Bubble Sort');
  const [arraySize, setArraySize] = useState<number>(DEFAULT_SIZE);
  const [speed, setSpeed] = useState<number>(DEFAULT_SPEED);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [trace, setTrace] = useState<SortStep[]>([]);

  // Timer Ref for the animation loop
  const timerRef = useRef<number | null>(null);

  // Initialize or Reset
  const resetArray = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Generate fresh random array
    const newArray: SortableItem[] = generateRandomArray(arraySize);

    // Generate trace based on selected algorithm
    let newTrace: SortStep[] = [];
    if (algorithm === 'Bubble Sort') {
      newTrace = generateBubbleSortTrace(newArray);
    } else if (algorithm === 'Quick Sort') {
      newTrace = generateQuickSortTrace(newArray);
    } else if (algorithm === 'Selection Sort') {
      newTrace = generateSelectionSortTrace(newArray);
    } else if (algorithm === 'Insertion Sort') {
      newTrace = generateInsertionSortTrace(newArray);
    } else if (algorithm === 'Merge Sort') {
      newTrace = generateMergeSortTrace(newArray);
    } else if (algorithm === 'Heap Sort') {
      newTrace = generateHeapSortTrace(newArray);
    }

    setTrace(newTrace);
    setCurrentStepIndex(0);
  }, [arraySize, algorithm]);

  // Initial Load & Algorithm Change
  useEffect(() => {
    resetArray();
  }, [resetArray]);

  // Animation Loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < trace.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, trace.length]);

  // Handlers
  const handlePlayPause = () => {
    if (currentStepIndex >= trace.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (currentStepIndex < trace.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleProgressChange = (step: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(step);
  };

  const currentStep = trace[currentStepIndex];
  const currentInfo = ALGORITHM_INFO[algorithm];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500/30">
      <div className="max-w-[90vw] mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Header Section with Dropdown */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex flex-col gap-2 w-full md:w-2/3">
            <div className="relative inline-block w-fit group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sorting Algorithm</label>
              <div className="relative flex items-center">
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
                  className="appearance-none bg-transparent text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent pr-10 cursor-pointer focus:outline-none z-10 w-full"
                >
                  <option className="bg-slate-800 text-indigo-400 text-lg" value="Bubble Sort">Bubble Sort</option>
                  <option className="bg-slate-800 text-indigo-400 text-lg" value="Quick Sort">Quick Sort</option>
                  <option className="bg-slate-800 text-indigo-400 text-lg" value="Selection Sort">Selection Sort</option>
                  <option className="bg-slate-800 text-indigo-400 text-lg" value="Insertion Sort">Insertion Sort</option>
                  <option className="bg-slate-800 text-indigo-400 text-lg" value="Merge Sort">Merge Sort</option>
                  <option className="bg-slate-800 text-indigo-400 text-lg" value="Heap Sort">Heap Sort</option>
                </select>
                <ChevronDown className="absolute right-0 text-indigo-400 pointer-events-none group-hover:translate-y-0.5 transition-transform" size={28} />
              </div>
            </div>

            <p className="text-slate-400 mt-1 text-sm leading-relaxed">
              {currentInfo.description}
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs font-mono bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded"></div>
              <span>Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded shadow-[0_0_5px_rgba(250,204,21,0.5)]"></div>
              <span>Compare</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
              <span>Swap</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
              <span>Sorted</span>
            </div>
            {algorithm === 'Quick Sort' && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded shadow-[0_0_5px_rgba(168,85,247,0.5)]"></div>
                <span>Pivot</span>
              </div>
            )}
          </div>
        </header>

        {/* Main Visualization Area */}
        <main className="flex flex-col gap-6">

          {/* Status Bar */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm backdrop-blur-sm gap-2">
            <div className="flex items-center gap-3">
              <Info className="text-indigo-400 shrink-0" size={20} />
              <span className="font-mono text-sm text-indigo-100 line-clamp-2 sm:line-clamp-1">
                {currentStep ? currentStep.description : "Loading..."}
              </span>
            </div>
            <div className="font-mono text-xs text-slate-500 whitespace-nowrap flex items-center gap-3">
              <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">
                {currentInfo.complexity}
              </span>
              <span>Step: {currentStepIndex + 1} / {trace.length}</span>
            </div>
          </div>

          {/* Visualizer Component */}
          {currentStep && (
            <Visualizer
              step={currentStep}
              arraySize={arraySize}
              speed={speed}
            />
          )}

          {/* Heap Structure Visualizer */}
          {algorithm === 'Heap Sort' && currentStep && (
            <HeapVisualizer step={currentStep} />
          )}

          {/* Controls */}
          <ControlPanel
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onReset={resetArray}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            arraySize={arraySize}
            onArraySizeChange={setArraySize}
            speed={speed}
            onSpeedChange={setSpeed}
            progress={currentStepIndex}
            maxProgress={trace.length - 1}
            onProgressChange={handleProgressChange}
            disabled={trace.length === 0}
          />

          {/* Code / Algorithm Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-x-auto">
            <div className="flex items-center gap-2 mb-4 text-slate-300">
              <Code size={18} />
              <h3 className="font-semibold text-sm uppercase tracking-wider">Algorithm Logic</h3>
            </div>
            <pre className="font-mono text-xs sm:text-sm text-slate-400 leading-relaxed">
              {currentInfo.code}
            </pre>
          </div>
        </main>

      </div>
    </div>
  );
};

export default App;
