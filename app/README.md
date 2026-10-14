# Cliente NeuroConnect — MVP-0

Flutter 3.47.5 / Dart 3.13.4, Material 3, Riverpod, go_router y Dio. Pantallas en español: registro, login, perfil, lista/creación/edición/detalle de objetivos, lifecycle, check-ins e historial.

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

Los proyectos Web, Android e iOS están generados. Este bloque valida Web; APK e iOS no fueron compilados. Dashboard, gráficas, Analytics, IA y red de apoyo corresponden a otros incrementos. fl_chart forma parte de Foundation según el roadmap y aún no se utiliza.
