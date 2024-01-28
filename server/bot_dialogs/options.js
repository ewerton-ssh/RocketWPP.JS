function options(option) {
    switch (option) {
        case '1':
            return 'resposta_bot';
        case '2':
            return 'SAC';
        case '3':
            return 'TI';
        default:
            return 'falseOption';
    }
}

module.exports = options;