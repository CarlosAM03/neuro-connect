import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/widgets/page_frame.dart';
import '../check_ins/check_in_repository.dart';
import 'goal_providers.dart';
import 'goal_repository.dart';

class GoalDetailPage extends ConsumerStatefulWidget {
  const GoalDetailPage({super.key, required this.id});
  final String id;
  @override
  ConsumerState<GoalDetailPage> createState() => _GoalDetailPageState();
}

class _GoalDetailPageState extends ConsumerState<GoalDetailPage> {
  bool _busy = false;
  Future<void> _operate(Future<void> Function() work) async {
    if (_busy) return;
    setState(() => _busy = true);
    try {
      await work();
      if (mounted) refreshGoal(ref, widget.id);
    } catch (error) {
      if (mounted) showFailure(context, error);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) => PageFrame(
    title: 'Detalle del objetivo',
    child: ref
        .watch(goalProvider(widget.id))
        .when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) =>
              ErrorView(error, () => refreshGoal(ref, widget.id)),
          data: (goal) => RefreshIndicator(
            onRefresh: () async {
              refreshGoal(ref, widget.id);
              await ref.read(goalProvider(widget.id).future);
            },
            child: ListView(
              padding: const EdgeInsets.all(24),
              physics: const AlwaysScrollableScrollPhysics(),
              children: [
                Text(
                  goal.title,
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                const SizedBox(height: 12),
                if (goal.description?.isNotEmpty == true) ...[
                  Text(goal.description!),
                  const SizedBox(height: 12),
                ],
                Text('Estado: ${statusLabel(goal.status)}'),
                if (goal.category?.isNotEmpty == true)
                  Text('Categoría: ${goal.category}'),
                if (goal.targetDate != null)
                  Text('Fecha objetivo: ${dateLabel(goal.targetDate!)}'),
                const SizedBox(height: 20),
                LinearProgressIndicator(
                  value: goal.progress / 100,
                  semanticsLabel: 'Progreso ${goal.progress}%',
                ),
                const SizedBox(height: 8),
                Text('Progreso actual: ${goal.progress}%'),
                const SizedBox(height: 20),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: [
                    FilledButton(
                      onPressed: _busy || goal.status != 'ACTIVE'
                          ? null
                          : () => context.go('/goals/${goal.id}/check-in'),
                      child: const Text('Registrar check-in'),
                    ),
                    OutlinedButton(
                      onPressed: _busy
                          ? null
                          : () => context.go('/goals/${goal.id}/edit'),
                      child: const Text('Editar objetivo'),
                    ),
                    for (final action in <String, String>{
                      if (goal.status == 'ACTIVE') 'PAUSED': 'Pausar objetivo',
                      if (goal.status != 'ACTIVE')
                        'ACTIVE': 'Reactivar objetivo',
                      if (goal.status != 'COMPLETED')
                        'COMPLETED': 'Marcar como completado',
                    }.entries)
                      OutlinedButton(
                        onPressed: _busy
                            ? null
                            : () => _operate(() async {
                                await ref.read(goalRepositoryProvider).update(
                                  goal.id,
                                  {'status': action.key},
                                );
                              }),
                        child: Text(action.value),
                      ),
                    TextButton(
                      onPressed: _busy
                          ? null
                          : () async {
                              if (!await confirmDeletion(
                                context,
                                '¿Eliminar este objetivo? También se eliminará su historial de check-ins.',
                              )) {
                                return;
                              }
                              if (!mounted) return;
                              await _operate(() async {
                                await ref
                                    .read(goalRepositoryProvider)
                                    .delete(goal.id);
                                if (context.mounted) context.go('/goals');
                              });
                            },
                      child: const Text('Eliminar objetivo'),
                    ),
                  ],
                ),
                if (goal.status != 'ACTIVE')
                  const Padding(
                    padding: EdgeInsets.only(top: 16),
                    child: Text(
                      'Reactiva el objetivo para registrar nuevos check-ins.',
                    ),
                  ),
                const SizedBox(height: 32),
                Text(
                  'Historial de check-ins',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 12),
                ref
                    .watch(historyProvider(goal.id))
                    .when(
                      loading: () =>
                          const Center(child: CircularProgressIndicator()),
                      error: (error, _) => ErrorView(
                        error,
                        () => ref.invalidate(historyProvider(goal.id)),
                      ),
                      data: (history) => Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          if (history.isEmpty)
                            const Text(
                              'Aún no hay check-ins. Registra el primero cuando quieras.',
                            ),
                          for (final item in history)
                            Card(
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      '${dateLabel(item.createdAt)} · ${TimeOfDay.fromDateTime(item.createdAt.toLocal()).format(context)}',
                                      style: Theme.of(context)
                                          .textTheme
                                          .titleMedium,
                                    ),
                                    Text(
                                      'Progreso: ${item.progress}% · Dificultad: ${item.difficulty}/5',
                                    ),
                                    Text(
                                      'Cumplimiento: ${completionLabel(item.completion)}',
                                    ),
                                    if (item.notes?.isNotEmpty == true)
                                      Padding(
                                        padding: const EdgeInsets.only(top: 8),
                                        child: Text(item.notes!),
                                      ),
                                    TextButton(
                                      onPressed: _busy
                                          ? null
                                          : () async {
                                              if (!await confirmDeletion(
                                                context,
                                                '¿Eliminar este check-in creado por error? El progreso actual puede cambiar si es el último registro.',
                                              )) {
                                                return;
                                              }
                                              if (!mounted) return;
                                              await _operate(
                                                () => ref
                                                    .read(
                                                      checkInRepositoryProvider,
                                                    )
                                                    .delete(goal.id, item.id),
                                              );
                                            },
                                      child: const Text('Eliminar check-in'),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
              ],
            ),
          ),
        ),
  );
}
