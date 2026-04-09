/* ============================================
   AGE GATE - blocks site until 21+ confirmed
   Persists verification in localStorage for 30 days
   ============================================ */
(function () {
    const STORAGE_KEY = 'edg_age_verified';
    const TTL_DAYS = 30;

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
                <img class="age-gate__logo-img" src="assets/logos/empire-logo.png" alt="Empire Distributors Group">
                <div class="age-gate__warning">
                    <strong>⚠ WARNING:</strong> This site contains products with nicotine, hemp-derived cannabinoids, and other age-restricted items intended for adults 21+ only.
                </div>
                <h2 id="age-gate-title" class="age-gate__title">Age Verification</h2>
                <p class="age-gate__text">
                    You must be <strong>21 years of age or older</strong> to enter this site.
                    By clicking below, you confirm that you meet the legal age requirement in your jurisdiction.
                </p>
                <button class="age-gate__btn" type="button" id="age-gate-accept">
                    Yes, I am 21 or older
                </button>
                <a class="age-gate__exit" href="https://www.google.com">I am under 21 - exit</a>
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

        // Focus trap - keep tab within the modal
        acceptBtn.focus();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
