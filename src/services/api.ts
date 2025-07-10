const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function simulateStrategy(data: any) {
    const res = await fetch(`${BASE_URL}/simulate`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function saveStrategy(data: any) {
    const res = await fetch(`${BASE_URL}/strategies`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function loadStrategies() {
    const res = await fetch(`${BASE_URL}/strategies`);
    return res.json();
}

export async function deleteStrategy(name: string) {
    const res = await fetch(`${BASE_URL}/strategies/${name}`, {
        method: "DELETE",
    });
    return res.json();
}

export async function loadStrategyByName(name: string) {
    const res = await fetch(`${BASE_URL}/strategies/${name}`);
    return res.json();
}