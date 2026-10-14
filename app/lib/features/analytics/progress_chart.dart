import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../../core/widgets/page_frame.dart';
import 'analytics_repository.dart';

class ProgressChart extends StatelessWidget {
  const ProgressChart({super.key, required this.points});
  final List<TimelinePoint> points;
  @override
  Widget build(BuildContext context) {
    if (points.isEmpty) {
      return const Padding(
        padding: EdgeInsets.all(24),
        child: Text('Aún no hay check-ins para mostrar progreso.'),
      );
    }
    final first = points.first.date.millisecondsSinceEpoch;
    final spots = points
        .map(
          (p) => FlSpot(
            (p.date.millisecondsSinceEpoch - first) / 86400000,
            p.progress.toDouble(),
          ),
        )
        .toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          'Progreso en el tiempo',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 16),
        Semantics(
          label:
              'Gráfica de progreso, ${points.length} registros, de ${dateLabel(points.first.date)} a ${dateLabel(points.last.date)}. Eje vertical: porcentaje de 0 a 100. Eje horizontal: fecha.',
          child: SizedBox(
            height: 240,
            child: Padding(
              padding: const EdgeInsets.only(right: 20),
              child: LineChart(
                LineChartData(
                  minX: 0,
                  maxX: spots.last.x == 0 ? 1 : spots.last.x,
                  minY: 0,
                  maxY: 100,
                  gridData: const FlGridData(
                    show: true,
                    drawVerticalLine: false,
                    horizontalInterval: 25,
                  ),
                  titlesData: FlTitlesData(
                    topTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    rightTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    bottomTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 48,
                        interval: 25,
                        getTitlesWidget: (value, meta) =>
                            Text('${value.toInt()}%'),
                      ),
                    ),
                  ),
                  lineBarsData: [
                    LineChartBarData(
                      spots: spots,
                      isCurved: false,
                      color: Theme.of(context).colorScheme.primary,
                      barWidth: 3,
                      dotData: const FlDotData(show: true),
                    ),
                  ],
                  borderData: FlBorderData(show: false),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(dateLabel(points.first.date)),
            Text(dateLabel(points.last.date)),
          ],
        ),
        const Center(child: Text('Fecha del check-in')),
      ],
    );
  }
}

class TrendSummary extends StatelessWidget {
  const TrendSummary({
    super.key,
    required this.analytics,
    required this.status,
  });
  final GoalAnalytics analytics;
  final String status;
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        '${status == 'ACTIVE' ? 'Tendencia' : 'Tendencia histórica'}: ${trendLabel(analytics.trend)}',
        style: Theme.of(context).textTheme.titleMedium,
      ),
      if (analytics.insufficientHistory)
        const Padding(
          padding: EdgeInsets.only(top: 8),
          child: Text(
            'Aún no existen suficientes check-ins para identificar una tendencia.',
          ),
        ),
    ],
  );
}
