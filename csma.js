packets = []
notifications = []
elapsedTime = 0
con = null

function sendPacket(source, destination) {
	if (source.id == destination.id) {
		console.log("Source and destination cannot be same")
		con.append("Source and destination cannot be same<br/>")
		return;
	}
	if (packets.length > 0) {
		console.log("Network is occupied. Collision imminent.")
		con.append("Network is occupied. Collision imminent.<br/>")
	}
	packets.push({source: source, destination: destination, position: source.distance, time: elapsedTime})
}

function hasPacketPassedThrough(distance) {
	for (var i = 0; i < packets.length; i++) {
		var distanceTravelled = Math.abs(packets[i].position - packets[i].source.distance)
		if (Math.abs(packets[i].source.distance - distance) <= distanceTravelled && packets[i].source.distance != packets[i].position)
			return true
	}
	return false
}

function checkNotifications() {
	for (var i = 0; i < notifications.length; i++) {
		if (elapsedTime == notifications[i].time) {
			console.log(notifications[i].message + " at time " + elapsedTime)
			con.append(notifications[i].message + " at time " + elapsedTime + "<br />")
			notifications.splice(i, 1)
		}
	}
}

function getFromToString(packet) {
	return "from " + packet.source.id + " to " + packet.destination.id
}

function tick() {
	checkNotifications()
	packets.sort(function(a, b) {
		return ((a.position < b.position) ? -1 : ((a.position > b.position) ? 1 : 0))
	})
	for (var i = 0; i < packets.length - 1; i++) {
		packets[i].position += (parseInt(packets[i].source.id) > parseInt(packets[i].destination.id)) ? -1 : 1
		if (packets[i].position == packets[i + 1].position) {
			console.log("Collision of packet " + getFromToString(packets[i]) + " occured at time " + elapsedTime)
			con.append("Collision of packet " + getFromToString(packets[i]) + " occured at time " + elapsedTime + "<br />")
			notifications.push({time: elapsedTime + Math.abs(packets[i].position - packets[i].source.distance), message: packets[i].source.id + " realizes collision"})
			notifications.push({time: elapsedTime + Math.abs(packets[i + 1].position - packets[i + 1].source.distance), message: packets[i + 1].source.id + " realizes collision"})
			packets.splice(i, 2)
		}
	}

	if (packets.length == 1) {
		packets[0].position += (parseInt(packets[0].source.id) > parseInt(packets[0].destination.id)) ? -1 : 1
	}
	
	if (packets.length == 1 && packets[0].position == packets[0].destination.distance) {
		console.log("Packet transmitted succesfully " + getFromToString(packets[0]))
		con.append("Packet transmitted succesfully " + getFromToString(packets[0]) + "<br />")
		packets.splice(0, 1)
	}
	
	elapsedTime ++
}