import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/auth/session.dart';
import '../../core/widgets/page_frame.dart';
import '../auth/auth_repository.dart';

final profileProvider = FutureProvider.autoDispose<UserProfile>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(authRepositoryProvider).profile();
});

class ProfilePage extends ConsumerWidget {
  const ProfilePage({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) => PageFrame(
    title: 'Mi perfil',
    child: ref
        .watch(profileProvider)
        .when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) =>
              ErrorView(error, () => ref.invalidate(profileProvider)),
          data: (user) => _ProfileForm(user: user),
        ),
  );
}

class _ProfileForm extends ConsumerStatefulWidget {
  const _ProfileForm({required this.user});
  final UserProfile user;
  @override
  ConsumerState<_ProfileForm> createState() => _ProfileFormState();
}

class _ProfileFormState extends ConsumerState<_ProfileForm> {
  late final _name = TextEditingController(text: widget.user.displayName);
  final _form = GlobalKey<FormState>();
  bool _busy = false;
  @override
  void dispose() {
    _name.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (_busy || !_form.currentState!.validate()) return;
    setState(() => _busy = true);
    try {
      final user = await ref
          .read(authRepositoryProvider)
          .updateProfile(_name.text);
      ref.read(sessionProvider.notifier).updateProfile(user);
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text('Perfil actualizado')));
      }
    } catch (error) {
      if (mounted) showFailure(context, error);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.all(24),
    children: [
      OutlinedButton(
        onPressed: () => context.go('/support/relationships'),
        child: const Text('Mi red de apoyo'),
      ),
      OutlinedButton(
        onPressed: () => context.go('/support/owners'),
        child: const Text('Personas a las que apoyo'),
      ),
      OutlinedButton(
        onPressed: () => context.go('/activity'),
        child: const Text('Historial de actividad'),
      ),
      Text(widget.user.email),
      const SizedBox(height: 24),
      Form(
        key: _form,
        child: TextFormField(
          controller: _name,
          maxLength: 100,
          decoration: const InputDecoration(labelText: 'Nombre'),
          validator: (v) =>
              v == null || v.trim().isEmpty ? 'Escribe tu nombre' : null,
        ),
      ),
      FilledButton(
        onPressed: _busy ? null : _save,
        child: const Text('Guardar perfil'),
      ),
      const SizedBox(height: 24),
      OutlinedButton(
        onPressed: _busy
            ? null
            : () async {
                try {
                  await ref.read(sessionProvider.notifier).logout();
                } catch (error) {
                  if (context.mounted) showFailure(context, error);
                }
              },
        child: const Text('Cerrar sesión'),
      ),
    ],
  );
}
