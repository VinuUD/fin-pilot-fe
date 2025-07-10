import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearStrategy } from "../store/strategySlice";
import StrategyBuilder from "../components/StrategyBuilder/StrategyBuilder.tsx";

export default function StrategyPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearStrategy());
    }, [dispatch]);

    return (
        <div className="p-6">
            <StrategyBuilder />
        </div>
    );
}