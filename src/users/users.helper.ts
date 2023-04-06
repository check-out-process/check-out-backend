import fetch from 'node-fetch';
import { User } from './users.entities';

export class UsersHelper{
    public static async getUserById(userId: number): Promise<User>{
        const url = `http://localhost:3000/users/${userId}`;
        const res = await fetch(url);
        const user : User = await res.json();
        return user;
    }
}