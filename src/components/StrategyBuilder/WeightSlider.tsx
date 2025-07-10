import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { updateAssetWeight } from "../../store/strategySlice";

type Props = {
    id: string;
};

export default function WeightSlider({ id }: Props) {
    const dispatch = useDispatch();
    const weight = useSelector((state: RootState) =>
        state.strategy.assets.find((a) => a.id === id)?.weight || 0
    );

    return (
        <div className="flex items-center gap-4">
            <input
                type="range"
                min="0"
                max="100"
                value={weight}
                onChange={(e) =>
                    dispatch(updateAssetWeight({ id, weight: Number(e.target.value) }))
                }
                className="w-full"
            />
            <span className="text-white w-12 text-right">{weight}%</span>
        </div>
    );
}