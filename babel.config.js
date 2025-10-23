// Babel, modern JavaScript'i eski tarayıcıların anlayabileceği koda çevirir
module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
    };
};

