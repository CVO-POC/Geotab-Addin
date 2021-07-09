class GeotabStateRepository {
    _geotabApi; 
    _geotabState;
    _geotabDevice;

    /**
     * Set the most recent API and state references
     * @param {object} api 
     * @param {object} state 
     */
    Update(geotabApi, geotabState) {
        this._geotabApi = geotabApi;
        this._geotabState = geotabState;
        if (geotabState) {
            this._geotabDevice = geotabState.device;
        }
    }
}

export default new GeotabStateRepository();