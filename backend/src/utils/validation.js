const clampText = (value, maxLength) => {
    if (typeof value !== 'string') {
        return '';
    }

    return value.trim().slice(0, maxLength);
};

const parsePositiveInt = (value, fieldName) => {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
        throw new Error(`${fieldName} deve ser um número inteiro positivo.`);
    }

    return parsedValue;
};

const parseRating = (value) => {
    const parsedValue = Number(value);

    if (!Number.isFinite(parsedValue) || parsedValue < 1 || parsedValue > 5) {
        throw new Error('A nota deve estar entre 1 e 5.');
    }

    return parsedValue;
};

module.exports = {
    clampText,
    parsePositiveInt,
    parseRating
};
