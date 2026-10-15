import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/auth/session.dart';
import '../core/widgets/page_frame.dart';
import '../features/auth/auth_page.dart';
import '../features/profile/profile_page.dart';
import '../features/goals/goals_page.dart';
import '../features/goals/goal_editor.dart';
import '../features/goals/goal_detail_page.dart';
import '../features/check_ins/check_in_page.dart';
import '../features/analytics/dashboard_page.dart';
import '../features/analytics/goal_analytics_page.dart';
import '../features/support/owner_support_page.dart';
import '../features/support/supporter_page.dart';
import '../features/activity/activity_page.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final refresh = ValueNotifier(0);
  ref.listen(sessionProvider, (_, _) => refresh.value++);
  final router = GoRouter(
    initialLocation: '/dashboard',
    refreshListenable: refresh,
    redirect: (context, route) {
      final session = ref.read(sessionProvider);
      final path = route.uri.path;
      if (session.isLoading || session.hasError) {
        return path == '/bootstrap' ? null : '/bootstrap';
      }
      final loggedIn = session.asData?.value != null;
      if (!loggedIn && path != '/login' && path != '/register') return '/login';
      if (loggedIn && ['/login', '/register', '/bootstrap'].contains(path)) {
        return '/dashboard';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/support/relationships',
        builder: (_, _) => const OwnerSupportPage(),
      ),
      GoRoute(
        path: '/support/owners',
        builder: (_, _) => const SupporterPage(),
      ),
      GoRoute(
        path: '/support/owners/:ownerId',
        builder: (_, state) =>
            SharedOwnerPage(ownerId: state.pathParameters['ownerId']!),
      ),
      GoRoute(path: '/activity', builder: (_, _) => const ActivityPage()),
      GoRoute(path: '/dashboard', builder: (_, _) => const DashboardPage()),
      GoRoute(
        path: '/goals/:id/analytics',
        builder: (_, state) =>
            GoalAnalyticsPage(id: state.pathParameters['id']!),
      ),
      GoRoute(path: '/bootstrap', builder: (_, _) => const _BootstrapPage()),
      GoRoute(path: '/login', builder: (_, _) => const AuthPage()),
      GoRoute(
        path: '/register',
        builder: (_, _) => const AuthPage(register: true),
      ),
      GoRoute(path: '/profile', builder: (_, _) => const ProfilePage()),
      GoRoute(path: '/goals', builder: (_, _) => const GoalsPage()),
      GoRoute(path: '/goals/new', builder: (_, _) => const GoalEditor()),
      GoRoute(
        path: '/goals/:id/edit',
        builder: (_, state) => GoalEditor(id: state.pathParameters['id']!),
      ),
      GoRoute(
        path: '/goals/:id/check-in',
        builder: (_, state) => CheckInPage(goalId: state.pathParameters['id']!),
      ),
      GoRoute(
        path: '/goals/:id',
        builder: (_, state) => GoalDetailPage(id: state.pathParameters['id']!),
      ),
    ],
  );
  ref.onDispose(() {
    router.dispose();
    refresh.dispose();
  });
  return router;
});

class NeuroConnectApp extends ConsumerWidget {
  const NeuroConnectApp({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) => MaterialApp.router(
    title: 'NeuroConnect',
    locale: const Locale('es'),
    supportedLocales: const [Locale('es')],
    localizationsDelegates: GlobalMaterialLocalizations.delegates,
    debugShowCheckedModeBanner: false,
    theme: ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xff275d69)),
      scaffoldBackgroundColor: const Color(0xfff6f8f9),
      inputDecorationTheme: const InputDecorationTheme(
        border: OutlineInputBorder(),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(minimumSize: const Size(48, 48)),
      ),
    ),
    routerConfig: ref.watch(routerProvider),
  );
}

class _BootstrapPage extends ConsumerWidget {
  const _BootstrapPage();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.watch(sessionProvider);
    return PageFrame(
      title: 'NeuroConnect',
      private: false,
      child: session.hasError
          ? ErrorView(session.error!, () => ref.invalidate(sessionProvider))
          : const Center(
              child: CircularProgressIndicator(
                semanticsLabel: 'Restaurando sesión',
              ),
            ),
    );
  }
}
