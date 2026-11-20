import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:neuroconnect/app/app.dart';

import 'widget_test.dart' show MemoryStore, FixtureAdapter, setup;
import 'summaries_test.dart' show SummaryFixture;

void main() {
  for (final width in [320.0, 1280.0]) {
    testWidgets('goals and summaries fit width $width at 200% text', (
      tester,
    ) async {
      tester.view.devicePixelRatio = 1;
      tester.view.physicalSize = Size(width, 960);
      tester.platformDispatcher.textScaleFactorTestValue = 2;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);
      addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
      final c = setup(MemoryStore()..token = 'test-token', SummaryFixture());
      await tester.pumpWidget(
        UncontrolledProviderScope(container: c, child: const NeuroConnectApp()),
      );
      await tester.pumpAndSettle();
      c.read(routerProvider).go('/goals');
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
      expect(find.text('Cancelados'), findsOneWidget);
      // Use the real empty API seam rather than generating content.
      c.read(routerProvider).go('/profile');
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
      c.read(routerProvider).go('/summaries');
      await tester.pumpAndSettle();
      expect(
        find.text('Todavía no hay resúmenes para consultar.'),
        findsOneWidget,
      );
      expect(tester.takeException(), isNull);
    });
  }
  testWidgets(
    'authentication supports keyboard focus, labels, contrast and touch targets',
    (tester) async {
      final semantics = tester.ensureSemantics();
      final c = setup(MemoryStore(), FixtureAdapter());
      await tester.pumpWidget(
        UncontrolledProviderScope(container: c, child: const NeuroConnectApp()),
      );
      await tester.pumpAndSettle();
      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.pump();
      expect(FocusManager.instance.primaryFocus, isNotNull);
      expect(
        tester
            .widgetList<EditableText>(find.byType(EditableText))
            .any((field) => field.focusNode.hasFocus),
        isTrue,
      );
      await expectLater(tester, meetsGuideline(textContrastGuideline));
      await expectLater(tester, meetsGuideline(labeledTapTargetGuideline));
      await expectLater(tester, meetsGuideline(androidTapTargetGuideline));
      semantics.dispose();
    },
  );
}
