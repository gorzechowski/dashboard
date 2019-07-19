import {Entity, Column, PrimaryColumn} from 'typeorm';

@Entity()
export class Setting {

    @PrimaryColumn({ nullable: false })
    public name: string;

    @Column({ nullable: false })
    public value: string;

    @Column({ nullable: false })
    public type: string;
}
