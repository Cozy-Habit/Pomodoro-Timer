import { uniqueNamesGenerator, adjectives, colors, animals, names } from 'unique-names-generator'

export function generateUniqueMemberName() {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: '-',
        style: 'lowerCase'
    })
}

export function generateUniqueRoomName() {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, colors, names],
        separator: '-',
        style: 'lowerCase'
    })
}