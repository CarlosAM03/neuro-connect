# Docker DESPUES

Captura CLI real: 2026-11-26T18:27:20.743Z. Sin Env, credenciales ni inspect completo.

## docker context show

```text
desktop-linux
```

## docker version --format {{.Server.Version}}

```text
29.9.2
```

## docker ps -a --format

```text
5430cbe91600|neuroconnect-frontend-1|neuroconnect|Up 3 minutes (healthy)|neuroconnect-frontend|32.8kB (virtual 102MB)
16d50c9cecac|neuroconnect-backend-1|neuroconnect|Up 3 minutes (healthy)|neuroconnect-backend|2.36MB (virtual 613MB)
2feb24e529c6|neuroconnect-postgres-1|neuroconnect|Up 3 minutes (healthy)|postgres:16-bookworm|20.5kB (virtual 470MB)
360030aca0ff|lucid_visvesvaraya|neuroconnect|Exited (1) 6 weeks ago|b7fa4ced6fc3|4.1kB (virtual 609MB)
9eae73833518|upbeat_spence|neuroconnect|Exited (1) 6 weeks ago|0759115962c9|4.1kB (virtual 609MB)
```

## docker image ls --format

```text
ff603d4873aa|neuroconnect-frontend:latest|139MB
62e32b41f37a|neuroconnect-backend:latest|793MB
0ea6700a3b4f|postgres:16-bookworm|634MB
```

## docker volume ls --format

```text
dev-env-audit_dev-postgres|local
globows-v2-9f910322ff_media-data|local
globows-v2-9f910322ff_postgres-data|local
globows-v2-a190000001_media-data|local
globows-v2-a190000001_postgres-data|local
globows-v2-p02-smoke_media-data|local
globows-v2-p02-smoke_postgres-data|local
globows-v2-p04-ui_media-data|local
globows-v2-p04-ui_postgres-data|local
globows-v2-p06-ui_media-data|local
globows-v2-p06-ui_postgres-data|local
globows-v2-p07-ui_media-data|local
globows-v2-p07-ui_postgres-data|local
globows-v2-p08-ui_media-data|local
globows-v2-p08-ui_postgres-data|local
neuroconnect_postgres_data|local
prospector-avance2-core_core-pg|local
prospector-avance2-core_core-tls|local
prospector-demo-110_demo-pg|local
prospector-demo-110_demo-tls|local
prospector-final-local_metadata|local
prospector-final-nginx-credentials|local
prospector-final-service-credentials|local
prospector-frontend-g1_core-pg|local
prospector-frontend-g1_core-tls|local
prospector-frontend-sprint_core-pg|local
prospector-frontend-sprint_core-tls|local
saas-platform-backend_dev-postgres|local
sigid-demo-b-deps|local
sigid-demo-b-npm-cache|local
t3-replicacion_db_a_data|local
t3-replicacion_db_b_data|local
```

## docker system df

```text
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          3         3         1.566GB   0B (0%)
Containers      5         3         2.421MB   8.192kB (0%)
Local Volumes   32        1         1.303GB   1.229GB (94%)
Build Cache     0         0         0B        0B
```

## docker compose ps -a

```text
NAME                      IMAGE                   COMMAND                  SERVICE    CREATED         STATUS                   PORTS
neuroconnect-backend-1    neuroconnect-backend    "docker-entrypoint.s…"   backend    7 minutes ago   Up 3 minutes (healthy)   127.0.0.1:3000->3000/tcp
neuroconnect-frontend-1   neuroconnect-frontend   "/docker-entrypoint.…"   frontend   6 minutes ago   Up 3 minutes (healthy)   127.0.0.1:5173->8080/tcp
neuroconnect-postgres-1   postgres:16-bookworm    "docker-entrypoint.s…"   postgres   6 weeks ago     Up 3 minutes (healthy)   127.0.0.1:5434->5432/tcp
```
