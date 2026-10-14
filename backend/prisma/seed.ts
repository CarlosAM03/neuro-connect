import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
const prisma = new PrismaClient();
async function seed() {
  if (process.env.NODE_ENV === 'production')
    throw new Error('Demo seed is disabled in production');
  const password = process.env.SEED_PASSWORD;
  if (!password || password.length < 8)
    throw new Error('Set SEED_PASSWORD (8+ characters) locally');
  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
  const day = 86400000;
  const anchor = new Date();
  anchor.setUTCHours(12, 0, 0, 0);
  const cases = [
    {
      title: 'Organizar las entregas',
      values: [10, 20, 35, 45, 60],
      days: [27, 20, 13, 6, 1],
    },
    {
      title: 'Mantener mi agenda',
      values: [45, 46, 45, 46, 47],
      days: [27, 20, 13, 6, 1],
    },
    {
      title: 'Retomar la lectura',
      values: [10, 20, 25, 30, 35],
      days: [42, 35, 28, 21, 14],
    },
  ];
  await prisma.$transaction(async (tx) => {
    const owner = await tx.user.upsert({
      where: { email: 'demo@neuroconnect.local' },
      create: {
        email: 'demo@neuroconnect.local',
        displayName: 'Cuenta de demostración',
        passwordHash,
      },
      update: { displayName: 'Cuenta de demostración', passwordHash },
    });
    for (let g = 0; g < cases.length; g++) {
      const item = cases[g];
      const id = `00000000-0000-4000-8000-${String(g + 1).padStart(12, '0')}`;
      const existing = await tx.goal.findUnique({ where: { id } });
      if (existing && existing.ownerId !== owner.id)
        throw new Error('Seed ID collision; no changes applied');
      await tx.goal.upsert({
        where: { id },
        create: {
          id,
          ownerId: owner.id,
          title: item.title,
          category: 'Demostración',
          progress: item.values[4],
        },
        update: {
          title: item.title,
          status: 'ACTIVE',
          progress: item.values[4],
        },
      });
      await tx.checkIn.deleteMany({ where: { goalId: id } });
      for (let i = 0; i < item.values.length; i++) {
        await tx.checkIn.create({
          data: {
            id: `00000000-0000-4000-9000-${String(g * 10 + i + 1).padStart(12, '0')}`,
            goalId: id,
            progress: item.values[i],
            difficulty: 2 + (i % 3),
            completion: i === 4 ? 'MET' : 'PARTIAL',
            notes: 'Registro sintético de demostración',
            createdAt: new Date(anchor.getTime() - item.days[i] * day),
          },
        });
      }
    }
  });
  console.log(
    'Seed complete: one demo account, three goals, five check-ins each. Re-run replaces only these demo histories.',
  );
}
seed()
  .catch(() => {
    console.error(
      'Seed failed; verify local configuration and database availability.',
    );
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
