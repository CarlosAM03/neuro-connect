import '../../core/api/api_client.dart';
import '../../core/storage/token_store.dart';

class UserProfile {
  const UserProfile({
    required this.id,
    required this.email,
    required this.displayName,
  });
  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
    id: json['id'] as String,
    email: json['email'] as String,
    displayName: json['displayName'] as String,
  );
  final String id, email, displayName;
}

class AuthRepository {
  AuthRepository(this.api, this.store);
  final ApiClient api;
  final AuthTokenStore store;
  Future<void> register(String email, String password, String name) async {
    await api.dio.post<dynamic>(
      '/auth/register',
      data: {
        'email': email.trim(),
        'password': password,
        'displayName': name.trim(),
      },
    );
  }

  Future<UserProfile> login(String email, String password) async {
    final result = await api.dio.post<Map<String, dynamic>>(
      '/auth/login',
      data: {'email': email.trim(), 'password': password},
    );
    await store.write(result.data!['accessToken'] as String);
    return _identity();
  }

  Future<UserProfile> _identity() async => UserProfile.fromJson(
    (await api.dio.get<Map<String, dynamic>>('/auth/me')).data!,
  );
  Future<UserProfile?> restoreSession() async =>
      await store.read() == null ? null : _identity();
  Future<void> logout() => store.clear();
  Future<UserProfile> profile() async => UserProfile.fromJson(
    (await api.dio.get<Map<String, dynamic>>('/users/me')).data!,
  );
  Future<UserProfile> updateProfile(String name) async => UserProfile.fromJson(
    (await api.dio.patch<Map<String, dynamic>>(
      '/users/me',
      data: {'displayName': name.trim()},
    )).data!,
  );
}
