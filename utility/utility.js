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
    },

    /**
     * Randomises the order of an array using Fisher-Yates
     * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     * @param {[T]} array
     * @returns {[T]} 
     */
    shuffleArray(array){
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
    }
}