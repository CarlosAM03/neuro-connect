import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:neuroconnect/app/app.dart';
import 'package:neuroconnect/features/ai/summaries_page.dart';

import 'widget_test.dart' show FixtureAdapter, MemoryStore, setup;

class SummaryFixture extends FixtureAdapter {
  bool populated = false, denied = false;
  @override
  Future<ResponseBody> fetch(
    RequestOptions o,
    Stream<Uint8List>? stream,
    Future<void>? cancel,
  ) async {
    if (!o.path.contains('/summaries')) return super.fetch(o, stream, cancel);
    requests.add(o);
    final row = {
      'id': 'fixture',
      'status': 'COMPLETED',
      'periodStart': '2026-10-01T00:00:00Z',
      'periodEnd': '2026-10-29T00:00:00Z',
      'content': 'SYNTHETIC TEST FIXTURE',
    };
    return ResponseBody.fromString(
      jsonEncode(
        denied
            ? {'message': 'Información compartida no disponible'}
            : o.path.endsWith('/fixture')
            ? row
            : populated
            ? [row]
            : [],
      ),
      denied ? 404 : 200,
      headers: {
        Headers.contentTypeHeader: ['application/json'],
      },
    );
  }
}

void main() {
  testWidgets(
    'unavailable AI is honest, empty and never sends generation requests',
    (tester) async {
      final adapter = SummaryFixture();
      final c = setup(MemoryStore()..token = 'test-token', adapter);
      await tester.pumpWidget(
        UncontrolledProviderScope(container: c, child: const NeuroConnectApp()),
      );
      await tester.pumpAndSettle();
      c.read(routerProvider).go('/summaries');
      await tester.pumpAndSettle();
      expect(find.text(summaryUnavailable), findsOneWidget);
      expect(
        find.text('Todavía no hay resúmenes para consultar.'),
        findsOneWidget,
      );
      expect(
        adapter.requests
            .where((o) => o.path.contains('/summaries'))
            .every((o) => o.method == 'GET'),
        isTrue,
      );
    },
  );
  testWidgets(
    'delegated detail is reauthorized after refresh and removes stale content',
    (tester) async {
      final adapter = SummaryFixture()..populated = true;
      final c = setup(MemoryStore()..token = 'test-token', adapter);
      await tester.pumpWidget(
        UncontrolledProviderScope(container: c, child: const NeuroConnectApp()),
      );
      await tester.pumpAndSettle();
      c.read(routerProvider).go('/support/owners/owner-a/summaries');
      await tester.pumpAndSettle();
      await tester.tap(find.byType(ListTile));
      await tester.pumpAndSettle();
      expect(find.text('SYNTHETIC TEST FIXTURE'), findsOneWidget);
      expect(find.text(summaryDisclaimer), findsOneWidget);
      adapter.denied = true;
      await tester.tap(find.byTooltip('Actualizar resumen'));
      await tester.pumpAndSettle();
      expect(find.text('SYNTHETIC TEST FIXTURE'), findsNothing);
      expect(find.text('Reintentar'), findsOneWidget);
      adapter.denied = false;
      await tester.tap(find.text('Reintentar'));
      await tester.pumpAndSettle();
      expect(find.text('SYNTHETIC TEST FIXTURE'), findsOneWidget);
      c.read(routerProvider).go('/support/owners/owner-a/summaries');
      await tester.pumpAndSettle();
      expect(find.byType(ListTile), findsOneWidget);
    },
  );
}
