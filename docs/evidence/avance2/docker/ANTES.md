# Docker ANTES

Captura CLI real: 2026-11-26T18:13:55.950Z. Sin Env, credenciales ni inspect completo.

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
fb224c4efefe|globows-v2-a190000001-web-1|globows-v2-a190000001|Exited (255) 8 hours ago|globows-v2-a190000001-web|975kB (virtual 323MB)
901a72e7f7f2|globows-v2-a190000001-api-1|globows-v2-a190000001|Exited (255) 8 hours ago|globows-v2-a190000001-api|16.4kB (virtual 1.13GB)
43abe75caf97|globows-v2-a190000001-migrate-1|globows-v2-a190000001|Exited (0) 9 hours ago|globows-v2-a190000001-migrate|139kB (virtual 1.39GB)
57d327be7d2d|globows-v2-a190000001-db-1|globows-v2-a190000001|Exited (255) 8 hours ago|postgres:16.16-bookworm|20.5kB (virtual 480MB)
881dcf7eb0db|prospector-final-local-nginx-1|prospector-final-local|Exited (255) 8 hours ago|7377697a821c|24.6kB (virtual 58.4MB)
4555a7bf9b36|prospector-final-local-service-1|prospector-final-local|Exited (255) 8 hours ago|prospector-service:entrega-final|24.6kB (virtual 1.42GB)
42c928790cd6|prospector-batch-qa-20261125||Exited (0) 17 hours ago|postgres:16|16.4kB (virtual 476MB)
10006a8ae71f|globows-v2-9f910322ff-migrate-1|globows-v2-9f910322ff|Exited (0) 47 hours ago|afcf02b0af53|143kB (virtual 1.39GB)
c1cf053fa1ca|globows-v2-9f910322ff-web-1|globows-v2-9f910322ff|Exited (143) 47 hours ago|ca6771b8ae56|905kB (virtual 322MB)
dabba2ddf9d8|globows-v2-9f910322ff-api-1|globows-v2-9f910322ff|Exited (143) 47 hours ago|8355c0867f39|16.4kB (virtual 1.21GB)
6605e57106a3|globows-v2-9f910322ff-db-1|globows-v2-9f910322ff|Exited (0) 39 hours ago|postgres:16.16-bookworm|16.4kB (virtual 480MB)
53ffe99f43a8|globows-v2-p14-check-db-qa-1|globows-v2-p14-check|Exited (0) 39 hours ago|postgres:16.16-bookworm|16.4kB (virtual 480MB)
72ae850c1639|globows-v2-p08-check-db-qa-1|globows-v2-p08-check|Exited (0) 39 hours ago|postgres:16.16-bookworm|16.4kB (virtual 480MB)
9f472d2f0c62|globows-v2-p07-check-db-qa-1|globows-v2-p07-check|Exited (0) 39 hours ago|postgres:16.16-bookworm|16.4kB (virtual 480MB)
92c0aff86d91|globows-v2-9f910322ff-db-qa-1|globows-v2-9f910322ff|Exited (0) 39 hours ago|postgres:16.16-bookworm|16.4kB (virtual 480MB)
6dcdb62e86ac|neuroconnect-frontend-1|neuroconnect|Exited (0) 5 days ago|neuroconnect-frontend|28.7kB (virtual 102MB)
ae27b4219e84|neuroconnect-backend-1|neuroconnect|Exited (0) 5 days ago|neuroconnect-backend|2.38MB (virtual 613MB)
7063acab81b6|sigid-demo-b-verify||Exited (0) 7 days ago|sigid-demo:demo.1|77.8kB (virtual 70.2MB)
7c84bdfa335c|prospector-frontend-g1-db-1|prospector-frontend-g1|Exited (255) 3 weeks ago|postgres:16|20.5kB (virtual 476MB)
59508b111889|prospector-stage00-frontend||Exited (0) 4 weeks ago|prospector-saas/frontend:avance2-main-e752f6c|77.8kB (virtual 96.3MB)
cf73acfa7067|prospector-stage00-backend||Exited (0) 4 weeks ago|prospector-saas/backend:avance2-main-b51b265|49.2kB (virtual 450MB)
3f30ddd7024c|prospector-stage00-postgres||Exited (0) 4 weeks ago|postgres:16|16.4kB (virtual 476MB)
b7b3f13f04fc|prospector-g1-final-pg||Exited (255) 4 weeks ago|postgres:16|49.2kB (virtual 476MB)
dc63bf82464e|prospector-g1-qa1-pg||Exited (255) 4 weeks ago|postgres:16|49.2kB (virtual 476MB)
b0e98573a4fd|prospector-g1-pg||Exited (255) 4 weeks ago|postgres:16|73.7kB (virtual 476MB)
0ed1bc409784|prospector-frontend-sprint-db-1|prospector-frontend-sprint|Exited (0) 4 weeks ago|postgres:16|16.4kB (virtual 476MB)
403ab0614236|prospector-demo-110-db-1|prospector-demo-110|Exited (255) 4 weeks ago|postgres:16|20.5kB (virtual 476MB)
75369f65da64|prospector-avance2-core-db-1|prospector-avance2-core|Exited (255) 4 weeks ago|postgres:16|20.5kB (virtual 476MB)
c63532fc2812|saas-platform-backend-db-1|saas-platform-backend|Exited (0) 4 weeks ago|postgres:16|16.4kB (virtual 476MB)
2feb24e529c6|neuroconnect-postgres-1|neuroconnect|Exited (0) 5 days ago|postgres:16-bookworm|16.4kB (virtual 470MB)
360030aca0ff|lucid_visvesvaraya|neuroconnect|Exited (1) 6 weeks ago|b7fa4ced6fc3|4.1kB (virtual 609MB)
9eae73833518|upbeat_spence|neuroconnect|Exited (1) 6 weeks ago|0759115962c9|4.1kB (virtual 609MB)
c689471e84fb|t3-db-a|t3-replicacion|Exited (0) 4 weeks ago|postgres:16.4-alpine|631kB (virtual 260MB)
b1a279808488|t3-db-b|t3-replicacion|Exited (0) 4 weeks ago|postgres:16.4-alpine|28.7kB (virtual 259MB)
cdb3848cffb6|dev-env-audit-api-1|dev-env-audit|Exited (1) 4 weeks ago|dev-env-audit-api|1.53MB (virtual 743MB)
e0808763a00a|dev-env-audit-db-init-1|dev-env-audit|Exited (0) 4 weeks ago|dev-env-audit-db-init|2.42MB (virtual 744MB)
4c015cd9eb27|dev-env-audit-db-1|dev-env-audit|Exited (0) 4 weeks ago|postgres:16|16.4kB (virtual 476MB)
db3637a0c03a|saas-platform-backend-test-db-1|saas-platform-backend|Exited (128) 6 weeks ago|postgres:16|16.4kB (virtual 476MB)
```

## docker image ls --format

```text
d3dd14097653|globows-v2-a190000001-web:latest|428MB
ac97345267a3|globows-v2-a190000001-api:latest|1.48GB
a8623571b03b|globows-release-api:f0e30b5|1.48GB
2dd7910b0f47|globows-v2-a190000001-migrate:latest|1.91GB
8af6f8675ee1|globows-v2-free-p19-api-qa:latest|1.91GB
9e7c4f8225e6|globows-v2-a190000001-web-qa:latest|3.33GB
9462395c27b7|prospector-service:entrega-final|1.98GB
289b53f004bc|prospector-service:v1-candidate|1.94GB
2e63206e6099|globows-v2-9f910322ff-migrate:latest|1.91GB
59d1f40cfacb|globows-v2-9f910322ff-api-qa:latest|1.91GB
bf89d2c5b439|globows-v2-9f910322ff-web:latest|427MB
4e36e1b53e79|globows-v2-9f910322ff-api:latest|1.59GB
f840365f6ba9|globows-v2-9f910322ff-web-qa:latest|3.33GB
6b6461558be2|globows-v2-p14-check-web-qa:latest|3.33GB
4dff2676dd45|globows-v2-p14-check-api-qa:latest|1.91GB
1eff563f6c86|postgres:<none>|652MB
e109c2221e52|neuroconnect-frontend:latest|139MB
f92028ff8a35|neuroconnect-backend:latest|793MB
36c60f13a1fc|sigid-demo:demo.2|97.8MB
ce3efec6bc40|postgres:<none>|648MB
db5d7cd7b49b|sigid-demo:demo.1|97.8MB
b24de00298eb|nginx:1.30.7-alpine|93.5MB
e176c2c6e415|datra-s0-sail:8.5|3.22GB
e9f565d32859|node:22.23.5-bookworm-slim|329MB
dc26ae92c9fb|node:24-bookworm-slim|333MB
ca11f643d779|composer:2|316MB
0bd9d7c11b60|prospector-saas/frontend:avance2-main-e752f6c|132MB
891d1b8df9e4|prospector-saas/backend:avance2-main-b51b265|592MB
224256ec864d|dev-env-audit-db-init:latest|971MB
a36d027607b0|dev-env-audit-api:latest|971MB
0ea6700a3b4f|postgres:16-bookworm|634MB
ca0bd484cb98|postgres:16|642MB
7377697a821c|nginxinc/nginx-unprivileged:1.28-alpine|81.4MB
4a4884e8a448|node:22.19.0-bookworm-slim|326MB
30f1c0d78e0a|nginx:1.28.0-alpine|74.6MB
5660c2cbfea5|postgres:16.4-alpine|359MB
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
Images          37        19        28.17GB   16.89GB (59%)
Containers      38        0         9.925MB   9.925MB (100%)
Local Volumes   32        16        1.303GB   674.8MB (51%)
Build Cache     109       0         10.75GB   3.368GB
```

## docker compose ps -a

```text
NAME                      IMAGE                   COMMAND                  SERVICE    CREATED       STATUS                  PORTS
neuroconnect-backend-1    neuroconnect-backend    "docker-entrypoint.s…"   backend    6 days ago    Exited (0) 5 days ago   
neuroconnect-frontend-1   neuroconnect-frontend   "/docker-entrypoint.…"   frontend   6 days ago    Exited (0) 5 days ago   
neuroconnect-postgres-1   postgres:16-bookworm    "docker-entrypoint.s…"   postgres   6 weeks ago   Exited (0) 5 days ago
```
