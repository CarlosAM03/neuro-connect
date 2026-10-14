import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:neuroconnect/app/app.dart';
import 'package:neuroconnect/core/api/api_client.dart';
import 'package:neuroconnect/core/auth/session.dart';
import 'package:neuroconnect/core/storage/token_store.dart';
import 'package:neuroconnect/features/goals/goal_providers.dart';

class MemoryStore implements AuthTokenStore {
  String? token;
  @override
  Future<String?> read() async => token;
  @override
  Future<void> write(String value) async {
    token = value;
  }

  @override
  Future<void> clear() async {
    token = null;
  }
}

class FixtureAdapter implements HttpClientAdapter {
  int calls = 0;
  int identityStatus = 200;
  String goalStatus = 'ACTIVE';
  final requests = <RequestOptions>[];
  Completer<void>? gate;
  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? stream,
    Future<void>? cancel,
  ) async {
    calls++;
    requests.add(options);
    if (gate != null) await gate!.future;
    final data = switch (options.path) {
      '/auth/login' => {'accessToken': 'synthetic-test-token'},
      '/auth/me' || '/users/me' => {
        'id': 'user-a',
        'email': 'a@example.com',
        'displayName': 'Persona A',
      },
      '/goals' => [
        {
          'id': 'goal-a',
          'title': 'Objetivo privado A',
          'status': 'ACTIVE',
          'progress': 20,
        },
      ],
      '/goals/goal-a' => {
        'id': 'goal-a',
        'title': 'Objetivo privado A',
        'status': goalStatus,
        'progress': 20,
      },
      '/goals/goal-a/check-ins' => [
        {
          'id': 'check-a',
          'progress': 20,
          'difficulty': 3,
          'completion': 'PARTIAL',
          'notes': 'Comentario privado',
          'createdAt': '2026-10-14T12:00:00Z',
        },
      ],
      _ => <String, dynamic>{},
    };
    return ResponseBody.fromString(
      jsonEncode(data),
      options.path == '/auth/me' ? identityStatus : 200,
      headers: {
        Headers.contentTypeHeader: ['application/json'],
      },
    );
  }

  @override
  void close({bool force = false}) {}
}

ProviderContainer setup(MemoryStore store, FixtureAdapter adapter) {
  late ProviderContainer container;
  container = ProviderContainer(
    overrides: [
      tokenStoreProvider.overrideWithValue(store),
      apiClientProvider.overrideWith(
        (ref) => ApiClient(
          store,
          () => ref.read(sessionProvider.notifier).logout(),
          dio: Dio()..httpClientAdapter = adapter,
        ),
      ),
    ],
  );
  addTearDown(container.dispose);
  return container;
}

void main() {
  testWidgets('paused goal retains history and rejects CheckIn in the UI', (
    tester,
  ) async {
    final store = MemoryStore()..token = 'synthetic-test-token';
    final adapter = FixtureAdapter()..goalStatus = 'PAUSED';
    final container = setup(store, adapter);
    await tester.pumpWidget(
      UncontrolledProviderScope(
        container: container,
        child: const NeuroConnectApp(),
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.text('Objetivo privado A'));
    await tester.pumpAndSettle();
    final button = tester.widget<FilledButton>(
      find.widgetWithText(FilledButton, 'Registrar check-in'),
    );
    expect(button.onPressed, isNull);
    expect(
      find.text('Reactiva el objetivo para registrar nuevos check-ins.'),
      findsOneWidget,
    );
    expect(find.text('Comentario privado'), findsOneWidget);
  });
  testWidgets('active goal opens a bounded CheckIn form', (tester) async {
    final store = MemoryStore()..token = 'synthetic-test-token';
    final container = setup(store, FixtureAdapter());
    await tester.pumpWidget(
      UncontrolledProviderScope(
        container: container,
        child: const NeuroConnectApp(),
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.text('Objetivo privado A'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Registrar check-in'));
    await tester.pumpAndSettle();
    final slider = tester.widget<Slider>(find.byType(Slider));
    expect(slider.max, 100);
    expect(slider.divisions, 100);
    expect(slider.value, 20);
    expect(find.text('Dificultad percibida'), findsOneWidget);
    expect(find.text('Guardar check-in'), findsOneWidget);
  });
  test('missing token means unauthenticated without network', () async {
    final adapter = FixtureAdapter();
    final container = setup(MemoryStore(), adapter);
    expect(await container.read(sessionProvider.future), isNull);
    expect(adapter.calls, 0);
  });
  test(
    'restores session by validating the stored token with auth/me',
    () async {
      final store = MemoryStore()..token = 'synthetic-test-token';
      final adapter = FixtureAdapter();
      final container = setup(store, adapter);
      expect(container.read(sessionProvider).isLoading, isTrue);
      expect((await container.read(sessionProvider.future))!.id, 'user-a');
      expect(adapter.requests.single.path, '/auth/me');
      expect(
        adapter.requests.single.headers['Authorization'],
        'Bearer synthetic-test-token',
      );
    },
  );
  test(
    'invalid stored token is removed and session becomes unauthenticated',
    () async {
      final store = MemoryStore()..token = 'expired-test-token';
      final adapter = FixtureAdapter()..identityStatus = 401;
      final container = setup(store, adapter);
      expect(await container.read(sessionProvider.future), isNull);
      expect(store.token, isNull);
    },
  );
  test(
    'login persists token, validates identity, logout clears private state',
    () async {
      final store = MemoryStore();
      final adapter = FixtureAdapter();
      final container = setup(store, adapter);
      await container.read(sessionProvider.future);
      await container
          .read(sessionProvider.notifier)
          .login('a@example.com', 'synthetic-password');
      expect(store.token, 'synthetic-test-token');
      final subscription = container.listen(goalsProvider, (_, _) {});
      addTearDown(subscription.close);
      expect(
        (await container.read(goalsProvider.future)).single.title,
        'Objetivo privado A',
      );
      await container.read(sessionProvider.notifier).logout();
      expect(store.token, isNull);
      expect(container.read(sessionProvider).asData!.value, isNull);
      expect(await container.read(goalsProvider.future), isEmpty);
    },
  );
  test(
    'transient server failure keeps token and exposes retryable session error',
    () async {
      final store = MemoryStore()..token = 'synthetic-test-token';
      final adapter = FixtureAdapter()..identityStatus = 503;
      final container = setup(store, adapter);
      await expectLater(
        container.read(sessionProvider.future),
        throwsA(isA<DioException>()),
      );
      expect(store.token, 'synthetic-test-token');
      adapter.identityStatus = 200;
      container.invalidate(sessionProvider);
      expect((await container.read(sessionProvider.future))!.id, 'user-a');
    },
  );
  testWidgets('bootstrap waits for identity before showing private content', (
    tester,
  ) async {
    final store = MemoryStore()..token = 'synthetic-test-token';
    final adapter = FixtureAdapter()..gate = Completer<void>();
    final container = setup(store, adapter);
    await tester.pumpWidget(
      UncontrolledProviderScope(
        container: container,
        child: const NeuroConnectApp(),
      ),
    );
    await tester.pump();
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
    expect(find.text('Mis objetivos'), findsNothing);
    adapter.gate!.complete();
    adapter.gate = null;
    await tester.pumpAndSettle();
    expect(find.text('Mis objetivos'), findsOneWidget);
    expect(find.text('Objetivo privado A'), findsOneWidget);
  });
  testWidgets('login validates locally and registration is navigable', (
    tester,
  ) async {
    final adapter = FixtureAdapter();
    final container = setup(MemoryStore(), adapter);
    await tester.pumpWidget(
      UncontrolledProviderScope(
        container: container,
        child: const NeuroConnectApp(),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Iniciar sesión'), findsOneWidget);
    await tester.tap(find.text('Entrar'));
    await tester.pump();
    expect(find.text('Escribe un correo válido'), findsOneWidget);
    expect(adapter.calls, 0);
    await tester.tap(find.text('Crear cuenta'));
    await tester.pumpAndSettle();
    expect(find.text('Nombre'), findsOneWidget);
  });
  testWidgets(
    'goal editor exposes metadata while progress requires a CheckIn',
    (tester) async {
      final store = MemoryStore()..token = 'synthetic-test-token';
      final container = setup(store, FixtureAdapter());
      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const NeuroConnectApp(),
        ),
      );
      await tester.pumpAndSettle();
      await tester.tap(find.text('Nuevo objetivo'));
      await tester.pumpAndSettle();
      expect(find.text('Guardar objetivo'), findsOneWidget);
      expect(find.byType(Slider), findsNothing);
      expect(
        find.text('El progreso se registra mediante check-ins.'),
        findsOneWidget,
      );
    },
  );
}
