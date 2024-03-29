module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    collectCoverageFrom: [
        "src/**/{!(getDisplayMedia.mock|index),}.(ts|tsx)"
    ]
};