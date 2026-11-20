# Validación de clientes Web / Android / iOS

Web: desde app, `flutter pub get --enforce-lockfile`, `flutter analyze`,
`flutter test`, `flutter build web --no-web-resources-cdn
--dart-define=API_BASE_URL=http://localhost:3000/api/v1` (comando en una línea).
La URL se incorpora al build; reconstruir al cambiar de host. Nunca es un secreto.

Android: el intento local de `flutter build apk` en este sprint falla porque
Flutter no encuentra Android SDK. No se produjo ni instaló APK. El responsable
instala Android SDK/command line tools y Java compatible con Gradle, verifica
`flutter doctor -v` y configura ANDROID_HOME o `flutter config --android-sdk RUTA`.
No cambiar versiones del proyecto para ocultar SDK ausente.

Con API HTTPS real, desde app:

```sh
flutter pub get --enforce-lockfile
flutter build apk --debug --dart-define=API_BASE_URL=https://API_HOST/api/v1
adb devices
adb install -r build/app/outputs/flutter-apk/app-debug.apk
```

La firma debug sirve para demostración, no publicación en tiendas. No se modifica
la firma release. Probar login, objetivo ACTIVE, check-in, historial, dashboard,
soporte/revocación y logout en dispositivo; conservar resultados y URL/SHA sin
datos sensibles. El workflow manual también intenta compilar debug con SDK.
Para emulador, localhost del dispositivo no apunta al host; la IP de host habitual
es 10.0.2.2, pero HTTP puede ser rechazado por la política Android. Este sprint no
habilita cleartext global. Preferir API HTTPS accesible. No introducir excepciones
productivas para facilitar la demo.

iOS: se inspeccionaron proyecto Runner, Info.plist y AppDelegate con registro de
plugins Flutter; no se agregaron llamadas nativas o dependencias. Swift/Xcode y
firma no pueden compilarse en Windows. Requiere macOS/Xcode para `flutter build
ios --no-codesign` y prueba real posterior; compatibilidad de estructura no equivale
a build o instalación acreditados. No se requieren tiendas.

Accesibilidad local: tests en 320/1280 px al 200% sobre Goals/Profile/Summaries,
focus de teclado y guidelines automáticas de contraste, labels y targets en Auth.
No equivale a certificación completa con lector de pantalla. Completar revisión
humana de dashboard, diálogos y vistas compartidas en el smoke local.
