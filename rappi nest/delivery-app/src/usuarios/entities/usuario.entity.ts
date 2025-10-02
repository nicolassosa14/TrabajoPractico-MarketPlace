import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TipoUsuario } from './tipo-usuario.entity';
import { Direccion } from '../../direcciones/entities/direccion.entity';


@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100, nullable: true })
  apellido?: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ name: 'num_telefono', type: 'bigint', nullable: true })
  num_telefono?: number;

  @Column({ name: 'cod_area', type: 'integer', nullable: true })
  cod_area?: number;

  @Column({ name: 'password_hash', length: 256, nullable: true })
  passwordHash?: string;

  @ManyToOne(() => TipoUsuario, t => t.usuarios, { eager: true })
  @JoinColumn({ name: 'tipo_usuario_id' })
  tipoUsuario: TipoUsuario;

  @OneToMany(() => Direccion, d => d.usuario)
  direcciones: Direccion[];
}
