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

/** Default Dark — the dark theme: an icy near-white crystal lit by indigo,
   on neutral near-black. Accent family from packages/tokens defaultDark. */
export const DARK: ScenePalette = {
	hemiSky: "#dfe3ff",
	hemiGround: "#1c1f33",
	fillBack: "#5b62e0",
	pointCore: "#6b73f0",
	fog: "#161616",
	formA: "#c6ccf5",
	formB: "#8b95ff",
	formC: "#eef0ff",
	shard: "#c6ccf5",
	shardEmissive: "#6b73f0",
	arc: "#8b95ff",
	particle: "#aab3f0",
};

export function getScenePalette(theme: string | undefined): ScenePalette {
	return theme === "dark" ? DARK : LIGHT;
}

export const PaletteContext = createContext<ScenePalette>(LIGHT);
export const usePalette = (): ScenePalette => useContext(PaletteContext);
