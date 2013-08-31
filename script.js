(function() {
    document.addEventListener("DOMContentLoaded", game, false);
    function game() {
        function showInfo(info, brCount) {
            var el = document.createElement("div"),
                    br = "";
            for (var i = 0; i < brCount; i++)
                br += "<br>";
            el.innerHTML = br + info;
            document.body.appendChild(el);
        }
        function createCards(deck) {
            var suits = ["H", "S", "C", "D"],
                    values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
            for (var i = 0; i < suits.length; i++)
                for (var j = 0; j < values.length; j++)
                    deck.push(values[j] + suits[i]);
        }
        function shuf(deck) {
            var shufDeck = [];
            for (var i = 0; i < deck.length; ) {
                var n = Math.floor(Math.random() * deck.length);
                shufDeck.push(deck[n]);
                deck.splice(n, 1);
            }
            return shufDeck;
        }
        function stackTransfer(a, b) {
            a.push(b[b.length - 1]);
            b.pop();
        }
        function giveCards(gamblers, gamersCount, deck, stackSize) {
            function Gamer() {
                this.stack = [];
            }
            var gambler;
            for (var i = 1; i <= gamersCount; i++) {
                gambler = new Gamer;
                gambler.uid = i;
                for (var j = 0; j < stackSize; j++)
                    stackTransfer(gambler.stack, deck);
                gamblers.push(gambler);
            }
        }
        function openCards(gamblers, opCards) {
            opCards.length = 0;
            for (var i = 0; i < gamblers.length; i++) {
                stackTransfer(opCards, gamblers[i].stack);
            }
        }
        function match(gamblers, opCards, closedCards) {
            var winGamerIndex, max = 1;
            for (var i = 0; i < opCards.length; i++) {
                if (parseInt(opCards[i]) > max) {
                    max = parseInt(opCards[i]);
                    winGamerIndex = i;
                }
            }
            var winGamersIndex = [];
            for (var i = 0; i < opCards.length; i++) {
                if (parseInt(opCards[i]) === max) {
                    winGamersIndex.push(i);
                }
            }
            // Проверяем победителя
            if (winGamersIndex.length > 1) {
                showInfo("Игроки, между которыми война:", 1);
                for (var i = 0; i < winGamersIndex.length; i++) {
                    showInfo("№: " + gamblers[winGamersIndex[i]].uid + ", карта: " + opCards[winGamersIndex[i]], 0);
                 /*   if (gamblers[winGamersIndex[i]].stack.length === 52)
                        return gamblers[winGamersIndex[i]].uid; */ // Игрок победил
                }

            /*    for (var i = 0; i < gamblers.length; i++) { // Зачищаем игроков без карт
                    if (gamblers[i].stack.length === 0) {
                        gamblers.splice(i, 1);
                    }
                } */
                var op2Cards = [], winGamblers = [];
                for (var i = 0; i < winGamersIndex.length; i++) {
                    stackTransfer(closedCards, gamblers[winGamersIndex[i]].stack);
                    stackTransfer(op2Cards, gamblers[winGamersIndex[i]].stack);
                    winGamblers.push(gamblers[winGamersIndex[i]]);
                }
                showInfo("Карты в заклад: " + closedCards + "   [" + closedCards.length + " шт]", 0);
                showInfo("Открытые карты: " + op2Cards + "   [" + op2Cards.length + " шт]", 0);
                closedCards = takeCards(opCards, closedCards);
                match(winGamblers, op2Cards, closedCards);
            } else {
                gamblers[winGamerIndex].stack = takeCards(closedCards, gamblers[winGamerIndex].stack);
                gamblers[winGamerIndex].stack = takeCards(opCards, gamblers[winGamerIndex].stack);
               /* if (gamblers[winGamerIndex].stack.length === 52)
                    return gamblers[winGamerIndex].uid; // Игрок победил
                for (var i = 0; i < gamblers.length; i++) { // Зачищаем игроков без карт
                    if (gamblers[i].stack.length === 0) {
                        gamblers.splice(i, 1);
                    }
                }
                */
                closedCards.length = 0;
                showInfo("Игроки (победитель забрал карты): ", 0);
                for (var i = 0; i < gamers.length; i++) {
                    showInfo("№: " + gamers[i].uid + ", карты: " + gamers[i].stack + "   [" + gamers[i].stack.length + " шт]", 0);
                }
                ////playing(gamers, opCards, closedCards);
            }
        }
        function takeCards(opCards, gamblerStack) {
            return opCards.concat(gamblerStack);
        }
        var deck = [];
        createCards(deck);
        showInfo("Созданная колода: " + deck, 0);
        showInfo("Количество карт в колоде: " + deck.length, 0);
        deck = shuf(deck);
        showInfo("Перетасованная колода: " + deck, 1);
        showInfo("Количество карт перетасованной в колоде: " + deck.length, 0);
        var gamers = [], gamersCount = 5;
        giveCards(gamers, gamersCount, deck, (deck.length / gamersCount ^ 0));
        showInfo("Игроки: ", 1);
        for (var i = 0; i < gamers.length; i++) {
            showInfo("№: " + gamers[i].uid + ", карты: " + gamers[i].stack + "   [" + gamers[i].stack.length + " шт]", 0);
        }
        var opCards = [], closedCards = [];
        function playing(gamers, opCards, closedCards) {
            openCards(gamers, opCards);
            showInfo("Открытые карты: " + opCards + "   [" + opCards.length + " шт]", 1);
            showInfo("Игроки (без открытых карт): ", 0);
            for (var i = 0; i < gamers.length; i++) {
                showInfo("№: " + gamers[i].uid + ", карты: " + gamers[i].stack + "   [" + gamers[i].stack.length + " шт]", 0);
            }
            return match(gamers, opCards, closedCards);
        }
        var winner = playing(gamers, opCards, closedCards);
       //// showInfo("ПОБЕДИЛ: " + winner + " игрок!!!", 3);
    }
})();
