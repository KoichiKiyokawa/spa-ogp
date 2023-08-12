# head-only-sg

## NOTE

- CDK の`crossRegionReferences`機能を使っている。
  - S3 と OAI だけ東京リージョン、ほかはバージニアリージョンにする。
  - リージョンをまたいでのロールバックはバグりがち。そこでデプロイ時にエラーが出やすいものをバージニアリージョンにまとめる
- `UPDATE_ROLLBACK_FAILED`ステータスになって、CDK からはどうにもできなくなったら、コンソール上で作業する必要あり
  - https://stackoverflow.com/a/72755589
  - それでもうまく行かない場合があるので、その際は、原因ぽいリソースを CDK のコードからコメントアウトして`cdk deploy`してみる

## References

- [How to use a custom domain on CloudFront with Cloudflare-managed DNS](https://advancedweb.hu/how-to-use-a-custom-domain-on-cloudfront-with-cloudflare-managed-dns/)
