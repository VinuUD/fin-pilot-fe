import {useNavigate} from "@tanstack/react-router";
import {useDispatch} from "react-redux";
import {setStrategyName, setAssets} from "../store/strategySlice";
import {useQuery} from '@tanstack/react-query';

export default function DashboardPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {data: savedStrategies = [], isLoading: loading, error} = useQuery({
        queryKey: ['strategies'],
        queryFn: async () => {
            const res = await fetch("http://localhost:8000/strategies");
            if (!res.ok) throw new Error("Failed to load strategies");
            return res.json();
        },
    });

    return (
        <div className="flex min-h-screen bg-gray-950 text-white">
            <div className="w-96 p-8 space-y-8 bg-gray-950">
                <h1 className="text-4xl font-semibold text-white mb-4">FinPilot</h1>
                <button
                    onClick={() => {
                        dispatch(setStrategyName(""));
                        dispatch(setAssets([]));
                        navigate({to: "/strategy", search: {name: ""}});
                    }}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium"
                >
                    + Create New Strategy
                </button>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full">
                    <h2 className="text-xl font-semibold mb-2">Saved Strategies</h2>
                    {loading ? (
                        <p className="text-gray-400">Loading strategies...</p>
                    ) : error ? (
                        <p className="text-red-400">Error: {error.message}</p>
                    ) : savedStrategies.length === 0 ? (
                        <p className="text-gray-400">No strategies saved yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {savedStrategies.map((s: {
                                name: string;
                                assets: any[];
                                stats: { return: any; sharpe: any; };
                            }) => (
                                <li
                                    key={s.name}
                                    className="border-b border-gray-700 py-3 px-2 hover:bg-gray-700/40 rounded transition min-w-0"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1 overflow-hidden">
                                            <span className="font-medium truncate">{s.name}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                dispatch(setStrategyName(s.name));
                                                dispatch(
                                                    setAssets(
                                                        s.assets.map((a: any) => ({
                                                            ...a,
                                                            id: a.id ?? crypto.randomUUID(),
                                                        }))
                                                    )
                                                );
                                                navigate({to: "/strategy", search: {name: s.name}});
                                            }}
                                            className="text-sm text-blue-400 hover:underline"
                                        >
                                            Open
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1">
                                        Return: {s.stats?.return ?? "—"}% | Sharpe: {s.stats?.sharpe ?? "—"}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-gray-400">
                <div className="text-2xl font-semibold mb-4">Dashboard in Development</div>
                <div className="animate-bounce text-5xl">🚧</div>
            </div>
        </div>
    );
}