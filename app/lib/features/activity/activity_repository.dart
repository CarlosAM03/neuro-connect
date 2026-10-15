import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/auth/session.dart';
import '../../core/api/api_client.dart';

class ActivityEntry {
  ActivityEntry.fromJson(Map<String, dynamic> j)
    : action = j['action'] as String,
      payload = j['payload'] as Map<String, dynamic>,
      occurredAt = DateTime.parse(j['occurredAt'] as String);
  final String action;
  final Map<String, dynamic> payload;
  final DateTime occurredAt;
  String get message {
    final title = payload['title'] as String?;
    final goal = payload['goalTitle'] as String?;
    final person = payload['supporterName'] as String?;
    return switch (action) {
      'ACCOUNT_REGISTERED' => 'Creaste tu cuenta.',
      'PROFILE_UPDATED' => 'Actualizaste tu perfil.',
      'GOAL_CREATED' => 'Creaste el objetivo “${title ?? "Objetivo"}”.',
      'GOAL_UPDATED' => 'Actualizaste el objetivo “${title ?? "Objetivo"}”.',
      'GOAL_STATUS_CHANGED' =>
        'Cambiaste el estado de “${title ?? "Objetivo"}”.',
      'GOAL_CANCELLED' => 'Cancelaste el objetivo “${title ?? "Objetivo"}”.',
      'GOAL_REACTIVATED' => 'Reactivaste el objetivo “${title ?? "Objetivo"}”.',
      'CHECKIN_CREATED' =>
        'Registraste un check-in de “${goal ?? "Objetivo"}”.',
      'CHECKIN_VOIDED' => 'Invalidaste un check-in de “${goal ?? "Objetivo"}”.',
      'SUPPORT_RELATIONSHIP_CREATED' =>
        'Agregaste a ${person ?? "un integrante"} a tu red de apoyo.',
      'SUPPORT_PERMISSIONS_UPDATED' =>
        'Actualizaste los permisos de ${person ?? "un integrante"}.',
      'SUPPORT_EXPIRATION_UPDATED' =>
        'Actualizaste la expiración de ${person ?? "un integrante"}.',
      'SUPPORT_RELATIONSHIP_REVOKED' =>
        'Revocaste el acceso de ${person ?? "un integrante"}.',
      'SUPPORT_RELATIONSHIP_REACTIVATED' =>
        'Reactivaste el acceso de ${person ?? "un integrante"}.',
      _ => 'Se registró un cambio en tu información.',
    };
  }
}

class ActivityPageData {
  ActivityPageData(this.items, this.total);
  final List<ActivityEntry> items;
  final int total;
}

class ActivityRepository {
  ActivityRepository(this.api);
  final ApiClient api;
  Future<ActivityPageData> page(int page) async {
    final j = (await api.dio.get<Map<String, dynamic>>(
      '/audit-events',
      queryParameters: {'page': page, 'limit': 20},
    )).data!;
    return ActivityPageData(
      (j['items'] as List<dynamic>)
          .map((e) => ActivityEntry.fromJson(e as Map<String, dynamic>))
          .toList(),
      j['total'] as int,
    );
  }
}

final activityRepositoryProvider = Provider(
  (ref) => ActivityRepository(ref.watch(apiClientProvider)),
);
final activityProvider = FutureProvider.autoDispose
    .family<ActivityPageData, int>((ref, page) {
      ref.watch(sessionProvider);
      return ref.watch(activityRepositoryProvider).page(page);
    });
