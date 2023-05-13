import fetch from 'node-fetch';
import { Room } from './rooms.entities';


export class RoomsHelper {
    public static async getRoomById(departmentId: string, roomId: string): Promise<Room>{
        const url = `http://localhost:8080/departments/${departmentId}/rooms/${roomId}`;
        const res = await fetch(url);
        const room : Room = await res.json();
        return room;
    }
}
