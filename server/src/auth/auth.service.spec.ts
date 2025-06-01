import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockAuthRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(() => 'test-token'),
};

const mockUsersService = {};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Auth),
          useValue: mockAuthRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Reset mock function calls after each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw UnauthorizedException if user exists', async () => {
      mockAuthRepository.findOne.mockResolvedValue({ id: 1 });

      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAuthRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
    });

    it('should create a new user if not exists', async () => {
      mockAuthRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      mockAuthRepository.create.mockReturnValue({
        email: 'test@example.com',
        name: 'Test User',
        password_hash: 'hashed_password',
      });

      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockAuthRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        password_hash: 'hashed_password',
      });
      expect(mockAuthRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ message: 'User registered successfully' });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockAuthRepository.findOne.mockResolvedValue(null);

      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAuthRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockAuthRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password_hash: 'hashed_password',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const loginDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrong_password',
        'hashed_password',
      );
    });

    it('should return access token if credentials are valid', async () => {
      mockAuthRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password_hash: 'hashed_password',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await service.login(loginDto);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: 'test@example.com',
        sub: 1,
      });
      expect(result).toEqual({ access_token: 'test-token' });
    });
  });
});
