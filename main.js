//Mikannounce V1
//Mika K. 2018

//load modules and set up stuff

const discord = require('discord-rich-presence')('413339730458050571');

discord.updatePresence({
  state: 'in the menu',
  details: 'sim.bemined.nl',
  startTimestamp: Date.now(),
  largeImageKey: 'largeexplore',
  largeImageText: 'Bestemming Onbekend',
  smallImageKey: 'smallnotfound',
  smallImageText: 'no image available',
  /*partySize: 2,
  partyMax: 3,*/
  instance: true,
});

var play = require('play')

/*var keypress = require('keypress');
keypress(process.stdin);

process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key);
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
  }  else if (key && key.name == "q") {
	playNextStation()
  }
});*/

var readline = require('readline')

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt("Y>")

var fs = require('fs')

console.log("MikAnnounce announcement tool made by Mika K.\nHave fun!\n\nList available mappacks with /maps and load one with /map load name.\nalternatively, you can list and load activities with /acts and /actpack load respectively")

//VARIABLES

const badstuff = /(require|function|while|console|process|eval|readfile|writefile|exec)/i

var globalStarttime = 0 //Update with date.now() when a new route is started, for lookup in RP updates
var currentRoute = "none" //expect a route object here
var currentStation = 0 //expect a station number here
var totalStations = 0 //total number of stations
var activityProgress = 0

var destinationHasPlayed = "no"
var departHasPlayed = "no"
var stationHasPlayed = "no"
var arriveHasPlayed = "no"

var map = "none"
var act = "none"

var globalDstate = "In the menu..." //lower text
var globalDdetails = "get the game on sim.bemined.nl" //upper text
var globalDlargeimage = "largeexplore" //large image
var globalDsmallimage = "smallnotfound" //small image
var globalDlargetext = "Current train: not available"
var globalDsmalltext = "Current line: not available"

//ARRAYS

const trains = [
    {name:"81-717",type:"Metro",img:"train81717",id:"0"},
    {name:"MCV 9100 MP",type:"Airportshuttle",img:"trainair",id:"1"},
    {name:"MG2",type:"Metro",img:"trainmg2",id:"2"},
    {name:"RSG3",type:"Metro",img:"trainrsg3",id:"3"},
    {name:"SG2",type:"Metro",img:"trainsg2",id:"4"},
    {name:"RSG2",type:"Metro",img:"trainsg2",id:"5"},
    {name:"SG3",type:"Metro",img:"trainsg3",id:"6"},
    {name:"MCV 9000 (SG4)",type:"Railway",img:"trainsg4",id:"7"},
    {name:"HSM",type:"Metro",img:"trainhsm",id:"8"},
    {name:"KTM Tram",type:"Tram",img:"traintram",id:"9"},
    {name:"A3L92",type:"Metro",img:"traina3l92",id:"10"}
]

//FUNCTIONS

function updoot () {
	discord.updatePresence({
		state: globalDstate,
		details: globalDdetails,
		startTimestamp: globalStarttime,
		largeImageKey: globalDlargeimage,
        largeImageText: globalDlargetext,
		smallImageKey: globalDsmallimage,
        smallImageText: globalDsmalltext,
		partySize: currentStation,
		partyMax: totalStations,
		instance:true
	})
}

function playNextStation () {
	if (destinationHasPlayed === "no" && departHasPlayed === "no" && stationHasPlayed === "no") { //none of the other sounds have played
		var thisStation = currentRoute.stations.find(s => s.id == currentStation + 1) //so pick the next station
	} else { //sounds have been played and our station is not yet complete
		var thisStation = currentRoute.stations.find(s => s.id == currentStation) //so pick this station again
	}

    if(!thisStation) {
        console.log("You reached the end of the route.\n")
        currentRoute = "none"
        currentStation = 0
        totalStations = 0
        globalDstate = "In the menu..." 
        globalDdetails = "get the game on sim.bemined.nl"
        globalDsmallimage = "smallnotfound" 
        globalDlargetext = "Current train: not available"
        globalDsmalltext = "Current line: not available"
        updoot()
        return
    }

	globalDstate = "\uD83D\uDE89 " + thisStation.name //Station name gets shown in rich presence
	currentStation = parseInt(thisStation.id, 10) //current station gets updated, I know its pointless to do when its the same station again but w/e
	updoot() //update rich presence
    

    if (stationHasPlayed === "no") { //station announcement has not yet played
        play.sound(map.pack.path + thisStation.sound) //play station announcement
        console.log("Playing Station announcement...")
        stationHasPlayed = "yes"
        return

    } else if (thisStation.arrive && arriveHasPlayed === "no") {
        play.sound(map.pack.path + thisStation.arrive)
        console.log("Playing arrival sound...")
        arriveHasPlayed = "yes"
        return

	} else if (thisStation.destinationEnable && destinationHasPlayed === "no") { //sound has not been played but is wanted
		play.sound(map.pack.path + currentRoute.destinationSound) //so play sound
        console.log("Playing destination sound...")
		destinationHasPlayed = "yes" //and note that sound has played
        return

	} else if (thisStation.departureEnable && departHasPlayed === "no") {
		play.sound(map.pack.path + currentRoute.departureSound)
        console.log("Playing departure sound...")
		departHasPlayed = "yes"
        return

	} else { //if all sounds have been played or none were wanted
		destinationHasPlayed = "no"
		departHasPlayed = "no"
        stationHasPlayed = "no"
        arriveHasPlayed = "no"
        playNextStation()
        /*if(thisStation.id == currentRoute.lenght && activityProgress === 0) {
            console.log("You reached the end of the route.\n")
            currentRoute = "none"
            currentStation = 0
            totalStations = 0
            globalDstate = "In the menu..." 
            globalDdetails = "get the game on sim.bemined.nl" 
            globalDsmallimage = "smallnotfound" 
            globalDlargetext = "Current train: not available"
            globalDsmalltext = "Current line: not available"
        }*/

	}

}

function arraylist (object) {
    console.log("( " + object.id + " )   " + object.name)
}

function linelist (line) {
    console.log("\nLine: " + line)
    map.routes.filter(r => r.line === line).forEach(arraylist)
}

//READLINE

rl.on("line", function (msg) {
    if(msg === "/trains") trains.forEach(arraylist)
    if(msg.startsWith("/train ")) {
        let newmsg = msg.split(" ")
        let train = trains.find(t => t.id === newmsg[1])
        if(!train) return console.log("Please enter a valid train number from the /trains command")
        globalDlargeimage = train.img
        globalDlargetext = "Current train: " + train.name
        console.log("Selected " + train.name)
        updoot()
    }
    if(msg.startsWith("/eval ")) {
        var code = msg.split(" ").slice(1).join(" ")
        var result = eval(code)
        console.log(result)
    }
    if(msg.startsWith("/maps")) {
        fs.readdir("./maps/", function(err, items) {
            console.log("\nThese are the currently installed mappacks. Load one with /map load name; write name without the .mappack file extension\n")
            for (var i=0; i<items.length; i++) {
                console.log(items[i])
            }
        })
    }
    if(msg.startsWith("/map load ")) {
        let newmsg = msg.split(" ")
        if(newmsg[2] === "force") return
        let mappack = fs.readFileSync("./maps/" + newmsg[2] + ".mappack", "utf8")
        let danger = badstuff.exec(mappack)
        if(danger) {
            return console.log("\nWait a moment...\nThe file you attempted to load (./maps/" + newmsg[2] + ".mappack) contains pontentially malicous code.\n\nThe author of the code is trying to use a '" + danger[0] + "' function, which is non standard behaviour for a mappack file.\nI advise you to ensure the file does nothing bad before running it. You can ignore this error and run the file nonetheless with /map load force filename.\n\nIf you do not know what this is about please do not run the mappack file as it could damage your computer and find an alternative one instead!\n")
        } else {
            map = require("./maps/" + newmsg[2] + ".mappack")
            console.log(`\nMap info for ${newmsg[2]}.mappack:\nName: ${map.map.name}\nAuthor: ${map.pack.author}\n\nThe map has the following routes\nSelect a route with /route [route number].`)
            map.map.lines.forEach(linelist)
            console.log("\n...Mappack successfully loaded!")
        }
    }
    if(msg.startsWith("/map load force ")) {
        let newmsg = msg.split(" ")
        map = require("./maps/" + newmsg[3] + ".mappack")
        console.log(`\nMap info for ${newmsg[3]}.mappack:\nName: ${map.map.name}\nAuthor: ${map.pack.author}\n\nThe map has the following routes\nSelect a route with /route [route number].`)
        map.map.lines.forEach(linelist)
        console.log("\n...Mappack successfully loaded!")
    }
    if(msg.startsWith("/route ")) {
        let newmsg = msg.split(" ")
        currentRoute = map.routes.find(r => r.id === newmsg[1])
        if(!currentRoute || currentRoute === "none") return console.log("An error occured: no route was found under specified route number!")    
        globalStarttime = Date.now() 
        totalStations = currentRoute.length
        globalDdetails = "\u2794 " + currentRoute.destsign
        globalDsmallimage = currentRoute.icon
        globalDsmalltext = "Current line: " + currentRoute.line
        currentStation = 1
        updoot()
        if(currentRoute.firstEnable) currentStation = 0
        console.log("\nstarted route " + currentRoute.name + "...\n")      
    }
    if(msg.startsWith("/routes")) map.map.lines.forEach(linelist)
    if(!msg && currentRoute != "none") playNextStation()
})
