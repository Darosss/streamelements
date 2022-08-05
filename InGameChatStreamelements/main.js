let eventsLimit = 5,
  userLocale = "en-US",
  includeFollowers = true,
  includeRedemptions = true,
  includeHosts = true,
  minHost = 0,
  includeRaids = true,
  minRaid = 0,
  includeSubs = true,
  includeTips = true,
  minTip = 0,
  includeCheers = true,
  hoursOn = false,
  direction = "top",
  textOrder = "nameFirst",
  minCheer = 0;

let userCurrency,
  totalEvents = 0;

window.addEventListener("onEventReceived", function (obj) {
  chatter = obj.detail.event.data;
  let nickname = chatter.nick;
  let msg = chatter.text;
  let msg_time_txt = null;
  if (hoursOn) {
    let msg_time = new Date(chatter.time);
    msg_time_txt =
      msg_time.getHours() +
      ":" +
      msg_time.getMinutes() +
      ":" +
      msg_time.getSeconds();
  }
  if (chatter.emotes) {
    let message_with_emotes = chatter.text;
    let first_index = 0;

    for (let i = 0; i < chatter.emotes.length; i++) {
      msg = message_with_emotes.replace(
        chatter.emotes[i].name,
        "<img src='" + chatter.emotes[i].urls[1] + "'>"
      );
    }
  }
  addEvent(nickname, msg, msg_time_txt);
});

window.addEventListener("onWidgetLoad", function (obj) {
  //addEvent("TUTAJ nick", "cotamjaktam??\n jak tam? lol wtf hahahaha jakbys tak zrobil cos tam ererererer er sdfsd fsdfsd fsdf sd fsd fsd fsd ", '14:23:32')
  //addEvent("TUTAJ NICK", "cotamjaktam??\n jak tam? lol wtf hahahaha jakbys tak zrobil cos tam ererererer er sdfsd fsdfsd fsdf sd fsd fsd fsd ", '14:23:32')
  //addEvent("TUTAJ NICK", "cotamjaktam??\n jak tam? lol wtf hahahaha jakbys tak zrobil cos tam ererererer er sdfsd fsdfsd fsdf sd fsd fsd fsd ", '14:23:32')
  //addEvent("TUTAJ NICK", "cotamjd ")
  //addEvent("TUTAJ NICK", "cotam")
  //addEvent("TUTAJ NICK", "cotamjaktam??\n jak tam? lol wtf hahahaha jakbys tak zrobil cos ta? lol wtf hahahaha jakbys tak zrobil cos ta? lol wtf hahahaha jakbys tak zrobil cos ta? lol wtf hahahaha jakbys tak zrobil cos tam ercotamjaktam??\n jak tam? lol wtf hahahaha jakbys tak zrobil cos tam ercotamjaktam??\n jak tam? lol wtf hahahaha jakbys tak zrobil cos tam ererererer er sdfsd fsdfsd fsdf sd fsd fsd fsd ")
  //addEvent("tyseK", "<img src='https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/1.0'> Siema <img src='https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/1.0'> <img src='https://cdn.betterttv.net/emote/54fa8f1401e468494b85b537/1x'> co tamKappa Siema <img src='https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/1.0'> <img src='https://cdn.betterttv.net/emote/54fa8f1401e468494b85b537/1x'> co tamKappa Siema <img src='https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/1.0'> <img src='https://cdn.betterttv.net/emote/54fa8f1401e468494b85b537/1x'> co tamKappa Siema <img src='https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/1.0'> <img src='https://cdn.betterttv.net/emote/54fa8f1401e468494b85b537/1x'> co tamKappa Siema <img src='https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/1.0'> <img src='https://cdn.betterttv.net/emote/54fa8f1401e468494b85b537/1x'> co tamKappa Siema <img src='https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/1.0'> <img src='https://cdn.betterttv.net/emote/54fa8f1401e468494b85b537/1x'> co tamKappa Siema <img src='https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/1.0'> <img src='https://cdn.betterttv.net/emote/54fa8f1401e468494b85b537/1x'> co tam ")
  let recents = obj.detail.recents;
  recents.sort(function (a, b) {
    return Date.parse(a.createdAt) - Date.parse(b.createdAt);
  });
  const fieldData = obj.detail.fieldData;
  eventsLimit = fieldData.eventsLimit;
  direction = fieldData.direction;
  userLocale = fieldData.locale;
  textOrder = fieldData.textOrder;
  fadeoutTime = fieldData.fadeoutTime;
  hoursOn = fieldData.hoursOn;
});

function addEvent(username, text, hour) {
  totalEvents += 1;
  let element;
  let usernameDiv = `<div class="username-container">${username}</div>`;
  if (hour) {
    usernameDiv += ` <div class="msg-time-container">${hour}</div>`;
  }
  element = `
    <div class="event-container" id="event-${totalEvents}">
        ${usernameDiv}
        <div class="text-container">${text}</div>
    </div>`;
  if (direction === "bottom") {
    $(".main-container").removeClass("fadeOutClass").show().append(element);
  } else {
    $(".main-container").removeClass("fadeOutClass").show().prepend(element);
  }
  //if (fadeoutTime !== 999) {
  //    $('.main-container').addClass("fadeOutClass");
  // }
  if (totalEvents > eventsLimit) {
    removeEvent(totalEvents - eventsLimit);
  }
}

function removeEvent(eventId) {
  $(`#event-${eventId}`).animate(
    {
      height: 0,
      opacity: 0,
    },
    "slow",
    function () {
      $(`#event-${eventId}`).remove();
    }
  );
}
