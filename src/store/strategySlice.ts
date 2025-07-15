import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {v4 as uuidv4} from "uuid";

type Asset = {
    id: string;
    category: string;
    weight: number;
};

export type StrategyState = {
    name: string;
    assets: Asset[];
};

const initialState: StrategyState = {
    name: "My Strategy",
    assets: [
        {id: uuidv4(), category: "", weight: 25},
    ],
};

const strategySlice = createSlice({
    name: "strategy",
    initialState,
    reducers: {
        addAsset(state) {
            state.assets.push({
                id: uuidv4(),
                category: "",
                weight: 25,
            });
        },
        updateAssetCategory(state, action: PayloadAction<{ id: string; category: string }>) {
            const asset = state.assets.find(a => a.id === action.payload.id);
            if (asset) {
                asset.category = action.payload.category;
            }
        },
        updateAssetWeight(state, action: PayloadAction<{ id: string; weight: number }>) {
            const asset = state.assets.find(a => a.id === action.payload.id);
            if (asset) {
                asset.weight = action.payload.weight;
            }
        },
        setStrategyName(state: StrategyState, action: PayloadAction<string>) {
            state.name = action.payload;
        },
        setAssets(state, action: PayloadAction<Asset[]>) {
            state.assets = action.payload;
        },
        clearStrategy(state) {
            state.name = "";
            state.assets = [{id: uuidv4(), category: "", weight: 25}];
        }
    },
});

export const {
    addAsset,
    updateAssetCategory,
    updateAssetWeight,
    setStrategyName,
    clearStrategy,
    setAssets
} = strategySlice.actions;
export default strategySlice.reducer;