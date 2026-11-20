# Backup y restore — PostgreSQL

Un backup contiene datos personales: custodiar fuera de Git, cifrado y con acceso
limitado. No subir dumps al reporte, CI artifacts públicos o logs. Retención y
ubicación productiva las establece el responsable; no se crea servicio externo.

## Ensayo local reproducible

Desde raíz, con `.env`/`backend/.env` locales ya configurados:

```sh
docker compose up -d --wait postgres
node infra/setup-test.cjs
node infra/backup-restore-smoke.cjs
```

Requiere dependencias backend instaladas y Prisma Client generado. Solo acepta
TEST_DATABASE_URL local terminada en `_test`. Crea dos bases con nombres aleatorios
de ensayo, aplica migraciones, carga seed sintético, hace pg_dump custom y restaura
en la segunda DB nueva. Compara filas completas de seis tablas y checksums de
migraciones. El dump viaja en memoria binaria, sin redirección PowerShell que pueda
corromperlo. Desconecta y elimina exclusivamente esas dos DB creadas por el ensayo.
Nunca restaura en neuroconnect o neuroconnect_test ni borra volúmenes.

## Operación productiva manual (cliente PostgreSQL 16)

Configurar previamente conexiones de servicio `neuroconnect_source` y
`neuroconnect_restore` en pg_service.conf / gestor seguro del operador, passwords
fuera del historial de shell. El destino debe ser **una DB nueva vacía** distinta
del origen, verificada por el responsable. No ejecutar si apunta a la base viva.

```sh
pg_dump --dbname=service=neuroconnect_source --format=custom --no-owner --no-privileges --file=neuroconnect.dump
pg_restore --list neuroconnect.dump
pg_restore --dbname=service=neuroconnect_restore --no-owner --no-privileges --exit-on-error neuroconnect.dump
```

Estos comandos son sintaxis de servicio libpq, no credenciales literales. Comprobar
versión servidor/cliente, TLS, espacio/cuotas y permisos antes de iniciar. Cifrar el
dump y guardar una copia protegida fuera del host; fecha, hash y ruta protegida en
inventario privado. Validar conteos y consultas de Goals/CheckIns/Audit/Support,
readiness, login, notes privadas y revocación apuntando una instancia de prueba
al destino. Probar trigger append-only; no editar auditoría para hacer pasar conteos.

Solo después de validación y decisión humana se cambia DATABASE_URL al destino
restaurado, con escrituras detenidas durante el corte. Conservar origen y backup.
Si falla restore, detenerse y descartar únicamente el destino de ensayo mediante
operación humana identificada; no ejecutar `--clean` contra producción. Este sprint
no determina una política nueva de eliminación/retención de datos.
