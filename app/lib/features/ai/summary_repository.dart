import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../../core/auth/session.dart';

class SummaryRecord {
  SummaryRecord.fromJson(Map<String, dynamic> j)
    : id = j['id'] as String,
      status = j['status'] as String,
      content = j['content'] as String?,
      start = DateTime.parse(j['periodStart'] as String),
      end = DateTime.parse(j['periodEnd'] as String);
  final String id, status;
  final String? content;
  final DateTime start, end;
}

class SummaryRepository {
  SummaryRepository(this.api);
  final ApiClient api;
  String base(String? owner) => owner == null
      ? '/ai/summaries'
      : '/support-network/owners/$owner/summaries';
  Future<List<SummaryRecord>> list(String? owner) async =>
      (await api.dio.get<List<dynamic>>(base(owner))).data!
          .map((j) => SummaryRecord.fromJson(j as Map<String, dynamic>))
          .toList();
  Future<SummaryRecord> detail(String? owner, String id) async =>
      SummaryRecord.fromJson(
        (await api.dio.get<Map<String, dynamic>>('${base(owner)}/$id')).data!,
      );
}

final summaryRepositoryProvider = Provider(
  (ref) => SummaryRepository(ref.watch(apiClientProvider)),
);
final summariesProvider = FutureProvider.autoDispose
    .family<List<SummaryRecord>, String?>((ref, owner) {
      if (ref.watch(sessionProvider).asData?.value == null) {
        throw StateError('Session required');
      }
      return ref.watch(summaryRepositoryProvider).list(owner);
    }, retry: (_, _) => null);
final summaryProvider = FutureProvider.autoDispose
    .family<SummaryRecord, ({String? owner, String id})>((ref, key) {
      if (ref.watch(sessionProvider).asData?.value == null) {
        throw StateError('Session required');
      }
      return ref.watch(summaryRepositoryProvider).detail(key.owner, key.id);
    }, retry: (_, _) => null);
