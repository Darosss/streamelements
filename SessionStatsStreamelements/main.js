let EVENTS_LIMIT = 3,
  COUNT_WORDS_LIMIT = 1,
  CHAT_SESSION = "chat",
  EMOTES_SESSION = "emotes",
  WORDS_SESSION = "words",
  WHAT_SHOW = CHAT_SESSION,
  THINGS_TO_COUNT = "Hi;Hello",
  MESSAGES_ARRAY = [],
  EMOTES_ARRAY = [],
  WORDS_ARRAY = [],
  MSGHEAD = ["User", "Amount"],
  EMOTEHEAD = ["Emote", "Amount"],
  WORDSHEAD = ["Word", "Amount"],
  whatShow = "messages",
  headTitle = "whatever",
  PLACE_ARR = ["first", "second", "third"],
  rankName = [],
  emoteSize = 1,
  DELAY = 10000;

class SessionStats {
  constructor(delay = 1000) {
    this.dealy = delay;
    this.chatters = "Session chatters";
    this.emotes = "Session emotes";
    this.words = `Session words<div style='color:red'>${THINGS_TO_COUNT.join(
      ", "
    )}</div>`;
  }
  static addEvent(type, username, text, headField = false, msgAmount = 0) {
    let element;
    let place_div = ``;
    if (msgAmount > 0) {
      place_div = `<div class="event-image">${msgAmount}</div>`;
    }
    if (!headField) {
      place_div = `<div class="event-image place-${type}"></div>`;
    }
    element = `
        <div class="event-container" id="event">
          <div class="backgroundsvg"></div> 
          ${place_div}
          <div class="username-container">${username}</div>
          <div class="details-container">${text}</div>
        </div>
        `;

    $(".main-container").removeClass("fadeOutClass").show().append(element);
  }
  static conditionArray(arr, limit, name, amount) {
    arr.sort((a, b) => b.amount - a.amount);
    if (limit > arr.length) {
      limit = arr.length;
    }
    if (arr.length <= 0) return;
    let sumMsg = 0;
    for (let i = 0; i < arr.length; i++) {
      sumMsg += arr[i].amount;
    }
    SessionStats.addEvent("", name, amount, true, sumMsg);
    for (let i = 0; i < limit; i++) {
      var percentMsg = Math.floor((arr[i].amount / sumMsg) * 100);
      SessionStats.addEvent(
        PLACE_ARR[i],
        arr[i].name,
        arr[i].amount + `(${percentMsg}%)`
      );
    }
  }
  showMessages(arr, limit) {
    $(".main-container").empty();
    $("#titleHead").text(this.chatters);

    setTimeout(function () {
      SessionStats.conditionArray(arr, limit, MSGHEAD[0], MSGHEAD[1]);
    }, this.delay);
    //timeout only because api is too slow or i dont know, without delay it's broken
  }
  showEmotes(arr, limit) {
    $(".main-container").empty();
    $("#titleHead").text(this.emotes);
    setTimeout(function () {
      SessionStats.conditionArray(arr, limit, EMOTEHEAD[0], EMOTEHEAD[1]);
    }, this.delay);
  }
  showWords(arr, limit) {
    $(".main-container").empty();
    $("#titleHead").empty();
    $("#titleHead").append(this.words);
    setTimeout(function () {
      SessionStats.conditionArray(arr, limit, WORDSHEAD[0], WORDSHEAD[1]);
    }, this.delay);
  }
  //timeout only because api is too slow or i dont know, without delay it's broken
}
function count_msg(nick) {
  if (MESSAGES_ARRAY.find((x) => x.name === nick)) {
    var indexOfUser = MESSAGES_ARRAY.findIndex((x) => x.name === nick);
    MESSAGES_ARRAY[indexOfUser].amount++;
  } else {
    MESSAGES_ARRAY.push({ name: nick, amount: 1 });
  }
}

function count_emote(emotes) {
  for (let emote = 0; emote < emotes.length; emote++) {
    let srcImage = emotes[emote].urls[emoteSize];
    name_emote = `<img src="${srcImage}" >`;
    if (EMOTES_ARRAY.find((x) => x.name === name_emote)) {
      var indexOfEmote = EMOTES_ARRAY.findIndex((x) => x.name === name_emote);
      EMOTES_ARRAY[indexOfEmote].amount++;
    } else {
      EMOTES_ARRAY.push({ name: name_emote, amount: 1 });
    }
  }
}

function count_word(text) {
  for (let word = 0; word < COUNT_WORDS_LIMIT; word++) {
    let indexLookingPhrase = -1;
    do {
      indexLookingPhrase = text.indexOf(
        THINGS_TO_COUNT[word],
        indexLookingPhrase + 1
      );
      if (indexLookingPhrase == -1) continue;
      if (WORDS_ARRAY.find((x) => x.name === THINGS_TO_COUNT[word])) {
        var indexOfWord = WORDS_ARRAY.findIndex(
          (x) => x.name === THINGS_TO_COUNT[word]
        );
        WORDS_ARRAY[indexOfWord].amount++;
      } else {
        WORDS_ARRAY.push({ name: THINGS_TO_COUNT[word], amount: 1 });
      }
    } while (indexLookingPhrase != -1);
  }
}
function sliceArrayPhrasesToLimit() {
  if (THINGS_TO_COUNT.length < 0) return;
  let length;
  if (COUNT_WORDS_LIMIT > THINGS_TO_COUNT.length) {
    COUNT_WORDS_LIMIT = THINGS_TO_COUNT.length;
  }
  // if limit > all words = limit = all words length
  if (THINGS_TO_COUNT.length > COUNT_WORDS_LIMIT) {
    length = THINGS_TO_COUNT.length - COUNT_WORDS_LIMIT;
  }
  // if all words length > limit = all words length - limit (pop different)
  for (let i = 0; i < length; i++) {
    let random = Math.floor(Math.random() * THINGS_TO_COUNT.length);
    //console.log(THINGS_TO_COUNT[random]);
    THINGS_TO_COUNT.splice(random, 1);
  }
}

window.addEventListener("onEventReceived", function (obj) {
  let user_nick = obj.detail.event.data.nick;

  count_msg(user_nick);

  let emotes = obj.detail.event.data.emotes;
  count_emote(emotes);

  let text = obj.detail.event.data.text;
  count_word(text);
});
window.addEventListener("onWidgetLoad", function (obj) {
  const fieldData = obj.detail.fieldData;
  THINGS_TO_COUNT = fieldData.phrasesToCount.split(";");
  EVENTS_LIMIT = fieldData.eventsLimit;
  COUNT_WORDS_LIMIT = fieldData.countWordsLimit;
  DELAY = fieldData.delay;
  sliceArrayPhrasesToLimit();
  const stats = new SessionStats();
  setInterval(function () {
    if (WHAT_SHOW == CHAT_SESSION) {
      WHAT_SHOW = EMOTES_SESSION;
      stats.showMessages(MESSAGES_ARRAY, EVENTS_LIMIT);
    } else if (WHAT_SHOW == EMOTES_SESSION) {
      WHAT_SHOW = WORDS_SESSION;
      stats.showEmotes(EMOTES_ARRAY, EVENTS_LIMIT);
    } else {
      WHAT_SHOW = CHAT_SESSION;
      stats.showWords(WORDS_ARRAY, COUNT_WORDS_LIMIT);
    }
  }, DELAY);
});
