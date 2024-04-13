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

type OnUpdate = (update: ServerUpdate) => void
let ws: WebSocket
let onUpdateFn: OnUpdate

function establishConnection() {
    if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
        return true
    }

    const roomName = window.location.pathname.match(/\/room\/([a-zA-Z-_0-9]+)/)?.[1]
    if (!roomName) {
        return false
    }
    console.log("Trying to connect...")
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
    ws = new WebSocket(`${protocol}://${window.location.hostname}:${window.location.port}/ws/${roomName}`)

    ws.addEventListener('open', () => console.log("Established connection to server!"))

    ws.addEventListener('message', event => {
        onUpdateFn?.(JSON.parse(event.data))
    })

    ws.addEventListener('close', event => {
        console.log("Lost connection. Retrying in 1s.")
        setTimeout(establishConnection, 1000)
    })

    return true
}

export default function setUpServerConnection(onUpdate: OnUpdate) {
    if (!establishConnection()) {
        return { play() {}, pause() {}, setDuration(durationInSeconds: number) {}, highlightLabel(label: string) {}}
    }

    onUpdateFn = onUpdate

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