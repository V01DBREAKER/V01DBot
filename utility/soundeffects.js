module.exports = {
    effects: [
        {
            name: 'Boom',
            value: 'vine_boom',
            path: 'vine-boom.mp3', // from assets folder
            reply: 'Boomed in chat.',
            empheral: false,
        },
        {
            name: 'Fart',
            value: 'fart',
            path: 'fart.mp3',
            reply: 'https://tenor.com/view/fart-gas-cutting-the-cheese-blast-fart-blast-gif-18044330474715481859',
            empheral: true,
        },
    ],

    getChoices() {
        out = []
        for (effect of this.effects) {
            out.push({name: effect.name, value: effect.value})
        }
        return out
    }
}