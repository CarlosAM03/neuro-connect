import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dio/dio.dart';
import 'package:neuroconnect/app/app.dart';
import 'package:neuroconnect/core/auth/session.dart';
import 'package:neuroconnect/core/api/api_client.dart';
import 'package:neuroconnect/features/goals/goal_providers.dart';
import 'package:neuroconnect/features/goals/goal_repository.dart';

import 'widget_test.dart' show MemoryStore, FixtureAdapter;

void main() {
  testWidgets(
    'filters preserve cancelled goals and combine with title search',
    (tester) async {
      final store = MemoryStore()..token = 'test-token';
      final container = ProviderContainer(
        overrides: [
          tokenStoreProvider.overrideWithValue(store),
          apiClientProvider.overrideWith(
            (ref) => ApiClient(
              store,
              () => ref.read(sessionProvider.notifier).logout(),
              dio: Dio()..httpClientAdapter = FixtureAdapter(),
            ),
          ),
          goalsProvider.overrideWith(
            (ref) async => [
              Goal.fromJson({
                'id': 'a',
                'title': 'Lectura',
                'status': 'ACTIVE',
                'progress': 0,
              }),
              Goal.fromJson({
                'id': 'b',
                'title': 'Archivo',
                'status': 'CANCELLED',
                'progress': 40,
              }),
            ],
          ),
        ],
      );
      addTearDown(container.dispose);
      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const NeuroConnectApp(),
        ),
      );
      await tester.pumpAndSettle();
      container.read(routerProvider).go('/goals');
      await tester.pumpAndSettle();
      expect(find.text('Lectura'), findsOneWidget);
      expect(find.text('Archivo'), findsOneWidget);
      await tester.tap(find.text('Cancelados'));
      await tester.pumpAndSettle();
      expect(find.text('Lectura'), findsNothing);
      expect(find.text('Archivo'), findsOneWidget);
      await tester.enterText(find.byType(TextField), 'sin coincidencias');
      await tester.pumpAndSettle();
      expect(find.text('Archivo'), findsNothing);
      expect(
        find.textContaining('No hay objetivos que coincidan'),
        findsOneWidget,
      );
      await tester.enterText(find.byType(TextField), 'ARCH');
      await tester.pumpAndSettle();
      expect(find.text('Archivo'), findsOneWidget);
    },
  );
}
