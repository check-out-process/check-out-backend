import { IsOptional } from "class-validator";
import { User } from "src/users/users.entities";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Token {
    @PrimaryColumn({unique: true})
    id : string;

    @Column()
    token : string;

    @ManyToOne(() => User, (user)=> user.tokens)
    @JoinColumn({ name: 'userId', referencedColumnName: 'id'})
    @IsOptional()
    userId: number;
}