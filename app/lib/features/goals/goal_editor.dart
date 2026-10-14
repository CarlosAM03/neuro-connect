import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/widgets/page_frame.dart';
import 'goal_providers.dart';
import 'goal_repository.dart';

class GoalEditor extends ConsumerWidget {
  const GoalEditor({super.key, this.id});
  final String? id;
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (id == null) return const _GoalForm();
    return ref
        .watch(goalProvider(id!))
        .when(
          loading: () => const PageFrame(
            title: 'Editar objetivo',
            child: Center(child: CircularProgressIndicator()),
          ),
          error: (error, _) => PageFrame(
            title: 'Editar objetivo',
            child: ErrorView(error, () => ref.invalidate(goalProvider(id!))),
          ),
          data: (goal) => _GoalForm(goal: goal),
        );
  }
}

class _GoalForm extends ConsumerStatefulWidget {
  const _GoalForm({this.goal});
  final Goal? goal;
  @override
  ConsumerState<_GoalForm> createState() => _GoalFormState();
}

class _GoalFormState extends ConsumerState<_GoalForm> {
  final _form = GlobalKey<FormState>();
  late final _title = TextEditingController(text: widget.goal?.title);
  late final _description = TextEditingController(
    text: widget.goal?.description,
  );
  late final _category = TextEditingController(text: widget.goal?.category);
  late DateTime? _date = widget.goal?.targetDate?.toLocal();
  bool _busy = false;
  @override
  void dispose() {
    _title.dispose();
    _description.dispose();
    _category.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (_busy || !_form.currentState!.validate()) return;
    setState(() => _busy = true);
    try {
      final data = {
        'title': _title.text.trim(),
        'description': _description.text.trim().isEmpty
            ? null
            : _description.text.trim(),
        'category': _category.text.trim().isEmpty
            ? null
            : _category.text.trim(),
        'targetDate': _date?.toUtc().toIso8601String(),
      };
      final repo = ref.read(goalRepositoryProvider);
      final goal = widget.goal == null
          ? await repo.create(data)
          : await repo.update(widget.goal!.id, data);
      if (!mounted) return;
      refreshGoal(ref, goal.id);
      context.go('/goals/${goal.id}');
    } catch (error) {
      if (mounted) showFailure(context, error);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) => PageFrame(
    title: widget.goal == null ? 'Nuevo objetivo' : 'Editar objetivo',
    child: Form(
      key: _form,
      child: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          TextFormField(
            controller: _title,
            decoration: const InputDecoration(labelText: 'Título'),
            maxLength: 200,
            validator: (v) =>
                v == null || v.trim().isEmpty ? 'Escribe un título' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _description,
            decoration: const InputDecoration(
              labelText: 'Descripción (opcional)',
            ),
            maxLength: 5000,
            minLines: 2,
            maxLines: 5,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _category,
            decoration: const InputDecoration(
              labelText: 'Categoría (opcional)',
            ),
            maxLength: 100,
          ),
          const SizedBox(height: 16),
          Text(
            _date == null
                ? 'Sin fecha objetivo'
                : 'Fecha objetivo: ${dateLabel(_date!)}',
          ),
          Wrap(
            spacing: 8,
            children: [
              OutlinedButton(
                onPressed: _busy
                    ? null
                    : () async {
                        final first = DateTime(2000), last = DateTime(2200);
                        final date = await showDatePicker(
                          context: context,
                          initialDate:
                              _date == null ||
                                  _date!.isBefore(first) ||
                                  _date!.isAfter(last)
                              ? DateTime.now()
                              : _date,
                          firstDate: first,
                          lastDate: last,
                        );
                        if (date != null && mounted) {
                          setState(() => _date = date);
                        }
                      },
                child: const Text('Elegir fecha'),
              ),
              TextButton(
                onPressed: _busy ? null : () => setState(() => _date = null),
                child: const Text('Quitar fecha'),
              ),
            ],
          ),
          const SizedBox(height: 24),
          const Text('El progreso se registra mediante check-ins.'),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: _busy ? null : _save,
            child: Text(_busy ? 'Guardando…' : 'Guardar objetivo'),
          ),
          TextButton(
            onPressed: _busy
                ? null
                : () => context.go(
                    widget.goal == null
                        ? '/goals'
                        : '/goals/${widget.goal!.id}',
                  ),
            child: const Text('Cancelar'),
          ),
        ],
      ),
    ),
  );
}
