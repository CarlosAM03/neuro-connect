FROM debian:bookworm-slim AS build
ARG FLUTTER_VERSION=3.47.5
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates git curl unzip xz-utils libglu1-mesa && rm -rf /var/lib/apt/lists/*
RUN git clone --depth 1 --branch ${FLUTTER_VERSION} https://github.com/flutter/flutter.git /opt/flutter
ENV PATH="/opt/flutter/bin:${PATH}" CI=true
RUN flutter config --no-analytics && flutter precache --web
WORKDIR /app
COPY pubspec.yaml pubspec.lock ./
RUN flutter pub get --enforce-lockfile
COPY lib ./lib
COPY web ./web
ARG API_BASE_URL=http://localhost:3000/api/v1
RUN flutter build web --release --no-web-resources-cdn --dart-define=API_BASE_URL=${API_BASE_URL}

FROM nginxinc/nginx-unprivileged:1.28-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build/web /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=5s --timeout=3s --retries=12 CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
