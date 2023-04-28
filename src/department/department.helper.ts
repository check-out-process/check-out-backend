import fetch from 'node-fetch';
import { Department } from './department.entities';


export class DepartmentsHelper {
    public static async getDepartmentById(departmentId: string): Promise<Department>{
        const url = `http://localhost:3000/departments/${departmentId}`;
        const res = await fetch(url);
        const department : Department = await res.json();
        return department;
    }
}
