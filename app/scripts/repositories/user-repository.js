import BaseGeotabApiRepository from './base-geotab-api-repository';
import { User } from '../models';


export default class UserRepository extends BaseGeotabApiRepository {
    /**
     * 
     * @param {string} userName - Unique user to search for
     * @returns {Promise<User[]>}
     */
    Get(userName) {
        const search = { name: userName };
        return this._executeGetCall('User', search);
    }
}