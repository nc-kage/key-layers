"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guid_typescript_1 = require("guid-typescript");
const lodash_1 = require("lodash");
const ID = guid_typescript_1.Guid.create().toString();
const RELEASE_DELAY = 150;
exports.EMITTER_FORCE_LAYER_TYPE = `EMITTER_FORCE_LAYER_TYPE_${ID}`;
exports.EMITTER_TOP_LAYER_TYPE = `EMITTER_TOP_LAYER_TYPE_${ID}`;
let isListenersSet = false;
const layersMap = [];
const listenersLayers = [];
const listenersPredefinedLayers = {};
const forceListeners = [];
const onEvent = (e, type) => {
    forceListeners.forEach((listener) => {
        lodash_1.get(listener, type, lodash_1.noop)(e);
    });
    if (listenersLayers.length) {
        lodash_1.get(lodash_1.last(listenersLayers), type, lodash_1.noop)(e);
    }
    else {
        const layers = Object.keys(listenersPredefinedLayers)
            .filter((key) => listenersPredefinedLayers[Number(key)].length > 0)
            .sort((a, b) => Number(a) - Number(b));
        (listenersPredefinedLayers[Number(lodash_1.last(layers))] || [])
            .forEach((listener) => {
            lodash_1.get(listener, type, lodash_1.noop)(e);
        });
    }
};
const clearTargetDownLists = (target) => {
    target.forEach((item) => {
        item.instance.clearDownList();
    });
};
const onPress = (e) => {
    onEvent(e, 'onPress');
};
const onDown = (e) => {
    onEvent(e, 'onDown');
};
const onUp = (e) => {
    onEvent(e, 'onUp');
};
const onWindowBlur = () => {
    clearTargetDownLists(listenersLayers);
    clearTargetDownLists(forceListeners);
    Object.keys(listenersPredefinedLayers)
        .forEach((key) => clearTargetDownLists(listenersPredefinedLayers[Number(key)]));
};
class Emitter {
    /**
     * Constructor of the class.
     * @param {boolean|number|string} subscribeType - Layer type,
     * EMITTER_TOP_LAYER_TYPE - creates new layer at the top of the layers
     * EMITTER_FORCE_LAYER_TYPE - add to layer witch execute permanently
     * 5 - add to the layer with index 5.
     * @param {number} releaseDelay - Delay between keyDown and keyUp events for
     * fires keyRelease event.
     */
    constructor(subscribeType, releaseDelay = RELEASE_DELAY) {
        this.id = guid_typescript_1.Guid.create().toString();
        this.downList = [];
        this.releaseDictionary = {};
        this.pressReleaseDictionary = {};
        this.keyDownListeners = [];
        this.keyPressListeners = [];
        this.keyUpListeners = [];
        this.keyReleaseListeners = [];
        this.pressReleaseListeners = [];
        this.pressHandler = (e) => {
            const { downList } = this;
            const keyCode = Emitter.getEventKeyCode(e);
            const timeStamp = e.timeStamp;
            const downData = downList.find(item => item.timeStamp === timeStamp);
            if (downData) {
                downData.pressKeyCode = keyCode;
                this.keyPressListeners.forEach(listener => this.executeCallback(e, listener, true));
            }
        };
        this.downHandler = (e) => {
            const { downList } = this;
            const keyCode = Emitter.getEventKeyCode(e);
            if (!downList.find(item => item.keyCode === keyCode)) {
                downList.push({ keyCode, timeStamp: e.timeStamp });
            }
            this.keyDownListeners.forEach(listener => this.executeCallback(e, listener));
        };
        this.upHandler = (e) => {
            const { downList, releaseDictionary, pressReleaseDictionary, releaseDelay } = this;
            const keyCode = Emitter.getEventKeyCode(e);
            let keyDownInfo = null;
            for (let i = 0, ln = downList.length; i < ln; i += 1) {
                if (downList[i].keyCode === keyCode) {
                    keyDownInfo = downList[i];
                    downList.splice(i, 1);
                    break;
                }
            }
            this.keyUpListeners.forEach(listener => this.executeCallback(e, listener));
            if (keyDownInfo && e.timeStamp - keyDownInfo.timeStamp <= releaseDelay) {
                releaseDictionary[keyDownInfo.keyCode] = keyDownInfo.timeStamp;
                this.keyReleaseListeners.forEach(listener => this.executeReleaseCallback(e, listener));
                if (keyDownInfo.pressKeyCode) {
                    pressReleaseDictionary[keyDownInfo.keyCode] = keyDownInfo;
                    this.pressReleaseListeners
                        .forEach(listener => this.executeReleaseCallback(e, listener, true));
                }
            }
        };
        this.subscribeType = subscribeType || exports.EMITTER_TOP_LAYER_TYPE;
        this.releaseDelay = releaseDelay;
        Emitter.setGeneralListeners();
        this.addListeners();
    }
    /**
     * @public
     *
     * Sets names for layers indexes.
     * @param {string|number|array[]|object[]|object} firstParam - Name or id of the layer.
     * For array or object it's a
     * layers config.
     *
     * @param {string} firstParam.name - Name of the layer.
     * @param {number} firstParam.id - Id of the layer.
     * @example
     * Emitter.setLayersMap({ name: 'fileBrowsing', id: 1 })
     *
     * @param {string} firstParam[0] - Name of the layer.
     * @param {number} firstParam[1] - Id of the layer.
     * @example
     * Emitter.setLayersMap(['fileBrowsing', 1])
     *
     * @param {number} firstParam[0] - Id of the layer.
     * @param {string} firstParam[1] - Name of the layer.
     * @example
     * Emitter.setLayersMap([1, 'fileBrowsing'])
     *
     * @param {string} firstParam[].name - Name of the layer.
     * @param {number} firstParam[].id - Id of the layer.
     * @example
     * Emitter.setLayersMap([
     *    { name: 'fileBrowsing', id: 1 },
     *    { name: 'preview', id: 5},
     * ])
     *
     * @param {string} firstParam[][0] - Name of the layer.
     * @param {number} firstParam[][1] - Id of the layer.
     * @example
     * Emitter.setLayersMap([
     *    ['fileBrowsing', 1],
     *    ['preview', 5],
     * ])
     *
     * @param {number} firstParam[][0] - Id of the layer.
     * @param {string} firstParam[][1] - Name of the layer.
     * @example
     * Emitter.setLayersMap([
     *    [1, 'fileBrowsing'],
     *    [5, 'preview'],
     * ])
     *
     * @param {Object.<string, number>} firstParam - Map of the Layers with name/id pairs.
     * @example
     * Emitter.setLayersMap({
     *    fileBrowsing: 1,
     *    preview: 5
     * })
     *
     * @param {string|number} secondParam - Name or id of the Layer.
     * @example
     * Emitter.setLayersMap('fileBrowsing', 1);
     * @example
     * Emitter.setLayersMap(1, 'fileBrowsing');
     *
     * @returns {number} Count of the set names;
     */
    static setLayersMap(firstParam, secondParam) {
        if (typeof firstParam === 'string' && typeof secondParam === 'number') {
            return Number(Emitter.setLayerMap({ name: firstParam, id: secondParam }));
        }
        if (typeof firstParam === 'number' && typeof secondParam === 'string') {
            return Number(Emitter.setLayerMap({ name: secondParam, id: firstParam }));
        }
        if (lodash_1.isArray(firstParam) && firstParam.length === 2
            && typeof firstParam[0] === 'string' && typeof firstParam[1] === 'number') {
            return Emitter.setLayersMap(firstParam[0], firstParam[1]);
        }
        if (lodash_1.isArray(firstParam) && firstParam.length === 2
            && typeof firstParam[0] === 'number' && typeof firstParam[1] === 'string') {
            return Emitter.setLayersMap(firstParam[0], firstParam[1]);
        }
        if (lodash_1.isArray(firstParam) && lodash_1.isUndefined(secondParam)) {
            let setCount = 0;
            firstParam.forEach((layerMap) => {
                setCount += Number(Emitter.setLayerMap(layerMap));
            });
            return setCount;
        }
        if (!lodash_1.isArray(firstParam) && typeof firstParam === 'object'
            && !lodash_1.isUndefined(firstParam.name) && !lodash_1.isUndefined(firstParam.id)) {
            return Number(Emitter.setLayerMap(firstParam));
        }
        if (!lodash_1.isArray(firstParam) && typeof firstParam === 'object') {
            let setCount = 0;
            Object.keys(firstParam).forEach((key) => {
                const id = firstParam[key];
                setCount += Number(Emitter.setLayerMap({ id, name: key }));
            });
            return setCount;
        }
        return 0;
    }
    static setLayerMap(data) {
        if (typeof data === 'object' && !lodash_1.isArray(data)) {
            return Emitter.setLayerMapFromObject(data);
        }
        if (lodash_1.isArray(data)) {
            return Emitter.setLayerMapFromArray(data);
        }
        return false;
    }
    static setLayerMapFromObject(data) {
        const { name, id } = data || { name: '', id: 0 };
        if (name) {
            layersMap.push({ name, id });
            return true;
        }
        return false;
    }
    static setLayerMapFromArray(data) {
        let name = data[0];
        let id = data[1];
        if (typeof name === 'number' && typeof id === 'string') {
            name = data[1];
            id = data[0];
        }
        return Emitter.setLayerMapFromObject({ name: name, id: id });
    }
    static setGeneralListeners() {
        if (!isListenersSet) {
            window.addEventListener('keypress', onPress, true);
            window.addEventListener('keyup', onUp, true);
            window.addEventListener('keydown', onDown, true);
            window.addEventListener('blur', onWindowBlur, true);
            isListenersSet = true;
        }
    }
    static getEventKeyCode(e) {
        return e.which || e.keyCode;
    }
    static checkInputTarget(e) {
        return ['INPUT', 'TEXTAREA'].includes(lodash_1.get(e, 'target.tagName'));
    }
    static checkMainOptions(e, options) {
        const { altKey, ctrlKey, shiftKey, metaKey, skipInput } = options;
        const isInputTarget = Emitter.checkInputTarget(e);
        return (altKey ? e.altKey : true)
            && (ctrlKey ? e.ctrlKey : true)
            && (shiftKey ? e.shiftKey : true)
            && (metaKey ? e.metaKey : true)
            && !(isInputTarget && skipInput);
    }
    static getListenersTarget(subscribeType) {
        if (typeof subscribeType === 'number') {
            if (!listenersPredefinedLayers[subscribeType]) {
                listenersPredefinedLayers[subscribeType] = [];
            }
            return listenersPredefinedLayers[subscribeType];
        }
        if (subscribeType === exports.EMITTER_FORCE_LAYER_TYPE) {
            return forceListeners;
        }
        if (subscribeType === exports.EMITTER_TOP_LAYER_TYPE) {
            return listenersLayers;
        }
        if (typeof subscribeType === 'string') {
            const layerId = lodash_1.get(layersMap.find(item => item.name === subscribeType), 'id');
            if (typeof layerId === 'number' && layerId >= 0) {
                return Emitter.getListenersTarget(layerId);
            }
        }
        return null;
    }
    static clearDownLists(subscribeType) {
        if (subscribeType === exports.EMITTER_TOP_LAYER_TYPE) {
            Emitter.clearLayerDownLists();
            Emitter.clearPredefinedLayersDownLists();
        }
        else if ((subscribeType === 'string' && subscribeType !== exports.EMITTER_FORCE_LAYER_TYPE)
            || typeof subscribeType === 'number') {
            const layerId = typeof subscribeType === 'string'
                ? lodash_1.get(layersMap.find(item => item.name === subscribeType), 'id')
                : subscribeType;
            const biggestLayerId = Math.max.apply(null, Object.keys(listenersPredefinedLayers)
                .map((key) => Number(key)));
            if (layerId && layerId >= biggestLayerId) {
                Emitter.clearPredefinedLayersDownLists([layerId]);
            }
        }
    }
    static clearLayerDownLists() {
        clearTargetDownLists(listenersLayers);
    }
    static clearPredefinedLayersDownLists(skip = []) {
        Object.keys(listenersPredefinedLayers).forEach((key) => {
            const normalizedKey = Number(key);
            if (!skip.includes(normalizedKey)) {
                clearTargetDownLists(listenersPredefinedLayers[normalizedKey]);
            }
        });
    }
    clearDownList() {
        this.downList = [];
        this.releaseDictionary = {};
        this.pressReleaseDictionary = {};
    }
    addListener(type, callback, options = {}) {
        switch (type) {
            case 'keyDown':
                this.keyDownListeners.push({ callback, options });
                break;
            case 'keyPress':
                this.keyPressListeners.push({ callback, options });
                break;
            case 'keyUp':
                this.keyUpListeners.push({ callback, options });
                break;
            case 'keyRelease':
                this.keyReleaseListeners.push({ callback, options });
                break;
            case 'pressRelease':
                this.pressReleaseListeners.push({ callback, options });
                break;
        }
        return () => this.removeListener(type, callback);
    }
    removeListener(type, callback) {
        let collection = [];
        switch (type) {
            case 'keyDown':
                collection = this.keyDownListeners;
                break;
            case 'keyPress':
                collection = this.keyPressListeners;
                break;
            case 'keyUp':
                collection = this.keyUpListeners;
                break;
            case 'keyRelease':
                collection = this.keyReleaseListeners;
                break;
            case 'pressRelease':
                collection = this.pressReleaseListeners;
                break;
        }
        for (let i = 0, ln = collection.length; i < ln; i += 1) {
            if (collection[i].callback === callback) {
                collection.splice(i, 1);
                break;
            }
        }
    }
    destroy() {
        this.removeListeners();
    }
    addListeners() {
        const { subscribeType } = this;
        const listenersTarget = Emitter.getListenersTarget(subscribeType);
        Emitter.clearDownLists(subscribeType);
        if (listenersTarget) {
            listenersTarget.push({
                id: this.id,
                instance: this,
                onPress: this.pressHandler,
                onDown: this.downHandler,
                onUp: this.upHandler,
            });
        }
        else {
            console.warn('KeyLayersJS', 'Unknown subscribe type!');
        }
    }
    removeListeners() {
        const listenersTarget = Emitter.getListenersTarget(this.subscribeType);
        if (listenersTarget) {
            for (let i = 0, ln = listenersTarget.length; i < ln; i += 1) {
                if (listenersTarget[i].id === this.id) {
                    listenersTarget.splice(i, 1);
                    break;
                }
            }
        }
    }
    executeCallback(e, listener, isPressCheck = false) {
        const { callback, options } = listener;
        if (Emitter.checkMainOptions(e, options) && this.checkCodeOptions(e, options, isPressCheck)) {
            callback(e);
        }
    }
    executeReleaseCallback(e, listener, isPressCheck = false) {
        const { callback, options } = listener;
        if (Emitter.checkMainOptions(e, options)
            && this.checkReleaseCodeOptions(e, options, isPressCheck)) {
            callback(e);
        }
    }
    checkCodeOptions(e, options, isPressCheck = false) {
        const { code } = options;
        let { codes = [] } = options;
        const { downList } = this;
        const keyCode = Emitter.getEventKeyCode(e);
        codes = code && !codes.length ? [code] : codes;
        if (codes.length) {
            if (!codes.includes(keyCode)) {
                return false;
            }
            for (let i = 0, ln = codes.length; i < ln; i += 1) {
                const checkCode = codes[i];
                if (checkCode !== keyCode && !downList.find(item => isPressCheck
                    ? item.pressKeyCode === checkCode : item.keyCode === checkCode)) {
                    return false;
                }
            }
        }
        return true;
    }
    checkReleaseCodeOptions(e, options, isPressCheck = false) {
        const { code } = options;
        let { codes = [] } = options;
        const { releaseDictionary, pressReleaseDictionary, releaseDelay } = this;
        let keyCode = Emitter.getEventKeyCode(e);
        if (isPressCheck) {
            const keyPressInfo = pressReleaseDictionary[keyCode];
            if (e.timeStamp - keyPressInfo.timeStamp <= releaseDelay) {
                keyCode = keyPressInfo.pressKeyCode || 0;
            }
        }
        const timeStamp = e.timeStamp;
        codes = code && !codes.length ? [code] : codes;
        if (codes.length) {
            if (!codes.includes(keyCode)) {
                return false;
            }
            for (let i = 0, ln = codes.length; i < ln; i += 1) {
                const checkCode = codes[i];
                let releaseCheckTimestamp = 0;
                if (isPressCheck) {
                    const pressKey = Object.keys(pressReleaseDictionary).find((key) => {
                        return pressReleaseDictionary[Number(key)].pressKeyCode === checkCode;
                    });
                    releaseCheckTimestamp = pressKey ? pressReleaseDictionary[Number(pressKey)].timeStamp : 0;
                }
                else {
                    releaseCheckTimestamp = releaseDictionary[checkCode];
                }
                if (checkCode !== keyCode && !(releaseCheckTimestamp
                    && timeStamp - releaseCheckTimestamp <= releaseDelay)) {
                    return false;
                }
            }
        }
        return true;
    }
}
exports.Emitter = Emitter;
