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
      console.log(chatter.emotes[i].name);
      message_with_emotes = message_with_emotes.replaceAll(
        chatter.emotes[i].name,
        "<img src='" + chatter.emotes[i].urls[1] + "'>"
      );
    }
    msg = message_with_emotes;
  }
  console.log(msg);
  addEvent(nickname, msg, msg_time_txt);
});

window.addEventListener("onWidgetLoad", function (obj) {
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
    console.log("ta");
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
