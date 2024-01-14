/* eslint-disable prettier/prettier */
import { UserService } from './user.service';
// import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { MyGuards } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { UpdateUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
@ApiTags('User')
@Controller('user')
@UseGuards(MyGuards)
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  async getAllUser() {
    return await this.userService.getAllUsers();
  }
  // @Post('upload-file')
  // @UseInterceptors(
  //   FileInterceptor('avatar', {
  //     storage: storageConfig('avatar'),
  //     fileFilter: (req, file, cb) => {
  //       const ext = extname(file.originalname);
  //       const allowedExtArr = ['.jpg', '.png', '.jpeg'];
  //       if (!allowedExtArr.includes(ext)) {
  //         req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
  //         cb(null, false);
  //       } else {
  //         const fileSize = parseInt(req.headers['content-length']);
  //         if (fileSize > 1024 * 1024 * 10) {
  //           req.fileValidationError =
  //             'File size is too large. Accepted file size is less than 5 MB';
  //           cb(null, false);
  //         } else {
  //           cb(null, true);
  //         }
  //       }
  //     },
  //   }),
  // )
  // async uploadPhoto(
  //   @GetUser('id') id: number,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   if (!file) {
  //     throw new BadRequestException('File is required');
  //   }
  //   return await this.userService.uploadImage(
  //     id,
  //     file,
  //     file.destination + '/' + file.filename,
  //   );
  // }

  @Get('/pictures/:filename')
  async getImage(@Param('filename') filename: any, @Res() res: Response) {
    return res.sendFile(filename, { root: './uploads' });
  }

  @Get('me')
  async me(@GetUser('id') id: number) {
    return await this.userService.getCurrentUser(id);
  }

  @Get('name')
  async getUserByName(@Body('name') name: string) {
    return await this.userService.getUserByName(name);
  }

  // tại sao cái này cần bỏ ở dưới cùng??
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserById(id);
  }

  @Patch()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storageConfig('avatar'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 10) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5 MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  async updateUser(
    @GetUser('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateUserDto.avatar = file.destination + '/' + file.filename;
    }
    return await this.userService.updateUser(id, { ...updateUserDto });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: any) {
    return await this.userService.deleteUser(id);
  }
}
