import { createContext, useContext } from "react";

/** Colours the hero scene draws with, swapped per theme. */
export interface ScenePalette {
	hemiSky: string;
	hemiGround: string;
	fillBack: string;
	pointCore: string;
	fog: string;
	formA: string;
	formB: string;
	formC: string;
	shard: string;
	shardEmissive: string;
	arc: string;
	particle: string;
}

/** Default Light — the light theme: a violet-indigo crystal on near-white.
   Accent family from packages/tokens defaultLight (palette.blue). */
export const LIGHT: ScenePalette = {
	hemiSky: "#5b62e0",
	hemiGround: "#e4e6fb",
	fillBack: "#3f45b5",
	pointCore: "#6b73f0",
	fog: "#f7f7f7",
	formA: "#5b62e0",
	formB: "#3f45b5",
	formC: "#6b73f0",
	shard: "#5b62e0",
	shardEmissive: "#6b73f0",
	arc: "#8b95ff",
	particle: "#5b62e0",
};

/** Midnight — the dark theme. The original blue-site look: an icy near-white
   crystal lit by cyan, on navy. Cyan family from the icon (icon.svg boltGrad). */
export const MIDNIGHT: ScenePalette = {
	hemiSky: "#cfe8f7",
	hemiGround: "#16243f",
	fillBack: "#2b9bd1",
	pointCore: "#1ea8d6",
	fog: "#0a1020",
	formA: "#bcd6ee",
	formB: "#5cc8ee",
	formC: "#e8fbff",
	shard: "#bcd6ee",
	shardEmissive: "#1ea8d6",
	arc: "#5cc8ee",
	particle: "#9ecbe8",
};

export function getScenePalette(theme: string | undefined): ScenePalette {
	return theme === "dark" ? MIDNIGHT : LIGHT;
}

export const PaletteContext = createContext<ScenePalette>(LIGHT);
export const usePalette = (): ScenePalette => useContext(PaletteContext);
