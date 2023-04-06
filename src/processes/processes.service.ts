import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Process, ProcessType } from './processes.entities';

@Injectable()
export class ProcessesService {
    constructor(
        @Inject('PROCESS_REPOSITORY')
        private processesRepo : Repository<Process>,

        @Inject('PROCESS_TYPE_REPOSITORY')
        private processTypesRepo : Repository<ProcessType>
    ) {}
}
