import '../../core/api/api_client.dart';

class AnalyticsOverview {
  AnalyticsOverview.fromJson(Map<String, dynamic> json)
    : totalGoals = json['totalGoals'] as int,
      activeGoals = json['activeGoals'] as int,
      pausedGoals = json['pausedGoals'] as int,
      completedGoals = json['completedGoals'] as int,
      completionRate = (json['completionRate'] as num).toDouble(),
      averageProgress = (json['averageProgress'] as num).toDouble(),
      checkInsLast28Days = json['checkInsLast28Days'] as int,
      checkInFrequencyPerWeek = (json['checkInFrequencyPerWeek'] as num)
          .toDouble(),
      inactiveGoals = json['inactiveGoals'] as int;
  final int totalGoals,
      activeGoals,
      pausedGoals,
      completedGoals,
      checkInsLast28Days,
      inactiveGoals;
  final double completionRate, averageProgress, checkInFrequencyPerWeek;
}

class TimelinePoint {
  TimelinePoint.fromJson(Map<String, dynamic> json)
    : date = DateTime.parse(json['date'] as String),
      progress = json['progress'] as int;
  final DateTime date;
  final int progress;
}

class GoalAnalytics {
  GoalAnalytics.fromJson(Map<String, dynamic> json)
    : goalId = json['goalId'] as String,
      currentProgress = json['currentProgress'] as int,
      previousProgress = json['previousProgress'] as int?,
      progressDelta = json['progressDelta'] as int?,
      averageDifficulty = (json['averageDifficulty'] as num?)?.toDouble(),
      totalCheckIns = json['totalCheckIns'] as int,
      checkInsLast28Days = json['checkInsLast28Days'] as int,
      daysSinceLastCheckIn = json['daysSinceLastCheckIn'] as int?,
      trend = json['trend'] as String,
      insufficientHistory = json['insufficientHistory'] as bool,
      timeline = (json['timeline'] as List<dynamic>)
          .map((item) => TimelinePoint.fromJson(item as Map<String, dynamic>))
          .toList();
  final String goalId, trend;
  final int currentProgress, totalCheckIns, checkInsLast28Days;
  final int? previousProgress, progressDelta, daysSinceLastCheckIn;
  final double? averageDifficulty;
  final bool insufficientHistory;
  final List<TimelinePoint> timeline;
}

class AnalyticsRepository {
  AnalyticsRepository(this.api);
  final ApiClient api;
  Future<AnalyticsOverview> overview() async => AnalyticsOverview.fromJson(
    (await api.dio.get<Map<String, dynamic>>('/analytics/overview')).data!,
  );
  Future<GoalAnalytics> goal(String id) async => GoalAnalytics.fromJson(
    (await api.dio.get<Map<String, dynamic>>('/analytics/goals/$id')).data!,
  );
}

String trendLabel(String trend) => switch (trend) {
  'PROGRESSING' => 'Progreso creciente',
  'DECLINING' => 'Progreso decreciente',
  'INACTIVE' => 'Sin seguimiento reciente',
  _ => 'Progreso estable',
};
