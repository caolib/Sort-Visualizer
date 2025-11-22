export enum BarState {
  DEFAULT = 'DEFAULT',
  COMPARING = 'COMPARING',
  SWAPPING = 'SWAPPING',
  SORTED = 'SORTED',
  PIVOT = 'PIVOT',
}

export interface SortableItem {
  id: string;
  value: number;
}

export interface SortStep {
  array: SortableItem[];
  comparing: number[]; // Indices currently being compared
  swapping: number[];  // Indices currently being swapped
  sorted: number[];    // Indices that are fully sorted
  pivot?: number;      // Index of the pivot element (for Quick Sort)
  description: string;
}

export interface SortingConfig {
  arraySize: number;
  animationSpeed: number; // ms per step
}
