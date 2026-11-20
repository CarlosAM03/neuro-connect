# Acciones exclusivas del responsable

No ejecutadas por Codex; después del smoke/revisión/PR/merge humanos:

1. Resolver DEC-001, instalar Android SDK y ejecutar la demo; validar iOS si dispone
   de macOS. Completar `SMOKE_HUMANO.md` usando plantilla del paquete.
2. Revisar planes vigentes/capacidad $0; elegir OCI Always Free o fallback Render
   Free. Mantener Cloudflare Pages + Neon Free PostgreSQL16. Sin autoscaling/addons
   pagos o sustitución de arquitectura. Detener alta si exige gasto obligatorio.
3. Crear cuentas/proyecto/DB/VM manualmente, configurar nombre gratuito, TLS,
   firewall, SSH por clave y permisos. No exponer DB ni API interna de VM.
4. Cargar secretos en proveedor/archivo protegido, CORS exacto, NODE_ENV production,
   Swagger/AI Preview false, sin keys IA ni seed productivo.
5. Revisar migraciones, backup si hay datos, desplegar imagen aprobada por SHA,
   health/readiness; build Web con URL HTTPS final y subida Pages manual.
6. Probar deep links, Auth/Goal/CheckIn/Analytics/Support/Revocación y generación
   indisponible, desde navegador externo y Android. Reiniciar backend y comprobar
   persistencia externa. Registrar evidencia sin credenciales.
7. Configurar monitor gratuito Web/API, probar alerta, backup cifrado fuera del host,
   restore a DB nueva y rollback de imagen/Web. Registrar costos obligatorios $0.
8. Completar sprint IA formal ADR-005 y evidencias académicas antes de plantear
   v1.0.0. Este bloque no crea tag/release ni acredita aceptación humana.

Comandos y restricciones: `docs/operations/*-RUNBOOK.md`.
