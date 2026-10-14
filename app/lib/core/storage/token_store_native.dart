import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'token_store.dart';

class PlatformTokenStore implements AuthTokenStore {
  final _storage = const FlutterSecureStorage();
  static const _key = 'neuroconnect.accessToken';
  @override
  Future<String?> read() => _storage.read(key: _key);
  @override
  Future<void> write(String token) => _storage.write(key: _key, value: token);
  @override
  Future<void> clear() => _storage.delete(key: _key);
}
