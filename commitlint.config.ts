module.exports = {
    parserPreset: {
        parserOpts: {
            headerPattern: /^\[(.+-\d+)] \[(.+)]: (.+)$/,
            headerCorrespondence: ['ticket', 'type', 'subject'],
        },
    },
    rules: {
        'header-max-length': [2, 'always', 100],
    },
};
