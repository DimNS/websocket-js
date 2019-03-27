/**
 * Инициализация
 *
 * @version 27.03.2019
 * @author  Дмитрий Щербаков <atomcms@ya.ru>
 */
webSocketPHP.init = function (options) {
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    if (!window.WebSocket) {
        console.info('WebSocket not supported');

        return;
    }

    if (typeof (options) === 'undefined') {
        options = {};
    }

    webSocketPHP._settings = $.extend({
        url            : null,
        sid            : null,
        attemptsCount  : 5,
        attemptsTimeout: 10,
        onMessage      : function (message) {
            console.info(message);
        }
    }, options);

    if (webSocketPHP._settings.url === null || webSocketPHP._settings.url === '') {
        console.error('WebSocket: Option "url" is empty');

        return;
    }

    if (webSocketPHP._settings.sid === null || webSocketPHP._settings.sid === '') {
        console.error('WebSocket: Option "sid" is empty');

        return;
    }

    webSocketPHP._settings.attemptsNum = 1;

    webSocketPHP._connect();
};