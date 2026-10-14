import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/widgets/page_frame.dart';
import '../goals/goal_providers.dart';

class CheckInPage extends ConsumerStatefulWidget {
  const CheckInPage({super.key, required this.goalId});
  final String goalId;
  @override
  ConsumerState<CheckInPage> createState() => _CheckInPageState();
}

class _CheckInPageState extends ConsumerState<CheckInPage> {
  final _notes = TextEditingController();
  final _form = GlobalKey<FormState>();
  double? _progress;
  int _difficulty = 3;
  String _completion = 'PARTIAL';
  bool _busy = false;
  @override
  void dispose() {
    _notes.dispose();
    super.dispose();
  }

  Future<void> _save(int progress) async {
    if (_busy || !_form.currentState!.validate()) return;
    setState(() => _busy = true);
    try {
      await ref.read(checkInRepositoryProvider).create(widget.goalId, {
        'progress': progress,
        'difficulty': _difficulty,
        'completion': _completion,
        'notes': _notes.text.trim().isEmpty ? null : _notes.text.trim(),
      });
      if (!mounted) return;
      refreshGoal(ref, widget.goalId);
      context.go('/goals/${widget.goalId}');
    } catch (error) {
      if (mounted) showFailure(context, error);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) => PageFrame(
    title: 'Registrar check-in',
    child: ref
        .watch(goalProvider(widget.goalId))
        .when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) => ErrorView(
            error,
            () => ref.invalidate(goalProvider(widget.goalId)),
          ),
          data: (goal) {
            if (goal.status != 'ACTIVE') {
              return const Center(
                child: Text(
                  'Reactiva el objetivo para registrar nuevos check-ins.',
                ),
              );
            }
            final progress = _progress ?? goal.progress.toDouble();
            return Form(
              key: _form,
              child: ListView(
                padding: const EdgeInsets.all(24),
                children: [
                  Text(
                    goal.title,
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 24),
                  Text('Progreso: ${progress.round()}%'),
                  Slider(
                    value: progress,
                    max: 100,
                    divisions: 100,
                    label: '${progress.round()}%',
                    onChanged: _busy
                        ? null
                        : (value) => setState(() => _progress = value),
                  ),
                  const SizedBox(height: 20),
                  DropdownButtonFormField<int>(
                    initialValue: _difficulty,
                    decoration: const InputDecoration(
                      labelText: 'Dificultad percibida',
                    ),
                    items: const [
                      DropdownMenuItem(value: 1, child: Text('1 · Muy baja')),
                      DropdownMenuItem(value: 2, child: Text('2 · Baja')),
                      DropdownMenuItem(value: 3, child: Text('3 · Media')),
                      DropdownMenuItem(value: 4, child: Text('4 · Alta')),
                      DropdownMenuItem(value: 5, child: Text('5 · Muy alta')),
                    ],
                    onChanged: _busy
                        ? null
                        : (value) => setState(() => _difficulty = value!),
                  ),
                  const SizedBox(height: 20),
                  DropdownButtonFormField<String>(
                    initialValue: _completion,
                    decoration: const InputDecoration(
                      labelText: 'Cumplimiento',
                    ),
                    items: const [
                      DropdownMenuItem(
                        value: 'NOT_MET',
                        child: Text('No cumplido'),
                      ),
                      DropdownMenuItem(
                        value: 'PARTIAL',
                        child: Text('Parcial'),
                      ),
                      DropdownMenuItem(value: 'MET', child: Text('Cumplido')),
                    ],
                    onChanged: _busy
                        ? null
                        : (value) => setState(() => _completion = value!),
                  ),
                  const SizedBox(height: 20),
                  TextFormField(
                    controller: _notes,
                    decoration: const InputDecoration(
                      labelText: 'Comentario opcional (privado)',
                    ),
                    maxLength: 5000,
                    minLines: 2,
                    maxLines: 5,
                  ),
                  const SizedBox(height: 24),
                  FilledButton(
                    onPressed: _busy ? null : () => _save(progress.round()),
                    child: Text(_busy ? 'Guardando…' : 'Guardar check-in'),
                  ),
                  TextButton(
                    onPressed: _busy
                        ? null
                        : () => context.go('/goals/${widget.goalId}'),
                    child: const Text('Cancelar'),
                  ),
                ],
              ),
            );
          },
        ),
  );
}
