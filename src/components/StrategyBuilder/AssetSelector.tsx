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

    return (
        <select
            className="w-full p-2 bg-gray-700 text-white rounded"
            value={value}
            onChange={(e) =>
                dispatch(updateAssetCategory({id, category: e.target.value}))
            }
        >
            <option value="">Select Asset Category</option>
            <option value="tech">Technology</option>
            <option value="energy">Energy</option>
            <option value="finance">Finance</option>
            <option value="health">Healthcare</option>
        </select>
    );
}