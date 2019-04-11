/**
 * Подключение к WebSocket серверу
 *
 * @version 11.04.2019
 * @author  Дмитрий Щербаков <atomcms@ya.ru>
 */
webSocketPHP._connect = function () {
    var ws = new WebSocket(webSocketPHP._settings.url + '/?sid=' + webSocketPHP._settings.sid);

    ws.onopen = function () {
        if (typeof webSocketPHP._settings.debug === 'boolean' && webSocketPHP._settings.debug === true) {
            console.info('WebSocket connection success');
        }

        // При успешном подключении сбрасываем попытки подключений
        webSocketPHP._settings.attemptsNum = 0;

        if (typeof webSocketPHP._settings.onConnect === 'function') {
            webSocketPHP._settings.onConnect();
        }
    };

    ws.onerror = function (error) {
        if (typeof webSocketPHP._settings.debug === 'boolean' && webSocketPHP._settings.debug === true) {
            console.error('WebSocket error', error);
        }
    };

    ws.onclose = function (event) {
        if (typeof webSocketPHP._settings.debug === 'boolean' && webSocketPHP._settings.debug === true) {
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