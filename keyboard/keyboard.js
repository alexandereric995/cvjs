$(function () {
    var shift = 'off';
    var caps = 'off';

    function changeKeyCase (shiftOrCaps) {
        var keys = document.querySelectorAll('.key');
        for (var i = 0; i < keys.length; i++) {
            var node = keys[i];
            var val = node.firstChild.nodeValue;
            if (KeyboardKeys['shift-' + shiftOrCaps][val] !== undefined) 
                node.firstChild.nodeValue = KeyboardKeys['shift-' + shiftOrCaps][val];
        }
    }

    var shifts = document.querySelectorAll('.shift');
    for (var i = 0; i < shifts.length; i++) {
        var key = shifts[i];
        key.addEventListener('click', function (ev) {
            changeKeyCase(shift);
            shift = shift == 'off' ? 'on' : 'off';
        });
    }

    document.querySelector('.caps').addEventListener('click', function (key) {
        changeKeyCase(caps);
        caps = caps == 'off' ? 'on' : 'off';
    });

    var keys = document.querySelectorAll('.key');
    for (var i = 0; i < keys.length; i++) {
        var node = keys[i];
        node.addEventListener('click', function (ev) {
            var key = this.firstChild.nodeValue;
            if (key == 'Shift' || key == 'Caps') {
                return;
            }
            if (keyCodes[key]) {
                //self.emit('key', keyCodes[key], key, keyCodes[key]);
                var keyCode = keyCodes[key];
                var keyDesc = keyCodes[key];
                alert(keyCode);
                document.querySelector('#output').appendChild(
                    document.createTextNode(
                        keyDesc + " (key code: " + keyCode + ") "
                    )
                );
            }
            else {
                //self.emit('key', key.charCodeAt(0), key, keyCodesRegular[key]);
                var keyCode = key.charCodeAt(0);
                var keyDesc = keyCodesRegular[key];
                alert(keyCode);
                document.querySelector('#output').appendChild(
                    document.createTextNode(
                        keyDesc + " (key code: " + keyCode + ") "
                    )
                );
            }
            if (shift == 'on') {
                changeKeyCase(shift);
                shift = 'off';
            }
        });
    }

    /*
    '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backsp'
    '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Backsp'

    'TAB', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'
    'TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|'

    'CAPS', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'
    'CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Enter'

    'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'
    'Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'Shift'
    */

    var KeyboardKeys = keys = {
        'shift-off' : {
            'ESC' : 'ESC',
            'F1' : 'F1',
            'F2' : 'F2',
            'F3' : 'F3',
            'F4' : 'F4',
            'F5' : 'F5',
            'F6' : 'F6',
            'F7' : 'F7',
            'F8' : 'F8',
            'F9' : 'F9',
            'F10' : 'F10',
            'F11' : 'F11',
            'F12' : 'F12',

            '`' : '~', 
            '1' : '!', 
            '2' : '@', 
            '3' : '#', 
            '4' : '$', 
            '5' : '%', 
            '6' : '^', 
            '7' : '&', 
            '8' : '*', 
            '9' : '(', 
            '0' : ')', 
            '-' : '_', 
            '=' : '+', 
            'Backsp' : 'Backsp',

            'TAB' : 'TAB',
            'q' : 'Q', 
            'w' : 'W', 
            'e' : 'E', 
            'r' : 'R', 
            't' : 'T', 
            'y' : 'Y', 
            'u' : 'U', 
            'i' : 'I', 
            'o' : 'O', 
            'p' : 'P', 
            '[' : '{', 
            ']' : '}', 
            '\\' : '|',

            'Caps' : 'Caps', 
            'a' : 'A', 
            's' : 'S', 
            'd' : 'D', 
            'f' : 'F', 
            'g' : 'G', 
            'h' : 'H', 
            'j' : 'J', 
            'k' : 'K', 
            'l' : 'L', 
            ';' : ':', 
            '\'' : '"', 
            'Enter' : 'Enter',

            'Shift' : 'Shift', 
            'z' : 'Z', 
            'x' : 'X', 
            'c' : 'C', 
            'v' : 'V', 
            'b' : 'B', 
            'n' : 'N', 
            'm' : 'M', 
            ',' : '<', 
            '.' : '>', 
            '/' : '?', 

            'Ctrl' : 'Ctrl',
            'WinKey' : 'WinKey',
            'Alt' : 'Alt',
            'Space' : 'Space',
            'OptKey' : 'OptKey'
        },
        'shift-on' : {
            'ESC' : 'ESC',
            'F1' : 'F1',
            'F2' : 'F2',
            'F3' : 'F3',
            'F4' : 'F4',
            'F5' : 'F5',
            'F6' : 'F6',
            'F7' : 'F7',
            'F8' : 'F8',
            'F9' : 'F9',
            'F10' : 'F10',
            'F11' : 'F11',
            'F12' : 'F12',

            '~' : '`', 
            '!' : '1',
            '@' : '2',
            '#' : '3',
            '$' : '4',
            '%' : '5',
            '^' : '6',
            '&' : '7',
            '*' : '8',
            '(' : '9',
            ')' : '0',
            '_' : '-',
            '+' : '=',
            'Backsp' : 'Backsp',

            'TAB' : 'TAB',
            'Q' : 'q',
            'W' : 'w',
            'E' : 'e',
            'R' : 'r',
            'T' : 't',
            'Y' : 'y',
            'U' : 'u',
            'I' : 'i',
            'O' : 'o',
            'P' : 'p',
            '{' : '[',
            '}' : ']',
            '"' : '\'',

            'Caps' : 'Caps',
            'A' : 'a',
            'S' : 's',
            'D' : 'd',
            'F' : 'f',
            'G' : 'g',
            'H' : 'h',
            'J' : 'j',
            'K' : 'k',
            'L' : 'l',
            ':' : ';',
            '|' : '\\',
            'Enter' : 'Enter',

            'Shift' : 'Shift',
            'Z' : 'z',
            'X' : 'x',
            'C' : 'c',
            'V' : 'v',
            'B' : 'b',
            'N' : 'n',
            'M' : 'm',
            '<' : ',',
            '>' : '.',
            '?' : '/',

            'Ctrl' : 'Ctrl',
            'WinKey' : 'WinKey',
            'Alt' : 'Alt',
            'Space' : 'Space',
            'OptKey' : 'OptKey'
        }
    };

    var keyCodes = {
        'Ctrl' : 17,
        'Alt' : 18,
        'WinKey' : 91,
        'OptKey' : 93,
        'Space' : 32,
        'ESC' : 27,
        'F1' : 112,
        'F2' : 113,
        'F3' : 114,
        'F4' : 115,
        'F5' : 116,
        'F6' : 117,
        'F7' : 118,
        'F8' : 119,
        'F9' : 120,
        'F10' : 121,
        'F11' : 122,
        'F12' : 123,
        'Backsp' : 8,
        'TAB' : 9,
        'Enter' : 13
    };

    var keyCodesRegular = {
        '`' : 192,
        '~' : 192,
        '1' : 49,
        '!' : 49,
        '2' : 50,
        '@' : 50,
        '3' : 51,
        '#' : 51,
        '4' : 52,
        '$' : 52,
        '5' : 53,
        '%' : 53,
        '6' : 54,
        '^' : 54,
        '7' : 55,
        '&' : 55,
        '8' : 56,
        '*' : 56,
        '9' : 57,
        '(' : 57,
        '0' : 48,
        ')' : 48,
        '-' : 189,
        '_' : 189,
        '=' : 187,
        '+' : 187,

        'q' : 81,
        'Q' : 81,
        'w' : 87,
        'W' : 87,
        'e' : 69,
        'E' : 69,
        'r' : 82,
        'R' : 82,
        't' : 84,
        'T' : 84,
        'y' : 89,
        'Y' : 89,
        'u' : 85,
        'U' : 85,
        'i' : 73,
        'I' : 73,
        'o' : 79,
        'O' : 79,
        'p' : 80,
        'P' : 80,
        '[' : 219,
        '{' : 219,
        ']' : 221,                                                                                                             
        '}' : 221,
        '\\' : 220,
        '|' : 220,

        'a' : 65,
        'A' : 65,
        's' : 83,
        'S' : 83,
        'd' : 68,
        'D' : 68,
        'f' : 70,
        'F' : 70,
        'g' : 71,
        'G' : 71,
        'h' : 72,
        'H' : 72,
        'j' : 74,
        'J' : 74,
        'k' : 75,
        'K' : 75,
        'l' : 76,
        'L' : 76,
        ';' : 186,
        ':' : 186,
        '\'' : 222,
        '"' : 222,

        'z' : 90,
        'Z' : 90,
        'x' : 88,
        'X' : 88,
        'c' : 67,
        'C' : 67,
        'v' : 86,
        'V' : 86,
        'b' : 66,
        'B' : 66,
        'n' : 78,
        'N' : 78,
        'm' : 77,
        'M' : 77,
        ',' : 188,
        '<' : 188,
        '.' : 190,
        '>' : 190,
        '/' : 191,
        '?' : 191
    };
});
