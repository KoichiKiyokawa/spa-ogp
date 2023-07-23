import { CfnOutput, Stack, StackProps, aws_certificatemanager, aws_route53 } from "aws-cdk-lib"
import { Construct } from "constructs"

type GlobalStackProps = {
  /** example.com */
  domainName: string
  /** foo.example.com */
  siteDomain: string
} & StackProps

export class GlobalStack extends Stack {
  zone: aws_route53.IHostedZone
  certificate: aws_certificatemanager.ICertificate

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
  }
}
