import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../users/entities/user.entity';
import { Address } from '../users/entities/address.entity';
import { Company } from '../users/entities/company.entity';
import { Geo } from '../users/entities/geo.entity';
import { Auth } from '../auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address, Company, Geo, Auth])],
  providers: [SeedService],
})
export class SeedModule {}
