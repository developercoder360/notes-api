import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NoteService {
  constructor(private readonly prismaService: PrismaService) { }

  // 📝 Create a new note
  async create(createNoteDto: CreateNoteDto, userId: number) {
    return this.prismaService.note.create({
      data: {
        ...createNoteDto,
        userId,
      },
    });
  }

  // 📋 Get all notes of logged-in user
  async findAll(userId: number) {
    return this.prismaService.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 🔍 Get a single note by ID (with ownership check)
  async findOne(id: number, userId: number) {
    const note = await this.prismaService.note.findUnique({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return note;
  }

  // ✏️ Update note (only if belongs to user)
  async update(id: number, userId: number, updateNoteDto: UpdateNoteDto) {
    const note = await this.prismaService.note.findUnique({ where: { id } });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.userId !== userId) {
      throw new ForbiddenException('You cannot edit this note');
    }

    return this.prismaService.note.update({
      where: { id },
      data: { ...updateNoteDto },
    });
  }

  // ❌ Delete note (only if belongs to user)
  async remove(id: number, userId: number) {
    const note = await this.prismaService.note.findUnique({ where: { id } });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.userId !== userId) {
      throw new ForbiddenException('You cannot delete this note');
    }

    return this.prismaService.note.delete({
      where: { id },
    });
  }
}
