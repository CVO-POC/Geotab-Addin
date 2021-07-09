import { MessageBus, AppConstants, TimerArgs, Timer } from '../shared';
import { SiteService, MotionAppServiceSingleton } from '../services';
import { CircleWithBearingGeo, TripPoint } from '../models';
import GeofenceCalculationService  from '../services/geofence-calculation-service';

class SiteListenerService {

    // Variables
    /**@type {CircleWithBearingGeo[]} */ _registeredGeofences;
    /**@type {CircleWithBearingGeo[]} */ _activeGeofences = [];
    /**@type {CircleWithBearingGeo[]} */ _closeGeofences = [];
    /**@type {TripPoint} */ _sigPoint;
    /**@type {boolean} */ _initalSiteFetchCompleted = false;
    /**@type {boolean} */ _initialSiteRegistrationCompleted = false;
    /**@type {Timer}*/ _siteFetchTimer;
    /**@type {Date} */ _lastProximityCheckTime;

    constructor(){
        const func = this.GetAllSites.bind(this);
        this._lastProximityCheckTime = 0;

        /**@type {TimerArgs}*/ 
        const timeArgs = {
            IntervalMs: 3600 * 1000, // 1 hour
            RunImmediately: false,
            Callback: func
        }
        
        this._siteFetchTimer = new Timer(timeArgs); // Check for new sites to fetch every hour

        MessageBus.subscribe(AppConstants.Messages.Gps.StartedTracking, this, this.onPositionChange);
    }

    /**
     * Called when there is significant gps movement. (greater than 5 feet)
     * @param {object} data
     * @returns {Promise<void>}
     */
    async onPositionChange(data){
        this._sigPoint = new TripPoint(data.coords.latitude, data.coords.longitude, data.coords.heading, data.coords.speed);
        console.log(`${data.coords.latitude}, ${data.coords.longitude} Bearing: ${data.coords.heading}, Speed: ${data.coords.speed}`);
        if(this._initialSiteRegistrationCompleted === true)
        {
            this.CheckForCloseGeofences();
            await this.CheckSiteEnter();

            // Only check exit if there are active geofences
            if(this._activeGeofences.length !== 0)
                await this.CheckSiteExit();
        }    

    }
    
    /**
     * Check for geofences less than 10 km away, add close geofences to _closeGeofences[]
     */
    CheckForCloseGeofences(){
        let currentTime = Date.now();
        let elapsedTime = (currentTime - this._lastProximityCheckTime) / 1000;
        elapsedTime /= 60; // in minutes
        if(elapsedTime > 10 && this._initialSiteRegistrationCompleted){
            this._lastProximityCheckTime = Date.now();
            for(let i = 0; i < this._registeredGeofences.length; i++){
                let site = this._registeredGeofences[i];
                let dist = GeofenceCalculationService.CalculateDistance(this._sigPoint.Latitude, this._sigPoint.Longitude, site.Latitude, site.Longitude);
                if(dist < 25000 && this._isClose(site) === -1){
                    this._closeGeofences.push(site);
                }else if(this._isClose(site) != -1 && dist > 25000){
                    this._closeGeofences.splice(i, 1);
                }
            }
        }
    }

    /**
     * Pulls site data from API
     */
    async GetAllSites(){

        this._siteFetchTimer.Start();

        if(!this._initalSiteFetchCompleted){
            let result = await SiteService.GetAllSites();
            this.RegisterGeofences(result);
            this._initalSiteFetchCompleted = true;
        }
        else{
            await this.CheckForUpdatedSites();
        }
    }

    async CheckForUpdatedSites(){
        let result = await SiteService.GetUpdatedSites();
        let remainingSites = this.UpdateRegistrations(result);
        this.RegisterGeofences(remainingSites);
    }

    /**
     * Register geofences for detection
     * @param {CircleWithBearingGeo[]} sites 
     */
    RegisterGeofences(sites){
        console.log(sites);
        if(!this._initialSiteRegistrationCompleted)
        {
            this._registeredGeofences = sites;
            this._initialSiteRegistrationCompleted = true; 
        }
        else{
            for(let i = 0; i < sites.length; i++){
                this._registeredGeofences.push(sites[i]);
            }
        }
    }

    /**
     * Update and current registered geofences 
     * @param {CircleWithBearingGeo} sites 
     * @return {CircleWithBearingGeo[]}
     */
    UpdateRegistrations(sites){
        let unregisteredSites = [];
        for(let i = 0; i < sites.length; i++){
            // Check if geo is registered, get index of matching geo if already registered
            let geoIndex = this._isRegistered(sites[i]); 

            if(this._isRegistered(sites[i]) != -1){
                // if found match check if they are same
                if(this._equal(sites[i], geo) === false) 
                    this._registeredGeofences[geoIndex] = sites[i]; // update registration
                continue;
            } 
            // Keep track of any additional unregistered geofences
            this.unregisteredSites.push(sites[i]);
        }
        return unregisteredSites;
    }

    /**
     * Check for any entered sites
     */
    async CheckSiteEnter()
    {
        //this._sigPoint.Speed = 30; // DEBUG
        // if(this._sigPoint.Speed >= 5)
        // { 
            for(let i = 0; i < this._closeGeofences.length; i++){
                
                let val = this._closeGeofences[i].CheckGeofenceEnter(this._sigPoint.Latitude, this._sigPoint.Longitude, this._sigPoint.Bearing);
                if(this._closeGeofences[i].CheckGeofenceEnter(this._sigPoint.Latitude, this._sigPoint.Longitude, this._sigPoint.Bearing)) 
                {
                    let site = this._closeGeofences[i];
                    if(this._isActive(site) === -1)
                    {    
                        this._activeGeofences.push(site);
                        MotionAppServiceSingleton.LaunchMotionOnGeofenceTrigger();
                    }
                    break; // in a site, no need to keep looping
                }    

            }
        //}
    }

    /**
     * Check if active geofence has been exited
     */
    async CheckSiteExit(){
        for(let i = 0; i < this._activeGeofences.length; i++){
            let val = this._activeGeofences[i].CheckStillInGeofence(this._sigPoint.Latitude, this._sigPoint.Longitude);
            if(this._activeGeofences[i].CheckStillInGeofence(this._sigPoint.Latitude, this._sigPoint.Longitude, this._sigPoint.Bearing) === false)
            {
                this._activeGeofences.splice(i, 1);
            }    
        }
    }


    /**
     * Check if geofence is already registered
     * @param {CircularWithBearingGeo} geo 
     * @return {number} index of same geo
     */
    _isRegistered(geo){
        for(let i = 0; i < this._registeredGeofences.length; i++){
            if(this._registeredGeofences[i].Id === geo.Id)
                return i;
        }
        return -1;
    }

    /**
     * Check if geofence is already active
     * @param {CircularWithBearingGeo} geo 
     * @return {number} index of same geo
     */
    _isActive(geo){
        for(let i = 0; i < this._activeGeofences.length; i++){
            if(this._activeGeofences[i].Id === geo.Id)
                return i;
        }
        return -1;
    }

    /**
     * Check if geofence is in _closeGeofences[]
     * @param {CircularWithBearingGeo} geo 
     * @return {number} index of same geo
     */
    _isClose(geo){
        for(let i = 0; i < this._closeGeofences.length; i++){
            if(this._closeGeofences[i].Id === geo.Id)
                return i;
        }
        return -1;
    }

    
    /**
     * check if two geofences have equal properties
     * @param {CircleWithBearingGeo} newGeo 
     * @param {CircleWithBearingGeo} originalGeo 
     * @return {boolean} 
     */
    _equal(newGeo, originalGeo){
        return newGeo.Latitude === originalGeo.Latitude 
        && newGeo.Longitude === originalGeo.Longitude 
        && newGeo.Bearing === originalGeo.Bearing 
        && newGeo.Radius === originalGeo.Radius 
        && newGeo.Id === originalGeo.Id;
    }
}


export default new SiteListenerService();