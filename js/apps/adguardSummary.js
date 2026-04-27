import { fetchAdGuard, formatNumber } from "./adguardCore.js";

export function initSummary(el, config) {
    const { url, user, pass } = config;
    const bodyEl = el.querySelector('.pihole-body'); // Reutilizamos la clase CSS

    bodyEl.innerHTML = `
        <div class="ph-grid">
            <div class="ph-card queries">
                <div class="ph-label">QUERIES</div>
                <div class="ph-val" id="val-total">--</div>
            </div>
            <div class="ph-card blocked">
                <div class="ph-label">BLOCKED</div>
                <div class="ph-val" id="val-blocked">--</div>
            </div>
            <div class="ph-card percent">
                <div class="ph-label">RATIO</div>
                <div class="ph-val" id="val-percent">--%</div>
            </div>
        </div>
    `;

    const statusDot = el.querySelector('.ph-status-dot');
    const statusText = el.querySelector('.ph-status-text');

    return async () => {
        const cleanBase = url.endsWith('/') ? url.slice(0, -1) : url;
        const targetUrl = `${cleanBase}/control/stats`;

        const data = await fetchAdGuard(targetUrl, user, pass);

        const total = data.num_dns_queries || 0;
        const blocked = data.num_blocked_filtering || 0;
        const ratio = total > 0 ? ((blocked / total) * 100).toFixed(1) : 0;

        el.querySelector('#val-total').innerText = formatNumber(total);
        el.querySelector('#val-blocked').innerText = formatNumber(blocked);
        el.querySelector('#val-percent').innerText = ratio + '%';

        statusDot.className = 'ph-status-dot active';
        statusText.innerText = 'ONLINE';
    };
}