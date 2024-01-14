/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';
import { use } from 'passport';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getAllUsers() {
    const users = await this.prismaService.user.findMany();
    return users;
  }

  async getCurrentUser(id: number) {
    const currentUser = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    delete currentUser.hashPassword;
    return currentUser;
  }

  async getUserById(id: number) {
    const idc = Number(id);
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: idc,
        },
      });
      if (!user) throw new ForbiddenException('not found user in db');
      delete user.hashPassword;
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByName(name: string): Promise<User[]> {
    const users: User[] = await this.prismaService.user.findMany({
      where: {
        userName: {
          contains: name,
        },
      },
    });
    return users;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const nid = Number(id);
    const user = await this.prismaService.user.findUnique({
      where: {
        id: nid,
      },
    });
    if (!user) throw new ForbiddenException('Not found user');
    const userUpdate = await this.prismaService.user.update({
      where: {
        id: nid,
      },
      data: {
        ...updateUserDto,
      },
    });
    return userUpdate;
  }

  async deleteUser(id: any) {
    const nid = Number(id);
    try {
      const deleteUser = await this.prismaService.user.delete({
        where: {
          id: nid,
        },
      });
      if (!deleteUser) throw new ForbiddenException('not found user');
      return deleteUser;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
  // async updateUserImage(userId: number, imageID: number) {
  //   const user = await this.prismaService.user.findUnique({
  //     where: {
  //       id: userId,
  //     },
  //   });
  //   if (!user) throw new ForbiddenException('not found user');
  //   const image = await this.prismaService.image.findUnique({
  //     where: {
  //       id: imageID,
  //     },
  //   });
  //   await this.prismaService.user.update({
  //     where: {
  //       id: userId,
  //     },
  //     data: {
  //       avatar: image.filepath,
  //     },
  //   });
  // }

  async uploadImage(userId: number, file: Express.Multer.File, avatar: string) {
    const createdFile = await this.prismaService.image.create({
      data: { filename: file.filename, filepath: avatar, userId },
    });
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException('not found user');
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar: file.path,
      },
    });
    return createdFile;
  }
}
