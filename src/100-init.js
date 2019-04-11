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