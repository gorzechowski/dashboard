import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Tab {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false })
    public qml: string;

    @Column({ nullable: false, unsigned: true })
    public index: number;
}
