/**
 * Callback when the time specified has elapsed
 * @callback TickCallback
 * @returns {Promise<void>}
 */


/** @class */
export class TimerArgs {
    /** @type {number} */       IntervalMs;
    /** @type {boolean} */      RunImmediately;
    /** @type {TickCallback} */ Callback;
}

/** @class */
export class Timer {
    _interval;
    _isCancelled;
    _tickDueTime;
    _callback;
    _runImmediately;

    MaxInterval = 60000;

    /**
     * 
     * @param {TimerArgs} args 
     */
    constructor(args) {
        this._callback = args.Callback;
        this._runImmediately = args.RunImmediately;
        this._interval = args.IntervalMs;
    }

    /**
     * Start the timer
     * @returns {Promise<void>}
     */
    Start() {
        return new Promise(resolve => {
            this._isCancelled = false;
            if (this._runImmediately) {
                this._executeTick();
            }

            this._calculateTickDueTime();
            this._runLoop();
            resolve();
        })
    }

    /**
     * Stop the current timer
     * @returns {Promise<void>}
     */
    Stop() {
        return new Promise(resolve => {
            this._isCancelled = true;
            resolve();
        });
    }

    /** @returns {Promise<void>} */
    async _runLoop() {
        if (!this._isCancelled) {
            let intervalRemaining = this._tickDueTime - Date.now();

            if (intervalRemaining < 0) {
                this._calculateTickDueTime();
                this._executeTick();
            }
            else {
                let interval = intervalRemaining < this.MaxInterval ? intervalRemaining : this.MaxInterval;
                await this._delay(interval);
            }

            this._runLoop();            
        }
    }

    /** @returns {void} */
    _calculateTickDueTime() {
        this._tickDueTime = Date.now() + this._interval;
    }

    /** @returns {void} */
    _executeTick() {
        if (this._callback) {
            this._callback();
        }
    }

    /** @returns {Promise<void>} */
    _delay(interval) {
        return new Promise(resolve => {
            setTimeout(() => resolve(), interval);
        });
    }
}