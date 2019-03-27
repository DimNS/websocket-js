/**
 * WebSocketPHP
 *
 * @version 27.03.2019
 * @author  Дмитрий Щербаков <atomcms@ya.ru>
 */

/**
 * Объект страницы
 *
 * @type {object}
 */
var webSocketPHP = {};
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
/**
 * Подключение к WebSocket серверу
 *
 * @version 27.03.2019
 * @author  Дмитрий Щербаков <atomcms@ya.ru>
 */
webSocketPHP._connect = function () {
    var ws = new WebSocket(webSocketPHP._settings.url + '/?sid=' + webSocketPHP._settings.sid);

    ws.onopen = function () {
        console.info('WebSocket connection success');

        // При успешном подключении сбрасываем попытки подключений
        webSocketPHP._settings.attemptsNum = 0;
    };

    ws.onerror = function (error) {
        console.error('WebSocket error', error);
    };

    ws.onclose = function (event) {
        if (event.wasClean) {
            console.info('WebSocket connection is closed');
        } else {
            console.error('WebSocket connection failure code: ' + event.code);
        }

        // Проверяем номер попытки
        if (webSocketPHP._settings.attemptsNum < webSocketPHP._settings.attemptsCount) {
            webSocketPHP._settings.attemptsNum++;

            var timeout = (webSocketPHP._settings.attemptsTimeout * webSocketPHP._settings.attemptsNum) * 1000;

            setTimeout(function () {
                webSocketPHP._connect();
            }, timeout);
        }
    };

    ws.onmessage = function (result) {
        webSocketPHP._settings.onMessage(JSON.parse(result.data));
    };
};