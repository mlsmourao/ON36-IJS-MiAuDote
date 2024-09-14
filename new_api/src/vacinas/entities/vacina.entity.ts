import { Veterinario } from 'src/veterinarios/entities/veterinario.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vacinas')
export class Vacina {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    animal_id: number;

    @Column()
    data_vacinacao: Date;

    @Column({ length: 255 })
    tipo_vacina: string;

    @Column()
    veterinario_id: number;

    @Column()
    gasto_id: number;

    @ManyToOne(() => Veterinario, (veterinario) => veterinario.vacinas)
    @JoinColumn({ name: 'veterinario_id' })
    veterinario: Veterinario;
}
