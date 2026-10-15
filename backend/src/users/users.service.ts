import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from '../auth/auth.dto';
import { appendAudit } from '../audit/audit';

export const safeUserSelect = {
  id: true,
  email: true,
  displayName: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async profile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }
  update(id: string, dto: UpdateProfileDto) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: { displayName: dto.displayName },
        select: safeUserSelect,
      });
      await appendAudit(tx, id, 'PROFILE_UPDATED', 'USER', id, {
        changedFields: ['displayName'],
      });
      return user;
    });
  }
}
