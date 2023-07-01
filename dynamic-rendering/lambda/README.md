## キーポイント

### 2 種類の Lambda@Edge の違い

| 観点               | Viewer Request                               | Origin Request                                           |
| ------------------ | -------------------------------------------- | -------------------------------------------------------- |
| 呼ばれるタイミング | キャッシュの有無に関わらず、基本的に呼ばれる | キャッシュがなく、オリジンにリクエストされる際に呼ばれる |
| 制限               | 厳しい(Headless Chrome が動かせない)         | 少しゆるい(Headless Chrome が動かせる)                   |

- 何も考えずに Origin Request で Dynamic Rendering しようとしても、キャッシュがあるためオリジンにリクエストされず関数が発火しない。
- キャッシュを完全に無効にするのであれば、Origin Request だけで良い。しかし、現実には負荷が増えすぎるため、キャッシュを完全無効にすることはできない。
- そこで、`x-need-dynamic-render`の有無によってキャッシュを分離することで、負荷は抑えつつ、Origin Request が発火するようにする。

## 参考

### インフラまわり

- https://qiita.com/geerpm/items/78e2b85dca3cb698e98d

### 実装まわり

- https://naokiotsu.com/2018-11-30-lambda-puppeteer-dynamic-rendering
