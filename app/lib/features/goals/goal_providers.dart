import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/auth/session.dart';
import '../check_ins/check_in_repository.dart';
import 'goal_repository.dart';

final goalRepositoryProvider = Provider(
  (ref) => GoalRepository(ref.watch(apiClientProvider)),
);
final checkInRepositoryProvider = Provider(
  (ref) => CheckInRepository(ref.watch(apiClientProvider)),
);
final goalsProvider = FutureProvider.autoDispose<List<Goal>>((ref) {
  final user = ref.watch(sessionProvider).asData?.value;
  return user == null
      ? Future.value([])
      : ref.watch(goalRepositoryProvider).list();
});
final goalProvider = FutureProvider.autoDispose.family<Goal, String>((ref, id) {
  final user = ref.watch(sessionProvider).asData?.value;
  if (user == null) throw StateError('Session required');
  return ref.watch(goalRepositoryProvider).detail(id);
});
final historyProvider = FutureProvider.autoDispose
    .family<List<CheckIn>, String>((ref, id) {
      final user = ref.watch(sessionProvider).asData?.value;
      return user == null
          ? Future.value([])
          : ref.watch(checkInRepositoryProvider).history(id);
    });
void refreshGoal(WidgetRef ref, String id) {
  ref.invalidate(goalsProvider);
  ref.invalidate(goalProvider(id));
  ref.invalidate(historyProvider(id));
}
