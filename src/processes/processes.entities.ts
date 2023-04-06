import { User } from "src/users/users.entities";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Process {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToOne(() => ProcessType, {eager: true})
    @JoinColumn()
    processType: ProcessType;

    @OneToOne(() => User, {eager: true})
    @JoinColumn()
    creatingUser: User;

    @CreateDateColumn({type: 'datetime'})
    createdAt: Date;

    @Column({
        type: 'datetime',
        nullable: true,
      })
    @Index()
    endedAt: Date;
}

@Entity()
export class ProcessType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}