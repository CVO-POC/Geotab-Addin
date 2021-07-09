import MotionAddinPage from './page';
import { AppLifecycleProducer } from './producers';
import { MotionAppServiceSingleton } from './services';
import { MobileDevice } from './platform/dependencies';


export default class PrePassMotionAddin {
    _page = new MotionAddinPage();

    constructor() {

    }

    /**
     * Startup addins are executed upon entering the dashboard page on the Drive App for the first time.  Once this page 
     * is loaded, the startup() method is called only once. If the user navigates away from the page and then back to 
     * it later, the method will not be called again. If the addin needs to be re-initialized, the user must either 
     * logout and log back in or refresh the application. 
     * @param {object} freshApi - The GeotabApi object for making calls to MyGeotab.
     * @param {object} freshState - The page state object allows access to URL, page navigation and global group filter.
     * @param {function} initializeCallback - Call this when your startup route is complete
     */
    startup(freshApi, freshState, initializeCallback) {
        AppLifecycleProducer.OnAppLaunch(freshApi, freshState);
    
        // MUST call initializeCallback when done any setup
        initializeCallback();      
    }

    /**
     * initialize() is called only once when the Add-In is first loaded. Use this function to initialize the
     * Add-In's state such as default values or make API requests (MyGeotab or external) to ensure interface
     * is ready for the user.
     * @param {object} freshApi - The GeotabApi object for making calls to MyGeotab.
     * @param {object} freshState - The page state object allows access to URL, page navigation and global group filter.
     * @param {function} initializeCallback - Call this when your initialize route is complete. Since your initialize routine
     *        might be doing asynchronous operations, you must call this method when the Add-In is ready
     *        for display to the user.
     */
    initialize(freshApi, freshState, initializeCallback) {
        // MUST call initializeCallback when done any setup
        initializeCallback();      
    }

    /**
     * focus() is called whenever the Add-In receives focus.
     *
     * The first time the user clicks on the Add-In menu, initialize() will be called and when completed, focus().
     * focus() will be called again when the Add-In is revisited. Note that focus() will also be called whenever
     * the global state of the MyGeotab application changes, for example, if the user changes the global group
     * filter in the UI.
     *
     * @param {object} freshApi - The GeotabApi object for making calls to MyGeotab.
     * @param {object} freshState - The page state object allows access to URL, page navigation and global group filter.
     */
    focus(freshApi, freshState) {
        AppLifecycleProducer.OnAddinFocus(freshApi, freshState);
        
        // show main content
        this._page.Root.removeClass('hidden');
        this._page.$('#launchButton').click(this._launchMotion.bind(this));
        this._page.$('#appStoreLink').click(this._goToAppStore.bind(this));
    }

    /**
     * blur() is called whenever the user navigates away from the Add-In.
     *
     * Use this function to save the page state or commit changes to a data store or release memory.
     *
     * @param {object} freshApi - The GeotabApi object for making calls to MyGeotab.
     * @param {object} freshState - The page state object allows access to URL, page navigation and global group filter.
     */
    blur() {
        // hide main content
        this._page.Root.addClass('hidden');
    }

    _launchMotion() {
        MotionAppServiceSingleton.LaunchMotion();
    }

    _goToAppStore() {
        MobileDevice.GoToAppStore();
    }
}