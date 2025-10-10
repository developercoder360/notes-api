import { Injectable, UseGuards } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Injectable()
export class NoteService {

  constructor(private readonly prismaService: PrismaService) { }


  create(createNoteDto: CreateNoteDto, userId: number) { // Create a new note

    console.log('createNoteDto', createNoteDto, userId);

    return this.prismaService.note.create({ data: { ...createNoteDto, userId } });
  }

  @UseGuards(AuthGuard)
  findAll() {
    return this.prismaService.note.findMany();  
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
