import express from 'express'
import expressWs from 'express-ws'
import { fileURLToPath } from 'url'
import path from 'path'
import {addMember, getRoom, removeMember} from "./server/rooms.js";
import {generateUniqueRoomName} from "./server/names.js";

const ROOM_NAME_MIN_LENGTH = 5

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
expressWs(app)

app.use('/dist', express.static('dist'))
app.use('/img', express.static('img'))
app.use('/css', express.static('css'))
app.use('/sound', express.static('sound'))


app.get('/room/:roomName', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/', (req, res) => {
    const roomName = generateUniqueRoomName()
    res.redirect(`/room/${roomName}`)
})

function createMessage(memberName, room) {
    const r = {...room}
    delete r.updates
    return {
        room: r,
        you: memberName,
        serverTimestamp: Date.now()
    }
}

app.ws("/ws/:roomName", (ws, req) => {
    const roomName = req.params.roomName
    if (roomName.length < ROOM_NAME_MIN_LENGTH) {
        console.log("ERROR: room name to short")
        ws.send(JSON.stringify({ error: `room name to short. Have at least ${ROOM_NAME_MIN_LENGTH} characters` }))
        ws.close()
    }
    const memberName = addMember(roomName)
    const room = getRoom(roomName)

    ws.send(JSON.stringify(createMessage(memberName, room)))

    room.updates.on('update', room => {
        ws.send(JSON.stringify(createMessage(memberName, room)))
    })

    ws.on('message', msg => {
        const json = JSON.parse(msg)
        console.log(`${memberName} sent ${msg}`)
    })

    ws.on('close', () => {
        console.log("close")
        removeMember(roomName, memberName)
    })
})

const port = 5000;
app.listen(port, () => { console.log(`server running on http://localhost:${port}`) })