module.exports = {
    /**
     * Converts seconds to string representation
     * @param {number} seconds - time in seconds 
     * @returns {string}
     */
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    },

    /**
     * Runs the async function and on error returns null
     * @param {function(T): O} f - Function to run
     * @param {T} i - Input it recieves
     * @returns {O | null} - Null or Output
     */
    async tryNull(f, i) {
        try {
            const o = await f(i)
            return o
        } catch (e) {
            return null
        }
    }
}