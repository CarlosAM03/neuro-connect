import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../api/api_client.dart';
import '../storage/token_store.dart';
import '../../features/auth/auth_repository.dart';

final tokenStoreProvider = Provider<AuthTokenStore>(
  (ref) => createTokenStore(),
);
final apiClientProvider = Provider<ApiClient>((ref) {
  final client = ApiClient(
    ref.watch(tokenStoreProvider),
    () => ref.read(sessionProvider.notifier).logout(),
  );
  ref.onDispose(() => client.dio.close());
  return client;
});
final authRepositoryProvider = Provider<AuthRepository>(
  (ref) => AuthRepository(
    ref.watch(apiClientProvider),
    ref.watch(tokenStoreProvider),
  ),
);
final sessionProvider = AsyncNotifierProvider<SessionNotifier, UserProfile?>(
  SessionNotifier.new,
  retry: (_, _) => null,
);

class SessionNotifier extends AsyncNotifier<UserProfile?> {
  @override
  Future<UserProfile?> build() async {
    try {
      return await ref.read(authRepositoryProvider).restoreSession();
    } on DioException catch (error) {
      if (error.response?.statusCode == 401) {
        await ref.read(tokenStoreProvider).clear();
        return null;
      }
      rethrow;
    }
  }

  Future<void> login(String email, String password) async {
    final user = await ref.read(authRepositoryProvider).login(email, password);
    state = AsyncData(user);
  }

  Future<void> logout() async {
    await ref.read(authRepositoryProvider).logout();
    state = const AsyncData(null);
  }

  void updateProfile(UserProfile user) => state = AsyncData(user);
}
