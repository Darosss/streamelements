let EVENTS_LIMIT=12,

    WHAT_SHOW="",
    MSG_TITLE="",
    EMOTE_TITLE="",
    DELAY=10000,
    TOGGLE_TOP_LISTS,
    EMOTE_SIZE,
    PLACE_ARR = ["first", "second", "third"],
    MSGHEAD = ["User", "Messages"],
    EMOTEHEAD = ["User", "Messages"],
    CHATSTATS_NAME = "chatstats",
    EMOTES_NAME = 'emotes',
    API_LINK = '';	

class getAPI{
    constructor(api_link) {
    this.api_link = api_link;
    this.topMessages = [];
    this.topEmotes = [];
    this.emoteType = 'emoteType';
    }

  	fetch(limit){
      	fetch(this.api_link, {
          "method": "GET",
          "headers": {
            "Content-Type": "application/json",
            "Accept": "application/json",
  		  }
        }).then(response => response.json()).then(data => {
          	console.log(data);
          	let msg = data.chatters;
          	let twitchEmot = data.twitchEmotes;
          	let bttvEmot = data.bttvEmotes;
          	let ffzEmot = data.ffzEmotes;
          	
          	for(let i = 0; i < limit; i++){
                if (ffzEmot.length > 0 && i < ffzEmot.length){ 
                  ffzEmot[i][this.emoteType]='ffzEmot';
                  this.topEmotes.push(ffzEmot[i]);
                }
                if (bttvEmot.length > 0 && i < bttvEmot.length){ 
                  bttvEmot[i][this.emoteType]='bttvEmotes';
                  this.topEmotes.push(bttvEmot[i])
                }
                if (twitchEmot.length > 0 && i < twitchEmot.length){ 
                  twitchEmot[i][this.emoteType]='twitchEmotes';
                  this.topEmotes.push(twitchEmot[i])
                }
                if (msg.length > 0 && i < msg.length){this.topMessages.push(msg[i])}
            }
          	console.log(this.topEmotes)
			this.topEmotes.sort((a,b) => b.amount - a.amount);
          	//Sort emotes and delete things in array till (length array == limit)
          	let diff = this.topEmotes.length - limit;
          	// difference between limit and length array
          	// its because fzz emotes, bttv emotes and twitch emotes are in separate key
          	this.topEmotes.splice(this.topEmotes.length - diff, diff);
          	// remove difference from array(it's already sorted so we remove less used emotes
        }).catch(err => { console.error(err);}); 
    }
    getTopMessages() {
      return this.topMessages;
 	}
    getTopEmotes() {
      return this.topEmotes;
 	}
          
}


class MessagesEmotes{
  constructor(container, delay=1000) {
		this.container = container;
    	this.delay = delay;
    }
  static addEvent(type, username, text, headField=false) {
    let element;
  	let place_div = ``;
  	if(!headField){place_div = `<div class="event-image place-${type}"></div>`;}
    element = `
      <div class="event-container" id="event">
        <div class="backgroundsvg"></div> 
        ${place_div}
        <div class="username-container">${username}</div>
      	<div class="details-container">${text}</div>
      </div>
      `;
 	 
 	 $('.main-container').removeClass("fadeOutClass").show().append(element);
	}
  showMessages(arr){
    MessagesEmotes.addEvent("", MSGHEAD[0], MSGHEAD[1], true)
    setTimeout(function(){
      	for(let i = 0; i < arr.length; i++){
     		 MessagesEmotes.addEvent(PLACE_ARR[i], arr[i].name, arr[i].amount) 
        }
    },this.delay);
    //timeout only because api is too slow or i dont know, without delay it's broken
  }
  showEmotes(arr){
    MessagesEmotes.addEvent("", EMOTEHEAD[0], EMOTEHEAD[1], true)
    setTimeout(function(){
      	for(let i = 0; i < arr.length; i++){
          	let emoteID = arr[i].id.toString();
          	let ImgSrc='';
          	if(arr[i].emoteType == 'twitchEmotes'){
            	ImgSrc = `https://static-cdn.jtvnw.net/emoticons/v2/${emoteID}/static/light/${EMOTE_SIZE}.0`;
            }
          	else if(arr[i].emoteType == 'bttvEmotes'){
				ImgSrc = `https://cdn.betterttv.net/emote/${emoteID}/${EMOTE_SIZE}x`
                console.log(ImgSrc);
            }
          	else if(arr[i].emoteType == 'ffzEmot'){
            	console.log('ffzEmotes are different');
            }
            MessagesEmotes.addEvent(PLACE_ARR[i],"<img src='"+ImgSrc+"'> "+arr[i].emote ,arr[i].amount);
        }
    },this.delay);
    //timeout only because api is too slow or i dont know, without delay it's broken
  }
}
window.addEventListener('onWidgetLoad', function (obj) {
  	const fieldData = obj.detail.fieldData;
   	EVENTS_LIMIT = fieldData.eventsLimit;
    WHAT_SHOW = fieldData.whatShow;

  	MSGHEAD[0] = fieldData.userName;
    MSGHEAD[1] = fieldData.messageAmount;
    EMOTEHEAD[0] = fieldData.emoteName;
    EMOTEHEAD[1] = fieldData.emoteAmmount;
    MSG_TITLE = fieldData.msgTitle;
    EMOTE_TITLE = fieldData.emoteTitle;
    DELAY = fieldData.delay;
  	TOGGLE_TOP_LISTS = fieldData.toggleTopLists;
  	EMOTE_SIZE=fieldData.emoteSize;
    $("#titleHead").html(titleHead);
    API_LINK = fieldData.apiLink;
  	let api = new getAPI(API_LINK);
    api.fetch(EVENTS_LIMIT);
    let topEmotes = api.getTopEmotes();
  	let topBox = new MessagesEmotes('.main_container');
    
  	setInterval(function(){
      $('.main-container').empty();
      if(WHAT_SHOW == CHATSTATS_NAME){
        $('#titleHead').text(MSG_TITLE);
        if(TOGGLE_TOP_LISTS){WHAT_SHOW = EMOTES_NAME}
        topBox.showMessages(api.getTopMessages());
      }else{
        $('#titleHead').text(EMOTE_TITLE);
        if(TOGGLE_TOP_LISTS){WHAT_SHOW = CHATSTATS_NAME}
        topBox.showEmotes(api.getTopEmotes());
      }
    }, DELAY);
  	
})