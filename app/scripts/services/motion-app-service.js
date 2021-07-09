import { SessionServiceSingleton } from '../services';
import { SessionData } from '../models';
import { MessageBus, AppConstants } from '../shared';
import { MobileDevice } from '../platform/dependencies';
import { DrivingStatusChangeProducer, DrivingStatus, GeotabGeolocationProducer } from '../producers';

class MotionAppService {
    /** @type {MobileDevice} */ _mobileDevice;
    /** @type {boolean} */ _autoLaunched;

    constructor() {
        this._autoLaunched = false;
        this._mobileDevice = new MobileDevice();
        
        MessageBus.subscribe(AppConstants.Messages.Start, this, this.OnStartup);     
        MessageBus.subscribe(AppConstants.Messages.PageLoad, this, this.OnPageLoad);
    }

    /**
     * Handles the Start message
     * @param {object} data
     * @returns {Promise<void>}
     */
    async OnStartup(data) {
        MessageBus.subscribe(AppConstants.Messages.Vehicle.StartedDriving, this, this._onDrivingStatusChanged);
        DrivingStatusChangeProducer.Start();
    }

    async _onDrivingStatusChanged(newDrivingStatus) {
        if (newDrivingStatus == DrivingStatus.Driving) {
            DrivingStatusChangeProducer.Stop();
            await this.AutoLaunchMotion();
        }
    }

    /**
     * Handles the Focus (PageLoad event)
     * @param {object} sessionData 
     * @returns {Promise<void>}
     */
    async OnPageLoad(data) {
        await this.AutoLaunchMotion();
    }

    /**
     * Auto launches the motion app if it hasn't been launched already
     * @param {SessionData} sessionData 
     * @returns {Promise<boolean>}
     */
    async AutoLaunchMotion() {
        if (!this._autoLaunched) {
            return await this.LaunchMotion();
        }
       
    }
    /**
     * Launches the MOTION app
     * @param {SessionData} sessionData 
     * @returns {Promise<boolean>} - True if operation successful
     */
    async LaunchMotion() {
        GeotabGeolocationProducer.Start();
        let sessionData = await SessionServiceSingleton.GetCurrentSessionData();

        if (sessionData != null) {
            let autoLaunched = await this._mobileDevice.LaunchMotion(sessionData);
            if (autoLaunched) 
                this._autoLaunched = true; 

            return autoLaunched;
        }
        
        return false;
    }

     /**
     * Launches the MOTION app on Geofence Trigger
     * @param {SessionData} sessionData 
     * @returns {Promise<boolean>} - True if operation successful
     */
    async LaunchMotionOnGeofenceTrigger() {
        let sessionData = await SessionServiceSingleton.GetCurrentSessionData();

        if (sessionData != null) {
            let isSuccessful = await this._mobileDevice.LaunchMotionOnGeofenceTrigger(sessionData);
            return isSuccessful;
        }        
        return false;
    }


}

export default new MotionAppService();