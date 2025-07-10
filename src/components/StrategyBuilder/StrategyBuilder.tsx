import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import type {RootState} from "../../store";
import {addAsset, setStrategyName, clearStrategy, setAssets} from "../../store/strategySlice";
import AssetSelector from "./AssetSelector";
import WeightSlider from "./WeightSlider";

import {PieChart, Pie, Cell, Tooltip} from "recharts";

export default function StrategyBuilder() {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<null | {
        return: number;
        sharpe: number;
    }>(null);
    // State to trigger UI updates for saved strategies
    const [reloadListKey, setReloadListKey] = useState(0);

    const navigate = useNavigate();

    const strategyAssets = useSelector((state: RootState) => state.strategy.assets);
    const strategyName = useSelector((state: RootState) => state.strategy.name);
    const dispatch = useDispatch();

    const totalWeight = strategyAssets.reduce((sum, a) => sum + a.weight, 0);

    const chartData = strategyAssets
        .filter((a) => a.category)
        .map((a) => ({
            name: a.category,
            value: a.weight,
        }));

    const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171", "#a78bfa"];

    const handleBacktest = () => {
        setIsLoading(true);
        setResults(null);

        // Simulate a backend call
        setTimeout(() => {
            setIsLoading(false);
            setResults({
                return: 18.7,
                sharpe: 1.42,
            });
        }, 1500);
    };

    // Check for existing strategy name in savedStrategies
    const savedStrategies = JSON.parse(localStorage.getItem("savedStrategies") || "[]") as any[];
    const strategyExists = savedStrategies.some((s) => s.name === strategyName);

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate("/")}
                className="text-sm text-blue-400 hover:underline mb-2"
            >
                ← Back to Home
            </button>
            <h2 className="text-2xl font-semibold text-white">Build Your Strategy</h2>

            {/* Strategy Name Input */}
            <input
                type="text"
                value={strategyName}
                onChange={(e) => dispatch(setStrategyName(e.target.value))}
                className="w-full p-2 bg-gray-700 text-white rounded"
                placeholder="Enter strategy name..."
            />

            {/* Delete Strategy Button */}
            <button
                onClick={() => {
                    if (!confirm(`Delete strategy "${strategyName}"?`)) return;
                    const saved = localStorage.getItem("savedStrategies");
                    const list = saved ? JSON.parse(saved) : [];
                    const updated = list.filter((s: any) => s.name !== strategyName);
                    localStorage.setItem("savedStrategies", JSON.stringify(updated));
                    alert("Strategy deleted!");
                }}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded mb-2"
            >
                Delete Strategy
            </button>

            {/* Load saved strategies */}

            <div className="bg-gray-900 p-4 rounded-md text-white mt-4">
                <h3 className="text-lg font-semibold mb-2">Saved Strategies</h3>
                <ul className="space-y-1">
                    {(JSON.parse(localStorage.getItem("savedStrategies") || "[]") as any[]).map((s) => (
                        <li key={reloadListKey + s.name}
                            className="flex justify-between items-center border-b border-gray-700 py-1">
                            <span>{s.name}</span>
                            <button
                                onClick={() => {
                                    dispatch(setStrategyName(s.name));
                                    dispatch(setAssets(s.assets));
                                }}
                                className="text-sm text-blue-400 hover:underline"
                            >
                                Load
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Dynamic list of asset selectors and sliders */}
            <div className="space-y-4">
                {strategyAssets.map((item) => (
                    <div key={item.id} className="bg-gray-800 p-4 rounded-md space-y-2">
                        <AssetSelector id={item.id}/>
                        <WeightSlider id={item.id}/>
                    </div>
                ))}
            </div>

            <button
                onClick={() => dispatch(addAsset())}
                className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 text-white"
            >
                Add Asset
            </button>

            {/* Pie Chart */}
            {chartData.length > 0 && (
                <div className="max-w-xs">
                    <PieChart width={250} height={250}>
                        <Pie
                            data={chartData}
                            cx={125}
                            cy={125}
                            innerRadius={40}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Pie>
                        <Tooltip/>
                    </PieChart>
                </div>
            )}

            {/* Validation */}
            <div className={`text-sm ${totalWeight === 100 ? "text-green-400" : "text-red-400"}`}>
                Total Allocation: {totalWeight}% {totalWeight !== 100 && "(must equal 100%)"}
            </div>

            {/* Run Backtest */}
            <button
                disabled={totalWeight !== 100 || isLoading}
                onClick={handleBacktest}
                className={`px-4 py-2 rounded text-white ${
                    totalWeight === 100 && !isLoading
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-600 cursor-not-allowed"
                }`}
            >
                {isLoading ? "Running..." : "Run Backtest"}
            </button>

            {/* Save/Update strategy */}
            <div className="flex gap-4">
                <button
                    disabled={!strategyExists}
                    onClick={() => {
                        const updated = savedStrategies.map((s: any) =>
                            s.name === strategyName ? {name: strategyName, assets: strategyAssets} : s
                        );
                        localStorage.setItem("savedStrategies", JSON.stringify(updated));
                        setReloadListKey((prev) => prev + 1);
                        alert("Strategy updated!");
                    }}
                    className={`px-4 py-2 text-white rounded ${
                        strategyExists ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 cursor-not-allowed"
                    }`}
                >
                    Update Strategy
                </button>

                <button
                    disabled={strategyExists}
                    onClick={() => {
                        const fakeStats = {return: 12.5, sharpe: 1.2}; // Simulated stats
                        const updated = [...savedStrategies, {
                            name: strategyName,
                            assets: strategyAssets,
                            stats: fakeStats
                        }];
                        localStorage.setItem("savedStrategies", JSON.stringify(updated));
                        setReloadListKey((prev) => prev + 1);
                        alert("Strategy saved as new!");
                    }}
                    className={`px-4 py-2 text-white rounded ${
                        !strategyExists ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 cursor-not-allowed"
                    }`}
                >
                    Save As New
                </button>
            </div>

            {/* Clear Strategy Button */}
            <button
                onClick={() => {
                    dispatch(clearStrategy())
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
                Clear Strategy
            </button>

            {results && (
                <div className="p-4 bg-gray-800 rounded-md text-white space-y-2">
                    <h3 className="text-lg font-semibold">Backtest Results</h3>
                    <p>Return: <span className="text-green-400">{results.return}%</span></p>
                    <p>Sharpe Ratio: <span className="text-blue-400">{results.sharpe}</span></p>
                </div>
            )}
        </div>
    );
}