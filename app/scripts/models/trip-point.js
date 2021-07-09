
export default class TripPoint{

    /**@type {number} */ Latitude;
    /**@type {number} */ Longitude;
    /**@type {number} */ Bearing;
    /**@type {number} */ Speed;

    constructor(lat, lon, bearing, speed){
        this.Latitude = lat;
        this.Longitude = lon;
        this.Bearing = bearing;
        this.Speed = speed;
    }
}