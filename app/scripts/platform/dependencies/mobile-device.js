import { SessionData } from '../../models';

export default class MobileDevice {
    static IOS = 0;
    static ANDROID = 1;
    static WINDOWS = 2;
    static UNSUPPORTED = -98;
    static UNKNOWN = -99;

    /**
     * Returns the appropriate device type based upon the device
     * @returns {number}
     */
    static GetPlatform() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return this.GetPlatformByUserAgent(userAgent);
    }

    /**
     * Returns the appropriate device type based upon the device
     * @param {string} userAgent - User agent string
     * @returns {number}
     */
    static GetPlatformByUserAgent(userAgent) {
        if (/windows phone/i.test(userAgent)) {
            return MobileDevice.UNSUPPORTED;
          } else if (/android/i.test(userAgent)) {
              return MobileDevice.ANDROID;
          } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {            
              return MobileDevice.IOS;
          } else{
            return MobileDevice.UNKNOWN;
          }  
    }

    /**
     * Go to the appropriate app store
     * @returns {Promise<boolean>}
     */
    static GoToAppStore() {
        return new Promise((resolve, reject) => {
            let deviceType= this.GetPlatform();
            switch (deviceType) {
                case MobileDevice.IOS:
                    window.open('https://apps.apple.com/us/app/prepass-motion/id1382441651', '_system');
                    resolve(true);
                    break;
                case MobileDevice.ANDROID:
                    window.open('https://play.google.com/store/apps/details?id=com.prepass.motion&hl=en_US', '_system');
                    resolve(true);
                    break;
                default:
                    alert('Could not determine your platform');
                    resolve(false);
                    break;
            }
        })
    }

    /**
     * Launc the MOTION app
     * @param {SessionData} sessionData 
     * @returns {Promise<boolean>}
     */
    LaunchMotion(sessionData) {
        return new Promise(resolve => {
            const url = `prepassmotion://main/geotab?vin=${sessionData.VehicleIdentificationNumber}&sessionId=${sessionData.SessionId}&userName=${sessionData.UserName}&deviceName=${sessionData.DeviceName}&&database=${sessionData.Database}&server=${sessionData.ApiServer}`;
            window.open(url, '_system');
            resolve(true);
        });        
    }
/**
     * Launc the MOTION app when in a Geofence  
     *    * @param {SessionData} sessionData 
     * @returns {Promise<boolean>}
     */
    LaunchMotionOnGeofenceTrigger(sessionData) {     
        return new Promise(resolve => {
            const url = `prepassmotion://main/geotab/station?vin=${sessionData.VehicleIdentificationNumber}&sessionId=${sessionData.SessionId}&userName=${sessionData.UserName}&deviceName=${sessionData.DeviceName}&&database=${sessionData.Database}&server=${sessionData.ApiServer}`;
            window.open(url, '_system');
            resolve(true);
        });    
    }

}