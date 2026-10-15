import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/widgets/page_frame.dart';
import 'support_repository.dart';

class OwnerSupportPage extends ConsumerWidget {
  const OwnerSupportPage({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) => PageFrame(
    title: 'Mi red de apoyo',
    actions: [
      IconButton(
        tooltip: 'Actualizar red',
        icon: const Icon(Icons.refresh),
        onPressed: () => ref.invalidate(relationshipsProvider),
      ),
    ],
    child: ref
        .watch(relationshipsProvider)
        .when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) =>
              ErrorView(e, () => ref.invalidate(relationshipsProvider)),
          data: (items) => ListView(
            padding: const EdgeInsets.all(24),
            children: [
              const Text(
                'Tú decides qué compartes y durante cuánto tiempo. Las notas de check-ins siempre son privadas.',
              ),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: () => _edit(context, ref),
                child: const Text('Agregar integrante'),
              ),
              if (items.isEmpty)
                const Padding(
                  padding: EdgeInsets.all(16),
                  child: Text('Aún no has agregado integrantes.'),
                ),
              for (final r in items)
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          r.supporterName,
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        Text('Estado: ${r.status}'),
                        Text(
                          'Objetivos: ${r.goals ? "Sí" : "No"} · Progreso: ${r.progress ? "Sí" : "No"} · Resúmenes: ${r.summaries ? "Sí" : "No"}',
                        ),
                        Text(
                          r.expiresAt == null
                              ? 'Sin expiración'
                              : 'Expira: ${dateLabel(r.expiresAt!)} ${TimeOfDay.fromDateTime(r.expiresAt!.toLocal()).format(context)}',
                        ),
                        Wrap(
                          spacing: 12,
                          children: [
                            OutlinedButton(
                              onPressed: () => _edit(context, ref, r),
                              child: Text(
                                r.active
                                    ? 'Editar permisos y expiración'
                                    : 'Reactivar relación',
                              ),
                            ),
                            if (r.revokedAt == null)
                              TextButton(
                                onPressed: () async {
                                  if (!await confirmDeletion(
                                    context,
                                    '¿Revocar el acceso de ${r.supporterName}? La relación y su historia se conservarán.',
                                  )) {
                                    return;
                                  }
                                  try {
                                    await ref
                                        .read(supportRepositoryProvider)
                                        .revoke(r.id);
                                    ref.invalidate(relationshipsProvider);
                                  } catch (e) {
                                    if (context.mounted) {
                                      showFailure(context, e);
                                    }
                                  }
                                },
                                child: const Text('Revocar acceso'),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
  );
  Future<void> _edit(
    BuildContext context,
    WidgetRef ref, [
    SupportRelationship? row,
  ]) async {
    final saved = await showDialog<bool>(
      context: context,
      builder: (_) => _SupportForm(row: row),
    );
    if (saved == true) ref.invalidate(relationshipsProvider);
  }
}

class _SupportForm extends ConsumerStatefulWidget {
  const _SupportForm({this.row});
  final SupportRelationship? row;
  @override
  ConsumerState<_SupportForm> createState() => _SupportFormState();
}

class _SupportFormState extends ConsumerState<_SupportForm> {
  final email = TextEditingController();
  late bool goals = widget.row?.goals ?? true,
      progress = widget.row?.progress ?? false,
      summaries = widget.row?.summaries ?? false;
  late DateTime? expires = widget.row?.expiresAt;
  bool busy = false;
  String? error;
  @override
  void dispose() {
    email.dispose();
    super.dispose();
  }

  Future<void> save() async {
    if (busy) return;
    if (!goals || (widget.row == null && !email.text.trim().contains('@'))) {
      setState(() => error = 'Revisa el correo y permite al menos Objetivos.');
      return;
    }
    setState(() {
      busy = true;
      error = null;
    });
    try {
      await ref.read(supportRepositoryProvider).save(widget.row?.id, {
        if (widget.row == null) 'supporterEmail': email.text.trim(),
        'canViewGoals': goals,
        'canViewProgress': progress,
        'canViewSummaries': summaries,
        'expiresAt': expires?.toUtc().toIso8601String(),
      }, reactivate: widget.row != null && !widget.row!.active);
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      if (mounted) {
        setState(
          () => error = 'No se pudo guardar. Revisa el correo, los permisos y la expiración.',
        );
      }
    } finally {
      if (mounted) setState(() => busy = false);
    }
  }

  @override
  Widget build(BuildContext context) => AlertDialog(
    title: Text(
      widget.row == null ? 'Agregar integrante' : widget.row!.supporterName,
    ),
    content: SizedBox(
      width: 420,
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (widget.row == null)
              TextField(
                controller: email,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                  labelText: 'Correo exacto de cuenta existente',
                ),
              ),
            CheckboxListTile(
              title: const Text('Ver objetivos'),
              value: goals,
              onChanged: busy
                  ? null
                  : (v) => setState(() {
                      goals = v!;
                      if (!goals) {
                        progress = false;
                        summaries = false;
                      }
                    }),
            ),
            CheckboxListTile(
              title: const Text('Ver progreso detallado'),
              value: progress,
              onChanged: busy || !goals
                  ? null
                  : (v) => setState(() => progress = v!),
            ),
            CheckboxListTile(
              title: const Text('Ver resúmenes'),
              value: summaries,
              onChanged: busy || !goals
                  ? null
                  : (v) => setState(() => summaries = v!),
            ),
            const Text(
              'Resúmenes: permiso preparado; todavía no hay resúmenes IA productivos.',
            ),
            Text(
              expires == null
                  ? 'Sin expiración'
                  : 'Expira: ${dateLabel(expires!)} ${TimeOfDay.fromDateTime(expires!.toLocal()).format(context)}',
            ),
            TextButton(
              onPressed: busy
                  ? null
                  : () async {
                      final now = DateTime.now();
                      final date = await showDatePicker(
                        context: context,
                        initialDate: now,
                        firstDate: now,
                        lastDate: DateTime(2200),
                      );
                      if (date == null || !context.mounted) return;
                      final time = await showTimePicker(
                        context: context,
                        initialTime: TimeOfDay.now(),
                      );
                      if (time != null && mounted) {
                        setState(
                          () => expires = DateTime(
                            date.year,
                            date.month,
                            date.day,
                            time.hour,
                            time.minute,
                          ),
                        );
                      }
                    },
              child: const Text('Configurar expiración'),
            ),
            TextButton(
              onPressed: busy ? null : () => setState(() => expires = null),
              child: const Text('Sin fecha de expiración'),
            ),
            if (error != null)
              Text(
                error!,
                style: TextStyle(color: Theme.of(context).colorScheme.error),
              ),
          ],
        ),
      ),
    ),
    actions: [
      TextButton(
        onPressed: busy ? null : () => Navigator.pop(context),
        child: const Text('Cancelar'),
      ),
      FilledButton(
        onPressed: busy ? null : save,
        child: Text(busy ? 'Guardando…' : 'Guardar acceso'),
      ),
    ],
  );
}
