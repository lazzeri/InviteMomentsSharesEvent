var broadcastId;
var userId;
var error = false;
var newFans = [];
var newInvites = [];
var lastmoment = "";
var eventsToTrigger = [];

var userName = "debbieretek";
var randomcolor = ['#EC4B13', '#ECDC13', '#16EC13', '#13ECC5', '#131AEC', '#C513EC', '#EC138D', '#EC1313'];

//CONSTRUCTORS

class AnimationStrucutre {
    //Picture with ending(e.g pic.jpg), Scalse  e.g. 0.5
    constructor(timeinsec, textbool, picbool, userpicbool, mainpos, textfont, textsize, text, textposx, textposy, picturename, pictureposx, pictureposy, picturewidthx, picturewidthy, picturescale, userpicposx, userpicposy, userpicscale, userId, textid) {
        this.timeinsec = timeinsec;
        this.textbool = textbool;
        this.picbool = picbool;
        this.userpicbool = userpicbool;
        this.mainpos = mainpos;
        this.textfont = textfont;
        this.textsize = textsize;
        this.text = text;
        this.textposx = textposx;
        this.textposy = textposy;
        this.picturename = picturename;
        this.pictureposx = pictureposx;
        this.pictureposy = pictureposy;
        this.picturewidthx = picturewidthx;
        this.picturewidthy = picturewidthy;
        this.picturescale = picturescale;
        this.userpicposx = userpicposx;
        this.userpicposy = userpicposy;
        this.userpicscale = userpicscale;
        this.userId = userId;
        this.textid = textid;
    }
}

class Event {
    constructor(category, name, id, inviteVal, text) {
        this.category = category;
        this.name = name;
        this.id = id;
        this.inviteVal = inviteVal;
        this.text = text;
    }
}

//CONSTRUCTS FOR ANIMATIONS
async function RunCode() {
    DownloadGifts();
    FetchBroadcastId();
    CastEvents();
}

async function CastEvents() {
    while (true) {
        if (eventsToTrigger.length != 0) {
            var totrigger = eventsToTrigger.shift();
            var text = totrigger.text;

            switch (totrigger.category) {
                case "Invite":
                    var Anim = new AnimationStrucutre(5, true, true, false, "LowerRight", '"Times New Roman", Times, serif', 25, text, 80, 20, "tjdrumslogo.png", 5, 5, 400, 400, 0.2, 0, 0, 0.6, totrigger.id, 0);
                    await Animation(Anim);
                    break;
                case "Moment":
                    var Anim = new AnimationStrucutre(5, true, true, false, "LowerRight", '"Times New Roman", Times, serif', 25, text, 80, 20, "tjdrumslogo.png", 5, 5, 400, 400, 1, 0, 0, 0.6, totrigger.id, 0);
                    await Animation(Anim);
                    break;
                case "Gift":
                    var Anim = new AnimationStrucutre(5, true, true, false, "LowerRight", '"Times New Roman", Times, serif', 25, text, 80, 20, "tjdrumslogo.png", 5, 5, 400, 400, 1, 0, 0, 0.6, totrigger.id, 0);
                    await Animation(Anim);
                    break;
                case "Sub":
                    var Anim = new AnimationStrucutre(5, true, true, false, "LowerRight", '"Times New Roman", Times, serif', 25, text, 80, 20, "tjdrumslogo.png", 5, 5, 400, 400, 0.2, 0, 0, 0.6, totrigger.id, 0);
                    await Animation(Anim);
                    break;
                case "Fan":
                    //TODO SET BACK TIME
                    var Anim = new AnimationStrucutre(5, true, true, false, "LowerRight", '"Times New Roman", Times, serif', 25, text, 80, 20, "tjdrumslogo.png", 5, 5, 400, 400, 0.2, 0, 0, 0.6, totrigger.id, 0);
                    await Animation(Anim);
                    break;
            }
            await sleep(1000);
        }
        await sleep(1000);
    }
}

async function Retry() {
    console.log("Retrying in 5 seconds");
    await sleep(5000);
    error = false;
    FetchBroadcastId();
}

async function DownloadGifts() {
    console.log("Fetching Gifts...");
    targetUrl = 'https://ynassets.younow.com/giftsData/live/de/data.json';
    var json = fetch(targetUrl)
        .then(blob => blob.json())
        .then(data => {
            json = JSON.stringify(data, null, 2);
            goodies = JSON.parse(json);
        });
}

async function FetchBroadcastId() {
    console.log("Fetching Broadcast....");
    var proxyUrl = 'https://younow-cors-header.herokuapp.com/?q=',
        targetUrl = 'https://api.younow.com/php/api/broadcast/info/curId=0/user=' + userName;
    var json = fetch(proxyUrl + targetUrl)
        .then(blob => blob.json())
        .then(data => {
            json = JSON.stringify(data, null, 2);
            var done = JSON.parse(json);
            if (json.length < 1) {
                console.log("No Data Found");
                error = true;
            } else if (done.errorCode != 0) {
                console.log("User not online or not found");
                error = true;
            }
            if (error) {
                console.log("Error Found Retrying")
                Retry();
                return;
            } else {
                userId = done.userId;
                broadcastId = done.broadcastId;
                console.log("Data Found");
                FetchEvent();
                return;
            }
        })
        .catch(e => {
        });
}

function FetchEvent() {
    //First Startup Connection:
    console.log("Succesfully Connected to WebSocket");

    var pusher = new Pusher('d5b7447226fc2cd78dbb', {
        cluster: "younow"
    });
    var channel = pusher.subscribe("public-channel_" + userId);


    //Get Moments, Invites and Shares
    channel.bind('onChat', async function (data) {
        var input = data.message.comments[0].comment;
        var foundname = data.message.comments[0].name;
        var userId = data.message.comments[0].userId;

        console.log(data);
        if (input.includes("I became a fan!")) {

            if (newFans.length > 0)
                for (b = 0; b < newFans.length; b++) {
                    var test = newFans[b].localeCompare(foundname);
                    console.log("Found compare solution: " + test);

                    if (test == 0) {
                        console.log("Replica found for " + foundname);
                        found = true;
                    }
                }

            if (!found) {
                //TODO EVENT FOR NEW INVITE  userId
                var newEvent = new Event("Fan", foundname, userId, "", 'Thank you for becoming a fan <br> ' + foundname + "!");
                eventsToTrigger.push(newEvent);
                console.log('Fan works');
            }
        }

        //Invite Event
        if (input.includes("invited") && input.includes("fans to this broadcast.")) {
            var found = false;
            let invitecount = input.match(/\d+/g);
            if (newInvites.length > 0)
                for (b = 0; b < newInvites.length; b++) {
                    var test = newInvites[b].localeCompare(foundname);
                    console.log("Found compare solution: " + test);

                    if (test == 0) {
                        console.log("Replica found for " + foundname);
                        found = true;
                    }
                }
            console.log(found);
            if (!found) {
                let text = 'Thank you for inviting ' + invitecount + ' fans, ' + foundname + "!"
                var newEvent = new Event("Invite", foundname, userId, invitecount, text);
                eventsToTrigger.push(newEvent);
            }

        }

        if (input.includes("captured a moment of")) {
            if (lastmoment.localeCompare(foundname) != 0) {
                lastmoment = foundname;
                let text = 'Thank you for capturing a moment! <br>' + foundname + "!"
                var newEvent = new Event("Moment", foundname, userId, "", text);
                eventsToTrigger.push(newEvent);
                console.log('CAPTURE WORKS');
            } else {
                console.log("Repeated Moment captured");
            }
        }
    });

    //Get Gifts
    channel.bind('onGift', function (data) {
        var userId = data.message.stageGifts[0].userId;
        if (data.message != "undefined") {
            var foundname = data.message.stageGifts[0].name;
            if (data.message.stageGifts[0].giftId == 63) {
                console.log('SUB WORKS');
                var newEvent = new Event("Sub", foundname, userId, "", 'Thank you for subscribing ' + foundname + "!");
                eventsToTrigger.push(newEvent);
            }
            var foundgif;
            var foundValue;
            for (b = 0; b < goodies.goodies.length; b++) {
                if (data.message.stageGifts[0].giftId == goodies.goodies[b].id) {
                    foundgif = goodies.goodies[b].SKU;
                    foundValue = goodies.goodies[b].cost;
                }
            }
            var test = foundgif.localeCompare("TIP");

            if (test == 0) {
                var newEvent = new Event("Gift", foundname, userId, "", 'Thank you for the Tip jar! <br> ' + foundname + "!");
                eventsToTrigger.push(newEvent);
            } else {
                if (foundValue > 10) {
                    var likes = data.message.stageGifts[0].extraData.numOfLikes;
                    var newEvent = new Event("Gift", foundname, userId, "", 'Thank you for dropping ' + likes + ' likes, <br>' + foundname + "!");
                    eventsToTrigger.push(newEvent);
                }
            }
        }
    });
}

async function Animation(animStruct) {
    console.log("START");

    var WholeThing = document.createElement("div");
    WholeThing.id = "WholeThing";
    WholeThing.style.animation = 'moveup 2s';

    var rancol;
    rancol = randomcolor[randomInt()];

    //if (animStruct.userpicbool) {
    var UserPicture = document.createElement("div");
    UserPicture.id = "UserPicture";
    UserPicture.style.border = "5px solid " + rancol;
    UserPicture.style.objectFit = "contain";
    UserPicture.style.backgroundImage = "url(https://ynassets.younow.com/user/live/" + animStruct.userId + "/" + animStruct.userId + ".jpg)";
    UserPicture.style.height = "100px";
    UserPicture.style.width = "100px";
    UserPicture.style.transform = "scale(" + animStruct.userpicscale + ")";
    UserPicture.style.float = "left";
    //Check if url is there if not we don't add
    if(isValidUrl(animStruct.userId))
    {
        WholeThing.appendChild(UserPicture);
    }
    else
    {
        console.log('DIDNT FIND URL');
        console.log(animStruct.userId)
    }

    if (animStruct.textbool) {
        var Text = document.createElement("class");
        Text.className = "Text" + animStruct.textid;
        Text.style.color = rancol;

        //Variable
        Text.innerHTML = animStruct.text;
        Text.style.top = animStruct.textposx + "px";
        Text.style.left = animStruct.textposy + "px";
        Text.style.font.size = animStruct.textsize + "px";

        WholeThing.appendChild(Text);
    }
    document.getElementById("Container").appendChild(WholeThing);
    await sleep(animStruct.timeinsec * 1000);

    var all = document.getElementById("WholeThing");
    all.parentNode.removeChild(all);

    console.log("DONE");
}

Event.prototype.toString = function () {
    console.log("Event: " + this.category + " with Name: " + this.name + " with id: " + this.id + " with inviteVal: " + this.inviteVal);
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function AddFan() {
    let foundname = 'Test';
    var newEvent = new Event("Fan", foundname, "39610842", "39610842", "Thank you for becoming a fan " + foundname + "!");
    eventsToTrigger.push(newEvent);
}

function AddInvite() {
    let foundname = 'Test';
    var newEvent = new Event("Invite", foundname, "39610842", "39610842", "Thank you for becoming a inv " + foundname + "!");
    eventsToTrigger.push(newEvent);
}

function AddMoment() {
    let foundname = 'Test';
    var newEvent = new Event("Moment", foundname, "39610842", "39610842", "Thank you for becoming a mom " + foundname + "!");
    eventsToTrigger.push(newEvent);
}

function randomInt() {
    return Math.floor(Math.random() * 7);
}
//Check if picture is there:
function isValidUrl(string) {
    try {
        var proxyUrl = 'https://younow-cors-header.herokuapp.com/?q=';

            new URL(proxyUrl +'https://ynassets.younow.com/user/live/' + string + '/' + string + '.jpg)');
    } catch (_) {
        return false;
    }

    return true;
}
