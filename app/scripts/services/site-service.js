import SiteRepository from '../repositories/site-repository';
import { GeofenceCalculationService } from '../services';
import { CircleWithBearingGeo } from '../models';

class SiteService{

    /**@type {SiteRepository} */ _siteRepository;

    constructor(){
        this._siteRepository = new SiteRepository();
    }

    /**
     * Get all sites from API
     * @return {Promise<CircleWithBearingGeo[]>}
     */
    async GetAllSites(){
        let sites = await this._siteRepository.GetAllSites();
        let mappedSites = this._mapToCircleWithBearing(sites);
        return mappedSites;
    }

    /**
     * Get all sites that have been updated within the last hour
     * @return {Promise<CircleWithBearingGeo[]>}
     */
    async GetUpdatedSites(){
        let updateTs = new Date(Date.now() - 1).toISOString();
        let sites = await this._siteRepository.GetUpdatedSites(updateTs);
        let mappedSites = this._mapToCircleWithBearing(sites);
        return mappedSites;
    }

    /**
     * Map datea from API array of CircleWithBearing Geofences
     * @param {Object[]} data 
     */
    _mapToCircleWithBearing(data){
        let geofences = [];
        for(let i = 0; i < data.length; i++){
            let site = data[i];
            let bearing = GeofenceCalculationService.ConvertDirectionOfTravelToBearing(site.directionOfTravel);
            let id = `${site.siteName}_${site.siteId}`;
            geofences.push(new CircleWithBearingGeo(site.rampEntranceLatitude, site.rampEntranceLongitude, bearing, site.siteDistance, id));
        }

        return geofences;
    }
}

export default new SiteService();