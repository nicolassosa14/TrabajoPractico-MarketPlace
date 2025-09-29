import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity({ name: 'tipos_usuario' })
export class TipoUsuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  nombre: string;

  @OneToMany(() => Usuario, u => u.tipoUsuario)
  usuarios: Usuario[];
}
