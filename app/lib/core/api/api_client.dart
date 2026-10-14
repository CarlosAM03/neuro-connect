import 'package:dio/dio.dart';

import '../storage/token_store.dart';

class ApiClient {
  ApiClient(
    AuthTokenStore store,
    Future<void> Function() onUnauthorized, {
    Dio? dio,
  }) : dio =
           dio ??
           Dio(
             BaseOptions(
               baseUrl: const String.fromEnvironment(
                 'API_BASE_URL',
                 defaultValue: 'http://localhost:3000/api/v1',
               ),
               connectTimeout: const Duration(seconds: 15),
               receiveTimeout: const Duration(seconds: 20),
               sendTimeout: const Duration(seconds: 20),
             ),
           ) {
    this.dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          try {
            final token = await store.read();
            if (token != null) {
              options.headers['Authorization'] = 'Bearer $token';
              options.extra['sessionToken'] = token;
            }
            handler.next(options);
          } catch (error) {
            handler.reject(DioException(requestOptions: options, error: error));
          }
        },
        onError: (error, handler) async {
          final public = [
            '/auth/register',
            '/auth/login',
          ].contains(error.requestOptions.path);
          if (error.response?.statusCode == 401 &&
              !public &&
              await store.read() ==
                  error.requestOptions.extra['sessionToken']) {
            await onUnauthorized();
          }
          handler.next(error);
        },
      ),
    );
  }
  final Dio dio;
}

String errorMessage(Object error) {
  if (error is DioException) {
    final status = error.response?.statusCode;
    if (status == 401) {
      return 'La sesión no es válida. Inicia sesión nuevamente.';
    }
    if (status == 404) return 'No se encontró el recurso solicitado.';
    if (status == 429) {
      return 'Hay varios intentos recientes. Espera un momento e inténtalo de nuevo.';
    }
    final data = error.response?.data;
    if (status == 409 && data is Map && data['message'] is String) {
      return data['message'] as String;
    }
    if (status == 400) return 'Revisa los datos del formulario.';
    return 'No fue posible conectar. Revisa tu conexión e inténtalo de nuevo.';
  }
  return 'No fue posible completar la operación. Inténtalo de nuevo.';
}
