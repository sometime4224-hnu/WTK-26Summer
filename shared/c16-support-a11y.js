(() => {
    'use strict';

    const actionByPage = {
        'grammar3-worth-gauge.html': '상황을 고르고, 걸림돌과 가치 근거를 읽은 뒤 판단하세요.',
        'grammar3-threshold-animation.html': '상황 하나를 골라 기준을 넘는지 짧게 확인하세요.',
        'grammar4-korea-map-match.html': '한국 지역을 고른 뒤, 보이는 도시 핀 하나를 선택하세요.',
        'grammar4-korea-then-now-map.html': '한국 지역을 고른 뒤, 도시의 문화 변화를 살펴보세요.',
        'grammar4-vietnam-map-match.html': '비교할 문화가 필요할 때만 지역과 도시를 선택하세요.',
        'grammar4-vietnam-then-now-map.html': '다른 문화와 비교할 때만 지역과 도시를 선택하세요.',
        'grammar4-fame-tag-match.html': '이 자료는 보관용입니다. 핵심 연습은 문법 4의 워크북 퀴즈에서 하세요.',
        'grammar4-fame-tag-match-vietnam.html': '이 자료는 보관용입니다. 핵심 연습은 문법 4의 워크북 퀴즈에서 하세요.',
        'grammar4-vietnam-map-music-match.html': '이 자료는 보관용입니다. 핵심 연습은 문법 4의 워크북 퀴즈에서 하세요.'
    };

    function pageName() {
        return location.pathname.split('/').pop() || '';
    }

    function plainTitle() {
        return document.title
            .replace(/^16과\s*/, '')
            .replace(/\s*\|\s*/g, ' · ')
            .replace(/보조자료\s*\d*\s*·?\s*/g, '')
            .trim() || '16과 문법 보조 활동';
    }

    function install() {
        if (document.getElementById('c16SupportA11yStyle')) {
            return;
        }
        const style = document.createElement('style');
        style.id = 'c16SupportA11yStyle';
        style.textContent = `
            .c16-skip-link { position: fixed; left: 12px; top: -56px; z-index: 9999; padding: 10px 14px; border-radius: 10px; background: #0f172a; color: #fff; font-weight: 800; text-decoration: none; }
            .c16-skip-link:focus { top: 10px; outline: 3px solid #fbbf24; outline-offset: 2px; }
            .c16-support-heading { margin: 0 0 5px; color: #0f172a; font-size: clamp(1.2rem, 4vw, 1.7rem); line-height: 1.25; font-weight: 950; }
            .c16-support-action { margin: 0 0 12px; color: #334155; font-size: 0.94rem; font-weight: 750; line-height: 1.55; }
            button:focus-visible, a:focus-visible, summary:focus-visible, input:focus-visible { outline: 3px solid #0f766e !important; outline-offset: 3px; }
            @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; } }
        `;
        document.head.append(style);

        const main = document.querySelector('main');
        if (!main) {
            return;
        }
        if (!main.id) {
            main.id = 'main-content';
        }
        main.setAttribute('tabindex', '-1');
        if (!document.querySelector('.c16-skip-link')) {
            const skip = document.createElement('a');
            skip.className = 'c16-skip-link';
            skip.href = '#' + main.id;
            skip.textContent = '본문으로 건너뛰기';
            document.body.insertBefore(skip, document.body.firstChild);
        }
        if (!main.querySelector('h1')) {
            const heading = document.createElement('h1');
            heading.className = 'c16-support-heading';
            heading.textContent = plainTitle();
            const action = document.createElement('p');
            action.className = 'c16-support-action';
            action.textContent = '첫 행동: ' + (actionByPage[pageName()] || '화면의 활동을 하나 선택하고 결과를 확인하세요.');
            main.insertBefore(action, main.firstChild);
            main.insertBefore(heading, main.firstChild);
        }
        document.querySelectorAll('[aria-live], #feedback, #result, #statusText').forEach((element) => {
            if (!element.getAttribute('role')) {
                element.setAttribute('role', 'status');
            }
            if (!element.getAttribute('aria-live')) {
                element.setAttribute('aria-live', 'polite');
            }
        });

        document.querySelectorAll('.c16-skip-link, .skip-link, .sp-c16-skip').forEach((link) => {
            link.addEventListener('click', () => {
                const href = link.getAttribute('href') || '';
                if (!href.startsWith('#') || href.length < 2) return;
                const target = document.getElementById(href.slice(1));
                if (!target) return;
                target.setAttribute('tabindex', '-1');
                window.setTimeout(() => target.focus({ preventScroll: true }), 0);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', install, { once: true });
    } else {
        install();
    }
})();
