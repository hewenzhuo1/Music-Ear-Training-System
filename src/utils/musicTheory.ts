// Musical notes
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Note frequencies (A4 = 440Hz)
export function getNoteFrequency(note: string, octave: number): number {
  const noteIndex = NOTES.indexOf(note);
  const semitones = (octave - 4) * 12 + noteIndex - 9; // A4 is reference
  return 440 * Math.pow(2, semitones / 12);
}

// Intervals
export const INTERVALS = {
  'Unison': 0,
  'Minor 2nd': 1,
  'Major 2nd': 2,
  'Minor 3rd': 3,
  'Major 3rd': 4,
  'Perfect 4th': 5,
  'Tritone': 6,
  'Perfect 5th': 7,
  'Minor 6th': 8,
  'Major 6th': 9,
  'Minor 7th': 10,
  'Major 7th': 11,
  'Octave': 12,
};

// Chord types and their intervals
export const CHORDS = {
  'Major': [0, 4, 7],
  'Minor': [0, 3, 7],
  'Diminished': [0, 3, 6],
  'Augmented': [0, 4, 8],
  'Sus2': [0, 2, 7],
  'Sus4': [0, 5, 7],
  'Major 7th': [0, 4, 7, 11],
  'Minor 7th': [0, 3, 7, 10],
  'Dominant 7th': [0, 4, 7, 10],
  'Diminished 7th': [0, 3, 6, 9],
  'Half-Diminished 7th': [0, 3, 6, 10],
  'Major 6th': [0, 4, 7, 9],
  'Minor 6th': [0, 3, 7, 9],
};

// Scale types and their intervals
export const SCALES = {
  'Major': [0, 2, 4, 5, 7, 9, 11],
  'Natural Minor': [0, 2, 3, 5, 7, 8, 10],
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
  'Melodic Minor': [0, 2, 3, 5, 7, 9, 11],
  'Dorian': [0, 2, 3, 5, 7, 9, 10],
  'Phrygian': [0, 1, 3, 5, 7, 8, 10],
  'Lydian': [0, 2, 4, 6, 7, 9, 11],
  'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
  'Pentatonic Major': [0, 2, 4, 7, 9],
  'Pentatonic Minor': [0, 3, 5, 7, 10],
  'Blues': [0, 3, 5, 6, 7, 10],
  'Whole Tone': [0, 2, 4, 6, 8, 10],
};

// Difficulty presets
export const DIFFICULTY_PRESETS = {
  beginner: {
    noteRange: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    octaveRange: [4, 4] as [number, number],
    intervals: ['Major 2nd', 'Major 3rd', 'Perfect 4th', 'Perfect 5th'],
    chords: ['Major', 'Minor'],
    scales: ['Major', 'Natural Minor'],
  },
  elementary: {
    noteRange: NOTES,
    octaveRange: [3, 5] as [number, number],
    intervals: ['Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Perfect 5th', 'Octave'],
    chords: ['Major', 'Minor', 'Diminished', 'Augmented'],
    scales: ['Major', 'Natural Minor', 'Harmonic Minor', 'Pentatonic Major', 'Pentatonic Minor'],
  },
  intermediate: {
    noteRange: NOTES,
    octaveRange: [2, 6] as [number, number],
    intervals: Object.keys(INTERVALS),
    chords: ['Major', 'Minor', 'Diminished', 'Augmented', 'Sus2', 'Sus4', 'Major 7th', 'Minor 7th', 'Dominant 7th'],
    scales: ['Major', 'Natural Minor', 'Harmonic Minor', 'Melodic Minor', 'Dorian', 'Pentatonic Major', 'Pentatonic Minor', 'Blues'],
  },
  advanced: {
    noteRange: NOTES,
    octaveRange: [1, 7] as [number, number],
    intervals: Object.keys(INTERVALS),
    chords: Object.keys(CHORDS),
    scales: Object.keys(SCALES),
  },
};

// Get random item from array
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Get note name with octave
export function getNoteName(note: string, octave: number): string {
  return `${note}${octave}`;
}
