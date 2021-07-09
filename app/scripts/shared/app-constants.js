import environment from '../environments/environments';

export default {
    Messages: {
        Start: 'Messages.Launch',
        PageLoad: 'Messages.PageLoad',

        Vehicle: {
            StartedDriving: 'Messages.Vehicle.StartedDriving'
        },
        // GPS messages for pub sub
        Gps: {
            StartedTracking: 'Messages.Gps.StartedTracking'
        }
    },

    Endpoints: {
        SiteApi: environment.endpoints.SiteApi
    },

    Paths: {
        Site: 'tables/sitesync',
        UpdatedSites: 'tables/sitesync?$filter=updatedAt gt DateTimeOffset'
    },

    MathVaues: {
        EarthRadius: 6378137.0
    }
}