(function attachCountryMapEngine(global) {
    'use strict';

    const REQUIRED_IDS = [
        'sentenceText',
        'regionBadge',
        'placeChip',
        'tagChip',
        'mapAction',
        'photoAction',
        'regionBar',
        'mapCanvas',
        'mapLayer',
        'pinLayer',
        'pinCount',
        'zoomOutBtn',
        'zoomInBtn',
        'zoomResetBtn',
        'zoomLevel',
        'placeIcon',
        'placeName',
        'placeMeta',
        'tagGrid',
        'tagCount',
        'nearGrid',
        'nearCount',
        'saveStatus',
        'resetActivityBtn'
    ];

    const DEFAULT_STATUS_MESSAGES = Object.freeze({
        empty: '자동 저장',
        restored: '이어서 시작했어요',
        saved: '저장됨',
        reset: '처음 상태로 돌아왔어요',
        'storage-unavailable': '이 기기에서는 선택을 저장할 수 없어요',
        'write-failed': '선택을 저장하지 못했어요',
        'reset-failed': '저장된 선택을 지우지 못했어요',
        'record-protected': '저장값을 확인한 뒤 처음부터 시작해 주세요',
        'corrupt-record': '저장값을 읽을 수 없어요. 처음부터 시작해 주세요',
        'unknown-schema': '다른 버전의 저장값이 있어요. 처음부터 시작해 주세요',
        'invalid-record': '저장값이 올바르지 않아요. 처음부터 시작해 주세요',
        'invalid-state': '현재 선택을 저장하지 못했어요'
    });

    const WARNING_CODES = new Set([
        'storage-unavailable',
        'write-failed',
        'reset-failed',
        'record-protected',
        'corrupt-record',
        'unknown-schema',
        'invalid-record',
        'invalid-state'
    ]);

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function isRecord(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function fillTemplate(template, values) {
        return String(template || '').replace(/\{(\w+)\}/g, (match, key) => (
            Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match
        ));
    }

    function jong(text) {
        const value = String(text || '');
        const code = value.charCodeAt(value.length - 1);
        if (code < 0xac00 || code > 0xd7a3) return 0;
        return (code - 0xac00) % 28;
    }

    function topicParticle(text) {
        return jong(text) === 0 ? '는' : '은';
    }

    function roParticle(text) {
        const finalSound = jong(text);
        return finalSound === 0 || finalSound === 8 ? '로' : '으로';
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function assert(condition, message) {
        if (!condition) throw new Error(`C16 country map: ${message}`);
    }

    function validateConfig(config) {
        assert(isRecord(config), 'configuration is required.');
        assert(isRecord(config.data), 'data is required.');
        assert(typeof config.data.countryId === 'string' && config.data.countryId, 'countryId is required.');
        assert(
            Number.isInteger(config.data.schemaVersion) && config.data.schemaVersion > 0,
            'schemaVersion must be a positive integer.'
        );
        assert(
            typeof config.data.storageKey === 'string' && config.data.storageKey,
            'storageKey is required.'
        );
        assert(Array.isArray(config.data.regions) && config.data.regions.length > 1, 'regions are required.');
        assert(Array.isArray(config.data.targets) && config.data.targets.length > 0, 'targets are required.');
        assert(isRecord(config.data.tags), 'tags are required.');
        assert(isRecord(config.data.initialState), 'initialState is required.');

        const zoomSteps = config.data.zoomSteps || [1, 1.35, 1.7, 2.15, 2.6];
        assert(
            Array.isArray(zoomSteps)
            && zoomSteps.length > 0
            && zoomSteps.every((step) => Number.isFinite(step) && step >= 1),
            'zoomSteps must contain numbers greater than or equal to 1.'
        );

        const regionIds = new Set();
        config.data.regions.forEach((region) => {
            assert(isRecord(region), 'each region must be an object.');
            assert(typeof region.id === 'string' && region.id, 'each region needs an id.');
            assert(!regionIds.has(region.id), `duplicate region id "${region.id}".`);
            assert(typeof region.label === 'string' && region.label, `region "${region.id}" needs a label.`);
            regionIds.add(region.id);
        });
        assert(regionIds.has('all'), 'regions must include the "all" filter.');

        const targetIds = new Set();
        const labelPlacements = new Set(['right', 'top', 'bottom', 'left']);
        config.data.targets.forEach((target) => {
            assert(isRecord(target), 'each target must be an object.');
            assert(typeof target.id === 'string' && target.id, 'each target needs an id.');
            assert(!targetIds.has(target.id), `duplicate target id "${target.id}".`);
            assert(regionIds.has(target.region), `target "${target.id}" references an unknown region.`);
            assert(target.region !== 'all', `target "${target.id}" cannot belong to the "all" region.`);
            assert(Number.isFinite(target.x) && target.x >= 0 && target.x <= 100, `target "${target.id}" has an invalid x coordinate.`);
            assert(Number.isFinite(target.y) && target.y >= 0 && target.y <= 100, `target "${target.id}" has an invalid y coordinate.`);
            assert(
                target.displayX === undefined
                || (Number.isFinite(target.displayX) && target.displayX >= 0 && target.displayX <= 100),
                `target "${target.id}" has an invalid displayX coordinate.`
            );
            assert(
                target.displayY === undefined
                || (Number.isFinite(target.displayY) && target.displayY >= 0 && target.displayY <= 100),
                `target "${target.id}" has an invalid displayY coordinate.`
            );
            assert(
                target.labelPlacement === undefined || labelPlacements.has(target.labelPlacement),
                `target "${target.id}" has an invalid labelPlacement.`
            );
            assert(typeof target.name === 'string' && target.name, `target "${target.id}" needs a name.`);
            assert(
                target.badge === undefined || typeof target.badge === 'string',
                `target "${target.id}" has an invalid badge.`
            );
            assert(Array.isArray(target.tagIds) && target.tagIds.length > 0, `target "${target.id}" needs tags.`);
            target.tagIds.forEach((tagId) => {
                assert(isRecord(config.data.tags[tagId]), `target "${target.id}" references unknown tag "${tagId}".`);
            });
            targetIds.add(target.id);
        });
        config.data.regions
            .filter((region) => region.id !== 'all')
            .forEach((region) => {
                assert(
                    config.data.targets.some((target) => target.region === region.id),
                    `region "${region.id}" has no targets.`
                );
            });

        Object.entries(config.data.tags).forEach(([tagId, tag]) => {
            assert(typeof tag.label === 'string' && tag.label, `tag "${tagId}" needs a label.`);
            assert(
                typeof tag.imageQuery === 'string' && tag.imageQuery,
                `tag "${tagId}" needs an imageQuery.`
            );
            assert(
                tag.mapQuery === undefined || tag.mapQuery === null || typeof tag.mapQuery === 'string',
                `tag "${tagId}" has an invalid mapQuery.`
            );
        });

        const initialTarget = config.data.targets.find((target) => (
            target.id === config.data.initialState.targetId
        ));
        assert(regionIds.has(config.data.initialState.region), 'initialState has an unknown region.');
        assert(initialTarget, 'initialState has an unknown target.');
        assert(
            config.data.initialState.region === 'all'
            || initialTarget.region === config.data.initialState.region,
            'initialState target does not belong to its region.'
        );
        assert(
            initialTarget.tagIds.includes(config.data.initialState.tagId),
            'initialState tag does not belong to its target.'
        );
        assert(
            Number.isInteger(config.data.initialState.zoomIndex)
            && config.data.initialState.zoomIndex >= 0
            && config.data.initialState.zoomIndex < zoomSteps.length,
            'initialState has an invalid zoomIndex.'
        );

        return zoomSteps;
    }

    function collectElements(root) {
        const elements = {};
        REQUIRED_IDS.forEach((id) => {
            const element = root.getElementById(id);
            assert(element, `missing required element #${id}.`);
            elements[id] = element;
        });
        return elements;
    }

    function mount(config) {
        const root = config?.root || document;
        const zoomSteps = validateConfig(config);
        const elements = collectElements(root);
        const data = config.data;
        const copy = {
            grammarLabel: 'N(으)로',
            mapTitle: '구글맵에서 보기',
            mapAria: '{place} {tag} 구글맵에서 보기',
            imageTitle: '사진 보기',
            imageAria: '{place} {tag} 사진 보기',
            resetConfirm: '이 활동의 저장된 선택을 지우고 처음부터 시작할까요?',
            ...config.copy
        };
        const statusMessages = {
            ...DEFAULT_STATUS_MESSAGES,
            ...config.statusMessages
        };
        const nearLimit = Number.isInteger(config.nearLimit) ? config.nearLimit : 6;

        const regionsById = new Map(data.regions.map((region) => [region.id, region]));
        const targetsById = new Map(data.targets.map((target) => [target.id, target]));

        function isValidState(candidate) {
            if (!isRecord(candidate)) return false;
            const target = targetsById.get(candidate.targetId);
            return Boolean(
                regionsById.has(candidate.region)
                && target
                && (candidate.region === 'all' || target.region === candidate.region)
                && target.tagIds.includes(candidate.tagId)
                && Number.isInteger(candidate.zoomIndex)
                && candidate.zoomIndex >= 0
                && candidate.zoomIndex < zoomSteps.length
            );
        }

        assert(global.C16CountryMapState, 'grammar4-country-map-state.js must load first.');
        const stateStore = global.C16CountryMapState.create({
            key: data.storageKey,
            schemaVersion: data.schemaVersion,
            defaults: data.initialState,
            validate: isValidState
        });
        const loadResult = stateStore.load();
        const state = loadResult.state;

        let destroyed = false;
        let pendingFocusSelector = '';
        let resizeObserver = null;

        function getTarget() {
            return targetsById.get(state.targetId);
        }

        function getTag(tagId) {
            return data.tags[tagId];
        }

        function filteredTargets() {
            return state.region === 'all'
                ? data.targets
                : data.targets.filter((target) => target.region === state.region);
        }

        function icon(className) {
            const safeClass = /^[a-z0-9 _-]+$/i.test(className || '') ? className : 'fa-location-dot';
            return `<i class="fa-solid ${escapeHtml(safeClass)}" aria-hidden="true"></i>`;
        }

        function buildSentence(target, tagId) {
            const tag = getTag(tagId).label;
            return `${target.name}${topicParticle(target.name)} ${tag}${roParticle(tag)} 유명해요.`;
        }

        function mapsUrl(tagId) {
            const query = getTag(tagId).mapQuery;
            if (!query) return '';
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
        }

        function photosUrl(tagId) {
            const query = getTag(tagId).imageQuery;
            return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
        }

        function linkMarkup(className, href, title, ariaLabel, iconName) {
            if (!href) return '';
            return `
                <a class="${escapeHtml(className)}" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(ariaLabel)}" title="${escapeHtml(title)}">
                    ${icon(iconName)}
                </a>
            `;
        }

        function tagActions(target, tagId) {
            const tag = getTag(tagId);
            const replacements = {
                place: target.name,
                tag: tag.label
            };
            const mapLink = linkMarkup(
                'map-link',
                mapsUrl(tagId),
                copy.mapTitle,
                fillTemplate(copy.mapAria, replacements),
                'fa-map-location-dot'
            );
            const imageLink = linkMarkup(
                'photo-link',
                photosUrl(tagId),
                copy.imageTitle,
                fillTemplate(copy.imageAria, replacements),
                'fa-image'
            );
            return `<span class="tag-actions">${mapLink}${imageLink}</span>`;
        }

        function updateSaveStatus(result) {
            elements.saveStatus.textContent = statusMessages[result.code] || '';
            elements.saveStatus.dataset.tone = WARNING_CODES.has(result.code) ? 'warning' : 'ok';
        }

        function saveState() {
            updateSaveStatus(stateStore.save(state));
        }

        function queueFocus(selector) {
            pendingFocusSelector = selector;
        }

        function restoreFocus() {
            if (!pendingFocusSelector) return;
            const selector = pendingFocusSelector;
            pendingFocusSelector = '';
            global.requestAnimationFrame(() => {
                if (destroyed) return;
                root.querySelector(selector)?.focus({ preventScroll: true });
            });
        }

        function updateZoomControls() {
            const scale = zoomSteps[state.zoomIndex];
            elements.zoomLevel.textContent = `${Math.round(scale * 100)}%`;
            elements.zoomOutBtn.disabled = state.zoomIndex === 0;
            elements.zoomInBtn.disabled = state.zoomIndex === zoomSteps.length - 1;
            elements.zoomResetBtn.disabled = state.zoomIndex === 0;
        }

        function updateMapTransform() {
            const scale = zoomSteps[state.zoomIndex];
            const target = getTarget();
            const rect = elements.mapCanvas.getBoundingClientRect();
            let panX = 0;
            let panY = 0;

            if (scale > 1 && rect.width > 0 && rect.height > 0) {
                panX = (rect.width / 2) - ((rect.width * target.x / 100) * scale);
                panY = (rect.height / 2) - ((rect.height * target.y / 100) * scale);
                panX = clamp(panX, rect.width * (1 - scale), 0);
                panY = clamp(panY, rect.height * (1 - scale), 0);
            }

            elements.mapLayer.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
            updateZoomControls();
        }

        function renderRegions() {
            elements.regionBar.innerHTML = data.regions.map((region) => `
                <button class="region-button ${region.id === state.region ? 'is-active' : ''}" type="button" data-region="${escapeHtml(region.id)}" aria-pressed="${region.id === state.region}">
                    ${icon(region.icon)} ${escapeHtml(region.label)}
                </button>
            `).join('');
        }

        function renderPins() {
            const visible = filteredTargets();
            const visibleIds = new Set(visible.map((target) => target.id));
            elements.pinLayer.innerHTML = data.targets.map((target) => {
                const isVisible = visibleIds.has(target.id);
                const isActive = target.id === state.targetId;
                const displayX = target.displayX ?? target.x;
                const displayY = target.displayY ?? target.y;
                const isShifted = displayX !== target.x || displayY !== target.y;
                const placement = target.labelPlacement || 'right';
                const hiddenAttribute = isVisible ? '' : 'hidden';
                const positionStyle = `--x:${displayX}%; --y:${displayY}%; --anchor-x:${target.x}%; --anchor-y:${target.y}%;`;
                const shiftedMarkup = isShifted ? `
                    <span class="pin-anchor" data-anchor-target="${escapeHtml(target.id)}" style="--anchor-x:${target.x}%; --anchor-y:${target.y}%;" aria-hidden="true" ${hiddenAttribute}></span>
                    <svg class="pin-leader" data-leader-target="${escapeHtml(target.id)}" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false" ${hiddenAttribute}>
                        <line x1="${target.x}" y1="${target.y}" x2="${displayX}" y2="${displayY}" vector-effect="non-scaling-stroke"></line>
                    </svg>
                ` : '';
                return `
                    ${shiftedMarkup}
                    <button class="pin ${isActive ? 'is-active' : ''}" type="button" data-target="${escapeHtml(target.id)}" data-shifted="${isShifted}" style="${positionStyle}" aria-label="${escapeHtml(target.name)}" aria-pressed="${isActive}" ${hiddenAttribute}>
                        ${icon(target.icon)}
                    </button>
                    <span class="pin-label" data-label-placement="${placement}" style="${positionStyle}" aria-hidden="true" ${hiddenAttribute}>${escapeHtml(target.name)}</span>
                `;
            }).join('');
            elements.pinCount.textContent = `${visible.length} / ${data.targets.length}`;
        }

        function renderTags() {
            const target = getTarget();
            elements.tagGrid.innerHTML = target.tagIds.map((tagId) => {
                const tag = getTag(tagId);
                return `
                    <div class="tag-tile">
                        <button class="tag-button ${tagId === state.tagId ? 'is-active' : ''}" type="button" data-tag="${escapeHtml(tagId)}" aria-pressed="${tagId === state.tagId}">
                            <strong>${escapeHtml(tag.label)}</strong>
                            <span>${escapeHtml(copy.grammarLabel)}</span>
                        </button>
                        ${tagActions(target, tagId)}
                    </div>
                `;
            }).join('');
            elements.tagCount.textContent = `${target.tagIds.length}개`;
        }

        function renderNearPlaces() {
            const target = getTarget();
            const near = data.targets
                .filter((item) => item.region === target.region && item.id !== target.id)
                .sort((a, b) => (
                    Math.hypot(a.x - target.x, a.y - target.y)
                    - Math.hypot(b.x - target.x, b.y - target.y)
                ))
                .slice(0, nearLimit);

            elements.nearGrid.innerHTML = near.map((item) => `
                <button class="mini-button" type="button" data-near="${escapeHtml(item.id)}">
                    <strong>${escapeHtml(item.name)}</strong>
                    <span>${escapeHtml(item.hint || '')}</span>
                </button>
            `).join('');
            elements.nearCount.textContent = `${near.length}곳`;
        }

        function setOutputLink(element, href, title, ariaLabel) {
            element.hidden = !href;
            if (!href) {
                element.removeAttribute('href');
                element.removeAttribute('aria-label');
                return;
            }
            element.href = href;
            element.title = title;
            element.setAttribute('aria-label', ariaLabel);
        }

        function renderOutput() {
            const target = getTarget();
            const tag = getTag(state.tagId);
            const replacements = {
                place: target.name,
                tag: tag.label
            };

            elements.sentenceText.textContent = buildSentence(target, state.tagId);
            elements.regionBadge.textContent = regionsById.get(target.region).label;
            elements.placeChip.innerHTML = `${icon(target.icon)} ${escapeHtml(target.name)}`;
            elements.tagChip.textContent = tag.label;
            setOutputLink(
                elements.mapAction,
                mapsUrl(state.tagId),
                copy.mapTitle,
                fillTemplate(copy.mapAria, replacements)
            );
            setOutputLink(
                elements.photoAction,
                photosUrl(state.tagId),
                copy.imageTitle,
                fillTemplate(copy.imageAria, replacements)
            );
            elements.placeIcon.innerHTML = icon(target.icon);
            elements.placeName.textContent = target.name;
            elements.placeMeta.textContent = [target.nativeName, target.hint].filter(Boolean).join(' · ');
            if (target.badge) {
                elements.placeMeta.dataset.badge = target.badge;
                const badge = root.createElement('span');
                badge.className = 'place-badge';
                badge.textContent = target.badge;
                elements.placeMeta.append(' ', badge);
            } else {
                delete elements.placeMeta.dataset.badge;
            }
        }

        function render() {
            renderRegions();
            renderOutput();
            renderPins();
            renderTags();
            renderNearPlaces();
            updateMapTransform();
            restoreFocus();
        }

        function selectRegion(regionId) {
            if (!regionsById.has(regionId)) return;
            state.region = regionId;
            const visible = filteredTargets();
            if (!visible.some((target) => target.id === state.targetId)) {
                state.targetId = visible[0].id;
                state.tagId = visible[0].tagIds[0];
            }
            queueFocus(`[data-region="${CSS.escape(regionId)}"]`);
            saveState();
            render();
        }

        function selectTarget(targetId, focusSelector) {
            const target = targetsById.get(targetId);
            if (!target) return;
            state.targetId = target.id;
            state.region = target.region;
            state.tagId = target.tagIds[0];
            queueFocus(focusSelector || `[data-target="${CSS.escape(target.id)}"]`);
            saveState();
            render();
        }

        function selectTag(tagId) {
            const target = getTarget();
            if (!target.tagIds.includes(tagId)) return;
            state.tagId = tagId;
            queueFocus(`[data-tag="${CSS.escape(tagId)}"]`);
            saveState();
            render();
        }

        function setZoomIndex(index) {
            state.zoomIndex = clamp(index, 0, zoomSteps.length - 1);
            updateMapTransform();
            saveState();
        }

        function onRegionClick(event) {
            const button = event.target.closest('[data-region]');
            if (!button || !elements.regionBar.contains(button)) return;
            selectRegion(button.dataset.region);
        }

        function nearestVisiblePin(clientX, clientY, fallback) {
            let nearest = fallback;
            let nearestDistance = Number.POSITIVE_INFINITY;
            elements.pinLayer.querySelectorAll('.pin:not([hidden])').forEach((pin) => {
                const rect = pin.getBoundingClientRect();
                const distance = Math.hypot(
                    clientX - (rect.left + rect.width / 2),
                    clientY - (rect.top + rect.height / 2)
                );
                if (distance < nearestDistance) {
                    nearest = pin;
                    nearestDistance = distance;
                }
            });
            return nearest;
        }

        function onPinClick(event) {
            const directButton = event.target.closest('.pin[data-target]');
            const button = event.detail > 0
                ? nearestVisiblePin(event.clientX, event.clientY, directButton)
                : directButton;
            if (!button || !elements.pinLayer.contains(button)) return;
            selectTarget(button.dataset.target);
        }

        function onTagClick(event) {
            const button = event.target.closest('[data-tag]');
            if (!button || !elements.tagGrid.contains(button)) return;
            selectTag(button.dataset.tag);
        }

        function onNearClick(event) {
            const button = event.target.closest('[data-near]');
            if (!button || !elements.nearGrid.contains(button)) return;
            selectTarget(button.dataset.near, '#placeName');
        }

        function reset(options = {}) {
            const shouldConfirm = options.confirm !== false;
            if (shouldConfirm && !global.confirm(copy.resetConfirm)) return false;
            const result = stateStore.reset();
            updateSaveStatus(result);
            if (!result.ok) return false;
            Object.assign(state, result.state);
            render();
            elements.resetActivityBtn.focus({ preventScroll: true });
            return true;
        }

        function onResetClick() {
            reset();
        }

        function onZoomOutClick() {
            setZoomIndex(state.zoomIndex - 1);
        }

        function onZoomInClick() {
            setZoomIndex(state.zoomIndex + 1);
        }

        function onZoomResetClick() {
            setZoomIndex(0);
        }

        elements.regionBar.addEventListener('click', onRegionClick);
        elements.pinLayer.addEventListener('click', onPinClick);
        elements.tagGrid.addEventListener('click', onTagClick);
        elements.nearGrid.addEventListener('click', onNearClick);
        elements.zoomOutBtn.addEventListener('click', onZoomOutClick);
        elements.zoomInBtn.addEventListener('click', onZoomInClick);
        elements.zoomResetBtn.addEventListener('click', onZoomResetClick);
        elements.resetActivityBtn.addEventListener('click', onResetClick);
        global.addEventListener('resize', updateMapTransform);

        if ('ResizeObserver' in global) {
            resizeObserver = new ResizeObserver(updateMapTransform);
            resizeObserver.observe(elements.mapCanvas);
        }

        render();
        updateSaveStatus(loadResult);

        return Object.freeze({
            getState() {
                return clone(state);
            },
            reset,
            destroy() {
                if (destroyed) return;
                destroyed = true;
                elements.regionBar.removeEventListener('click', onRegionClick);
                elements.pinLayer.removeEventListener('click', onPinClick);
                elements.tagGrid.removeEventListener('click', onTagClick);
                elements.nearGrid.removeEventListener('click', onNearClick);
                elements.zoomOutBtn.removeEventListener('click', onZoomOutClick);
                elements.zoomInBtn.removeEventListener('click', onZoomInClick);
                elements.zoomResetBtn.removeEventListener('click', onZoomResetClick);
                elements.resetActivityBtn.removeEventListener('click', onResetClick);
                global.removeEventListener('resize', updateMapTransform);
                resizeObserver?.disconnect();
            }
        });
    }

    global.C16CountryMap = Object.freeze({ mount });
})(window);
