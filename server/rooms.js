import EventEmitter from 'events'
import {generateUniqueMemberName} from "./names.js";

const REMOVE_ROOM_AFTER = 5 * 60 * 60 * 1000 // milliseconds

const rooms = {};

// garbage collection of rooms
setInterval(() => {
    Object.entries(rooms).map(([roomName, room]) => {
        if (room.unusedSince !== null && (Date.now() - room.unusedSince) > REMOVE_ROOM_AFTER) {
            delete rooms[roomName]
        }
    })
}, REMOVE_ROOM_AFTER * 2)

function createRoomInstance(roomName) {
    return {
        roomName,
        members: [],
        state: 'paused',
        elapsed: 0,
        duration: null,
        sessionLabel: 'pomodoro',
        startTimestamp: null,
        updates: new EventEmitter(),
        unusedSince: null,
    }
}

function roomExists(roomName) {
    return roomName in rooms
}

export function getRoom(roomName) {
    if (!roomExists(roomName)) {
        rooms[roomName] = createRoomInstance(roomName)
        console.log(`added new room ${roomName}`)
    }
    return rooms[roomName]
}

/**
 *
 * @param roomName
 * @return a random generated name for the new member
 */
export function addMember(roomName) {
    const name = generateUniqueMemberName()
    const room = getRoom(roomName)
    room.members.push(name)
    console.log(`added member with name ${name} to room ${roomName}`)
    room.updates.emit('update', { type: 'join' })
    room.unusedSince = null
    return name
}

export function removeMember(roomName, memberName) {
    if (roomExists(roomName)) {
        const room = getRoom(roomName)
        const members = room.members
        const index = members.indexOf(memberName)
        if (index !== -1) {
            members.splice(index, 1)
        }
        room.updates.emit('update', { type: 'leave' })
        console.log(`removed member ${memberName} from ${roomName})`)

        if (room.members.length === 0) {
            room.unusedSince = Date.now()
        }
    }
}