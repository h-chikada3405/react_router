# baseイメージ
ARG PYTHON_VER=3.11.10
FROM python:${PYTHON_VER}-slim-bullseye AS base
ENV UV_HTTP_TIMEOUT=120

ENV TZ=Asia/Tokyo \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONBUFFERED=1 \
    PYTHONPATH=/project \
    UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    UV_PYTHON_DOWNLOADS=never

# APIディレクトリ作成
RUN mkdir /project

# uv 設定コピー
COPY pyproject.toml /project
COPY uv.lock /project
# run pytest 必要ファイル
COPY README.md /project
COPY prisma/schema.prisma /project/prisma/schema.prisma
# uv インストール
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Place executables in the environment at the front of the path
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#using-the-environment
ENV PATH="/project/.venv/bin:$PATH"

# 実行ディレクトリ変更
WORKDIR /project

# dependencies 依存関係インストール
# Install dependencies
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#intermediate-layers
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project

# ユーザー/グループ追加
RUN addgroup --system --gid 1000 python
RUN adduser --system --uid 1000 --gid 1000 api
RUN chown -R api:python /project

# 実行ユーザー変更
USER api

# API本体コピー
COPY app /project/app

# Sync the project
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#intermediate-layers
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync

RUN prisma generate

# 開発用イメージ
FROM base AS dev

# uvicorn 起動(hot reload有効にするため)
CMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]

# 公開用イメージ
FROM base AS prod

# AWS Lambda Adapterインストール
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.7.1 /lambda-adapter /opt/extensions/lambda-adapter

# fastapi-cli 起動
CMD ["fastapi", "run", "--port", "8000"]
