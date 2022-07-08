'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var guidTypescript = require('guid-typescript');
var lodashEs = require('lodash-es');

var ID = guidTypescript.Guid.create().toString();
var RELEASE_DELAY = 150;
var EMITTER_FORCE_LAYER_TYPE = "EMITTER_FORCE_LAYER_TYPE_".concat(ID);
var EMITTER_TOP_LAYER_TYPE = "EMITTER_TOP_LAYER_TYPE_".concat(ID);
var isListenersSet = false;
var layersMap = [];
var listenersLayers = [];
var listenersPredefinedLayers = {};
var forceListeners = [];
var onEvent = function (e, type) {
    forceListeners.forEach(function (listener) {
        lodashEs.get(listener, type, lodashEs.noop)(e);
    });
    if (listenersLayers.length) {
        lodashEs.get(lodashEs.last(listenersLayers), type, lodashEs.noop)(e);
    }
    else {
        var layers = Object.keys(listenersPredefinedLayers)
            .filter(function (key) { return listenersPredefinedLayers[Number(key)].length > 0; })
            .sort(function (a, b) { return Number(a) - Number(b); });
        (listenersPredefinedLayers[Number(lodashEs.last(layers))] || [])
            .forEach(function (listener) {
            lodashEs.get(listener, type, lodashEs.noop)(e);
        });
    }
};
var clearTargetDownLists = function (target) {
    target.forEach(function (item) {
        item.instance.clearDownList();
    });
};
var onPress = function (e) {
    onEvent(e, 'onPress');
};
var onDown = function (e) {
    onEvent(e, 'onDown');
};
var onUp = function (e) {
    onEvent(e, 'onUp');
};
var onWindowBlur = function () {
    clearTargetDownLists(listenersLayers);
    clearTargetDownLists(forceListeners);
    Object.keys(listenersPredefinedLayers)
        .forEach(function (key) { return clearTargetDownLists(listenersPredefinedLayers[Number(key)]); });
};
var Emitter = /** @class */ (function () {
    /**
     * Constructor of the class.
     * @param {boolean|number|string} subscribeType - Layer type,
     * EMITTER_TOP_LAYER_TYPE - creates new layer at the top of the layers
     * EMITTER_FORCE_LAYER_TYPE - add to layer witch execute permanently
     * 5 - add to the layer with index 5.
     * @param {number} releaseDelay - Delay between keyDown and keyUp events for
     * fires keyRelease event.
     */
    function Emitter(subscribeType, releaseDelay) {
        if (releaseDelay === void 0) { releaseDelay = RELEASE_DELAY; }
        var _this = this;
        this.id = guidTypescript.Guid.create().toString();
        this.downList = [];
        this.releaseDictionary = {};
        this.pressReleaseDictionary = {};
        this.keyDownListeners = [];
        this.keyPressListeners = [];
        this.keyUpListeners = [];
        this.keyReleaseListeners = [];
        this.pressReleaseListeners = [];
        this.pressHandler = function (e) {
            var downList = _this.downList;
            var keyCode = Emitter.getEventKeyCode(e);
            var timeStamp = e.timeStamp;
            var downData = downList.find(function (item) { return item.timeStamp === timeStamp; });
            if (downData) {
                downData.pressKeyCode = keyCode;
                _this.keyPressListeners.forEach(function (listener) { return _this.executeCallback(e, listener, true); });
            }
        };
        this.downHandler = function (e) {
            var downList = _this.downList;
            var keyCode = Emitter.getEventKeyCode(e);
            if (!downList.find(function (item) { return item.keyCode === keyCode; })) {
                downList.push({ keyCode: keyCode, timeStamp: e.timeStamp });
            }
            _this.keyDownListeners.forEach(function (listener) { return _this.executeCallback(e, listener); });
        };
        this.upHandler = function (e) {
            var _a = _this, downList = _a.downList, releaseDictionary = _a.releaseDictionary, pressReleaseDictionary = _a.pressReleaseDictionary, releaseDelay = _a.releaseDelay;
            var keyCode = Emitter.getEventKeyCode(e);
            var keyDownInfo = null;
            for (var i = 0, ln = downList.length; i < ln; i += 1) {
                if (downList[i].keyCode === keyCode) {
                    keyDownInfo = downList[i];
                    downList.splice(i, 1);
                    break;
                }
            }
            _this.keyUpListeners.forEach(function (listener) { return _this.executeCallback(e, listener); });
            if (keyDownInfo && e.timeStamp - keyDownInfo.timeStamp <= releaseDelay) {
                releaseDictionary[keyDownInfo.keyCode] = keyDownInfo.timeStamp;
                _this.keyReleaseListeners.forEach(function (listener) { return _this.executeReleaseCallback(e, listener); });
                if (keyDownInfo.pressKeyCode) {
                    pressReleaseDictionary[keyDownInfo.keyCode] = keyDownInfo;
                    _this.pressReleaseListeners
                        .forEach(function (listener) { return _this.executeReleaseCallback(e, listener, true); });
                }
            }
        };
        this.subscribeType = subscribeType || EMITTER_TOP_LAYER_TYPE;
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
    Emitter.setLayersMap = function (firstParam, secondParam) {
        if (typeof firstParam === 'string' && typeof secondParam === 'number') {
            return Number(Emitter.setLayerMap({ name: firstParam, id: secondParam }));
        }
        if (typeof firstParam === 'number' && typeof secondParam === 'string') {
            return Number(Emitter.setLayerMap({ name: secondParam, id: firstParam }));
        }
        if (lodashEs.isArray(firstParam) && firstParam.length === 2
            && typeof firstParam[0] === 'string' && typeof firstParam[1] === 'number') {
            return Emitter.setLayersMap(firstParam[0], firstParam[1]);
        }
        if (lodashEs.isArray(firstParam) && firstParam.length === 2
            && typeof firstParam[0] === 'number' && typeof firstParam[1] === 'string') {
            return Emitter.setLayersMap(firstParam[0], firstParam[1]);
        }
        if (lodashEs.isArray(firstParam) && lodashEs.isUndefined(secondParam)) {
            var setCount_1 = 0;
            firstParam.forEach(function (layerMap) {
                setCount_1 += Number(Emitter.setLayerMap(layerMap));
            });
            return setCount_1;
        }
        if (!lodashEs.isArray(firstParam) && typeof firstParam === 'object'
            && !lodashEs.isUndefined(firstParam.name) && !lodashEs.isUndefined(firstParam.id)) {
            return Number(Emitter.setLayerMap(firstParam));
        }
        if (!lodashEs.isArray(firstParam) && typeof firstParam === 'object') {
            var setCount_2 = 0;
            Object.keys(firstParam).forEach(function (key) {
                var id = firstParam[key];
                setCount_2 += Number(Emitter.setLayerMap({ id: id, name: key }));
            });
            return setCount_2;
        }
        return 0;
    };
    Emitter.setLayerMap = function (data) {
        if (typeof data === 'object' && !lodashEs.isArray(data)) {
            return Emitter.setLayerMapFromObject(data);
        }
        if (lodashEs.isArray(data)) {
            return Emitter.setLayerMapFromArray(data);
        }
        return false;
    };
    Emitter.setLayerMapFromObject = function (data) {
        var _a = data || { name: '', id: 0 }, name = _a.name, id = _a.id;
        if (name) {
            layersMap.push({ name: name, id: id });
            return true;
        }
        return false;
    };
    Emitter.setLayerMapFromArray = function (data) {
        var name = data[0];
        var id = data[1];
        if (typeof name === 'number' && typeof id === 'string') {
            name = data[1];
            id = data[0];
        }
        return Emitter.setLayerMapFromObject({ name: name, id: id });
    };
    Emitter.setGeneralListeners = function () {
        if (!isListenersSet) {
            window.addEventListener('keypress', onPress, true);
            window.addEventListener('keyup', onUp, true);
            window.addEventListener('keydown', onDown, true);
            window.addEventListener('blur', onWindowBlur, true);
            isListenersSet = true;
        }
    };
    Emitter.getEventKeyCode = function (e) {
        return e.which || e.keyCode;
    };
    Emitter.checkInputTarget = function (e) {
        return ['INPUT', 'TEXTAREA'].includes(lodashEs.get(e, 'target.tagName'));
    };
    Emitter.checkMainOptions = function (e, options) {
        var altKey = options.altKey, ctrlKey = options.ctrlKey, shiftKey = options.shiftKey, metaKey = options.metaKey, skipInput = options.skipInput;
        var isInputTarget = Emitter.checkInputTarget(e);
        return (altKey ? e.altKey : true)
            && (ctrlKey ? e.ctrlKey : true)
            && (shiftKey ? e.shiftKey : true)
            && (metaKey ? e.metaKey : true)
            && !(isInputTarget && skipInput);
    };
    Emitter.getListenersTarget = function (subscribeType) {
        if (typeof subscribeType === 'number') {
            if (!listenersPredefinedLayers[subscribeType]) {
                listenersPredefinedLayers[subscribeType] = [];
            }
            return listenersPredefinedLayers[subscribeType];
        }
        if (subscribeType === EMITTER_FORCE_LAYER_TYPE) {
            return forceListeners;
        }
        if (subscribeType === EMITTER_TOP_LAYER_TYPE) {
            return listenersLayers;
        }
        if (typeof subscribeType === 'string') {
            var layerId = lodashEs.get(layersMap.find(function (item) { return item.name === subscribeType; }), 'id');
            if (typeof layerId === 'number' && layerId >= 0) {
                return Emitter.getListenersTarget(layerId);
            }
        }
        return null;
    };
    Emitter.clearDownLists = function (subscribeType) {
        if (subscribeType === EMITTER_TOP_LAYER_TYPE) {
            Emitter.clearLayerDownLists();
            Emitter.clearPredefinedLayersDownLists();
        }
        else if ((subscribeType === 'string' && subscribeType !== EMITTER_FORCE_LAYER_TYPE)
            || typeof subscribeType === 'number') {
            var layerId = typeof subscribeType === 'string'
                ? lodashEs.get(layersMap.find(function (item) { return item.name === subscribeType; }), 'id')
                : subscribeType;
            var biggestLayerId = Math.max.apply(null, Object.keys(listenersPredefinedLayers)
                .map(function (key) { return Number(key); }));
            if (layerId && layerId >= biggestLayerId) {
                Emitter.clearPredefinedLayersDownLists([layerId]);
            }
        }
    };
    Emitter.clearLayerDownLists = function () {
        clearTargetDownLists(listenersLayers);
    };
    Emitter.clearPredefinedLayersDownLists = function (skip) {
        if (skip === void 0) { skip = []; }
        Object.keys(listenersPredefinedLayers).forEach(function (key) {
            var normalizedKey = Number(key);
            if (!skip.includes(normalizedKey)) {
                clearTargetDownLists(listenersPredefinedLayers[normalizedKey]);
            }
        });
    };
    Emitter.prototype.clearDownList = function () {
        this.downList = [];
        this.releaseDictionary = {};
        this.pressReleaseDictionary = {};
    };
    Emitter.prototype.addListener = function (type, callback, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        switch (type) {
            case 'keyDown':
                this.keyDownListeners.push({ callback: callback, options: options });
                break;
            case 'keyPress':
                this.keyPressListeners.push({ callback: callback, options: options });
                break;
            case 'keyUp':
                this.keyUpListeners.push({ callback: callback, options: options });
                break;
            case 'keyRelease':
                this.keyReleaseListeners.push({ callback: callback, options: options });
                break;
            case 'pressRelease':
                this.pressReleaseListeners.push({ callback: callback, options: options });
                break;
        }
        return function () { return _this.removeListener(type, callback); };
    };
    Emitter.prototype.removeListener = function (type, callback) {
        var collection = [];
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
        for (var i = 0, ln = collection.length; i < ln; i += 1) {
            if (collection[i].callback === callback) {
                collection.splice(i, 1);
                break;
            }
        }
    };
    Emitter.prototype.destroy = function () {
        this.removeListeners();
    };
    Emitter.prototype.updateLayerType = function (subscribeType) {
        this.removeListeners();
        this.subscribeType = subscribeType;
        this.addListeners();
    };
    Emitter.prototype.addListeners = function () {
        var subscribeType = this.subscribeType;
        var listenersTarget = Emitter.getListenersTarget(subscribeType);
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
    };
    Emitter.prototype.removeListeners = function () {
        var listenersTarget = Emitter.getListenersTarget(this.subscribeType);
        if (listenersTarget) {
            for (var i = 0, ln = listenersTarget.length; i < ln; i += 1) {
                if (listenersTarget[i].id === this.id) {
                    listenersTarget.splice(i, 1);
                    break;
                }
            }
        }
    };
    Emitter.prototype.executeCallback = function (e, listener, isPressCheck) {
        if (isPressCheck === void 0) { isPressCheck = false; }
        var callback = listener.callback, options = listener.options;
        if (Emitter.checkMainOptions(e, options) && this.checkCodeOptions(e, options, isPressCheck)) {
            callback(e);
        }
    };
    Emitter.prototype.executeReleaseCallback = function (e, listener, isPressCheck) {
        if (isPressCheck === void 0) { isPressCheck = false; }
        var callback = listener.callback, options = listener.options;
        if (Emitter.checkMainOptions(e, options)
            && this.checkReleaseCodeOptions(e, options, isPressCheck)) {
            callback(e);
        }
    };
    Emitter.prototype.checkCodeOptions = function (e, options, isPressCheck) {
        if (isPressCheck === void 0) { isPressCheck = false; }
        var code = options.code;
        var _a = options.codes, codes = _a === void 0 ? [] : _a;
        var downList = this.downList;
        var keyCode = Emitter.getEventKeyCode(e);
        codes = code && !codes.length ? [code] : codes;
        if (codes.length) {
            if (!codes.includes(keyCode)) {
                return false;
            }
            var _loop_1 = function (i, ln) {
                var checkCode = codes[i];
                if (checkCode !== keyCode && !downList.find(function (item) { return isPressCheck
                    ? item.pressKeyCode === checkCode : item.keyCode === checkCode; })) {
                    return { value: false };
                }
            };
            for (var i = 0, ln = codes.length; i < ln; i += 1) {
                var state_1 = _loop_1(i, ln);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
        return true;
    };
    Emitter.prototype.checkReleaseCodeOptions = function (e, options, isPressCheck) {
        if (isPressCheck === void 0) { isPressCheck = false; }
        var code = options.code;
        var _a = options.codes, codes = _a === void 0 ? [] : _a;
        var _b = this, releaseDictionary = _b.releaseDictionary, pressReleaseDictionary = _b.pressReleaseDictionary, releaseDelay = _b.releaseDelay;
        var keyCode = Emitter.getEventKeyCode(e);
        if (isPressCheck) {
            var keyPressInfo = pressReleaseDictionary[keyCode];
            if (e.timeStamp - keyPressInfo.timeStamp <= releaseDelay) {
                keyCode = keyPressInfo.pressKeyCode || 0;
            }
        }
        var timeStamp = e.timeStamp;
        codes = code && !codes.length ? [code] : codes;
        if (codes.length) {
            if (!codes.includes(keyCode)) {
                return false;
            }
            var _loop_2 = function (i, ln) {
                var checkCode = codes[i];
                var releaseCheckTimestamp = 0;
                if (isPressCheck) {
                    var pressKey = Object.keys(pressReleaseDictionary).find(function (key) {
                        return pressReleaseDictionary[Number(key)].pressKeyCode === checkCode;
                    });
                    releaseCheckTimestamp = pressKey ? pressReleaseDictionary[Number(pressKey)].timeStamp : 0;
                }
                else {
                    releaseCheckTimestamp = releaseDictionary[checkCode];
                }
                if (checkCode !== keyCode && !(releaseCheckTimestamp
                    && timeStamp - releaseCheckTimestamp <= releaseDelay)) {
                    return { value: false };
                }
            };
            for (var i = 0, ln = codes.length; i < ln; i += 1) {
                var state_2 = _loop_2(i, ln);
                if (typeof state_2 === "object")
                    return state_2.value;
            }
        }
        return true;
    };
    return Emitter;
}());

exports.EMITTER_FORCE_LAYER_TYPE = EMITTER_FORCE_LAYER_TYPE;
exports.EMITTER_TOP_LAYER_TYPE = EMITTER_TOP_LAYER_TYPE;
exports.Emitter = Emitter;
//# sourceMappingURL=index.js.map
