import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('modulo-contabilidad')
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;
}
