import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Address } from './entities/address.entity';
import { Company } from './entities/company.entity';
import { Geo } from './entities/geo.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Geo)
    private geoRepository: Repository<Geo>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Create geo
    const geo = this.geoRepository.create({
      lat: createUserDto.address.geo.lat,
      lng: createUserDto.address.geo.lng,
    });
    await this.geoRepository.save(geo);

    // Create address
    const address = this.addressRepository.create({
      street: createUserDto.address.street,
      suite: createUserDto.address.suite,
      city: createUserDto.address.city,
      zipcode: createUserDto.address.zipcode,
      geo,
    });
    await this.addressRepository.save(address);

    // Create company
    const company = this.companyRepository.create({
      name: createUserDto.company.name,
      catchPhrase: createUserDto.company.catchPhrase,
      bs: createUserDto.company.bs,
    });
    await this.companyRepository.save(company);

    // Create user
    const user = this.usersRepository.create({
      name: createUserDto.name,
      username: createUserDto.username,
      email: createUserDto.email,
      phone: createUserDto.phone,
      website: createUserDto.website,
      address,
      company,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Update address if provided
    if (updateUserDto.address) {
      // Update geo if provided
      if (updateUserDto.address.geo) {
        await this.geoRepository.update(user.address.geo.id, {
          lat: updateUserDto.address.geo.lat,
          lng: updateUserDto.address.geo.lng,
        });
      }

      await this.addressRepository.update(user.address.id, {
        street: updateUserDto.address.street,
        suite: updateUserDto.address.suite,
        city: updateUserDto.address.city,
        zipcode: updateUserDto.address.zipcode,
      });
    }

    // Update company if provided
    if (updateUserDto.company) {
      await this.companyRepository.update(user.company.id, {
        name: updateUserDto.company.name,
        catchPhrase: updateUserDto.company.catchPhrase,
        bs: updateUserDto.company.bs,
      });
    }

    // Update user
    await this.usersRepository.update(id, {
      name: updateUserDto.name,
      username: updateUserDto.username,
      email: updateUserDto.email,
      phone: updateUserDto.phone,
      website: updateUserDto.website,
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
