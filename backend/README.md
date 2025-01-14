## 開発環境

依存関係をインストール

```bash
uv sync
```

仮想環境の有効化

```bash
source .venv/bin/activate
```

docker をビルド

```bash
docker compose up -d --build
```

Dockerを監視

```bash
docker compose watch
```

## printログの確認方法

```bash
docker logs -f test_fast-api
```

## migration

migration 実行

```bash
prisma migrate dev
```

migration ロールバック

```bash

```

migration リセット

```bash
prisma migrate reset
```

## seeder

コンテナin

```bash
docker exec -it test_fast-api bash
```

seeder 実行

```bash
python prisma/seed.py
```

### psqlコマンド操作

*psql →　ターミナルで PostgreSQL データベースを操作すること*

コンテナin

```sh
docker exec -it test_fast-db psql -U postgres -d vector_db
```

テーブル一覧

```sh
\dt
```

テーブル確認

```sh
\d users
SELECT * FROM users;
```

vector拡張機能インストール
```sh
CREATE EXTENSION vector;
```

## 開発ポート

エントリーポイント
http://localhost:8000

swagger UI
http://localhost:8000/docs

データベース
http://localhost:8080


## ベクトル検索

[prisma ベクトル検索導入例](https://www.mof-mof.co.jp/tech-blog/pgvector-similarity-search)

[model タイプ](https://sbert.net/docs/sentence_transformer/pretrained_models.html)
