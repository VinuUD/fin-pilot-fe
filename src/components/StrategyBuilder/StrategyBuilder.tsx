import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import type {RootState} from "../../store";
import {addAsset, setStrategyName, clearStrategy, setAssets} from "../../store/strategySlice";
import AssetSelector from "./AssetSelector";
import WeightSlider from "./WeightSlider";

import {PieChart, Pie, Cell, Tooltip} from "recharts";
import {
    simulateStrategy,
    saveStrategy,
    loadStrategies,
    deleteStrategy,
    loadStrategyByName
} from "../../services/api.ts";
import toast from "react-hot-toast";

export default function StrategyBuilder() {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingStrategies, setIsLoadingStrategies] = useState(false);
    const [results, setResults] = useState<null | {
        return: number;
        sharpe: number;
    }>(null);
    const [reloadListKey, setReloadListKey] = useState(0);

    const [savedStrategies, setSavedStrategies] = useState<any[]>([]);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingStrategies(true);
            try {
                const result = await loadStrategies();
                setSavedStrategies(result);
                // After loading, if strategyName exists in result, dispatch its name and assets
                const found = result.find((s: any) => s.name === strategyName);
                if (found) {
                    dispatch(setStrategyName(found.name));
                    dispatch(setAssets(found.assets.map((a: any) => ({...a, id: crypto.randomUUID()}))));
                }
            } catch (err: any) {
                console.error("API Error:", err);
                toast.error(err?.response?.data?.detail || "An error occurred.");
            } finally {
                setIsLoadingStrategies(false);
            }
        };
        fetchData();
    }, [reloadListKey]);

    const navigate = useNavigate();

    const strategyAssets = useSelector((state: RootState) => state.strategy.assets);
    const strategyName = useSelector((state: RootState) => state.strategy.name);

    const totalWeight = strategyAssets.reduce((sum, a) => sum + a.weight, 0);

    const chartData = strategyAssets
        .filter((a) => a.category)
        .map((a) => ({
            name: a.category,
            value: a.weight,
        }));

    const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171", "#a78bfa"];

    const handleBacktest = async () => {
        setIsLoading(true);
        setResults(null);
        try {
            const response = await simulateStrategy({
                name: strategyName,
                assets: strategyAssets
            });
            setResults({
                return: response.return_,
                sharpe: response.sharpe
            });
        } catch (err: any) {
            console.error("API Error:", err);
            toast.error(err?.response?.data?.detail || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    // Check for existing strategy name in savedStrategies
    const strategyExists = savedStrategies.some((s) => s.name === strategyName);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Saved strategies column */}
            <div className="w-full lg:w-[20rem] space-y-6">
                <button
                    onClick={() => navigate("/")}
                    className="text-sm text-blue-400 hover:underline"
                >
                    ← Back to Home
                </button>
                <div className="bg-gray-900 p-4 rounded-md text-white">
                    <h3 className="text-lg font-semibold mb-2">Saved Strategies</h3>
                    {isLoadingStrategies ? (
                        <p className="text-sm text-gray-400">Loading strategies...</p>
                    ) : (
                        <ul className="space-y-1">
                            {savedStrategies.map((s) => (
                                <li key={reloadListKey + s.name}
                                    className="flex justify-between items-center border-b border-gray-700 py-1">
                                    <span>{s.name}</span>
                                    <button
                                        onClick={async () => {
                                            try {
                                                const strategy = await loadStrategyByName(s.name);
                                                dispatch(setStrategyName(strategy.name));
                                                dispatch(setAssets(strategy.assets.map((a: any) => ({
                                                    ...a,
                                                    id: crypto.randomUUID() // Ensure unique IDs
                                                }))));
                                                if (window.location.pathname !== "/strategy") {
                                                    navigate("/strategy");
                                                }
                                            } catch (err: any) {
                                                console.error("API Error:", err);
                                                toast.error(err?.response?.data?.detail || "An error occurred.");
                                            }
                                        }}
                                        className="text-sm text-blue-400 hover:underline"
                                    >
                                        Load
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Strategy form and controls */}
            <div className="flex-1 space-y-6">
                <h1 className="text-3xl font-bold text-white">Strategy Builder</h1>

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
                    onClick={async () => {
                        if (!confirm(`Delete strategy "${strategyName}"?`)) return;
                        try {
                            await deleteStrategy(strategyName);
                            setReloadListKey((prev) => prev + 1);
                            toast.success("Strategy deleted!");
                        } catch (err: any) {
                            console.error("API Error:", err);
                            toast.error(err?.response?.data?.detail || "An error occurred.");
                        }
                    }}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded mb-2"
                >
                    Delete Strategy
                </button>

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
                <div className="flex flex-wrap gap-4">
                    <button
                        disabled={!strategyExists}
                        onClick={async () => {
                            try {
                                await saveStrategy({name: strategyName, assets: strategyAssets});
                                setReloadListKey((prev) => prev + 1);
                                toast.success("Strategy updated!");
                            } catch (err: any) {
                                console.error("API Error:", err);
                                toast.error(err?.response?.data?.detail || "An error occurred.");
                            }
                        }}
                        className={`px-4 py-2 text-white rounded ${
                            strategyExists ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 cursor-not-allowed"
                        }`}
                    >
                        Update Strategy
                    </button>

                    <button
                        disabled={strategyExists}
                        onClick={async () => {
                            try {
                                await saveStrategy({name: strategyName, assets: strategyAssets}).then(() => {
                                    setReloadListKey((prev) => prev + 1);
                                    toast.success("Strategy saved as new!");
                                });
                            } catch (err: any) {
                                console.error("API Error:", err);
                                toast.error(err?.response?.data?.detail || "An error occurred.");
                            }
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
            </div>

            {/* Chart and backtest results */}
            <div className="w-full lg:w-[24rem] space-y-6">
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

                {results && (
                    <div className="p-4 bg-gray-800 rounded-md text-white space-y-2">
                        <h3 className="text-lg font-semibold">Backtest Results</h3>
                        <p>Return: <span className="text-green-400">{results.return}%</span></p>
                        <p>Sharpe Ratio: <span className="text-blue-400">{results.sharpe}</span></p>
                    </div>
                )}
            </div>
        </div>
    );
}