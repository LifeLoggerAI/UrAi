import type { PassportDataLayerId } from "@/lib/lifemap/lifeMapTypes";
import { getRitualTemplate, RITUAL_TEMPLATES } from "./ritualTemplateRegistry";
import type { RitualSuggestionContext, RitualTemplate, UraiRitual } from "./ritualTypes";

const now = () => new Date().toISOString();

function layerAllowed(context: RitualSuggestionContext, layer: PassportDataLayerId): boolean {
  if (layer === "system" || layer === "passport") return true;
  const profile = context.passportProfile;
  if (profile?.ritualsEnabled === false) return false;
  if (profile?.enabledLayers?.[layer] === true) return true;
  if (layer === "shadow") return profile?.shadowEnabled === true;
  if (layer === "legacy") return profile?.legacyEnabled === true;
  return false;
}

function ritualFromTemplate(template: RitualTemplate, sourceType: UraiRitual["sourceType"] = "system", sourceId?: string, sourceLayerIds: PassportDataLayerId[] = ["system"]): UraiRitual {
  return {
    id: `ritual-${template.id}-${sourceId ?? "system"}-${Date.now()}`,
    title: template.title,
    subtitle: template.subtitle,
    type: template.type,
    intensity: template.intensity,
    status: "suggested",
    summary: template.summary,
    steps: template.steps,
    sourceType,
    sourceId,
    sourceLayerIds,
    createdAt: now(),
    exportAllowed: false,
    addToLegacyAllowed: false,
  };
}

function allowedTemplate(context: RitualSuggestionContext, template: RitualTemplate, sourceLayers: PassportDataLayerId[]): boolean {
  if (template.type === "shadow_softening" && !context.passportProfile?.shadowEnabled) return false;
  if (template.type === "legacy" && !context.passportProfile?.legacyEnabled) return false;
  return sourceLayers.every((layer) => layerAllowed(context, layer));
}

export function suggestRituals(context: RitualSuggestionContext = {}): UraiRitual[] {
  const suggestions: Array<{ template: RitualTemplate; sourceType: UraiRitual["sourceType"]; sourceId?: string; layers: PassportDataLayerId[] }> = [];

  if (context.selectedShadowReflection?.id && context.selectedShadowReflection.visibility !== "locked") {
    const layers = context.selectedShadowReflection.sourceLayerIds?.length ? context.selectedShadowReflection.sourceLayerIds : ["shadow"];
    for (const id of ["keep-light-on", "soften-sentence", "step-back-ground"]) {
      const template = getRitualTemplate(id);
      if (template) suggestions.push({ template, sourceType: "shadow", sourceId: context.selectedShadowReflection.id, layers });
    }
  }

  if (context.selectedGroundElement?.id) {
    const layer = context.selectedGroundElement.sourceLayerId ?? "system";
    const template = getRitualTemplate(context.selectedGroundElement.type === "recoveryBloom" ? "small-return" : "return-ground");
    if (template) suggestions.push({ template, sourceType: "ground", sourceId: context.selectedGroundElement.id, layers: [layer] });
  }

  if (context.selectedLifeMapStar?.id) {
    const layer = context.selectedLifeMapStar.sourceLayerId ?? "system";
    const template = getRitualTemplate(context.selectedLifeMapStar.type === "milestone" ? "carry-forward" : "look-without-judging");
    if (template) suggestions.push({ template, sourceType: "life_map", sourceId: context.selectedLifeMapStar.id, layers: [layer] });
  }

  if (context.selectedMirrorReflection?.id) {
    const layers = context.selectedMirrorReflection.sourceLayerIds?.length ? context.selectedMirrorReflection.sourceLayerIds : ["system"];
    const pattern = context.selectedMirrorReflection.patternType;
    const template = getRitualTemplate(pattern === "overload" ? "put-one-thing-down" : pattern === "recovery" ? "small-return" : "name-pattern-softly");
    if (template) suggestions.push({ template, sourceType: "mirror", sourceId: context.selectedMirrorReflection.id, layers });
  }

  if (context.selectedLegacyItem?.id) {
    const layers = context.selectedLegacyItem.sourceLayerIds?.length ? context.selectedLegacyItem.sourceLayerIds : ["legacy"];
    const template = getRitualTemplate("write-one-line");
    if (template) suggestions.push({ template, sourceType: "legacy", sourceId: context.selectedLegacyItem.id, layers });
  }

  if (suggestions.length === 0) {
    for (const id of ["one-quiet-breath", "name-visible-thing", "put-one-thing-down"]) {
      const template = getRitualTemplate(id);
      if (template) suggestions.push({ template, sourceType: "system", layers: ["system"] });
    }
  }

  return suggestions
    .filter((item) => allowedTemplate(context, item.template, item.layers))
    .slice(0, 3)
    .map((item) => ritualFromTemplate(item.template, item.sourceType, item.sourceId, item.layers));
}

export function createSystemRitual(templateId = "one-quiet-breath"): UraiRitual {
  const template = getRitualTemplate(templateId) ?? RITUAL_TEMPLATES[0];
  return ritualFromTemplate(template, "system", undefined, ["system"]);
}
