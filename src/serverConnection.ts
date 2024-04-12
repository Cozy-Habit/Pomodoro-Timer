
export interface Room {
    roomName: string,
    members: string[],
    state: 'paused' | 'running',
    duration: number,
    startTimestamp: number,
}

export interface ServerUpdate {
    room: Room,
    you: string,
    serverTimestamp: number
}
export default function setUpServerConnection(onUpdate: (update: ServerUpdate) => void) {
    const roomName = window.location.pathname.match(/\/room\/([a-zA-Z-_0-9]+)/)?.[1]
    if (!roomName) {
        return
    }

    const ws = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/ws/${roomName}`)
    ws.addEventListener('message', event => {
        console.log("message!!")
        onUpdate?.(JSON.parse(event.data))
    })
}