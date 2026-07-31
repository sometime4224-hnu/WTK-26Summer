(function attachCountryMapState(global) {
    'use strict';

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function isRecord(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    function create(options) {
        if (!isRecord(options)) {
            throw new TypeError('Country map state options are required.');
        }

        const {
            key,
            schemaVersion,
            defaults,
            validate
        } = options;

        if (typeof key !== 'string' || key.length === 0) {
            throw new TypeError('A stable storage key is required.');
        }

        if (!Number.isInteger(schemaVersion) || schemaVersion < 1) {
            throw new TypeError('A positive schema version is required.');
        }

        if (!isRecord(defaults) || typeof validate !== 'function') {
            throw new TypeError('Defaults and a validator are required.');
        }

        let protectedRecord = false;

        function fallback(code) {
            return {
                ok: false,
                code,
                state: clone(defaults)
            };
        }

        function load() {
            let raw;

            try {
                raw = global.localStorage.getItem(key);
            } catch (error) {
                return fallback('storage-unavailable');
            }

            if (raw === null) {
                return {
                    ok: true,
                    code: 'empty',
                    state: clone(defaults)
                };
            }

            let record;

            try {
                record = JSON.parse(raw);
            } catch (error) {
                protectedRecord = true;
                return fallback('corrupt-record');
            }

            if (!isRecord(record) || record.schemaVersion !== schemaVersion) {
                protectedRecord = true;
                return fallback('unknown-schema');
            }

            if (!isRecord(record.state) || !validate(record.state)) {
                protectedRecord = true;
                return fallback('invalid-record');
            }

            return {
                ok: true,
                code: 'restored',
                state: clone(record.state)
            };
        }

        function save(state) {
            if (protectedRecord) {
                return {
                    ok: false,
                    code: 'record-protected'
                };
            }

            if (!isRecord(state) || !validate(state)) {
                return {
                    ok: false,
                    code: 'invalid-state'
                };
            }

            const record = {
                schemaVersion,
                savedAt: new Date().toISOString(),
                state: clone(state)
            };

            try {
                global.localStorage.setItem(key, JSON.stringify(record));
                return {
                    ok: true,
                    code: 'saved'
                };
            } catch (error) {
                return {
                    ok: false,
                    code: 'write-failed'
                };
            }
        }

        function reset() {
            try {
                global.localStorage.removeItem(key);
                protectedRecord = false;
                return {
                    ok: true,
                    code: 'reset',
                    state: clone(defaults)
                };
            } catch (error) {
                return {
                    ok: false,
                    code: 'reset-failed',
                    state: clone(defaults)
                };
            }
        }

        return Object.freeze({
            key,
            load,
            save,
            reset,
            isRecordProtected() {
                return protectedRecord;
            }
        });
    }

    global.C16CountryMapState = Object.freeze({ create });
})(window);
