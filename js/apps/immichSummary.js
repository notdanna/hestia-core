import { fetchImmich, formatBytes } from "./immichCore.js";

export function initSummary(el, config) {
    const { url, apiKey } = config;
    const bodyEl = el.querySelector('.pihole-body'); 

    bodyEl.innerHTML = `
        <div class="ph-grid">
            <div class="ph-card queries">
                <div class="ph-label">PHOTOS</div>
                <div class="ph-val" id="val-photos">--</div>
            </div>
            <div class="ph-card blocked">
                <div class="ph-label">VIDEOS</div>
                <div class="ph-val" id="val-videos">--</div>
            </div>
            <div class="ph-card percent">
                <div class="ph-label">STORAGE</div>
                <div class="ph-val" id="val-usage" style="font-size: 1rem;">--</div>
            </div>
        </div>
    `;

    const statusDot = el.querySelector('.ph-status-dot');
    const statusText = el.querySelector('.ph-status-text');

    return async () => {
        const cleanBase = url.endsWith('/') ? url.slice(0, -1) : url;
        const targetUrl = `${cleanBase}/api/server-info/statistics`;

        const data = await fetchImmich(targetUrl, apiKey);

        el.querySelector('#val-photos').innerText = data.photos.toLocaleString();
        el.querySelector('#val-videos').innerText = data.videos.toLocaleString();
        el.querySelector('#val-usage').innerText = formatBytes(data.usage);

        statusDot.className = 'ph-status-dot active';
        statusText.innerText = 'ONLINE';
    };
}