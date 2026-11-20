import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/widgets/page_frame.dart';
import 'goal_providers.dart';
import 'goal_repository.dart';

class GoalsPage extends ConsumerStatefulWidget {
  const GoalsPage({super.key});
  @override
  ConsumerState<GoalsPage> createState() => _GoalsPageState();
}

class _GoalsPageState extends ConsumerState<GoalsPage> {
  String? _status;
  String _query = '';
  bool _alphabetical = false;

  List<Goal> _visible(List<Goal> goals) {
    final query = _query.trim().toLowerCase();
    final result = goals
        .where(
          (goal) =>
              (_status == null || goal.status == _status) &&
              ('${goal.title} ${goal.category ?? ''}'.toLowerCase().contains(
                query,
              )),
        )
        .toList();
    if (_alphabetical) {
      result.sort(
        (a, b) => a.title.toLowerCase().compareTo(b.title.toLowerCase()),
      );
    }
    return result;
  }

  @override
  Widget build(BuildContext context) => PageFrame(
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
                TextField(
                  decoration: const InputDecoration(
                    labelText: 'Buscar por título o categoría',
                    prefixIcon: Icon(Icons.search),
                  ),
                  onChanged: (value) => setState(() => _query = value),
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    for (final entry in <String?, String>{
                      null: 'Todos',
                      'ACTIVE': 'Activos',
                      'PAUSED': 'Pausados',
                      'COMPLETED': 'Completados',
                      'CANCELLED': 'Cancelados',
                    }.entries)
                      FilterChip(
                        label: Text(entry.value),
                        selected: _status == entry.key,
                        onSelected: (_) => setState(() => _status = entry.key),
                      ),
                  ],
                ),
                SwitchListTile(
                  title: const Text('Ordenar por título'),
                  subtitle: const Text('Desactivado: más recientes primero'),
                  value: _alphabetical,
                  onChanged: (value) => setState(() => _alphabetical = value),
                ),
                if (goals.isEmpty)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 64),
                    child: Text(
                      'Aún no tienes objetivos. Crea uno para comenzar tu seguimiento.',
                      textAlign: TextAlign.center,
                    ),
                  ),
                if (goals.isNotEmpty && _visible(goals).isEmpty)
                  const Padding(
                    padding: EdgeInsets.all(24),
                    child: Text(
                      'No hay objetivos que coincidan con la búsqueda y el estado.',
                    ),
                  ),
                for (final goal in _visible(goals))
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
