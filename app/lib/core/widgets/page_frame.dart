import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../api/api_client.dart';

class PageFrame extends StatelessWidget {
  const PageFrame({
    super.key,
    required this.title,
    required this.child,
    this.actions,
    this.private = true,
  });
  final String title;
  final Widget child;
  final List<Widget>? actions;
  final bool private;
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: Text(title), actions: actions),
    body: Align(
      alignment: Alignment.topCenter,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 960),
        child: child,
      ),
    ),
    bottomNavigationBar: private
        ? NavigationBar(
            selectedIndex:
                GoRouterState.of(context).uri.path.startsWith('/profile')
                ? 1
                : 0,
            onDestinationSelected: (index) =>
                context.go(index == 0 ? '/goals' : '/profile'),
            destinations: const [
              NavigationDestination(
                icon: Icon(Icons.flag_outlined),
                label: 'Objetivos',
              ),
              NavigationDestination(
                icon: Icon(Icons.person_outline),
                label: 'Perfil',
              ),
            ],
          )
        : null,
  );
}

class ErrorView extends StatelessWidget {
  const ErrorView(this.error, this.retry, {super.key});
  final Object error;
  final VoidCallback retry;
  @override
  Widget build(BuildContext context) => Center(
    child: Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(errorMessage(error), textAlign: TextAlign.center),
          const SizedBox(height: 16),
          FilledButton(onPressed: retry, child: const Text('Reintentar')),
        ],
      ),
    ),
  );
}

Future<bool> confirmDeletion(BuildContext context, String message) async =>
    await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirmar eliminación'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Eliminar'),
          ),
        ],
      ),
    ) ??
    false;
void showFailure(BuildContext context, Object error) =>
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(errorMessage(error))));
String dateLabel(DateTime date) {
  final local = date.toLocal();
  return '${local.day.toString().padLeft(2, '0')}/${local.month.toString().padLeft(2, '0')}/${local.year}';
}
