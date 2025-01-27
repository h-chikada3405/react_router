# 現在のライブラリより安定してそうなのないの？

## そもそもなぜ現在のライブラリを選んだのか

Remix Auth OAuth2をベースにしたOpenID Connect対応を謳うライブラリの多くは、scopeにopenidを追加しただけでnonceパラメータを使っておらず、トークンレスポンスで返ってきたIDトークンを確認せずアクセストークンを使って/userinfoエンドポイントにアクセスしてユーザー情報を取り、その情報を丸呑みして認証するような所謂OAuth認証になっている。

→ nonceは「number used once」の略で、一度だけ使用される値です。OIDCでは、リプレイ攻撃から保護するためにnonceパラメータが導入されています。具体的には以下のように機能します：
- リクエスト時に生成: クライアントが認証要求を送信する際に、nonceが生成されます。この値はセッションに関連付けられます。
- トークン内への埋め込み: IDプロバイダーは発行したIDトークン内にこのnonce値を含めて返却します。
- 検証: クライアントは受け取ったIDトークン内のnonceと、自身が保存しているnonceが一致するか確認します。一致しない場合、トークンは無効とされます25。
- nonceパラメータを使用することで、通信途中でIDトークンが盗まれた場合でも、そのトークンが無効になる仕組みが実現されます。→ なぜ????

## remix-auth-oidc ライブラリ

- (https://github.com/manaty226/remix-auth-openid)
  - zennの記事読んだ感じかなり詳しい人が作ってそう。
  - 既に実装済み
  - スター数がかなり少ない(10)

- (https://github.com/sergiodxa/remix-auth-oauth2)
  - スター数が多い(170)
  - remix-auth の開発者が作成している
  - oauth2 を拡張しただけなので、nonceを使用していない(2024/06/09時点)

- (https://github.com/authts/react-oidc-context)
  - スター数多い(754)
  - SSRで処理できない可能性がある

- ~~(https://github.com/boxyhq/remix-auth-sso)~~
  - ~~2年前から更新が止まっている~~
  - ~~スター数は少ない(18)~~

- ~~(https://github.com/neverstew/remix-auth-oidc)~~
  - ~~3年前から更新が止まっている~~
  - ~~スター数は少ない(18)~~

- ~~(https://github.com/sergiodxa/web-oidc)~~
  - ~~remix-auth-oauth2 に移行したため現在のは非推奨(作者同じ)~~
