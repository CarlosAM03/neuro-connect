import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../../core/auth/session.dart';
import '../goals/goal_repository.dart';
import '../analytics/analytics_repository.dart';

class SharedCheckIn {
  SharedCheckIn.fromJson(Map<String, dynamic> j)
    : date = DateTime.parse(j['date'] as String),
      progress = j['progress'] as int,
      difficulty = j['difficulty'] as int,
      completion = j['completion'] as String;
  final DateTime date;
  final int progress, difficulty;
  final String completion;
}

class SharedProgress {
  SharedProgress.fromJson(Map<String, dynamic> j)
    : analytics = GoalAnalytics.fromJson(j),
      timeline = (j['timeline'] as List<dynamic>)
          .map((c) => SharedCheckIn.fromJson(c as Map<String, dynamic>))
          .toList();
  final GoalAnalytics analytics;
  final List<SharedCheckIn> timeline;
}

class SupportRelationship {
  SupportRelationship.fromJson(Map<String, dynamic> j)
    : id = j['id'] as String,
      supporterName =
          (j['supporter'] as Map<String, dynamic>)['displayName'] as String,
      goals = j['canViewGoals'] as bool,
      progress = j['canViewProgress'] as bool,
      summaries = j['canViewSummaries'] as bool,
      expiresAt = j['expiresAt'] == null
          ? null
          : DateTime.parse(j['expiresAt'] as String),
      revokedAt = j['revokedAt'] == null
          ? null
          : DateTime.parse(j['revokedAt'] as String);
  final String id, supporterName;
  final bool goals, progress, summaries;
  final DateTime? expiresAt, revokedAt;
  bool get active =>
      revokedAt == null &&
      (expiresAt == null || expiresAt!.isAfter(DateTime.now()));
  String get status => revokedAt != null
      ? 'Revocada'
      : active
      ? 'Activa'
      : 'Expirada';
}

class SupportedOwner {
  SupportedOwner.fromJson(Map<String, dynamic> j)
    : id = (j['owner'] as Map<String, dynamic>)['id'] as String,
      name = (j['owner'] as Map<String, dynamic>)['displayName'] as String,
      progress = j['canViewProgress'] as bool,
      summaries = j['canViewSummaries'] as bool;
  final String id, name;
  final bool progress, summaries;
}

class SharedData {
  SharedData(this.owner, this.goals);
  final SupportedOwner owner;
  final List<Goal> goals;
}

class SupportRepository {
  SupportRepository(this.api);
  final ApiClient api;
  Future<SharedProgress> progress(String ownerId, String goalId) async =>
      SharedProgress.fromJson(
        (await api.dio.get<Map<String, dynamic>>(
          '/support-network/owners/$ownerId/goals/$goalId/progress',
        )).data!,
      );
  Future<void> summaries(String ownerId) async {
    await api.dio.get<List<dynamic>>(
      '/support-network/owners/$ownerId/summaries',
    );
  }

  Future<List<SupportRelationship>> relationships() async =>
      (await api.dio.get<List<dynamic>>('/support-network/relationships')).data!
          .map((j) => SupportRelationship.fromJson(j as Map<String, dynamic>))
          .toList();
  Future<List<SupportedOwner>> owners() async =>
      (await api.dio.get<List<dynamic>>('/support-network/owners')).data!
          .map((j) => SupportedOwner.fromJson(j as Map<String, dynamic>))
          .toList();
  Future<void> save(
    String? id,
    Map<String, dynamic> data, {
    bool reactivate = false,
  }) async {
    const base = '/support-network/relationships';
    if (id == null) {
      await api.dio.post<dynamic>(base, data: data);
    } else if (reactivate) {
      await api.dio.post<dynamic>('$base/$id/reactivate', data: data);
    } else {
      await api.dio.patch<dynamic>('$base/$id', data: data);
    }
  }

  Future<void> revoke(String id) async {
    await api.dio.post<dynamic>('/support-network/relationships/$id/revoke');
  }

  Future<SharedData> shared(String id) async {
    // Refresh the permissions as well as the goals; never persist delegated data.
    final owner = (await owners()).where((o) => o.id == id).firstOrNull;
    if (owner == null) throw StateError('Acceso compartido no disponible');
    final goals = (await api.dio.get<List<dynamic>>(
      '/support-network/owners/$id/goals',
    )).data!.map((j) => Goal.fromJson(j as Map<String, dynamic>)).toList();
    return SharedData(owner, goals);
  }
}

final supportRepositoryProvider = Provider(
  (ref) => SupportRepository(ref.watch(apiClientProvider)),
);
final relationshipsProvider = FutureProvider.autoDispose((ref) {
  ref.watch(sessionProvider);
  return ref.watch(supportRepositoryProvider).relationships();
});
final supportedOwnersProvider = FutureProvider.autoDispose((ref) {
  ref.watch(sessionProvider);
  return ref.watch(supportRepositoryProvider).owners();
});
final sharedDataProvider = FutureProvider.autoDispose
    .family<SharedData, String>((ref, id) {
      ref.watch(sessionProvider);
      return ref.watch(supportRepositoryProvider).shared(id);
    });
