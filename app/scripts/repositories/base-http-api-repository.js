export default class BaseHttpApiRepository {
    /**
     * 
     * @param {string} url 
     * @param {string} path 
     * @returns {Promise<any>} 
     */
    async Get(url, path, headers) {
        // Not using because I ran into inheritance issues.  So currently in site repository
        // // Build URI
        const uri = `${url}${path}`;

        // // Make API call
        const response = await fetch(uri, { headers: headers });
        return response.json();
    }
}