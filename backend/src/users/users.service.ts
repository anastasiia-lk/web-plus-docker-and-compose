import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;
    const user = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (user) {
      throw new ConflictException('Пользователь уже существует');
    }

    const hash = await this.hashService.generate(password);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hash,
    });

    return this.userRepository.save(newUser);
  }

  getByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const { email, username, password } = updateUserDto;
    const isExist = !!(await this.userRepository.findOne({
      where: [{ email }, { username }],
    }));

    if (isExist) throw new ConflictException('Пользователь уже существует');

    const user = await this.userRepository.findOne({ where: { id } });

    if (password) {
      updateUserDto.password = await this.hashService.generate(password);
    }

    const updatedUser = { ...user, ...updateUserDto };
    await this.userRepository.update(id, updatedUser);

    return this.userRepository.findOne({ where: { id } });
  }

  findByUsernameOrEmail(query: string) {
    return this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }

  async getUserWishes(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        wishes: { owner: true },
      },
    });

    return user.wishes;
  }

  async getAnotherUserWishes(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: {
        wishes: true,
      },
    });

    return user.wishes;
  }

  findOne(query: FindOneOptions<User>) {
    return this.userRepository.findOne(query);
  }
}
