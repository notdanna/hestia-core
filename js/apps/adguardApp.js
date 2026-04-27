import { BaseApp } from "./baseApp.js";
import { registry } from "../registry.js";
import { initSummary } from "./adguardSummary.js";

export class AdGuardApp extends BaseApp {
    async render(app) {
        return `
            <div class="app-content app-type-pihole">
                <div class="pihole-header">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <img src="https://cdn.adguard.com/public/Adguard/Common/adguard_logo.svg" style="width:16px;">
                        <span class="ph-title">ADGUARD HOME</span>
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
        const url = app.data.url || 'http://100.92.76.91:8082';
        const user = app.data.user || '';
        const pass = app.data.pass || '';
        const intervalTime = parseInt(app.data.interval) || 5000;

        const config = { url, user, pass };
        const updateLogic = initSummary(el, config);

        const runUpdate = async () => {
            if (!el.isConnected) return;
            try {
                if (updateLogic) await updateLogic();
            } catch (err) {
                console.error("[AdGuard] Error:", err);
                const statusText = el.querySelector('.ph-status-text');
                if (statusText) statusText.innerText = "ERR";
            }
        };

        const timer = setInterval(runUpdate, intervalTime);
        runUpdate();
    }
}

registry.register('adguard', AdGuardApp, {
    label: 'AdGuard Home',
    category: 'data',
    defaultSize: { cols: 2, rows: 1 },
    settings: [
        { name: 'url', label: 'URL (ej. http://100.92.76.91:8082)', type: 'text' },
        { name: 'user', label: 'Username', type: 'text' },
        { name: 'pass', label: 'Password', type: 'password' },
        { name: 'interval', label: 'Interval (ms)', type: 'text', defaultValue: '5000' }
    ]
});