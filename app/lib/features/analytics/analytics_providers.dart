import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/auth/session.dart';
import '../goals/goal_providers.dart';
import '../goals/goal_repository.dart';
import 'analytics_repository.dart';

final analyticsRepositoryProvider = Provider(
  (ref) => AnalyticsRepository(ref.watch(apiClientProvider)),
);
final goalAnalyticsProvider = FutureProvider.autoDispose
    .family<GoalAnalytics, String>((ref, id) async {
      await ref.watch(goalProvider(id).future);
      return ref.watch(analyticsRepositoryProvider).goal(id);
    }, retry: (_, _) => null);

class DashboardData {
  DashboardData(this.overview, this.goals, this.analytics);
  final AnalyticsOverview overview;
  final List<Goal> goals;
  final Map<String, GoalAnalytics> analytics;
}

final dashboardProvider = FutureProvider.autoDispose<DashboardData>((
  ref,
) async {
  final user = ref.watch(sessionProvider).asData?.value;
  if (user == null) throw StateError('Session required');
  final overview = await ref.watch(analyticsRepositoryProvider).overview();
  final goals = await ref.watch(goalsProvider.future);
  final analyses = await Future.wait(
    goals.map((goal) => ref.watch(goalAnalyticsProvider(goal.id).future)),
  );
  return DashboardData(overview, goals, {
    for (final item in analyses) item.goalId: item,
  });
}, retry: (_, _) => null);
void refreshDashboard(WidgetRef ref) {
  ref.invalidate(goalsProvider);
  ref.invalidate(goalProvider);
  ref.invalidate(goalAnalyticsProvider);
  ref.invalidate(dashboardProvider);
}
