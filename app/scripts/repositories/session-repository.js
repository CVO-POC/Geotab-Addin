import { BaseGeotabApiRepository } from '.';
import { PartialSessionData } from '../models';

/** @class */
export default class SessionRepository extends BaseGeotabApiRepository {
    /**
     * @returns {Promise<PartialSessionData>}
     */
    GetSessionPartial() {
        return this.GetPartialSessionData();
    }
}