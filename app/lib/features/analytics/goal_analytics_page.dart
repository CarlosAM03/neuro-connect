import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/widgets/page_frame.dart';
import '../goals/goal_providers.dart';
import 'analytics_providers.dart';
import 'progress_chart.dart';

class GoalAnalyticsPage extends ConsumerWidget {
  const GoalAnalyticsPage({super.key, required this.id});
  final String id;
  @override
  Widget build(BuildContext context, WidgetRef ref) => PageFrame(
    title: 'Análisis del objetivo',
    child: ref
        .watch(goalAnalyticsProvider(id))
        .when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) =>
              ErrorView(error, () => ref.invalidate(goalAnalyticsProvider(id))),
          data: (data) {
            final goal = ref.watch(goalProvider(id)).asData?.value;
            return ListView(
              padding: const EdgeInsets.all(24),
              children: [
                Text(
                  goal?.title ?? 'Objetivo',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                const SizedBox(height: 16),
                TrendSummary(analytics: data, status: goal?.status ?? 'ACTIVE'),
                const SizedBox(height: 16),
                Text('Progreso actual: ${data.currentProgress}%'),
                Text(
                  'Progreso anterior: ${data.previousProgress == null ? 'Sin registro anterior' : '${data.previousProgress}%'}',
                ),
                Text(
                  'Cambio de progreso: ${data.progressDelta == null ? 'Sin historial suficiente' : '${data.progressDelta} puntos porcentuales'}',
                ),
                Text(
                  'Dificultad promedio (todo el historial): ${data.averageDifficulty?.toStringAsFixed(2) ?? 'Sin registros'}',
                ),
                Text(
                  'Total de check-ins: ${data.totalCheckIns} · Últimos 28 días: ${data.checkInsLast28Days}',
                ),
                Text(
                  'Días completos desde el último check-in: ${data.daysSinceLastCheckIn ?? 'Sin registros'}',
                ),
                const SizedBox(height: 24),
                ProgressChart(points: data.timeline),
                const SizedBox(height: 24),
                Text(
                  'Historial temporal',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                for (final point in data.timeline)
                  ListTile(
                    title: Text('${point.progress}%'),
                    subtitle: Text(
                      '${dateLabel(point.date)} · ${TimeOfDay.fromDateTime(point.date.toLocal()).format(context)}',
                    ),
                  ),
                TextButton(
                  onPressed: () => context.go('/goals/$id'),
                  child: const Text('Ver objetivo y check-ins'),
                ),
              ],
            );
          },
        ),
  );
}
