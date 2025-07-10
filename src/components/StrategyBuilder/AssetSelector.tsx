import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../store";
import {updateAssetCategory} from "../../store/strategySlice";

type Props = {
    id: string;
};

export default function AssetSelector({id}: Props) {
    const dispatch = useDispatch();
    const value = useSelector((state: RootState) =>
        state.strategy.assets.find((a) => a.id === id)?.category || ""
    );
    console.log("Rendering", id, "with value", value);
    return (
        <select
            className="w-full p-2 bg-gray-700 text-white rounded"
            value={value}
            onChange={(e) =>
                dispatch(updateAssetCategory({id, category: e.target.value}))
            }
        >
            <option value="">Select Asset Category</option>
            <option value="Technology">Technology</option>
            <option value="Energy">Energy</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
        </select>
    );
}