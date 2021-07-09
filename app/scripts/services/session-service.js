import { SessionData, User, Device, DeviceStatusInfo, PartialSessionData } from '../models';
import { SessionRepository, UserRepository, DeviceRepository } from '../repositories';

/** @class */
class SessionService {
    /** @type {SessionRepository} */  _sessionRepository;
    /** @type {UserRepository} */ _userRepository;
    /** @type {DeviceRepository} */ _deviceRepository;

    /** @type {User} */ _user;
    /** @type {Device} */ _device;
    /** @type {string} */ _deviceId;

    /** @property {string} DeviceId - Currently known device ID */
    get DeviceId() { return this._deviceId; }
    set DeviceId(val) { this._deviceId = val; }
    

    constructor() {
        this._sessionRepository = new SessionRepository();
        this._userRepository = new UserRepository();
        this._deviceRepository = new DeviceRepository();
    }

    /**
     * @returns {Promise<User>} - The currently logged in user
     */
    async GetCurrentUser() {
        const s = await this._sessionRepository.GetPartialSessionData();
        
        if (!this._lastUser || !this._lastUser.name == s.UserName) {
            try {
                const users = await this._userRepository.Get(s.UserName);
                if (users && users[0])
                    this._lastUser = users[0];
                else {
                    this._lastUser = null;
                }
            }
            catch(err) {
                console.log(err);
                this._lastUser = null;
            }
        }

        return this._lastUser;
    }

    /**
     * Fetch the current device in use by this user
     * @returns {Promise<Device>}
     */
    async GetCurrentDevice() {
        if (!this._device || this._device.id != this._deviceId) {
            if (!this._deviceId)
                return null;

            try {
                const devices = await this._deviceRepository.GetDevice(this._deviceId);
                if (devices && devices[0])
                    this._device = devices[0];
                else return null;
            } catch (error) {
                console.log(error);
                return null;
            }
        }

        return this._device;
    }

    /**
     * Fetch the device info for the device currently in use by the user
     * @returns {Promise<DeviceStatusInfo>}
     */
    async GetCurrentDeviceStatusInfo() {
        const u = await this.GetCurrentUser();
        if (u && u.id) {
            try {
                const info = await this._deviceRepository.GetDeviceStatusInfoForUser(u.id);
                if (!info || !info[0])
                    return null;
                
                if (info[0].device && info[0].device.id != this._deviceId)
                    this._deviceId = info[0].device.id;

                return info[0];
            } catch (err) {
                console.log(err);
            }
        }

        return null;
    }

    /**
     * @returns {Promise<SessionData>}
     */
    async GetCurrentSessionData() {
        const session = await this._sessionRepository.GetPartialSessionData();
        const device = await this.GetCurrentDevice();

        if (session && device) {
            const retVal = new SessionData();
            retVal.ApiServer = session.ApiServer;
            retVal.Database = session.Database;
            retVal.DeviceId = device.id;
            retVal.DeviceName = device.name;
            retVal.VehicleIdentificationNumber = device.vehicleIdentificationNumber;
            retVal.SessionId = session.SessionId;
            retVal.UserName = session.UserName;
            return retVal;
        }
        return null;
    }
}

export default new SessionService();