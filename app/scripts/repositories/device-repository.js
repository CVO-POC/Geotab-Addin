import { BaseGeotabApiRepository } from '.';
import { DeviceStatusInfo, Device } from '../models';

export default class DeviceRepository extends BaseGeotabApiRepository {
    /** @type {} */
    IsDriving() {
        this.State.driving;
    }


    /**
     * Fetch the device information
     * @param {string} deviceId - ID for the device you want to fetch
     * @returns {Promise<Device>}
     */
    GetDevice(deviceId) {
        const search = { id: deviceId };
        return this._executeGetCall('Device', search);
    }

    /**
     * 
     * @param {string} userId - Currently logged in user
     * @returns {Promise<DeviceStatusInfo[]>}
     */
    GetDeviceStatusInfoForUser(userId) {
        const search = { userSearch: { id: userId }};
        return this._executeGetCall('DeviceStatusInfo', search);
    }
}