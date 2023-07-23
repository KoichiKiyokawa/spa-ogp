import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
  aws_certificatemanager,
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_iam,
  aws_lambda_nodejs,
  aws_route53,
  aws_s3,
  aws_s3_deployment,
} from "aws-cdk-lib"
import { Construct } from "constructs"

export type TokyoStackProps = {
  siteDomain: string
} & StackProps

// cf) https://github.com/aws-samples/aws-cdk-examples/blob/master/typescript/static-site/static-site.ts
// Only S3 will be specially created in the Tokyo region
export class TokyoStack extends Stack {
  siteBucket: aws_s3.Bucket
  cloudfrontOAI: aws_cloudfront.OriginAccessIdentity

  constructor(parent: Construct, name: string, props: TokyoStackProps) {
    super(parent, name, props)

    const cloudfrontOAI = new aws_cloudfront.OriginAccessIdentity(this, "cloudfront-OAI", {
      comment: `OAI for ${name}`,
    })

    new CfnOutput(this, "Site", { value: "https://" + props.siteDomain })

    // Content bucket
    this.siteBucket = new aws_s3.Bucket(this, "SiteBucket", {
      bucketName: props.siteDomain,
      publicReadAccess: false,
      blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,

      /**
       * The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new bucket, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
       */
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code

      /**
       * For sample purposes only, if you create an S3 bucket then populate it, stack destruction fails.  This
       * setting will enable full cleanup of the demo.
       */
      autoDeleteObjects: true, // NOT recommended for production code
    })

    new CfnOutput(this, "Bucket", { value: this.siteBucket.bucketName })

    // Grant access to cloudfront
    this.siteBucket.addToResourcePolicy(
      new aws_iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [this.siteBucket.arnForObjects("*")],
        principals: [
          new aws_iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    )

    // Use Cloudflare
    //
    // Route53 alias record for the CloudFront distribution
    // new aws_route53.ARecord(this, "SiteAliasRecord", {
    //   recordName: props.siteDomain,
    //   target: aws_route53.RecordTarget.fromAlias(
    //     new aws_route53_targets.CloudFrontTarget(distribution)
    //   ),
    //   zone: props.zone,
    // })

    // Deploy site contents to S3 bucket
    new aws_s3_deployment.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [aws_s3_deployment.Source.asset("../front-app/dist")],
      destinationBucket: this.siteBucket,
    })
  }
}
