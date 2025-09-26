import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  prompt: string;

  @Column()
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  imagePath?: string;
  
  @Column({ nullable: true })
  generatedText?: string;
  
  @Column()
  userId: string;
  
  @Column({ nullable: true })
  error?: string;
}