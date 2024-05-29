import { EarningsData, fetchEarningsData } from "@/store/slices/earnings/earningsSlice";

export const updateEarningsDatazz = (data: EarningsData) => {
    return {
        type: fetchEarningsData.fulfilled.type,
        payload: data,
    };
};