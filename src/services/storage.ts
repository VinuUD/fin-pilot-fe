export type SavedStrategy = {
    name: string;
    assets: { id: string; category: string; weight: number }[];
};

const STORAGE_KEY = "finpilot-strategies";

export function saveStrategy(strategy: SavedStrategy) {
    const existing = getSavedStrategies();
    const updated = [...existing.filter(s => s.name !== strategy.name), strategy];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getSavedStrategies(): SavedStrategy[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}