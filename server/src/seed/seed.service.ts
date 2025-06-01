import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Address } from '../users/entities/address.entity';
import { Company } from '../users/entities/company.entity';
import { Geo } from '../users/entities/geo.entity';
import { Auth } from '../auth/entities/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Geo)
    private geoRepository: Repository<Geo>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async onModuleInit() {
    const userCount = await this.usersRepository.count();
    if (userCount === 0) {
      this.logger.log('Seeding database...');
      await this.seedUsers();
      await this.seedAuth();
      this.logger.log('Database seeded successfully');
    } else {
      this.logger.log('Database already seeded');
    }
  }

  private async seedUsers() {
    const jsonPlaceholderUsers = [
      {
        id: 1,
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'Sincere@april.biz',
        address: {
          street: 'Kulas Light',
          suite: 'Apt. 556',
          city: 'Gwenborough',
          zipcode: '92998-3874',
          geo: {
            lat: '-37.3159',
            lng: '81.1496',
          },
        },
        phone: '1-770-736-8031 x56442',
        website: 'hildegard.org',
        company: {
          name: 'Romaguera-Crona',
          catchPhrase: 'Multi-layered client-server neural-net',
          bs: 'harness real-time e-markets',
        },
      },
      {
        id: 2,
        name: 'Ervin Howell',
        username: 'Antonette',
        email: 'Shanna@melissa.tv',
        address: {
          street: 'Victor Plains',
          suite: 'Suite 879',
          city: 'Wisokyburgh',
          zipcode: '90566-7771',
          geo: {
            lat: '-43.9509',
            lng: '-34.4618',
          },
        },
        phone: '010-692-6593 x09125',
        website: 'anastasia.net',
        company: {
          name: 'Deckow-Crist',
          catchPhrase: 'Proactive didactic contingency',
          bs: 'synergize scalable supply-chains',
        },
      },
      {
        id: 3,
        name: 'Clementine Bauch',
        username: 'Samantha',
        email: 'Nathan@yesenia.net',
        address: {
          street: 'Douglas Extension',
          suite: 'Suite 847',
          city: 'McKenziehaven',
          zipcode: '59590-4157',
          geo: {
            lat: '-68.6102',
            lng: '-47.0653',
          },
        },
        phone: '1-463-123-4447',
        website: 'ramiro.info',
        company: {
          name: 'Romaguera-Jacobson',
          catchPhrase: 'Face to face bifurcated interface',
          bs: 'e-enable strategic applications',
        },
      },
      {
        id: 4,
        name: 'Patricia Lebsack',
        username: 'Karianne',
        email: 'Julianne.OConner@kory.org',
        address: {
          street: 'Hoeger Mall',
          suite: 'Apt. 692',
          city: 'South Elvis',
          zipcode: '53919-4257',
          geo: {
            lat: '29.4572',
            lng: '-164.2990',
          },
        },
        phone: '493-170-9623 x156',
        website: 'kale.biz',
        company: {
          name: 'Robel-Corkery',
          catchPhrase: 'Multi-tiered zero tolerance productivity',
          bs: 'transition cutting-edge web services',
        },
      },
      {
        id: 5,
        name: 'Chelsey Dietrich',
        username: 'Kamren',
        email: 'Lucio_Hettinger@annie.ca',
        address: {
          street: 'Skiles Walks',
          suite: 'Suite 351',
          city: 'Roscoeview',
          zipcode: '33263',
          geo: {
            lat: '-31.8129',
            lng: '62.5342',
          },
        },
        phone: '(254)954-1289',
        website: 'demarco.info',
        company: {
          name: 'Keebler LLC',
          catchPhrase: 'User-centric fault-tolerant solution',
          bs: 'revolutionize end-to-end systems',
        },
      },
    ];

    for (const userData of jsonPlaceholderUsers) {
      // Create geo
      const geo = this.geoRepository.create({
        lat: userData.address.geo.lat,
        lng: userData.address.geo.lng,
      });
      await this.geoRepository.save(geo);

      // Create address
      const address = this.addressRepository.create({
        street: userData.address.street,
        suite: userData.address.suite,
        city: userData.address.city,
        zipcode: userData.address.zipcode,
        geo,
      });
      await this.addressRepository.save(address);

      // Create company
      const company = this.companyRepository.create({
        name: userData.company.name,
        catchPhrase: userData.company.catchPhrase,
        bs: userData.company.bs,
      });
      await this.companyRepository.save(company);

      // Create user
      const user = this.usersRepository.create({
        name: userData.name,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        website: userData.website,
        address,
        company,
      });
      await this.usersRepository.save(user);
    }
  }

  private async seedAuth() {
    // Create a default admin user for testing
    const passwordHash = await bcrypt.hash('password123', 10);
    const auth = this.authRepository.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password_hash: passwordHash,
    });
    await this.authRepository.save(auth);
  }
}
