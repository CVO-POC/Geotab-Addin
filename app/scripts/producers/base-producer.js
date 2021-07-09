export default class BaseProducer {
    /**
     * Start the producer
     * @param {object} args - (Optional) name for the producer
     * @returns {Promise<void>}
     */
    Start(args) {
        throw 'Not implemented';
    }

    /**
     * Stop the producer
     * @returns {Promise<void>}
     */
    Stop() {
        throw 'Not implemented';
    }
}