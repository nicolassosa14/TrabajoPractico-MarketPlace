import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity({ name: 'direcciones' })
export class Direccion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, u => u.direcciones, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ length: 200 })
  calle: string;

  @Column({ type: 'int' })
  altura: number;

  @Column({ length: 100 })
  ciudad: string;

  @Column({ length: 100 })
  provincia: string;

  @Column({ length: 100, default: 'Argentina' })
  pais: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitud?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitud?: number;

  @Column({ type: 'text', nullable: true })
  instrucciones_entrega?: string;
}
