import { BaseApp } from "./baseApp.js";
import { registry } from "../registry.js";
import { initSummary } from "./immichSummary.js";

export class ImmichApp extends BaseApp {
    async render(app) {
        return `
            <div class="app-content app-type-pihole">
                <div class="pihole-header">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <img src="https://immich.app/img/immich-logo-stacked-dark.svg" style="width:16px;">
                        <span class="ph-title">IMMICH</span>
                    </div>
                    <div class="ph-status-wrapper">
                        <div class="ph-status-dot"></div>
                        <span class="ph-status-text">--</span>
                    </div>
                </div>
                <div class="pihole-body"></div>
            </div>`;
    }

    onMount(el, app) {
        const url = app.data.url || '/immich-api';
        const apiKey = app.data.apiKey || '';
        const intervalTime = parseInt(app.data.interval) || 10000;

        const config = { url, apiKey };
        const updateLogic = initSummary(el, config);

        const runUpdate = async () => {
            if (!el.isConnected) return;
            try {
                if (updateLogic) await updateLogic();
            } catch (err) {
                console.error("[Immich] Error:", err);
                el.querySelector('.ph-status-text').innerText = "ERR";
            }
        };

        setInterval(runUpdate, intervalTime);
        runUpdate();
    }
}

registry.register('immich', ImmichApp, {
    label: 'Immich Stats',
    category: 'media',
    defaultSize: { cols: 2, rows: 1 },
    settings: [
        { name: 'url', label: 'URL (ej. /immich-api)', type: 'text' },
        { name: 'apiKey', label: 'API Key', type: 'password' },
        { name: 'interval', label: 'Interval (ms)', type: 'text', defaultValue: '10000' }
    ]
});