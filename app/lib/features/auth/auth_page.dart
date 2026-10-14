import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/auth/session.dart';
import '../../core/api/api_client.dart';
import '../../core/widgets/page_frame.dart';

class AuthPage extends ConsumerStatefulWidget {
  const AuthPage({super.key, this.register = false});
  final bool register;
  @override
  ConsumerState<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends ConsumerState<AuthPage> {
  final _form = GlobalKey<FormState>();
  final _email = TextEditingController(),
      _password = TextEditingController(),
      _name = TextEditingController();
  bool _busy = false;
  String? _error;
  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    _name.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_busy || !_form.currentState!.validate()) return;
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      if (widget.register) {
        await ref
            .read(authRepositoryProvider)
            .register(_email.text, _password.text, _name.text);
        if (mounted) {
          context.go('/login');
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Cuenta creada. Inicia sesión.')),
          );
        }
      } else {
        await ref
            .read(sessionProvider.notifier)
            .login(_email.text, _password.text);
      }
    } catch (error) {
      if (mounted) setState(() => _error = errorMessage(error));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) => PageFrame(
    title: 'NeuroConnect',
    private: false,
    child: Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 440),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _form,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  widget.register ? 'Crear cuenta' : 'Iniciar sesión',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                const SizedBox(height: 12),
                const Text(
                  'Un espacio para dar seguimiento a tus objetivos, a tu ritmo.',
                ),
                const SizedBox(height: 24),
                if (widget.register) ...[
                  TextFormField(
                    controller: _name,
                    decoration: const InputDecoration(labelText: 'Nombre'),
                    maxLength: 100,
                    validator: (v) => v == null || v.trim().isEmpty
                        ? 'Escribe tu nombre'
                        : null,
                  ),
                  const SizedBox(height: 16),
                ],
                TextFormField(
                  controller: _email,
                  decoration: const InputDecoration(
                    labelText: 'Correo electrónico',
                  ),
                  keyboardType: TextInputType.emailAddress,
                  autofillHints: const [AutofillHints.email],
                  validator: (v) =>
                      v == null ||
                          !RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
                              .hasMatch(v.trim())
                      ? 'Escribe un correo válido'
                      : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _password,
                  decoration: const InputDecoration(
                    labelText: 'Contraseña (mínimo 8 caracteres)',
                  ),
                  obscureText: true,
                  maxLength: 128,
                  onFieldSubmitted: (_) => _submit(),
                  validator: (v) => v == null || v.length < 8
                      ? 'Usa al menos 8 caracteres'
                      : null,
                ),
                const SizedBox(height: 16),
                if (_error != null) ...[
                  Text(
                    _error!,
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.error,
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
                FilledButton(
                  onPressed: _busy ? null : _submit,
                  child: Text(
                    _busy
                        ? 'Procesando…'
                        : widget.register
                        ? 'Crear cuenta'
                        : 'Entrar',
                  ),
                ),
                TextButton(
                  onPressed: _busy
                      ? null
                      : () => context.go(
                          widget.register ? '/login' : '/register',
                        ),
                  child: Text(
                    widget.register ? 'Ya tengo cuenta' : 'Crear cuenta',
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}
