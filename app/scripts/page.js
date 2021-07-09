
export default class MotionAddinPage {
    rootElemantLookup = '#prePassMotion';

    /**
     * Returns the root jQuery element
     * @returns {JQuery}
     */
    get Root() {
        return $('#prePassMotion');
    }

    /**
     * Get an element from our page
     * @param {string} query - the jquery expression to run
     * @returns {JQuery}
     */
    $(query) {
        return this.Root.find(query);
    }
}