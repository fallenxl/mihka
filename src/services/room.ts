import data from "@/data/floors.json";

export function getRoomById(roomId: string) {
    for (const floor of data) {
        const room = floor.rooms.find((room) => room.id === roomId);
        if (room) {
        return room;
        }
    }
    return null;
}

export function getFloorBySlug(slug: string) {
    return data.find((floor) => floor.slug === slug);
}