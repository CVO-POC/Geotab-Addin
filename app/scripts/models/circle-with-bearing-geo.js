import GeofenceCalculationService  from '../services/geofence-calculation-service';

export default class CircleWithBearingGeofence{

    /**@type {number} */ Latitude; // Site.rampEnteranceLat
    /**@type {number} */ Longitude; // Site.rampEnteranceLon
    /**@type {number} */ Bearing;   
    /**@type {number} */ Radius;
    /**@type {number} */ MaxBearing;
    /**@type {number} */ Id

    constructor(lat, lon, bearing, radius, id, maxBearing=45){
        this.Id = id;
        this.Latitude = lat;
        this.Longitude = lon;
        this.Bearing = bearing;
        this.Radius = radius;
        this.MaxBearing = maxBearing;
    }

    /**
     * Checks to see if user has entered the geofence
     * @param {number} currentUserLat 
     * @param {number} currentUserLon
     * @param {number} currentUserBearing 
     * @returns {boolean}
     */
    CheckGeofenceEnter(currentUserLat, currentUserLon, currentUserBearing){
        let distance = GeofenceCalculationService.CalculateDistance(currentUserLat, currentUserLon, this.Latitude, this.Longitude);
        let dist = distance <= this.Radius;
        
        if(currentUserBearing === null || currentUserBearing === 0){
            let userBer = GeofenceCalculationService.CalculateBearing(currentUserLat, currentUserLon, this.Latitude, this.Longitude);
            let ber = GeofenceCalculationService.IsBearingInRange(userBer, this.Bearing, this.MaxBearing);
            return dist && ber;
        }else{
            let ber = GeofenceCalculationService.IsBearingInRange(currentUserBearing, this.Bearing, this.MaxBearing);
            return dist && ber;
        }
    }
    
    /**
     * Checks to see if user is still in geofence 
     * @param {number} currentUserLat 
     * @param {number} currentUserLon 
     * @param {number} currentUserBearing
     * @returns {boolean} 
     */
    CheckStillInGeofence(currentUserLat, currentUserLon){
        let distance = GeofenceCalculationService.CalculateDistance(currentUserLat, currentUserLon, this.Latitude, this.Longitude);
        let dist = distance <= this.Radius;
        return dist;
    }

}