
import fetch from 'node-fetch';
import { Job } from './jobs.entities';

export class JobsHelper{
    public static async getJobById(jobID: string): Promise<Job>{
        const url = `http://localhost:3000/jobs/${jobID}`;
        const res = await fetch(url);
        const job : Job = await res.json();
        return job;
    }
}