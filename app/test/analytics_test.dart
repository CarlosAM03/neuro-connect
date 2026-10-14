import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:neuroconnect/app/app.dart';
import 'package:neuroconnect/core/auth/session.dart';

import 'widget_test.dart' show MemoryStore, FixtureAdapter, setup;

Future<ProviderContainer> mount(
  WidgetTester tester,
  FixtureAdapter adapter,
) async {
  final container = setup(
    MemoryStore()..token = 'synthetic-test-token',
    adapter,
  );
  await tester.pumpWidget(
    UncontrolledProviderScope(
      container: container,
      child: const NeuroConnectApp(),
    ),
  );
  await tester.pumpAndSettle();
  return container;
}

void main() {
  testWidgets(
    'dashboard consumes repository metrics and backend trend, then opens goal analytics',
    (tester) async {
      final adapter = FixtureAdapter();
      final container = await mount(tester, adapter);
      expect(find.text('Mi seguimiento'), findsOneWidget);
      expect(find.text('20.00%'), findsOneWidget);
      expect(find.text('Objetivos activos'), findsOneWidget);
      expect(find.byType(LineChart), findsOneWidget);
      expect(
        adapter.requests.any((r) => r.path == '/analytics/goals/goal-a'),
        isTrue,
      );
      await tester.scrollUntilVisible(find.text('Ver análisis'), 300);
      expect(find.text('Tendencia: Progreso creciente'), findsOneWidget);
      await tester.tap(find.text('Ver análisis'));
      await tester.pumpAndSettle();
      expect(find.text('Análisis del objetivo'), findsOneWidget);
      expect(find.byType(LineChart), findsOneWidget);
      await container.read(sessionProvider.notifier).logout();
      await tester.pumpAndSettle();
      expect(find.text('Iniciar sesión'), findsOneWidget);
      expect(find.byType(LineChart), findsNothing);
    },
  );
  testWidgets('empty dashboard offers first goal without a fabricated chart', (
    tester,
  ) async {
    await mount(tester, FixtureAdapter()..empty = true);
    expect(find.text('Crear primer objetivo'), findsOneWidget);
    expect(find.byType(LineChart), findsNothing);
    await tester.tap(find.text('Crear primer objetivo'));
    await tester.pumpAndSettle();
    expect(find.text('Guardar objetivo'), findsOneWidget);
  });
  testWidgets('dashboard failure can be retried against the API', (
    tester,
  ) async {
    final adapter = FixtureAdapter()..analyticsStatus = 503;
    await mount(tester, adapter);
    expect(find.text('Reintentar'), findsOneWidget);
    adapter.analyticsStatus = 200;
    await tester.tap(find.text('Reintentar'));
    await tester.pumpAndSettle();
    expect(find.text('Objetivos activos'), findsOneWidget);
    expect(find.byType(LineChart), findsOneWidget);
  });
  testWidgets(
    'insufficient history is explicit, including historical paused analysis',
    (tester) async {
      final container = await mount(
        tester,
        FixtureAdapter()
          ..insufficient = true
          ..goalStatus = 'PAUSED',
      );
      container.read(routerProvider).go('/goals/goal-a/analytics');
      await tester.pumpAndSettle();
      expect(
        find.text('Tendencia histórica: Progreso estable'),
        findsOneWidget,
      );
      expect(
        find.text(
          'Aún no existen suficientes check-ins para identificar una tendencia.',
        ),
        findsOneWidget,
      );
    },
  );
  testWidgets('dashboard loading waits for analytics response', (tester) async {
    final adapter = FixtureAdapter()..analyticsGate = Completer<void>();
    final container = setup(
      MemoryStore()..token = 'synthetic-test-token',
      adapter,
    );
    await tester.pumpWidget(
      UncontrolledProviderScope(
        container: container,
        child: const NeuroConnectApp(),
      ),
    );
    for (var i = 0; i < 5; i++) {
      await tester.pump(const Duration(milliseconds: 100));
    }
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
    expect(find.text('Mi seguimiento'), findsOneWidget);
    adapter.analyticsGate!.complete();
    adapter.analyticsGate = null;
    await tester.pumpAndSettle();
    expect(find.text('Objetivos activos'), findsOneWidget);
  });
}
