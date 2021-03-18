import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';
import uploadConfig from '@config/upload';

// KISS - Keep It Simple & Stupid

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url'})
  getAvatar_url(): string | null {
    //verifica se avatar não existe
    if(!this.avatar){
      return null;
    }

    switch (uploadConfig.driver) {
      case 'diskStorage':
        return `${process.env.APP_API_URL}/files/${this.avatar}`;
        break;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.us-east-2.amazonaws.com/${this.avatar}`;
        break;
      default:
        return null;
    }
  }
}

export default User;
