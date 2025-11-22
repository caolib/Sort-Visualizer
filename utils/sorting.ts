import { SortStep, SortableItem } from '../types';

export const generateRandomArray = (size: number, min: number = 10, max: number = 100): SortableItem[] => {
  return Array.from({ length: size }, (_, i) => ({
    id: `item-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    value: Math.floor(Math.random() * (max - min + 1) + min)
  }));
};

export const generateBubbleSortTrace = (initialArray: SortableItem[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = initialArray.map(item => ({ ...item })); // Deep copy elements
  const n = array.length;
  const sortedIndices: number[] = [];

  // Initial state
  steps.push({
    array: array.map(item => ({ ...item })),
    comparing: [],
    swapping: [],
    sorted: [],
    description: "Initial State"
  });

  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      // Comparison Step
      steps.push({
        array: array.map(item => ({ ...item })),
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sortedIndices],
        description: `Comparing index ${j} (${array[j].value}) and ${j + 1} (${array[j + 1].value})`
      });

      if (array[j].value > array[j + 1].value) {
        // Swap Step (Before swap happens visually)
        steps.push({
          array: array.map(item => ({ ...item })),
          comparing: [j, j + 1],
          swapping: [j, j + 1],
          sorted: [...sortedIndices],
          description: `Swapping ${array[j].value} and ${array[j + 1].value}`
        });

        // Perform Swap
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        swapped = true;

        // Post Swap Step
        steps.push({
          array: array.map(item => ({ ...item })),
          comparing: [],
          swapping: [j, j + 1], // Keep highlighted briefly
          sorted: [...sortedIndices],
          description: `Swapped.`
        });
      }
    }
    
    // Add the correctly placed element to sorted list
    sortedIndices.push(n - 1 - i);
    
    // Step showing the newly sorted element
    steps.push({
      array: array.map(item => ({ ...item })),
      comparing: [],
      swapping: [],
      sorted: [...sortedIndices],
      description: `Element at index ${n - 1 - i} is now sorted.`
    });

    // Optimization
    if (!swapped) {
        const remaining: number[] = [];
        for(let k=0; k < n - 1 - i; k++) remaining.push(k);
        sortedIndices.push(...remaining);
        
        steps.push({
            array: array.map(item => ({ ...item })),
            comparing: [],
            swapping: [],
            sorted: Array.from({length: n}, (_, idx) => idx),
            description: "Array is fully sorted early!"
        });
        break;
    }
  }

  // Final State
  steps.push({
    array: array.map(item => ({ ...item })),
    comparing: [],
    swapping: [],
    sorted: Array.from({length: n}, (_, idx) => idx),
    description: "Sorting Complete!"
  });

  return steps;
};

// Quick Sort Implementation
const partition = (
  array: SortableItem[],
  low: number,
  high: number,
  steps: SortStep[],
  sortedIndices: number[]
): number => {
  const pivot = array[high];
  let i = low - 1;

  steps.push({
    array: array.map(item => ({ ...item })),
    comparing: [],
    swapping: [],
    sorted: [...sortedIndices],
    pivot: high,
    description: `Pivot selected: ${pivot.value}`
  });

  for (let j = low; j < high; j++) {
    steps.push({
      array: array.map(item => ({ ...item })),
      comparing: [j, high],
      swapping: [],
      sorted: [...sortedIndices],
      pivot: high,
      description: `Comparing ${array[j].value} with pivot ${pivot.value}`
    });

    if (array[j].value < pivot.value) {
      i++;
      if (i !== j) {
          steps.push({
            array: array.map(item => ({ ...item })),
            comparing: [j, high],
            swapping: [i, j],
            sorted: [...sortedIndices],
            pivot: high,
            description: `Swapping ${array[i].value} and ${array[j].value}`
          });

          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
          
          steps.push({
            array: array.map(item => ({ ...item })),
            comparing: [],
            swapping: [i, j],
            sorted: [...sortedIndices],
            pivot: high,
            description: `Swapped.`
          });
      }
    }
  }

  if (i + 1 !== high) {
      steps.push({
        array: array.map(item => ({ ...item })),
        comparing: [],
        swapping: [i + 1, high],
        sorted: [...sortedIndices],
        pivot: high,
        description: `Moving pivot to correct position`
      });
      
      const temp = array[i + 1];
      array[i + 1] = array[high];
      array[high] = temp;

      steps.push({
        array: array.map(item => ({ ...item })),
        comparing: [],
        swapping: [i + 1, high],
        sorted: [...sortedIndices],
        pivot: i + 1,
        description: `Pivot moved.`
      });
  }
  
  return i + 1;
}

const quickSortHelper = (
  array: SortableItem[],
  low: number,
  high: number,
  steps: SortStep[],
  sortedIndices: number[]
) => {
  if (low < high) {
    const pi = partition(array, low, high, steps, sortedIndices);
    
    // We can mark pivot as sorted momentarily, but simplified here
    // In standard visualization, we often wait until recursion returns to mark ranges sorted, 
    // or mark pivot sorted immediately.
    // Let's try to mark the pivot as sorted after partition
    
    quickSortHelper(array, low, pi - 1, steps, sortedIndices);
    quickSortHelper(array, pi + 1, high, steps, sortedIndices);
  }
}

export const generateQuickSortTrace = (initialArray: SortableItem[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = initialArray.map(item => ({ ...item }));
  
  steps.push({
    array: array.map(item => ({ ...item })),
    comparing: [],
    swapping: [],
    sorted: [],
    description: "Initial State"
  });

  quickSortHelper(array, 0, array.length - 1, steps, []);

  // Final sorted state
  steps.push({
    array: array.map(item => ({ ...item })),
    comparing: [],
    swapping: [],
    sorted: Array.from({length: array.length}, (_, i) => i),
    description: "Quick Sort Complete!"
  });

  return steps;
};
