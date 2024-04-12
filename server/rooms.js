import EventEmitter from 'events'
import {generateUniqueMemberName} from "./names.js";

const rooms = {};

function createRoomInstance(roomName) {
    return {
        roomName,
        members: [],
        state: 'paused',
        elapsed: 0,
        duration: null,
        startTimestamp: null,
        updates: new EventEmitter()
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

        // FIXME remove unused rooms... but delayed so you can come back
        // if (room.members.length === 0) {
        //     delete rooms[roomName]
        // }
    }
}