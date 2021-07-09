

/**
 * @class
 */
class PubSub {

    /** @type {Object.<string, Array<SubscribeCallback>>} */
    _dic = {};

    constructor() {
        
    }

    /**
     * Subscribe to an event stream
     * @param {string} eventName 
     * @param {SubscribeCallback} callback
     */
    subscribe(eventName, objectRef, callback) {
        this._initDic(eventName);
        const newCallback = objectRef ? callback.bind(objectRef) : callback;
        this._dic[eventName].push(newCallback);
    }

    /**
     * 
     * @param {string} eventName 
     * @param {SubscribeCallback} callback 
     */
    unsubscribe(eventName, objectRef, callback) {
        this._initDic(eventName);
        const newCallback = objectRef ? callback.bind(objectRef) : callback;
        this.dic[eventName] = this.dic[eventName].filter(x => x != newCallback);
        if (!this.dic[eventName].length) {
            delete this.dic[eventName];
        }
    }

    /**
     * Publish a message to the stream
     * @param {string} eventName 
     * @param {object} data 
     */
    publish(eventName, data) {
        this._initDic(eventName);
        if (this._dic[eventName]) {
            for (let i = 0; i < this._dic[eventName].length; i++) {
                const func = this._dic[eventName][i];
                func(data).catch(reason => this._onPublishError(eventName, reason));
            }
        }
    }

    /**
     * 
     * @param {object} reason 
     * @returns {void}
     */
    _onPublishError(eventName, reason) {
        console.log(`Failed to publish an event for ${eventName}: ${reason}`);
    }

    _initDic(eventName) {
        if (!this._dic) {
            this._dic = {};
        }
        if (eventName && !this._dic[eventName]) {
            this._dic[eventName] = [];
        }
    };
}

export default new PubSub();

/**
 * This callback is displayed as part of the Requester class.
 * @callback SubscribeCallback
 * @param {object} data
 * @returns {Promise<void>}
 */