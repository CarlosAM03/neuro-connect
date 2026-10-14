import 'package:web/web.dart' as web;

import 'token_store.dart';

class PlatformTokenStore implements AuthTokenStore {
  static const _key = 'neuroconnect.accessToken';
  @override
  Future<String?> read() async => web.window.sessionStorage.getItem(_key);
  @override
  Future<void> write(String token) async =>
      web.window.sessionStorage.setItem(_key, token);
  @override
  Future<void> clear() async => web.window.sessionStorage.removeItem(_key);
}
