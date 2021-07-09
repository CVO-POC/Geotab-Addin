import { BaseProducer } from '.';
import { MessageBus, AppConstants } from '../shared';
import { DeviceRepository } from '../repositories';
import { SiteListenerService } from '../services';

class GeotabGeolocationProducer
{
    // vars
    /** @type {boolean} */_isCancelled;
    /** @type {number} */_geolocatorId;
    /** @type {DeviceRepository} */ _deviceRepository;
    /**@type {boolean}*/ _isRunning;

    constructor(){
        this._deviceRepository = new DeviceRepository();
        this._isRunning = false;
    }
    /**
     * Start the producer
     * @returns {Promise<void>}
     */
    Start() {
        console.log('Started GPS producer...');
        SiteListenerService.GetAllSites().catch(err => { console.log(err)});
        return new Promise(resolve => {
            this._isCancelled = false;
            this._startGeolocationTracking();
            resolve();
        });
    }

    /**
     * Stop the producer
     * @returns {Promise<void>}
     */
    Stop() {
        // Stop polling gps data from geotab
        // should stop when geotab app goes to the background
        console.log('Ending location tracking...');
        return new Promise(resolve => {
            this._isCancelled = true;
            this._endGeolocationTracking();
            resolve();
        });
    }

    /**
     * Start the geolocation updates
     * @returns {Promise<void>}
     */
    _startGeolocationTracking(){
        // get geolocation object
        if(!this._isRunning)
        {
            this._isRunning = true;
            let geoloc = this._deviceRepository.Api.mobile.geolocation;
            if(geoloc){
                this._geolocatorId = geoloc.watchPosition(this._getPosition, this._catchError); // begin location stream
            }
        }      
    }

    /**
     * Stop geolocation tracking
     * @returns {Promise<void>}
     */
    _endGeolocationTracking(){
        if(this._isRunning)
        {
            navigator.geolocation.clearWatch(this._geolocatorId);
            this._isRunning = false;
        }   
    }

    /**
     * Publish message with position update
     * @param {object}
     * @return {Promise<void>}
     */
    _getPosition(position){
        if(position != null){
            MessageBus.publish(AppConstants.Messages.Gps.StartedTracking, position);
        }
    }

    /**
     * Catch error if location is unavailable
     * @return {Promise<void>}
     */
    _catchError(positionError){
        if(positionError.code == positionError.TIMEOUT){
            console.log('Location updates have been aborted...');
        }
        else if(positionError.code == positionError.POSITION_UNAVAILABLE){
            console.log('Location information is unavailable...');
        }
        else if(positionError.code == positionError.PERMISSION_DENIED){
            console.log('Permission to share location information denied...');
        }
    }
}

export default new GeotabGeolocationProducer();