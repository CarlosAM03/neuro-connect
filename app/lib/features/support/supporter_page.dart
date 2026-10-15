import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/widgets/page_frame.dart';
import '../analytics/analytics_repository.dart';
import '../analytics/progress_chart.dart';
import '../check_ins/check_in_repository.dart';
import '../goals/goal_repository.dart';
import 'support_repository.dart';

class SupporterPage extends ConsumerWidget {
  const SupporterPage({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) => PageFrame(
    title: 'Personas a las que apoyo',
    actions: [
      IconButton(
        tooltip: 'Actualizar personas',
        icon: const Icon(Icons.refresh),
        onPressed: () => ref.invalidate(supportedOwnersProvider),
      ),
    ],
    child: ref
        .watch(supportedOwnersProvider)
        .when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) =>
              ErrorView(e, () => ref.invalidate(supportedOwnersProvider)),
          data: (owners) => ListView(
            padding: const EdgeInsets.all(24),
            children: [
              const Text(
                'Consulta únicamente la información que cada persona decidió compartir contigo.',
              ),
              if (owners.isEmpty)
                const Padding(
                  padding: EdgeInsets.all(24),
                  child: Text('No hay accesos compartidos activos.'),
                ),
              for (final owner in owners)
                Card(
                  child: ListTile(
                    title: Text(owner.name),
                    subtitle: const Text(
                      'Información compartida · Solo lectura',
                    ),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => context.go('/support/owners/${owner.id}'),
                  ),
                ),
            ],
          ),
        ),
  );
}

class SharedOwnerPage extends ConsumerStatefulWidget {
  const SharedOwnerPage({super.key, required this.ownerId});
  final String ownerId;
  @override
  ConsumerState<SharedOwnerPage> createState() => _SharedOwnerPageState();
}

class _SharedOwnerPageState extends ConsumerState<SharedOwnerPage> {
  @override
  Widget build(BuildContext context) => PageFrame(
    title: 'Información compartida',
    actions: [
      IconButton(
        tooltip: 'Actualizar acceso compartido',
        icon: const Icon(Icons.refresh),
        onPressed: () {
          ref.invalidate(sharedDataProvider(widget.ownerId));
        },
      ),
    ],
    child: ref
        .watch(sharedDataProvider(widget.ownerId))
        .when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (_, _) => Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'Información compartida no disponible. El acceso pudo cambiar o expirar.',
                ),
                FilledButton(
                  onPressed: () =>
                      ref.invalidate(sharedDataProvider(widget.ownerId)),
                  child: const Text('Reintentar'),
                ),
                TextButton(
                  onPressed: () => context.go('/support/owners'),
                  child: const Text('Volver a personas'),
                ),
              ],
            ),
          ),
          data: (data) => ListView(
            padding: const EdgeInsets.all(24),
            children: [
              Text(
                'Estás viendo información compartida por ${data.owner.name}',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const Text('Solo lectura. Las notas privadas no se comparten.'),
              if (!data.owner.progress)
                const Text(
                  'No tienes permiso para consultar el progreso detallado.',
                ),
              if (data.goals.isEmpty)
                const Text('Esta persona aún no tiene objetivos compartidos.'),
              for (final goal in data.goals)
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          goal.title,
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        Text(
                          '${statusLabel(goal.status)} · Progreso actual: ${goal.progress}%',
                        ),
                        if (goal.description != null) Text(goal.description!),
                        if (goal.category != null)
                          Text('Categoría: ${goal.category}'),
                        if (goal.targetDate != null)
                          Text(
                            'Fecha objetivo: ${dateLabel(goal.targetDate!)}',
                          ),
                        if (data.owner.progress)
                          TextButton(
                            onPressed: () => _progress(goal),
                            child: Text('Ver progreso de ${goal.title}'),
                          ),
                      ],
                    ),
                  ),
                ),
              if (data.owner.summaries)
                TextButton(
                  onPressed: _summaries,
                  child: const Text('Ver resúmenes compartidos'),
                ),
            ],
          ),
        ),
  );
  Future<void> _progress(Goal goal) async {
    try {
      final shared = await ref
          .read(supportRepositoryProvider)
          .progress(widget.ownerId, goal.id);
      final analytics = shared.analytics;
      final timeline = shared.timeline;
      if (!mounted) return;
      await showDialog<void>(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Progreso compartido: ${goal.title}'),
          content: SizedBox(
            width: 600,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Solo lectura · Progreso actual: ${analytics.currentProgress}%',
                  ),
                  Text(trendLabel(analytics.trend)),
                  if (analytics.insufficientHistory)
                    const Text(
                      'Historial insuficiente para una tendencia concluyente.',
                    ),
                  Text(
                    'Check-ins efectivos: ${analytics.totalCheckIns} · Dificultad promedio: ${analytics.averageDifficulty?.toStringAsFixed(2) ?? "Sin datos"}',
                  ),
                  ProgressChart(points: analytics.timeline),
                  for (final c in timeline)
                    Text(
                      '${dateLabel(c.date)} · ${c.progress}% · Dificultad ${c.difficulty}/5 · ${completionLabel(c.completion)}',
                    ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cerrar'),
            ),
          ],
        ),
      );
    } catch (e) {
      if (mounted) {
        ref.invalidate(sharedDataProvider(widget.ownerId));
        showFailure(context, e);
      }
    }
  }

  Future<void> _summaries() async {
    try {
      await ref.read(supportRepositoryProvider).summaries(widget.ownerId);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Todavía no hay resúmenes IA productivos compartidos.',
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ref.invalidate(sharedDataProvider(widget.ownerId));
        showFailure(context, e);
      }
    }
  }
}
