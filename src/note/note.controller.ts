import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/notes')
@UseGuards(AuthGuard) // Apply guard globally on controller level
export class NoteController {
  constructor(private readonly noteService: NoteService) { }

  // POST /api/notes
  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Request() req: any) {
    const userId = req.user?.sub;
    return this.noteService.create(createNoteDto, userId);
  }

  // GET /api/notes
  @Get()
  findAll(@Request() req: any) {
    const userId = req.user?.sub;
    return this.noteService.findAll(userId);
  }

  // GET /api/notes/:id
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.sub;
    return this.noteService.findOne(+id, userId);
  }

  // PATCH /api/notes/:id
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req: any,
  ) {
    const userId = req.user?.sub;
    return this.noteService.update(+id, userId, updateNoteDto);
  }

  // DELETE /api/notes/:id
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.sub;
    return this.noteService.remove(+id, userId);
  }
}
