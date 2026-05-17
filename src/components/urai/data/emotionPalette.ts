export type MemoryCategory = "becoming" | "threshold" | "recovery" | "relationship" | "dream" | "mirror";

export const emotionPalette: Record<MemoryCategory, { label: string; core: string; halo: string; nebula: string; border: string }> = {
  becoming: { label: "Becoming", core: "#9BE7FF", halo: "rgba(155,231,255,.58)", nebula: "rgba(90,210,255,.13)", border: "rgba(155,231,255,.38)" },
  threshold: { label: "Threshold", core: "#C7A0FF", halo: "rgba(199,160,255,.58)", nebula: "rgba(140,90,255,.14)", border: "rgba(199,160,255,.38)" },
  recovery: { label: "Recovery", core: "#B8FFD8", halo: "rgba(184,255,216,.56)", nebula: "rgba(80,255,170,.13)", border: "rgba(184,255,216,.36)" },
  relationship: { label: "Relationships", core: "#FFB7D6", halo: "rgba(255,183,214,.53)", nebula: "rgba(255,110,180,.13)", border: "rgba(255,183,214,.34)" },
  dream: { label: "Dream Field", core: "#FFE58A", halo: "rgba(255,229,138,.52)", nebula: "rgba(255,202,70,.13)", border: "rgba(255,229,138,.34)" },
  mirror: { label: "Mirror", core: "#E8F2FF", halo: "rgba(232,242,255,.55)", nebula: "rgba(190,220,255,.11)", border: "rgba(232,242,255,.32)" },
};
