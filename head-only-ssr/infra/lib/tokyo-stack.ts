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
  zone: aws_route53.IHostedZone
  certificate: aws_certificatemanager.ICertificate
  originResponseFunction: aws_lambda_nodejs.NodejsFunction
} & StackProps

// cf) https://github.com/aws-samples/aws-cdk-examples/blob/master/typescript/static-site/static-site.ts
// Only S3 will be specially created in the Tokyo region
export class TokyoStack extends Stack {
  constructor(parent: Construct, name: string, props: TokyoStackProps) {
    super(parent, name, props)

    const cloudfrontOAI = new aws_cloudfront.OriginAccessIdentity(this, "cloudfront-OAI", {
      comment: `OAI for ${name}`,
    })

    new CfnOutput(this, "Site", { value: "https://" + props.siteDomain })

    // Content bucket
    const siteBucket = new aws_s3.Bucket(this, "SiteBucket", {
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

    new CfnOutput(this, "Bucket", { value: siteBucket.bucketName })

    // Grant access to cloudfront
    siteBucket.addToResourcePolicy(
      new aws_iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [
          new aws_iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    )

    // CloudFront distribution
    const distribution = new aws_cloudfront.Distribution(this, "SiteDistribution", {
      certificate: props.certificate,
      defaultRootObject: "index.html",
      domainNames: [props.siteDomain],
      minimumProtocolVersion: aws_cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 403,
          responsePagePath: "/error.html",
          ttl: Duration.minutes(30),
        },
      ],
      defaultBehavior: {
        origin: new aws_cloudfront_origins.S3Origin(siteBucket, {
          originAccessIdentity: cloudfrontOAI,
        }),
        compress: true,
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        edgeLambdas: [
          {
            eventType: aws_cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,
            functionVersion: props.originResponseFunction.currentVersion,
          },
        ],
      },
    })

    new CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    })
    // NOTE: Register this domain as CNAME in Cloudflare console
    new CfnOutput(this, "CloudFrontDomain", {
      value: distribution.distributionDomainName,
    })

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
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    })
  }
}
