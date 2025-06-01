import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Geo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lat: string;

  @Column()
  lng: string;
}
