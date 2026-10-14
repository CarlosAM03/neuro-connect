import 'token_store_native.dart'
    if (dart.library.js_interop) 'token_store_web.dart'
    as platform;

abstract interface class AuthTokenStore {
  Future<String?> read();
  Future<void> write(String token);
  Future<void> clear();
}

AuthTokenStore createTokenStore() => platform.PlatformTokenStore();
