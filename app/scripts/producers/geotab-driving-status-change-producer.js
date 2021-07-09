import { TimerArgs, Timer, MessageBus, AppConstants } from '../shared';
import { SessionServiceSingleton } from '../services';


export const DrivingStatus = {
    Unknown: 0,
    Driving: 1,
    NotDriving: 2
};

export class GeotabDrivingStatusChangeProducer {
    /** @type {Timer} */ _vehicleDrivingTimer;
    /** @type {DeviceRepository} */ _deviceRepository;
    /** @type {number} */ _drivingStatus;
    /** @type {date} */ _startTime;
    /** @type {boolean} */ _started;
    /** @type {boolean} */ _running;
    

    constructor() {
        this._drivingStatus = DrivingStatus.Unknown;
        this._started = false;
    }

    /**
     * Start the producer
     * @param {object} args - (Optional) name for the producer
     * @returns {Promise<void>}
     */
    async Start(args) {
        if (this._vehicleDrivingTimer != null) {
            await this.Stop();
        }

        if (!this._started) {
            this._startTime = Date.now();
            this._started = true;
        }
        
        const timerArgs = args ? args : this._generateDefaultTimerArgs();
        this._vehicleDrivingTimer = new Timer(timerArgs);
        this._vehicleDrivingTimer.Start();
    }

    /**
     * Stop the producer
     * @returns {Promise<void>}
     */
    Stop() {
        if (this._vehicleDrivingTimer) {    
            this._vehicleDrivingTimer.Stop();
            delete this._vehicleDrivingTimer;
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async _onVehicleDrivingTimerTick() {
        let result = null;

        if (!this._running) {
            this._running = true;
            try {
                result = await SessionServiceSingleton.GetCurrentDeviceStatusInfo();
            } catch (error) {
                console.log(error);
                this._running = false;
                return;
            }
    
            if (result) {
                const newStatus = result.isDriving ? DrivingStatus.Driving : DrivingStatus.NotDriving;
                if (this._drivingStatus != newStatus) {
                    this._drivingStatus = newStatus;
                    MessageBus.publish(AppConstants.Messages.Vehicle.StartedDriving, this._drivingStatus);
                }
            }
    
            if ((Date.now() - this._startTime) > 4 * 60 * 1000) { // 4 minutes
                await this.Stop();
                await this.Start(this._generateSlowTimerArgs());
            }
            this._running = false;
        }
    }

    /**
     * @returns {TimerArgs}
     */
    _generateSlowTimerArgs() {
        const retVal = this._generateDefaultTimerArgs();
        retVal.IntervalMs = 25 * 1000; // 25 seconds
    }

    /**
     * @returns {TimerArgs}
     */
    _generateDefaultTimerArgs() {
        const func = this._onVehicleDrivingTimerTick.bind(this);

        /**@type {TimerArgs} */
        const retVal = {
            IntervalMs: 4 * 1000, // 4 seconds
            RunImmediately: false,
            Callback: func
        };
        return retVal;
    }
}

export const GeotabDrivingStatusChangeProducerSingleton = new GeotabDrivingStatusChangeProducer();