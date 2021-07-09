import { BaseProducer } from '.';
import { GeotabStateRepositorySingleton } from '../repositories';
import { MessageBus, AppConstants } from '../shared';
import { SessionServiceSingleton } from '../services';

class AppLifecycleProducerImpl extends BaseProducer {
    OnAppLaunch(api, state) {
        GeotabStateRepositorySingleton.Update(api, state);
        if (state && state.device && state.device.id)
            SessionServiceSingleton.DeviceId = state.device.id;

        MessageBus.publish(AppConstants.Messages.Start, {api, state});
    }

    OnAddinFocus(api, state) {
        GeotabStateRepositorySingleton.Update(api, state);
        if (state && state.device && state.device.id)
            SessionServiceSingleton.DeviceId = state.device.id;
        MessageBus.publish(AppConstants.Messages.PageLoad, {api, state});
    }
}

export default new AppLifecycleProducerImpl();