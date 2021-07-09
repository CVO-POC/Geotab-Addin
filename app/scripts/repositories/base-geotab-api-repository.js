import { GeotabStateRepositorySingleton } from '.';
import { PartialSessionData } from '../models';

export default class BaseGeotabApiRepository {
    /**
     * Geotab API reference
     * @returns {object}
     */
    get Api() {
        return GeotabStateRepositorySingleton._geotabApi;
    }

    /**
     * Geotab state reference
     * @returns {object}
     */
    get State() {
        return GeotabStateRepositorySingleton._geotabState;
    }

    get Device() {
        return GeotabStateRepositorySingleton._geotabDevice;
    }

    set Device(val) {
        GeotabStateRepositorySingleton._geotabDevice = val;
    }

    /**
     * Fetch the full session details for the current device
     * @returns {Promise<PartialSessionData>}
     */
    GetPartialSessionData() {
        return new Promise(resolve => {
            const retVal = new PartialSessionData();
            this.Api.getSession((credentials, server) => {
                retVal.SessionId = credentials.sessionId;
                retVal.UserName = credentials.userName;
                retVal.Database = credentials.database;
                retVal.ApiServer = server;

                resolve(retVal);
            });
        });
    }

    /**
     * Executes a Geotab get call to fetch information
     * @param {string} typeName - Target search object
     * @param {object} search - Search parameters
     * @returns {Promise<object>} - Returns a promise containing the result of the query
     */
    _executeGetCall(typeName, search) {
        const getArgs = {
            typeName: typeName
        };

        if (search) {
            getArgs.search = search;
        }

        return new Promise((resolve, reject) => {
            this.Api.call('Get', getArgs,
            result => {
                resolve(result);
            },
            err => {
                reject(err);
            })
        });
    }
}