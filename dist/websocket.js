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
 * @version 11.04.2019
 * @author  Дмитрий Щербаков <atomcms@ya.ru>
 */
webSocketPHP.init = function (options) {
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // Проверка на наличие возможности WebSocket
    if (!window.WebSocket) {
        console.info('WebSocket not supported');

        return;
    }

    // Проверка на наличие объекта
    if (typeof options === 'undefined') {
        options = {};
    }

    // Настройки
    webSocketPHP._settings = $.extend({
        url            : null,
        sid            : null,
        attemptsCount  : 5,
        attemptsTimeout: 10,
        debug          : false,
        onConnect      : null,
        onDisconnect   : null,
        onMessage      : function (message) {
            console.info(message);
        }
    }, options);

    // Проверка наличия обязательного параметра url
    if (webSocketPHP._settings.url === null || webSocketPHP._settings.url === '') {
        console.error('WebSocket: Option "url" is empty');

        return;
    }

    // Проверка наличия обязательного параметра sid
    if (webSocketPHP._settings.sid === null || webSocketPHP._settings.sid === '') {
        console.error('WebSocket: Option "sid" is empty');

        return;
    }

    // Первая попытка соединения
    webSocketPHP._settings.attemptsNum = 1;

    // Запустим установку соединения
    webSocketPHP._connect();
};
/**
 * Подключение к WebSocket серверу
 *
 * @version 11.04.2019
 * @author  Дмитрий Щербаков <atomcms@ya.ru>
 */
webSocketPHP._connect = function () {
    var ws = new WebSocket(webSocketPHP._settings.url + '/?sid=' + webSocketPHP._settings.sid);

    ws.onopen = function () {
        if (webSocketPHP._settings.debug === true) {
            console.info('WebSocket connection success');
        }

        // При успешном подключении сбрасываем попытки подключений
        webSocketPHP._settings.attemptsNum = 0;

        if (typeof webSocketPHP._settings.onConnect === 'function') {
            webSocketPHP._settings.onConnect();
        }
    };

    ws.onerror = function (error) {
        if (webSocketPHP._settings.debug === true) {
            console.error('WebSocket error', error);
        }
    };

    ws.onclose = function (event) {
        if (webSocketPHP._settings.debug === true) {
            if (event.wasClean) {
                console.info('WebSocket connection is closed');
            } else {
                console.error('WebSocket connection failure code: ' + event.code);
            }
        }

        if (typeof webSocketPHP._settings.onDisconnect === 'function') {
            webSocketPHP._settings.onDisconnect();
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
        if (typeof webSocketPHP._settings.onMessage === 'function') {
            webSocketPHP._settings.onMessage(JSON.parse(result.data));
        }
    };
};