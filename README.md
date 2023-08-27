# spa-ogp

## 概要

純SPAでも、ページによってmetaタグを切り替えられるようにする

## 一覧

| 名称                | 概要                                                                                  | デモ                                                                            |
| ------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| dynamic-rendering   | リクエスト時、BotからのアクセスであればHeadlessChromeでレンダリングした結果を返却する | https://dynamic-rendering.kiyoshiro.me                                          |
| head-only-ssr       | リクエスト時、Lambdaなどで、ページに応じてmetaタグを注入して返却する                  | https://head-only-ssr.kiyoshiro.me/1, https://head-only-ssr.kiyoshiro.me/2, ... |
| head-only-sg        | ビルド時、ページに応じてmetaタグを注入したHTMLを生成しておく                          | https://head-only-sg.kiyoshiro.me, https://head-only-sg.kiyoshiro.me/about      |
| static-prerendering | ビルド時、特定のページをHeadlessChromeでレンダリングし、Bot用のHTMLを生成しておく     | https://static-prerendering.kiyoshiro.me/about                                  |

## 登壇資料

TODO
