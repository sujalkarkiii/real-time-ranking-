import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class polls{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column()
    pollId:string


    @Column('simple-array')
    nominees: string[]
}{}