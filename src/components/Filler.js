import message from "./MessagesBlock/Message/Message";

export default class Filler {
    static worldList = 'Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст.. Здесь ваш текст.. Здесь ваш текст.." Многие программы электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию, так что поиск по ключевым словам "lorem ipsum" сразу показывает, как много веб-страниц всё ещё дожидаются своего настоящего рождения. За прошедшие годы текст Lorem Ipsum получил много версий. Некоторые версии появились по ошибке, некоторые - намеренно'.split(' ');
    static getRandomValue = function (min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    static getRandomMessageText = function (wordList, wordLength) {
        let text = [];

        for (let i = 0; i < wordLength; i++) {
            text.push(wordList[Filler.getRandomValue(0, wordList.length)]);
        }

        return text.join(' ');
    }
    static getRandomMessages = function (wordList, amountMessages, messageSize = [5, 15]) {
        let messages = [];

        for (let i = 0; i < amountMessages; i++) {
            messages.push({
                date: Date.now() - i * Filler.getRandomValue(1000, 1500),
                user: Filler.getRandomValue(0, 1),
                message: Filler.getRandomMessageText(wordList, Filler.getRandomValue(messageSize[0], messageSize[1])),
            });
        }

        return messages;
    };
}