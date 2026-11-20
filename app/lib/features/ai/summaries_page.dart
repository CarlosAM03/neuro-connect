import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/widgets/page_frame.dart';
import 'summary_repository.dart';

const summaryUnavailable = 'Resúmenes generados por IA aún no disponibles';
const summaryDisclaimer =
    'Contenido informativo de seguimiento. No constituye diagnóstico ni sustituye atención profesional. Las métricas oficiales están en Seguimiento.';
String summaryStatus(String status) => switch (status) {
  'COMPLETED' => 'Completado',
  'FAILED' => 'No se pudo generar',
  _ => 'Pendiente',
};

class SummariesPage extends ConsumerWidget {
  const SummariesPage({super.key, this.ownerId});
  final String? ownerId;
  String get path =>
      ownerId == null ? '/summaries' : '/support/owners/$ownerId/summaries';
  @override
  Widget build(BuildContext context, WidgetRef ref) => PageFrame(
    title: ownerId == null
        ? 'Mis resúmenes'
        : 'Resúmenes compartidos · Solo lectura',
    actions: [
      IconButton(
        tooltip: 'Actualizar resúmenes',
        onPressed: () => ref.invalidate(summariesProvider(ownerId)),
        icon: const Icon(Icons.refresh),
      ),
    ],
    child: ref
        .watch(summariesProvider(ownerId))
        .when(
          skipLoadingOnRefresh: false,
          loading: () => const Center(
            child: CircularProgressIndicator(
              semanticsLabel: 'Cargando resúmenes',
            ),
          ),
          error: (e, _) =>
              ErrorView(e, () => ref.invalidate(summariesProvider(ownerId))),
          data: (items) => ListView(
            padding: const EdgeInsets.all(24),
            children: [
              const Text(summaryUnavailable),
              const Text(
                'La generación se habilitará cuando exista un proveedor real. No se generan resúmenes de demostración.',
              ),
              const SizedBox(height: 16),
              if (items.isEmpty)
                const Text('Todavía no hay resúmenes para consultar.'),
              for (final item in items)
                Card(
                  child: ListTile(
                    title: Text(
                      '${dateLabel(item.start)} – ${dateLabel(item.end)}',
                    ),
                    subtitle: Text(summaryStatus(item.status)),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => context.go('$path/${item.id}'),
                  ),
                ),
              const SizedBox(height: 16),
              const Text(summaryDisclaimer),
            ],
          ),
        ),
  );
}

class SummaryDetailPage extends ConsumerWidget {
  const SummaryDetailPage({super.key, required this.id, this.ownerId});
  final String id;
  final String? ownerId;
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final key = (owner: ownerId, id: id);
    return PageFrame(
      title: ownerId == null
          ? 'Detalle del resumen'
          : 'Resumen compartido · Solo lectura',
      actions: [
        IconButton(
          tooltip: 'Actualizar resumen',
          onPressed: () => ref.invalidate(summaryProvider(key)),
          icon: const Icon(Icons.refresh),
        ),
      ],
      child: ref
          .watch(summaryProvider(key))
          .when(
            skipLoadingOnRefresh: false,
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (e, _) =>
                ErrorView(e, () => ref.invalidate(summaryProvider(key))),
            data: (item) => ListView(
              padding: const EdgeInsets.all(24),
              children: [
                Text('${dateLabel(item.start)} – ${dateLabel(item.end)}'),
                Text(summaryStatus(item.status)),
                const SizedBox(height: 16),
                if (item.status == 'COMPLETED' && item.content != null) ...[
                  const Text('Resumen generado por IA'),
                  SelectableText(item.content!),
                ] else
                  const Text(
                    'Este resumen no tiene contenido disponible. La generación aún no está habilitada.',
                  ),
                const SizedBox(height: 24),
                const Text(summaryDisclaimer),
                TextButton(
                  onPressed: () => context.go(
                    ownerId == null
                        ? '/summaries'
                        : '/support/owners/$ownerId/summaries',
                  ),
                  child: const Text('Volver a resúmenes'),
                ),
              ],
            ),
          ),
    );
  }
}
