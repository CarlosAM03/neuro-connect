import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:neuroconnect/app/app.dart';
import 'package:neuroconnect/features/activity/activity_repository.dart';

import 'widget_test.dart' show MemoryStore, FixtureAdapter, setup;

class SupportFixture extends FixtureAdapter {
  bool progress = false, revoked = false, exists = true, fail = false;
  final permissions = <Map<String, dynamic>>[];
  @override
  Future<ResponseBody> fetch(
    RequestOptions o,
    Stream<Uint8List>? stream,
    Future<void>? cancel,
  ) async {
    if (!o.path.startsWith('/support-network') &&
        !o.path.startsWith('/audit-events')) {
      return super.fetch(o, stream, cancel);
    }
    requests.add(o);
    final owner = {'id': 'owner-a', 'displayName': 'Persona compartida'};
    final relation = {
      'id': 'rel',
      'ownerId': 'owner-a',
      'supporterId': 'b',
      'supporter': {'id': 'b', 'displayName': 'Persona B'},
      'canViewGoals': true,
      'canViewProgress': progress,
      'canViewSummaries': false,
      'expiresAt': null,
      'revokedAt': revoked ? '2026-10-14T00:00:00Z' : null,
    };
    Object data = [];
    if (o.path.endsWith('/revoke')) {
      revoked = true;
      data = relation;
    } else if (o.path.contains('/relationships')) {
      if (o.method != 'GET') {
        permissions.add(Map<String, dynamic>.from(o.data as Map));
        exists = true;
        progress = (o.data as Map)['canViewProgress'] as bool;
        data = relation;
      } else {
        data = exists ? [relation] : [];
      }
    } else if (o.path == '/support-network/owners') {
      data = revoked
          ? []
          : [
              {
                'owner': owner,
                'canViewProgress': progress,
                'canViewSummaries': false,
              },
            ];
    } else if (o.path.endsWith('/goals')) {
      data = [
        {
          'id': 'shared-goal',
          'title': 'Objetivo compartido',
          'status': 'CANCELLED',
          'progress': 40,
        },
      ];
    } else if (o.path.endsWith('/progress')) {
      data = {
        'goalId': 'shared-goal',
        'currentProgress': 40,
        'previousProgress': null,
        'progressDelta': null,
        'averageDifficulty': 2,
        'totalCheckIns': 1,
        'checkInsLast28Days': 1,
        'daysSinceLastCheckIn': 1,
        'trend': 'STABLE',
        'insufficientHistory': true,
        'timeline': [
          {
            'date': '2026-10-14T00:00:00Z',
            'progress': 40,
            'difficulty': 2,
            'completion': 'PARTIAL',
          },
        ],
      };
    } else if (o.path == '/audit-events') {
      data = {
        'items': [
          {
            'action': 'GOAL_CANCELLED',
            'payload': {'title': 'Objetivo compartido'},
            'occurredAt': '2026-10-14T00:00:00Z',
          },
        ],
        'total': 1,
      };
    }
    return ResponseBody.fromString(
      jsonEncode(data),
      fail ? 503 : 200,
      headers: {
        Headers.contentTypeHeader: ['application/json'],
      },
    );
  }
}

Future<ProviderContainer> mountSupport(
  WidgetTester tester,
  SupportFixture adapter,
  String path,
) async {
  final container = setup(MemoryStore()..token = 'synthetic-token', adapter);
  addTearDown(container.dispose);
  await tester.pumpWidget(
    UncontrolledProviderScope(
      container: container,
      child: const NeuroConnectApp(),
    ),
  );
  await tester.pumpAndSettle();
  container.read(routerProvider).go(path);
  await tester.pumpAndSettle();
  return container;
}

void main() {
  test('void activity distinguishes original and resulting progress, preserving legacy events', () {
    ActivityEntry entry(Map<String, dynamic> payload) =>
        ActivityEntry.fromJson({
          'action': 'CHECKIN_VOIDED',
          'payload': {'goalTitle': 'Lectura', ...payload},
          'occurredAt': '2026-10-15T00:00:00Z',
        });
    expect(
      entry({'voidedProgress': 70, 'resultingGoalProgress': 40}).message,
      'Invalidaste un check-in de “Lectura”: progreso invalidado 70%; progreso efectivo 40%.',
    );
    expect(
      entry({'voidedProgress': 40, 'resultingGoalProgress': 0}).message,
      contains('efectivo 0%'),
    );
    expect(
      entry({'progress': 40}).message,
      'Invalidaste un check-in de “Lectura”.',
    );
  });
  testWidgets(
    'cancelled owner goal retains history and offers reactivation only',
    (t) async {
      final a = SupportFixture()..goalStatus = 'CANCELLED';
      await mountSupport(t, a, '/goals/goal-a');
      expect(find.text('Estado: Cancelado'), findsOneWidget);
      expect(find.text('Reactivar objetivo'), findsOneWidget);
      expect(find.text('Marcar como completado'), findsNothing);
      expect(find.text('Cancelar objetivo'), findsNothing);
      expect(
        t
            .widget<FilledButton>(
              find.widgetWithText(FilledButton, 'Registrar check-in'),
            )
            .onPressed,
        isNull,
      );
      await t.scrollUntilVisible(find.text('Comentario privado'), 200);
      expect(find.text('Comentario privado'), findsOneWidget);
    },
  );
  testWidgets(
    'void confirmation explains retained history and uses canonical action',
    (t) async {
      final a = SupportFixture();
      await mountSupport(t, a, '/goals/goal-a');
      await t.scrollUntilVisible(find.text('Invalidar check-in'), 200);
      await t.drag(find.byType(ListView), const Offset(0, -250));
      await t.pumpAndSettle();
      await t.tap(find.text('Invalidar check-in'));
      await t.pumpAndSettle();
      expect(find.textContaining('Se conservará el registro'), findsOneWidget);
      await t.tap(find.text('Confirmar'));
      await t.pumpAndSettle();
      expect(
        a.requests.any(
          (r) =>
              r.path == '/goals/goal-a/check-ins/check-a/void' &&
              r.method == 'POST',
        ),
        isTrue,
      );
      expect(a.requests.any((r) => r.method == 'DELETE'), isFalse);
    },
  );
  testWidgets(
    'owner adds exact email with explicit permissions and no role switch',
    (t) async {
      final a = SupportFixture()..exists = false;
      await mountSupport(t, a, '/support/relationships');
      expect(find.text('Aún no has agregado integrantes.'), findsOneWidget);
      await t.tap(find.text('Agregar integrante'));
      await t.pumpAndSettle();
      await t.enterText(find.byType(TextField), 'b@example.com');
      await t.tap(find.text('Guardar acceso'));
      await t.pumpAndSettle();
      expect(a.permissions.single, {
        'supporterEmail': 'b@example.com',
        'canViewGoals': true,
        'canViewProgress': false,
        'canViewSummaries': false,
        'expiresAt': null,
      });
      expect(find.text('Persona B'), findsOneWidget);
    },
  );
  testWidgets(
    'owner changes progress permission and confirms persistent revoke',
    (t) async {
      final a = SupportFixture();
      await mountSupport(t, a, '/support/relationships');
      await t.tap(find.text('Editar permisos y expiración'));
      await t.pumpAndSettle();
      await t.tap(find.text('Ver progreso detallado'));
      await t.pumpAndSettle();
      await t.tap(find.text('Guardar acceso'));
      await t.pumpAndSettle();
      expect(a.permissions.single['canViewProgress'], isTrue);
      await t.tap(find.text('Revocar acceso'));
      await t.pumpAndSettle();
      await t.tap(find.text('Confirmar'));
      await t.pumpAndSettle();
      expect(find.text('Estado: Revocada'), findsOneWidget);
      expect(find.text('Reactivar relación'), findsOneWidget);
    },
  );
  testWidgets(
    'supporter sees contextual owner and cancelled snapshot but no progress action',
    (t) async {
      final a = SupportFixture();
      await mountSupport(t, a, '/support/owners');
      await t.tap(find.text('Persona compartida'));
      await t.pumpAndSettle();
      expect(
        find.text('Estás viendo información compartida por Persona compartida'),
        findsOneWidget,
      );
      expect(find.text('Cancelado · Progreso actual: 40%'), findsOneWidget);
      expect(
        find.text('No tienes permiso para consultar el progreso detallado.'),
        findsOneWidget,
      );
      expect(find.textContaining('Ver progreso de'), findsNothing);
      expect(find.text('Editar objetivo'), findsNothing);
      expect(a.requests.where((r) => r.path.endsWith('/progress')), isEmpty);
    },
  );
  testWidgets('delegated refresh removes cached goals when access is revoked', (
    t,
  ) async {
    final a = SupportFixture();
    await mountSupport(t, a, '/support/owners/owner-a');
    expect(find.text('Objetivo compartido'), findsOneWidget);
    a.revoked = true;
    await t.tap(find.byTooltip('Actualizar acceso compartido'));
    await t.pumpAndSettle();
    expect(find.text('Objetivo compartido'), findsNothing);
    expect(find.textContaining('El acceso pudo cambiar'), findsOneWidget);
    a.revoked = false;
    await t.tap(find.text('Reintentar'));
    await t.pumpAndSettle();
    expect(find.text('Objetivo compartido'), findsOneWidget);
  });
  testWidgets(
    'permitted delegated progress shows effective timeline without editing',
    (t) async {
      final a = SupportFixture()..progress = true;
      await mountSupport(t, a, '/support/owners/owner-a');
      await t.tap(find.text('Ver progreso de Objetivo compartido'));
      await t.pumpAndSettle();
      expect(
        find.text('Progreso compartido: Objetivo compartido'),
        findsOneWidget,
      );
      expect(find.textContaining('Dificultad 2/5'), findsOneWidget);
      expect(find.text('Registrar check-in'), findsNothing);
      expect(find.text('Invalidar check-in'), findsNothing);
    },
  );
  testWidgets(
    'owner activity renders Spanish descriptions instead of raw payload',
    (t) async {
      await mountSupport(t, SupportFixture(), '/activity');
      expect(
        find.text('Cancelaste el objetivo “Objetivo compartido”.'),
        findsOneWidget,
      );
      expect(find.textContaining('GOAL_CANCELLED'), findsNothing);
      expect(find.text('Página 1'), findsOneWidget);
    },
  );
  testWidgets('support network error can be retried', (t) async {
    final a = SupportFixture()..fail = true;
    await mountSupport(t, a, '/support/owners');
    expect(find.text('Reintentar'), findsOneWidget);
    a.fail = false;
    await t.tap(find.text('Reintentar'));
    await t.pumpAndSettle();
    expect(find.text('Persona compartida'), findsOneWidget);
  });
  test('activity messages cover all permission and historical changes', () {
    for (final action in [
      'CHECKIN_VOIDED',
      'SUPPORT_EXPIRATION_UPDATED',
      'SUPPORT_RELATIONSHIP_REACTIVATED',
      'SUPPORT_PERMISSIONS_UPDATED',
    ]) {
      final entry = ActivityEntry.fromJson({
        'action': action,
        'payload': {'goalTitle': 'Lectura', 'supporterName': 'Ana'},
        'occurredAt': '2026-10-14T00:00:00Z',
      });
      expect(entry.message, isNot(contains(action)));
      expect(entry.message, isNot(contains('{')));
    }
  });
}
