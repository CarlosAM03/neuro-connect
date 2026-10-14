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
  Widget build(BuildContext context) {
    final path = GoRouterState.of(context).uri.path;
    final selected = path.startsWith('/profile')
        ? 2
        : path.startsWith('/goals')
        ? 1
        : 0;
    const routes = ['/dashboard', '/goals', '/profile'];
    final wide = private && MediaQuery.sizeOf(context).width >= 1024;
    final content = Align(
      alignment: Alignment.topCenter,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 960),
        child: child,
      ),
    );
    return Scaffold(
      appBar: AppBar(title: Text(title), actions: actions),
      body: wide
          ? Row(
              children: [
                NavigationRail(
                  selectedIndex: selected,
                  labelType: NavigationRailLabelType.all,
                  onDestinationSelected: (index) => context.go(routes[index]),
                  destinations: const [
                    NavigationRailDestination(
                      icon: Icon(Icons.insights_outlined),
                      label: Text('Seguimiento'),
                    ),
                    NavigationRailDestination(
                      icon: Icon(Icons.flag_outlined),
                      label: Text('Objetivos'),
                    ),
                    NavigationRailDestination(
                      icon: Icon(Icons.person_outline),
                      label: Text('Perfil'),
                    ),
                  ],
                ),
                const VerticalDivider(width: 1),
                Expanded(child: content),
              ],
            )
          : content,
      bottomNavigationBar: private && !wide
          ? NavigationBar(
              selectedIndex: selected,
              onDestinationSelected: (index) => context.go(routes[index]),
              destinations: const [
                NavigationDestination(
                  icon: Icon(Icons.insights_outlined),
                  label: 'Seguimiento',
                ),
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
