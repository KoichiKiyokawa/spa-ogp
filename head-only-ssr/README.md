# head-only-ssr

## NOTE

- CDK の`crossRegionReferences`機能を使っている。

  - S3 だけ東京リージョン、ほかはバージニアリージョンにしようとしたが、cdk deploy 時に循環参照エラーがでたため断念。
  - その代わり、バージニアリージョンでしか作れない以下のリソース以外は東京リージョンで作る方式に
    - ACM(ACM 自体は東京リージョンでも作れるが、CloudFront と紐付ける場合はバージニアリージョンじゃないとだめ)
    - Lambda@Edge(東京リージョンで作ろうとしたら、「バージニアリージョンでしか作れない」と明確にエラーがでた)

- `UPDATE_ROLLBACK_FAILED`ステータスになって、CDK からはどうにもできなくなったら、コンソール上で作業する必要あり
  - https://stackoverflow.com/a/72755589
  - それでもうまく行かない場合があるので、その際は、原因ぽいリソースを CDK のコードからコメントアウトして`cdk deploy`してみる

## References

- [How to use a custom domain on CloudFront with Cloudflare-managed DNS](https://advancedweb.hu/how-to-use-a-custom-domain-on-cloudfront-with-cloudflare-managed-dns/)
