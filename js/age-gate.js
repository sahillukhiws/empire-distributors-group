/* ============================================
   AGE GATE - blocks site until 21+ confirmed
   Persists verification in localStorage for 30 days
   ============================================ */
(function () {
    const STORAGE_KEY = 'edg_age_verified';
    const TTL_DAYS = 30;
    const inPages = /\/pages\//.test(window.location.pathname);
    const BASE = inPages ? '../' : '';

    function isVerified() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return false;
            const { ts } = JSON.parse(raw);
            const ageMs = Date.now() - ts;
            return ageMs < TTL_DAYS * 24 * 60 * 60 * 1000;
        } catch { return false; }
    }

    function markVerified() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now() }));
        } catch { /* storage disabled */ }
    }

    function buildGate() {
        const gate = document.createElement('div');
        gate.className = 'age-gate';
        gate.setAttribute('role', 'dialog');
        gate.setAttribute('aria-modal', 'true');
        gate.setAttribute('aria-labelledby', 'age-gate-title');
        gate.innerHTML = `
            <div class="age-gate__card">
                <div class="age-gate__head">
                    <img class="age-gate__logo" src="${BASE}assets/logos/empire-logo-removebg-preview.png" alt="Empire Distributors Group">
                </div>

                <div class="age-gate__banner">
                    <img src="${BASE}assets/categories/vape/vapes-new/img-6937.png" alt="Featured product">
                </div>

                <div class="age-gate__body">
                    <p class="age-gate__desc">
                        Experience premium distribution with Empire Distributors Group - the fastest-growing distributor of vape, wellness, and lifestyle products nationwide. Before we proceed, we want to remind you that only adults of legal age are permitted to purchase, handle, and own these products. Use our products at your own risk, and let's get ready to elevate your retail game!
                    </p>

                    <p class="age-gate__prompt" id="age-gate-title">Please verify that you are 21 years of age or older.</p>

                    <button class="age-gate__btn" type="button" id="age-gate-accept">Yes, I am 21 or older</button>

                    <p class="age-gate__cookie">This website uses cookies, by continuing to use our site you're agreeing to our cookie policy.</p>

                    <div class="age-gate__socials">
                        <a class="age-gate__social" data-wa="Hi Empire!" aria-label="WhatsApp">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A7.8 7.8 0 0 0 12 4a7.9 7.9 0 0 0-6.7 12L4 20.9l5-1.3a7.9 7.9 0 0 0 11.9-6.8 7.8 7.8 0 0 0-2.3-5.5z"/></svg>
                        </a>
                        <a class="age-gate__social" href="mailto:empiredistributorsgroup@gmail.com" aria-label="Email">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                        </a>
                        <a class="age-gate__social" href="tel:+14703753936" aria-label="Phone">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>
                        </a>
                        <a class="age-gate__social" href="#" aria-label="Instagram">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        `;
        return gate;
    }

    function init() {
        // Lock scroll while gate is visible
        if (isVerified()) return;

        document.documentElement.style.overflow = 'hidden';
        const gate = buildGate();
        document.body.appendChild(gate);

        const acceptBtn = gate.querySelector('#age-gate-accept');
        acceptBtn.addEventListener('click', () => {
            markVerified();
            gate.style.animation = 'fadeIn 0.3s reverse';
            setTimeout(() => {
                gate.remove();
                document.documentElement.style.overflow = '';
            }, 280);
        });

        // Wire the WhatsApp social icon immediately (don't wait for catalog.js)
        const waLink = gate.querySelector('[data-wa]');
        if (waLink) {
            const msg = encodeURIComponent(waLink.getAttribute('data-wa') || 'Hi Empire!');
            waLink.href = 'https://wa.me/14703753936?text=' + msg;
            waLink.target = '_blank';
            waLink.rel = 'noopener';
        }

        // Focus trap - keep tab within the modal
        acceptBtn.focus();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
