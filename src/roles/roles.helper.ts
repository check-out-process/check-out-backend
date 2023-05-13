
import { Role } from './roles.entities';
import fetch from 'node-fetch';

export class RolesHelper{
    public static async getRoleById(roleId: string): Promise<Role>{
        const url = `http://localhost:8080/roles/${roleId}`;
        const res = await fetch(url);
        const role : Role = await res.json();
        return role;
    }
}