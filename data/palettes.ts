// To remove a color, delete that one entry (ids never renumber); to remove a palette, delete its line.
export type Palette = { id: string; colors: Record<string, string> };

export const palettes: Palette[] = [
  { id: "A", colors: { A1: "#F1AE56", A2: "#D2DCC0", A3: "#064BC0", A4: "#0520DB", A5: "#A1727D" } },
  { id: "B", colors: { B1: "#BB3468", B2: "#E57D27", B3: "#356DA2", B4: "#2B4857", B5: "#39AB59" } },
  { id: "C", colors: { C1: "#2EF102", C2: "#F5B015", C3: "#05E291", C4: "#400964", C5: "#40B560" } },
  { id: "D", colors: { D1: "#51EBAF", D2: "#B83878", D3: "#E70D33", D4: "#1B0454", D5: "#771DA5" } },
  { id: "E", colors: { E1: "#67BC1E", E2: "#EC2DBA", E3: "#B3BCA2", E4: "#7FF419", E5: "#6E9759" } },
  { id: "F", colors: { F1: "#304FBE", F2: "#7F8734", F3: "#3C5393", F4: "#FC56A1", F5: "#DEDA6D" } },
  { id: "G", colors: { G1: "#168EFE", G2: "#B10ED6", G3: "#7E461B", G4: "#DD63BF", G5: "#F7462D" } },
  { id: "H", colors: { H1: "#2B1C9A", H2: "#96B81F", H3: "#C46D6C", H4: "#DF6012", H5: "#DEAB29" } },
  { id: "I", colors: { I1: "#BE608A", I2: "#5E225B", I3: "#2FAC28", I4: "#6548CD", I5: "#41AEEE" } },
  { id: "J", colors: { J1: "#3A5B63", J2: "#3A3A20", J3: "#E83BD3", J4: "#21EBF0", J5: "#EA97F1" } },
  { id: "K", colors: { K1: "#B0E9F6", K2: "#0921A3", K3: "#9BF92F", K4: "#27934E", K5: "#3405CD" } },
  { id: "L", colors: { L1: "#70070C", L2: "#CAAA45", L3: "#112265", L4: "#F8D888", L5: "#1FD048" } },
  { id: "M", colors: { M1: "#01A9D7", M2: "#ACDA60", M3: "#1C5D4F", M4: "#9794A0", M5: "#976605" } },
];
