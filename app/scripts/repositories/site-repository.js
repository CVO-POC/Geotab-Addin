
import { AppConstants } from '../shared';
import { BaseHttpApiRepository } from '.';

export default class SiteRepository extends BaseHttpApiRepository {

    constructor(){
        super();
    }

    /**
     * Gets sites from API
     * @param {Date} lastFetchTimestamp 
     * @returns {Promise<Object[]>}
     */
    GetAllSites() {
        const url = AppConstants.Endpoints.SiteApi;
        const path = AppConstants.Paths.Site;

        // Make API call
        return this.GetWithHeaders(url, path);
    }

    /**
     * 
     * @param {Date} lastFetchTimestamp 
     * @returns {Promise<Object>}
     */
    GetUpdatedSites(lastFetchTimestamp){
        const url = AppConstants.Endpoints.ProdSiteEndpoint;
        const path = AppConstants.Paths.UpdatedSites;

        // Make API call
        return this.GetWithHeaders(url, `${path}'${lastFetchTimestamp}'`);
    }

    GetWithHeaders(url, path) {
        let headers = {
            'ZUMO-API-VERSION': '2.0.0'
        };
        return super.Get(url, path, headers);
    }
}
