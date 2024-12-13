export type Molecule = {
  id: string;
  isFixed: boolean;
  isSeparator?: boolean;
  minWidthInPx: number;
  minHeightInPx: number;
  molecules?: Molecule[]
  measurements: Percentage
}

export type Percentage = {
  xPercentage: number;
}
