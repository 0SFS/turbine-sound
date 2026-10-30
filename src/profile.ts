import type { EngineAcousticDefinition } from "@0sfs/engine-sound/definition";
import { JET_ACOUSTIC_PROFILE_FIELDS, PISTON_ACOUSTIC_PROFILE_FIELDS, type EngineAcousticProfile } from "@0sfs/engine-sound/legacyProfile";
export { JET_ACOUSTIC_PROFILE_FIELDS, ACOUSTIC_PROFILE_FIELDS } from "@0sfs/engine-sound/legacyProfile";
export type { EngineAcousticProfile } from "@0sfs/engine-sound/legacyProfile";
export function acousticProfileValues(definition: EngineAcousticDefinition): number[] {
  const parameters = definition.parameters;
  if (!parameters || typeof parameters !== "object") throw new Error("Missing procedural jet parameters");
  const values = parameters as Record<string, unknown>;
  const encoded = JET_ACOUSTIC_PROFILE_FIELDS.map(field => {
    const value = values[field];
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 100_000) throw new Error(`Invalid procedural jet parameter ${field}`);
    return value;
  });
  const at = (field: keyof EngineAcousticProfile): number => encoded[JET_ACOUSTIC_PROFILE_FIELDS.indexOf(field)];
  if (at("idleN1Pct") >= 100 || at("idleN1SpanPct") <= 0 || at("idleN1SpanPct") > 100
    || at("thrustReferenceLbf") < 1 || at("fuelReferencePps") <= 0 || at("fanMix") > 1) {
    throw new Error("Invalid procedural jet reference range");
  }
  const gains: (keyof EngineAcousticProfile)[] = ["fanToneGain", "coreToneGain", "fanNoiseBaseGain",
    "fanNoisePowerGain", "bypassGain", "jetGain", "combustorGain", "outputGain", "afterburnerJetGain",
    "highFineMixGain", "highShockGain"];
  if (gains.some(field => at(field) > 16)) throw new Error("Invalid procedural jet gain range");
  const bounded: (keyof EngineAcousticProfile)[] = ["highRearMixDirectivity", "highShockDirectivity", "highCockpitGain"];
  if (bounded.some(field => at(field) > 1)) throw new Error("Invalid High acoustic shape range");
  const frequencies: (keyof EngineAcousticProfile)[] = ["highFineMixHz", "highShockHz", "highCockpitHz"];
  if (frequencies.some(field => at(field) < 20 || at(field) > 20_000)) throw new Error("Invalid High acoustic frequency range");
  return [...encoded, 0, ...PISTON_ACOUSTIC_PROFILE_FIELDS.map(() => 0)];
}

