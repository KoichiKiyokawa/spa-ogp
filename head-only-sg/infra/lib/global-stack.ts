import {
  CfnOutput,
  Duration,
  Stack,
  StackProps,
  aws_certificatemanager,
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_lambda_nodejs,
  aws_route53,
  aws_s3,
} from "aws-cdk-lib"
import { Construct } from "constructs"

type GlobalStackProps = {
  /** example.com */
  domainName: string
  /** foo.example.com */
  siteDomain: string
  siteBucket: aws_s3.Bucket
  cloudfrontOAI: aws_cloudfront.OriginAccessIdentity
} & StackProps

export class GlobalStack extends Stack {
  zone: aws_route53.IHostedZone
  certificate: aws_certificatemanager.ICertificate
  originResponseFunction: aws_lambda_nodejs.NodejsFunction

  constructor(parent: Construct, name: string, props: GlobalStackProps) {
    super(parent, name, props)

    // TLS certificate
    // this.certificate = new aws_certificatemanager.Certificate(this, "SiteCertificate", {
    //   domainName: props.siteDomain,
    //   validation: aws_certificatemanager.CertificateValidation.fromDns(this.zone),
    // })

    const certificate = aws_certificatemanager.Certificate.fromCertificateArn(
      this,
      "SiteCertificate",
      "arn:aws:acm:us-east-1:877131159332:certificate/ba35c31d-d07d-411f-b297-2ba3901208c8"
    )

    // new CfnOutput(this, "Certificate", { value: this.certificate.certificateArn })

    // CloudFront Function
    const viewerRequestFunction = new aws_cloudfront.Function(this, "ViewerRequestFunction", {
      code: aws_cloudfront.FunctionCode.fromFile({
        filePath: "../edge-functions/viewer-request/dist/index.js",
      }),
    })

    // CloudFront distribution
    const distribution = new aws_cloudfront.Distribution(this, "SiteDistribution", {
      certificate: certificate,
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
        origin: new aws_cloudfront_origins.S3Origin(props.siteBucket, {
          originAccessIdentity: props.cloudfrontOAI,
        }),
        compress: true,
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [
          {
            eventType: aws_cloudfront.FunctionEventType.VIEWER_REQUEST,
            function: viewerRequestFunction,
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
  }
}
