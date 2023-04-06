import { Sector } from "./sectors.entities";
import fetch from 'node-fetch';

export class SectorsHelper{
    public static async getSectorById(sectorId: string): Promise<Sector>{
        const url = `http://localhost:3000/sectors/${sectorId}`;
        const res = await fetch(url);
        const sector : Sector = await res.json();
        return sector;
    }
}