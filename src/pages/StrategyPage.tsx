import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setStrategyName, setAssets, clearStrategy } from "../store/strategySlice";
import StrategyBuilder from "../components/StrategyBuilder/StrategyBuilder.tsx";

export default function StrategyPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        const activeName = localStorage.getItem("activeStrategy");
        const saved = JSON.parse(localStorage.getItem("savedStrategies") || "[]");

        if (activeName) {
            const strategy = saved.find((s: any) => s.name === activeName);
            if (strategy) {
                dispatch(setStrategyName(strategy.name));
                dispatch(setAssets(strategy.assets));
                return;
            }
        }

        // If no active strategy, or not found, clear the strategy
        dispatch(clearStrategy());
    }, [dispatch]);

    return (
        <div className="p-6">
            <StrategyBuilder />
        </div>
    );
}