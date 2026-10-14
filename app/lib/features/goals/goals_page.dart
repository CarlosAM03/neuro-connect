import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/widgets/page_frame.dart';
import 'goal_providers.dart';
import 'goal_repository.dart';

class GoalsPage extends ConsumerWidget {
  const GoalsPage({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) => PageFrame(
    title: 'Mis objetivos',
    actions: [
      TextButton.icon(
        onPressed: () => context.go('/goals/new'),
        icon: const Icon(Icons.add),
        label: const Text('Nuevo objetivo'),
      ),
    ],
    child: ref
        .watch(goalsProvider)
        .when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) =>
              ErrorView(error, () => ref.invalidate(goalsProvider)),
          data: (goals) => RefreshIndicator(
            onRefresh: () => ref.refresh(goalsProvider.future),
            child: ListView(
              padding: const EdgeInsets.all(24),
              physics: const AlwaysScrollableScrollPhysics(),
              children: [
                if (goals.isEmpty)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 64),
                    child: Text(
                      'Aún no tienes objetivos. Crea uno para comenzar tu seguimiento.',
                      textAlign: TextAlign.center,
                    ),
                  ),
                for (final goal in goals)
                  Card(
                    child: InkWell(
                      onTap: () => context.go('/goals/${goal.id}'),
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              goal.title,
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            const SizedBox(height: 8),
                            Text(statusLabel(goal.status)),
                            if (goal.category != null &&
                                goal.category!.isNotEmpty)
                              Text(goal.category!),
                            if (goal.targetDate != null)
                              Text(
                                'Fecha objetivo: ${dateLabel(goal.targetDate!)}',
                              ),
                            const SizedBox(height: 16),
                            LinearProgressIndicator(
                              value: goal.progress / 100,
                              semanticsLabel: 'Progreso ${goal.progress}%',
                            ),
                            const SizedBox(height: 8),
                            Text('${goal.progress}%'),
                          ],
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
  );
}
