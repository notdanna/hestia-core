export async function fetchAdGuard(url, user, pass) {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    // Autenticación básica
    if (user && pass) {
        headers['Authorization'] = 'Basic ' + btoa(`${user}:${pass}`);
    }

    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    
    return await res.json();
}

export function formatNumber(num) {
    if (num === undefined || num === null) return '--';
    return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
}