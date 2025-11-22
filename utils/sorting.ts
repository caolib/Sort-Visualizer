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
      for (let k = 0; k < n - 1 - i; k++) remaining.push(k);
      sortedIndices.push(...remaining);

      steps.push({
        array: array.map(item => ({ ...item })),
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: n }, (_, idx) => idx),
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
    sorted: Array.from({ length: n }, (_, idx) => idx),
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
    sorted: Array.from({ length: array.length }, (_, i) => i),
    description: "Quick Sort Complete!"
  });

  return steps;
};

export const generateSelectionSortTrace = (initialArray: SortableItem[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = initialArray.map(item => ({ ...item }));
  const n = array.length;
  const sortedIndices: number[] = [];

  steps.push({
    array: array.map(item => ({ ...item })),
    comparing: [],
    swapping: [],
    sorted: [],
    description: "Initial State"
  });

  for (let i = 0; i < n; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: array.map(item => ({ ...item })),
        comparing: [minIdx, j],
        swapping: [],
        sorted: [...sortedIndices],
        description: `Comparing current minimum (${array[minIdx].value}) with ${array[j].value}`
      });

      if (array[j].value < array[minIdx].value) {
        minIdx = j;
        steps.push({
          array: array.map(item => ({ ...item })),
          comparing: [minIdx],
          swapping: [],
          sorted: [...sortedIndices],
          description: `New minimum found: ${array[minIdx].value}`
        });
      }
    }

    if (minIdx !== i) {
      steps.push({
        array: array.map(item => ({ ...item })),
        comparing: [i, minIdx],
        swapping: [i, minIdx],
        sorted: [...sortedIndices],
        description: `Swapping ${array[i].value} and minimum ${array[minIdx].value}`
      });

      const temp = array[i];
      array[i] = array[minIdx];
      array[minIdx] = temp;

      steps.push({
        array: array.map(item => ({ ...item })),
        comparing: [],
        swapping: [i, minIdx],
        sorted: [...sortedIndices],
        description: "Swapped."
      });
    }

    sortedIndices.push(i);
    steps.push({
      array: array.map(item => ({ ...item })),
      comparing: [],
      swapping: [],
      sorted: [...sortedIndices],
      description: `Element at index ${i} is sorted.`
    });
  }

  steps.push({
    array: array.map(item => ({ ...item })),
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    description: "Selection Sort Complete!"
  });

  return steps;
};

export const generateInsertionSortTrace = (initialArray: SortableItem[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = initialArray.map(item => ({ ...item }));
  const n = array.length;
  const sortedIndices: number[] = [0];

  steps.push({
    array: array.map(item => ({ ...item })),
    comparing: [],
    swapping: [],
    sorted: [0],
    description: "Initial State"
  });

  for (let i = 1; i < n; i++) {
    let j = i;

    steps.push({
      array: array.map(item => ({ ...item })),
      comparing: [i],
      swapping: [],
      sorted: Array.from({ length: i }, (_, k) => k),
      description: `Selected element ${array[i].value} to insert`
    });

    while (j > 0 && array[j].value < array[j - 1].value) {
      steps.push({
        array: array.map(item => ({ ...item })),
        comparing: [j, j - 1],
        swapping: [],
        sorted: Array.from({ length: i }, (_, k) => k),
        description: `Comparing ${array[j].value} < ${array[j - 1].value}`
      });

      steps.push({
        array: array.map(item => ({ ...item })),
        comparing: [j, j - 1],
        swapping: [j, j - 1],
        sorted: Array.from({ length: i }, (_, k) => k),
        description: `Swapping ${array[j].value} and ${array[j - 1].value}`
      });

      // Perform Swap
      const temp = array[j];
      array[j] = array[j - 1];
      array[j - 1] = temp;

      steps.push({
        array: array.map(item => ({ ...item })),
        comparing: [],
        swapping: [j, j - 1],
        sorted: Array.from({ length: i }, (_, k) => k),
        description: "Swapped."
      });

      j--;
    }

    // Now 0..i are sorted
    const newSorted = Array.from({ length: i + 1 }, (_, k) => k);
    steps.push({
      array: array.map(item => ({ ...item })),
      comparing: [],
      swapping: [],
      sorted: newSorted,
      description: `Element inserted at position ${j}`
    });
  }

  steps.push({
    array: array.map(item => ({ ...item })),
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    description: "Insertion Sort Complete!"
  });

  return steps;
};

const merge = (
  array: SortableItem[],
  left: number,
  mid: number,
  right: number,
  steps: SortStep[]
) => {
  const n1 = mid - left + 1;
  const n2 = right - mid;

  const L: SortableItem[] = new Array(n1);
  const R: SortableItem[] = new Array(n2);

  for (let i = 0; i < n1; i++) L[i] = array[left + i];
  for (let j = 0; j < n2; j++) R[j] = array[mid + 1 + j];

  let i = 0;
  let j = 0;
  let k = left;

  // Helper to create a visual snapshot without duplicates
  // We construct the array as:
  // [0...left-1] (unchanged)
  // [left...k-1] (merged)
  // [k...k+(n1-i)+(n2-j)-1] (remaining L and R items)
  // [right+1...end] (unchanged)
  const getVisualArray = (currentArray: SortableItem[], kIdx: number, lIdx: number, rIdx: number) => {
    const visualArray = [...currentArray];
    // Fill the "to be merged" area with remaining items from L and R
    let ptr = kIdx;
    for (let x = lIdx; x < n1; x++) {
      visualArray[ptr++] = L[x];
    }
    for (let y = rIdx; y < n2; y++) {
      visualArray[ptr++] = R[y];
    }
    return visualArray;
  };

  while (i < n1 && j < n2) {
    // For comparison step, we want to show the items being compared.
    // They are currently in L[i] and R[j].
    // In the visual array, L[i] is at k (conceptually, or the first available slot)
    // and R[j] is somewhere after L's remaining items?
    // Actually, if we just use getVisualArray, L[i] is at k, and R[j] is at k + (n1 - i).

    const visualArr = getVisualArray(array, k, i, j);

    // Calculate indices in the visual array for highlighting
    // L[i] is at index k
    // R[j] is at index k + (n1 - i)
    const idxL = k;
    const idxR = k + (n1 - i);

    steps.push({
      array: visualArr.map(item => ({ ...item })),
      comparing: [idxL, idxR],
      swapping: [],
      sorted: [],
      description: `Comparing ${L[i].value} and ${R[j].value}`
    });

    if (L[i].value <= R[j].value) {
      array[k] = L[i];
      // After assignment, we want to show the move.
      // The item L[i] moves to k. It was already at k in our visual array logic above?
      // Yes, L[i] was at k. So it stays there (or is confirmed there).

      steps.push({
        array: getVisualArray(array, k + 1, i + 1, j).map(item => ({ ...item })),
        comparing: [],
        swapping: [k],
        sorted: [],
        description: `Taking ${L[i].value} from left subarray`
      });
      i++;
    } else {
      array[k] = R[j];
      // The item R[j] moves to k.
      // In previous visual state, R[j] was at k + (n1 - i).
      // Now it moves to k.

      steps.push({
        array: getVisualArray(array, k + 1, i, j + 1).map(item => ({ ...item })),
        comparing: [],
        swapping: [k],
        sorted: [],
        description: `Taking ${R[j].value} from right subarray`
      });
      j++;
    }
    k++;
  }

  while (i < n1) {
    steps.push({
      array: getVisualArray(array, k + 1, i + 1, j).map(item => ({ ...item })),
      comparing: [],
      swapping: [k],
      sorted: [],
      description: `Taking remaining ${L[i].value} from left subarray`
    });
    array[k] = L[i];
    i++;
    k++;
  }

  while (j < n2) {
    steps.push({
      array: getVisualArray(array, k + 1, i, j + 1).map(item => ({ ...item })),
      comparing: [],
      swapping: [k],
      sorted: [],
      description: `Taking remaining ${R[j].value} from right subarray`
    });
    array[k] = R[j];
    j++;
    k++;
  }
};

const mergeSortHelper = (
  array: SortableItem[],
  left: number,
  right: number,
  steps: SortStep[]
) => {
  if (left >= right) {
    return;
  }
  const mid = left + Math.floor((right - left) / 2);
  mergeSortHelper(array, left, mid, steps);
  mergeSortHelper(array, mid + 1, right, steps);
  merge(array, left, mid, right, steps);
};

export const generateMergeSortTrace = (initialArray: SortableItem[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = initialArray.map(item => ({ ...item }));

  steps.push({
    array: array.map(item => ({ ...item })),
    comparing: [],
    swapping: [],
    sorted: [],
    description: "Initial State"
  });

  mergeSortHelper(array, 0, array.length - 1, steps);

  steps.push({
    array: array.map(item => ({ ...item })),
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: array.length }, (_, i) => i),
    description: "Merge Sort Complete!"
  });

  return steps;
};

export const generateHeapSortTrace = (initialArray: SortableItem[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = initialArray.map(item => ({ ...item }));
  const n = array.length;
  const sortedIndices: number[] = [];

  steps.push({
    array: array.map(item => ({ ...item })),
    comparing: [],
    swapping: [],
    sorted: [],
    description: "Initial State"
  });

  const heapify = (n: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      steps.push({
        array: array.map(item => ({ ...item })),
        comparing: [largest, left],
        swapping: [],
        sorted: [...sortedIndices],
        description: `Comparing root ${array[largest].value} with left child ${array[left].value}`
      });
      if (array[left].value > array[largest].value) {
        largest = left;
      }
    }

    if (right < n) {
      steps.push({
        array: array.map(item => ({ ...item })),
        comparing: [largest, right],
        swapping: [],
        sorted: [...sortedIndices],
        description: `Comparing current largest ${array[largest].value} with right child ${array[right].value}`
      });
      if (array[right].value > array[largest].value) {
        largest = right;
      }
    }

    if (largest !== i) {
      steps.push({
        array: array.map(item => ({ ...item })),
        comparing: [i, largest],
        swapping: [i, largest],
        sorted: [...sortedIndices],
        description: `Swapping ${array[i].value} and ${array[largest].value}`
      });

      const temp = array[i];
      array[i] = array[largest];
      array[largest] = temp;

      steps.push({
        array: array.map(item => ({ ...item })),
        comparing: [],
        swapping: [i, largest],
        sorted: [...sortedIndices],
        description: "Swapped."
      });

      heapify(n, largest);
    }
  };

  // Build heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  steps.push({
    array: array.map(item => ({ ...item })),
    comparing: [],
    swapping: [],
    sorted: [],
    description: "Max Heap built. Starting extraction."
  });

  // One by one extract an element from heap
  for (let i = n - 1; i > 0; i--) {
    steps.push({
      array: array.map(item => ({ ...item })),
      comparing: [0, i],
      swapping: [0, i],
      sorted: [...sortedIndices],
      description: `Moving root ${array[0].value} to end`
    });

    const temp = array[0];
    array[0] = array[i];
    array[i] = temp;

    sortedIndices.push(i);

    steps.push({
      array: array.map(item => ({ ...item })),
      comparing: [],
      swapping: [0, i],
      sorted: [...sortedIndices],
      description: `Element ${array[i].value} is sorted.`
    });

    heapify(i, 0);
  }

  sortedIndices.push(0);
  steps.push({
    array: array.map(item => ({ ...item })),
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    description: "Heap Sort Complete!"
  });

  return steps;
};
