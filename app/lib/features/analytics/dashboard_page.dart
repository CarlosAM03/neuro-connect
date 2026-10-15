import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/widgets/page_frame.dart';
import '../goals/goal_repository.dart';
import 'analytics_providers.dart';
import 'progress_chart.dart';

class DashboardPage extends ConsumerStatefulWidget {
  const DashboardPage({super.key});
  @override
  ConsumerState<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends ConsumerState<DashboardPage> {
  String? _selected;
  @override
  Widget build(BuildContext context) => PageFrame(
    title: 'Mi seguimiento',
    actions: [
      IconButton(
        onPressed: () => refreshDashboard(ref),
        icon: const Icon(Icons.refresh),
        tooltip: 'Actualizar seguimiento',
      ),
    ],
    child: ref
        .watch(dashboardProvider)
        .when(
          loading: () => const Center(
            child: CircularProgressIndicator(
              semanticsLabel: 'Cargando seguimiento',
            ),
          ),
          error: (error, _) => ErrorView(error, () => refreshDashboard(ref)),
          data: (data) {
            final metrics = data.overview;
            final selected =
                data.goals.where((g) => g.id == _selected).firstOrNull ??
                data.goals.firstOrNull;
            return RefreshIndicator(
              onRefresh: () async {
                refreshDashboard(ref);
                await ref.read(dashboardProvider.future);
              },
              child: ListView(
                padding: const EdgeInsets.all(24),
                physics: const AlwaysScrollableScrollPhysics(),
                children: [
                  Text(
                    'Tu seguimiento, a tu ritmo',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Indicadores calculados a partir de tus objetivos y check-ins.',
                  ),
                  const SizedBox(height: 20),
                  LayoutBuilder(
                    builder: (context, constraints) {
                      final width =
                          (constraints.maxWidth -
                              (constraints.maxWidth < 600 ? 12 : 36)) /
                          (constraints.maxWidth < 600 ? 2 : 4);
                      return Wrap(
                        spacing: 12,
                        runSpacing: 12,
                        children: [
                          for (final metric in <String, String>{
                            'Objetivos activos': '${metrics.activeGoals}',
                            'Objetivos completados':
                                '${metrics.completedGoals}',
                            'Progreso promedio':
                                '${metrics.averageProgress.toStringAsFixed(2)}%',
                            'Check-ins (28 días)':
                                '${metrics.checkInsLast28Days}',
                          }.entries)
                            SizedBox(
                              width: width,
                              child: Card(
                                margin: EdgeInsets.zero,
                                child: Padding(
                                  padding: const EdgeInsets.all(16),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(metric.key),
                                      const SizedBox(height: 8),
                                      Text(
                                        metric.value,
                                        style: Theme.of(context)
                                            .textTheme
                                            .headlineSmall,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                        ],
                      );
                    },
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Total: ${metrics.totalGoals} · Pausados: ${metrics.pausedGoals} · Cancelados: ${metrics.cancelledGoals} · Cumplimiento: ${metrics.completionRate.toStringAsFixed(2)}%',
                  ),
                  Text(
                    'Frecuencia: ${metrics.checkInFrequencyPerWeek.toStringAsFixed(2)} check-ins por semana (últimos 28 días)',
                  ),
                  Text(
                    'Objetivos activos sin seguimiento reciente: ${metrics.inactiveGoals}',
                  ),
                  const SizedBox(height: 24),
                  if (selected == null) ...[
                    const Text(
                      'Aún no tienes objetivos. Crea uno para comenzar tu seguimiento.',
                    ),
                    const SizedBox(height: 16),
                    FilledButton(
                      onPressed: () => context.go('/goals/new'),
                      child: const Text('Crear primer objetivo'),
                    ),
                  ] else ...[
                    DropdownButtonFormField<String>(
                      key: ValueKey(selected.id),
                      initialValue: selected.id,
                      isExpanded: true,
                      decoration: const InputDecoration(
                        labelText: 'Objetivo de la gráfica',
                      ),
                      items: data.goals
                          .map(
                            (g) => DropdownMenuItem(
                              value: g.id,
                              child: Text(
                                g.title,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          )
                          .toList(),
                      onChanged: (id) => setState(() => _selected = id),
                    ),
                    const SizedBox(height: 20),
                    ProgressChart(
                      points: data.analytics[selected.id]!.timeline,
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Tendencias por objetivo',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
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
                                '${statusLabel(goal.status)} · ${goal.progress}%',
                              ),
                              const SizedBox(height: 8),
                              TrendSummary(
                                analytics: data.analytics[goal.id]!,
                                status: goal.status,
                              ),
                              Wrap(
                                spacing: 12,
                                children: [
                                  TextButton(
                                    onPressed: () => context.go(
                                      '/goals/${goal.id}/analytics',
                                    ),
                                    child: const Text('Ver análisis'),
                                  ),
                                  TextButton(
                                    onPressed: () =>
                                        context.go('/goals/${goal.id}'),
                                    child: const Text('Ver objetivo'),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ],
              ),
            );
          },
        ),
  );
}
