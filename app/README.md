# Cliente NeuroConnect

Flutter 3.47.5 / Dart 3.13.4, Material 3, Riverpod, go_router, Dio y fl_chart. Pantallas en español: registro, login, perfil, objetivos/lifecycle, check-ins, historial, dashboard de seguimiento y análisis por objetivo. Analytics proviene del backend; la app no clasifica tendencias.

```sh
flutter pub get --enforce-lockfile
flutter analyze
flutter test
flutter build web --dart-define=API_BASE_URL=http://localhost:3000/api/v1
flutter run -d chrome --web-port=5173 --dart-define=API_BASE_URL=http://localhost:3000/api/v1
```

El backend debe permitir `http://localhost:5173` en CORS_ORIGINS. Para otro puerto cambia ambas configuraciones. En un emulador Android, usa `http://10.0.2.2:3000/api/v1` para desarrollo; en dispositivos utiliza un origen HTTPS accesible. La app no contiene credenciales de base de datos ni JWT_SECRET.

La URL se inyecta al compilar. Web guarda únicamente el access token en sessionStorage; Android/iOS usan almacenamiento seguro del sistema. El arranque valida el token mediante `/auth/me`; un 401 privado elimina el token y cambia la sesión a no autenticada. Logout limpia el token y los providers de datos privados reaccionan al cambio de identidad. Los errores de red permiten reintentar sin descartar una sesión potencialmente válida. No hay refresh tokens ni modo offline.

Los widgets consumen repositorios y providers; no construyen requests HTTP. Crear/editar Goal no permite cambiar progreso: este se registra mediante CheckIn. Las acciones de eliminación requieren confirmación en la UI y explican su efecto sobre el historial/progreso.

El dashboard es la entrada autenticada. La gráfica muestra fechas y progreso 0–100; el análisis incluye una timeline textual accesible. Sin registros no se fabrican puntos, y con menos de dos se muestra historial insuficiente. Los estados PAUSED/COMPLETED muestran tendencia histórica. Loading, errores, retry y vacío están probados.

Desde la raíz, `docker compose up -d --build --wait` construye y sirve toda la aplicación. El Dockerfile del frontend compila con SDK fijado y sirve mediante Nginx en 8080 sin root. `API_BASE_URL` es un build arg que se convierte en dart-define; cambiarlo requiere rebuild. Nginx ofrece `/healthz`, fallback SPA y assets locales sin depender del CDN Flutter.

Los proyectos Web, Android e iOS existentes se conservan. Este bloque valida Web; APK e iOS no fueron compilados. IA y red de apoyo corresponden a incrementos posteriores. Ver `../harness/codex/MVP1_REPORT.md`.
