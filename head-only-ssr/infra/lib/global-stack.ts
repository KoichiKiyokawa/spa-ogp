import {
  Stack,
  StackProps,
  aws_certificatemanager,
  aws_lambda,
  aws_lambda_nodejs,
  aws_logs,
  aws_route53,
} from "aws-cdk-lib"
import { Construct } from "constructs"
import { readFileSync } from "fs"

type GlobalStackProps = {
  /** example.com */
  domainName: string
  /** foo.example.com */
  siteDomain: string
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

    this.certificate = aws_certificatemanager.Certificate.fromCertificateArn(
      this,
      "SiteCertificate",
      "arn:aws:acm:us-east-1:877131159332:certificate/ba35c31d-d07d-411f-b297-2ba3901208c8"
    )

    // new CfnOutput(this, "Certificate", { value: this.certificate.certificateArn })

    // Lambda@Edge
    this.originResponseFunction = new aws_lambda_nodejs.NodejsFunction(
      this,
      "OriginResponseFunction",
      {
        entry: "../lambda/origin-response/index.ts",
        handler: "handler",
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        logRetention: aws_logs.RetentionDays.ONE_WEEK,
        bundling: {
          define: {
            __SITE_ROOT_INDEX_HTML_CONTENT: JSON.stringify(
              readFileSync("../front-app/dist/index.html", "utf-8")
            ),
          },
        },
      }
    )
  }
}
