// To remove a color, delete that one entry (ids never renumber); to remove a palette, delete its line.
export type Palette = { id: string; colors: Record<string, string> };

export const palettes: Palette[] = [
  { id: "B", colors: { B1: "#BB3468", B2: "#E57D27", B3: "#356DA2", B4: "#2B4857", B5: "#39AB59" } },
  { id: "G", colors: { G1: "#168EFE", G2: "#B10ED6", G3: "#7E461B", G4: "#DD63BF", G5: "#F7462D" } },
  { id: "M", colors: { M1: "#01A9D7", M2: "#ACDA60", M3: "#1C5D4F", M4: "#9794A0", M5: "#976605" } },
];
