import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TipoUsuario } from './tipo-usuario.entity';

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

  // Tené en cuenta que tu esquema usa BIGINT; acá usamos string o number
  @Column({ name: 'num_telefono', type: 'bigint', nullable: true })
  num_telefono?: number;

  @Column({ name: 'cod_area', type: 'integer', nullable: true })
  cod_area?: number;

  @Column({ name: 'password_hash', length: 256, nullable: true })
  passwordHash?: string;

  @ManyToOne(() => TipoUsuario, t => t.usuarios, { eager: true })
  @JoinColumn({ name: 'tipo_usuario_id' })
  tipoUsuario: TipoUsuario;
}
