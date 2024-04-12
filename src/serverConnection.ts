export interface Room {
    roomName: string
    members: string[]
    state: 'paused' | 'running'
    // mode: 'pomodoro' | 'short-break' | 'long-break' // TODO implement
    duration: number
    elapsed: number
    startTimestamp: number
}

export interface ServerUpdate {
    type: 'init' | 'pause' | 'play' | 'set' | 'join' | 'leave'
    room: Room
    you: string
    serverTimestamp: number
}

let ws: WebSocket

function establishConnection() {
    const roomName = window.location.pathname.match(/\/room\/([a-zA-Z-_0-9]+)/)?.[1]
    if (!roomName) {
        return false
    }
    ws = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/ws/${roomName}`)
    return true
}

export default function setUpServerConnection(onUpdate: (update: ServerUpdate) => void) {
    if (!establishConnection()) {
        return { broadcastPlay() {}, broadcastPause() {}, broadcastSetDuration(durationInSeconds: number) {}}
    }

    ws.addEventListener('open', () => console.log("established connection to server!"))

    ws.addEventListener('message', event => {
        onUpdate?.(JSON.parse(event.data))
    })

    ws.addEventListener('close', event => {
        // try to reconnect
        console.log("Lost connection. Retrying in 1s.")
        setTimeout(establishConnection, 1000)
    })

    function broadcastPlay() {
        ws.send(JSON.stringify({type: 'play'}))
    }

    function broadcastPause() {
        ws.send(JSON.stringify({type: 'pause'}))
    }

    function broadcastSetDuration(durationInSeconds: number) {
        ws.send(JSON.stringify({type: 'set', newDuration: durationInSeconds}))
    }

    return { broadcastPlay, broadcastPause, broadcastSetDuration }
}