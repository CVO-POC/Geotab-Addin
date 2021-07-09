import { AppConstants } from '../shared';


export default class GeofenceCalculationService{

    /**
     * Calculates the geographic distance between two latitude, longitude coordinates
     * @param {number} userLat 
     * @param {number} userLon 
     * @param {number} geofenceLat 
     * @param {number} geofenceLon 
     * @returns {number}
     */
    static CalculateDistance(userLat, userLon, geofenceLat, geofenceLon){
        const deltaLat = this.ConvertDegreesToRadians(userLat - geofenceLat);
        const deltaLon = this.ConvertDegreesToRadians(userLon - geofenceLon);

        const geoRadiansLat = this.ConvertDegreesToRadians(geofenceLat);
        const userRadiansLat = this.ConvertDegreesToRadians(userLat);

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                  Math.cos(userRadiansLat) * Math.cos(geoRadiansLat) *
                  Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        let distance = this.ConvertRadiansToMeters(c);

        return distance;
    }

    /**
     * 
     * @param {number} userLat 
     * @param {number} userLon 
     * @param {number} geoLat 
     * @param {number} geoLon 
     */
    static CalculateBearing(userLat, userLon, geoLat, geoLon){
        let userLatRad = this.ConvertDegreesToRadians(userLat);
        let userLonRad = this.ConvertDegreesToRadians(userLon);
        let geoLatRad = this.ConvertDegreesToRadians(geoLat);
        let geoLonRad = this.ConvertDegreesToRadians(geoLon);
        let y = Math.sin(geoLonRad - userLonRad) * Math.cos(geoLatRad);
        let x = Math.cos(userLatRad) * Math.sin(geoLatRad) -
                Math.sin(userLatRad) * Math.cos(geoLatRad) * Math.cos(geoLonRad - userLonRad);
        let radBearing = Math.atan2(y, x);
        let degBearing = this.ConvertRadiansToDegrees(radBearing);
        return this.ToCompassBearing(degBearing);
    }


    /**
     * Converts degrees to radians
     * @param {number} degree 
     * @returns {number}
     */
    static ConvertDegreesToRadians(degree){
        return degree * Math.PI / 180;
    }

    /**
     * 
     * @param {number} radians 
     * @return {number}
     */
    static ConvertRadiansToDegrees(radians){
        return radians * 180 / Math.PI;
    }

    /**
     * Converts radian measurement to meters
     * @param {number} radians 
     * @returns {number}
     */
    static ConvertRadiansToMeters(radians){
        return radians * AppConstants.MathVaues.EarthRadius;
    }

    /**
     * Converts to latitude to geocentric latitude in radians
     * @param {number} latitude 
     * @returns {number}
     */
    static ToGeographicLatitude(latitude){
        let val = Math.asin(latitude)
        return val;
    }

    /**
     * @param {number} userBearing
     * @param {number} geoBearing
     * @param {number} maxDifferenceInDegrees
     * @return {boolean}
     */
    static IsBearingInRange(userBearing, geoBearing, maxDifferenceInDegrees){

        // Calculate difference
        const phi = Math.abs(geoBearing - userBearing) % 360;
        const distance = phi > 180 ? 360 - phi : phi;

        return distance <= maxDifferenceInDegrees;
    }

    /**
     * 
     * @param {number} bearing 
     * @return {number}
     */
    static ToCompassBearing(bearing){
        return (bearing + 360) % 360;
    }

    /**
     * 
     * @param {string} direction 
     * @returns {number}
     */
    static ConvertDirectionOfTravelToBearing(direction){
        return this.GetIntRepresentationOfCardinalDirection(direction) * 22.5;
    }

    /**
     * 
     * @param {string} direction 
     * @returns {number}
     */
    static GetIntRepresentationOfCardinalDirection(direction){
        switch(direction){
            case 'N':
                return 0;
            case 'NNE':
                return 1;
            case 'NE':
                return 2;
            case 'ENE':
                return 3;
            case 'E':
                return 4;
            case 'ESE': 
                return 5;
            case 'SE':
                return 6;
            case 'SSE':
                return 7;
            case 'S':
                return 8;
            case 'SSW':
                return 9;
            case 'SW':
                return 10;
            case 'WSW':
                return 11;
            case 'W':
                return 12;
            case 'WNW':
                return 13;
            case 'NW':
                return 14;
            case 'NNW':
                return 15;
            default:
                return 0;
        }
    }

}