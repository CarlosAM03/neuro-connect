import '../../core/api/api_client.dart';

class CheckIn {
  CheckIn.fromJson(Map<String, dynamic> json)
    : id = json['id'] as String,
      progress = json['progress'] as int,
      difficulty = json['difficulty'] as int,
      completion = json['completion'] as String,
      notes = json['notes'] as String?,
      createdAt = DateTime.parse(json['createdAt'] as String);
  final String id, completion;
  final int progress, difficulty;
  final String? notes;
  final DateTime createdAt;
}

class CheckInRepository {
  CheckInRepository(this.api);
  final ApiClient api;
  Future<List<CheckIn>> history(String goalId) async =>
      (await api.dio.get<List<dynamic>>('/goals/$goalId/check-ins')).data!
          .map((item) => CheckIn.fromJson(item as Map<String, dynamic>))
          .toList();
  Future<void> create(String goalId, Map<String, dynamic> data) async {
    await api.dio.post<dynamic>('/goals/$goalId/check-ins', data: data);
  }

  Future<void> voidCheckIn(String goalId, String id) async {
    await api.dio.post<dynamic>('/goals/$goalId/check-ins/$id/void');
  }
}

String completionLabel(String value) => switch (value) {
  'MET' => 'Cumplido',
  'PARTIAL' => 'Parcial',
  _ => 'No cumplido',
};
