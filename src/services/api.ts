import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function simulateStrategy(data: any) {
    const res = await fetch(`${BASE_URL}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleApiResponse(res, "Simulating strategy failed");
}

export async function saveStrategy(data: any) {
    const res = await fetch(`${BASE_URL}/strategies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleApiResponse(res, "Saving strategy failed");
}

export async function loadStrategies() {
    const res = await fetch(`${BASE_URL}/strategies`);
    return handleApiResponse(res, "Loading strategies failed");
}

export async function deleteStrategy(name: string) {
    const res = await fetch(`${BASE_URL}/strategies/${name}`, {
        method: "DELETE",
    });
    return handleApiResponse(res, "Deleting strategy failed");
}

export async function loadStrategyByName(name: string) {
    const res = await fetch(`${BASE_URL}/strategies/${name}`);
    return handleApiResponse(res, "Loading strategy by name failed");
}

async function handleApiResponse(res: Response, defaultErrMessage: string) {
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const errorMessage = err?.detail || defaultErrMessage;
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }
    return res.json();
}