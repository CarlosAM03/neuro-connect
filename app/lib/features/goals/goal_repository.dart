import '../../core/api/api_client.dart';

class Goal {
  Goal.fromJson(Map<String, dynamic> json)
    : id = json['id'] as String,
      title = json['title'] as String,
      description = json['description'] as String?,
      category = json['category'] as String?,
      status = json['status'] as String,
      progress = json['progress'] as int,
      targetDate = json['targetDate'] == null
          ? null
          : DateTime.parse(json['targetDate'] as String);
  final String id, title, status;
  final String? description, category;
  final int progress;
  final DateTime? targetDate;
}

class GoalRepository {
  GoalRepository(this.api);
  final ApiClient api;
  Future<List<Goal>> list() async =>
      (await api.dio.get<List<dynamic>>('/goals')).data!
          .map((item) => Goal.fromJson(item as Map<String, dynamic>))
          .toList();
  Future<Goal> detail(String id) async => Goal.fromJson(
    (await api.dio.get<Map<String, dynamic>>('/goals/$id')).data!,
  );
  Future<Goal> create(Map<String, dynamic> data) async => Goal.fromJson(
    (await api.dio.post<Map<String, dynamic>>('/goals', data: data)).data!,
  );
  Future<Goal> update(String id, Map<String, dynamic> data) async =>
      Goal.fromJson(
        (await api.dio.patch<Map<String, dynamic>>(
          '/goals/$id',
          data: data,
        )).data!,
      );
  Future<void> delete(String id) async {
    await api.dio.delete<dynamic>('/goals/$id');
  }
}

String statusLabel(String status) => switch (status) {
  'PAUSED' => 'Pausado',
  'COMPLETED' => 'Completado',
  _ => 'Activo',
};
