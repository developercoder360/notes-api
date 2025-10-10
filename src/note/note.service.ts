import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NoteService {

  constructor(private readonly prismaService: PrismaService) { }


  create(createNoteDto: CreateNoteDto, userId: number) { // Create a new note

    console.log('createNoteDto', createNoteDto, userId);

    return this.prismaService.note.create({ data: { ...createNoteDto, userId } });
  }

  findAll() {
    return `This action returns all note`;
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
