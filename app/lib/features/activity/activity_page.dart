import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'activity_repository.dart';
import '../../core/widgets/page_frame.dart';

class ActivityPage extends ConsumerStatefulWidget {
  const ActivityPage({super.key});
  @override
  ConsumerState<ActivityPage> createState() => _ActivityPageState();
}

class _ActivityPageState extends ConsumerState<ActivityPage> {
  int page = 1;
  @override
  Widget build(BuildContext context) => PageFrame(
    title: 'Historial de actividad',
    actions: [
      IconButton(
        tooltip: 'Actualizar actividad',
        icon: const Icon(Icons.refresh),
        onPressed: () => ref.invalidate(activityProvider(page)),
      ),
    ],
    child: ref
        .watch(activityProvider(page))
        .when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) =>
              ErrorView(e, () => ref.invalidate(activityProvider(page))),
          data: (data) => ListView(
            padding: const EdgeInsets.all(24),
            children: [
              const Text(
                'Tu historial privado de cambios. La trazabilidad comienza con la incorporación de la auditoría.',
              ),
              if (data.items.isEmpty)
                const Text('Todavía no hay actividad registrada.'),
              for (final event in data.items)
                Card(
                  child: ListTile(
                    title: Text(event.message),
                    subtitle: Text(
                      '${dateLabel(event.occurredAt)} · ${TimeOfDay.fromDateTime(event.occurredAt.toLocal()).format(context)}',
                    ),
                  ),
                ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TextButton(
                    onPressed: page > 1 ? () => setState(() => page--) : null,
                    child: const Text('Anterior'),
                  ),
                  Text('Página $page'),
                  TextButton(
                    onPressed: page * 20 < data.total
                        ? () => setState(() => page++)
                        : null,
                    child: const Text('Siguiente'),
                  ),
                ],
              ),
            ],
          ),
        ),
  );
}
