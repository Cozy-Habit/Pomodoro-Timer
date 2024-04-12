export interface Room {
    roomName: string
    members: string[]
    state: 'paused' | 'running'
    sessionLabel: 'pomodoro' | 'short-break' | 'long-break'
    duration: number
    elapsed: number
    startTimestamp: number
}

export interface ServerUpdate {
    type: 'init' | 'pause' | 'play' | 'set' | 'setLabel' | 'join' | 'leave'
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
        return { play() {}, pause() {}, setDuration(durationInSeconds: number) {}, highlightLabel(label: string) {}}
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

    function play() {
        ws.send(JSON.stringify({type: 'play'}))
    }

    function pause() {
        ws.send(JSON.stringify({type: 'pause'}))
    }

    function setDuration(durationInSeconds: number) {
        ws.send(JSON.stringify({type: 'set', newDuration: durationInSeconds}))
    }

    function highlightLabel(label: string) {
        ws.send(JSON.stringify({type: 'setLabel', sessionLabel: label}))
    }

    return { play, pause, setDuration, highlightLabel }
}