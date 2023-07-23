#!/usr/bin/env node
import * as cdk from "aws-cdk-lib"
import "source-map-support/register"
import { GlobalStack } from "../lib/global-stack"
import { TokyoStack } from "../lib/tokyo-stack"

const app = new cdk.App()

const subDomain = "head-only-ssr"
const domainName = "kiyoshiro.me"
const siteDomain = [subDomain, domainName].join(".")

const account = app.node.tryGetContext("accountId")

const globalStack = new GlobalStack(app, "HeadOnlySsrGlobalStack", {
  domainName,
  siteDomain,
  env: { region: "us-east-1", account },
  crossRegionReferences: true,
})

new TokyoStack(app, "HeadOnlySsrTokyoStack", {
  siteDomain,
  zone: globalStack.zone,
  certificate: globalStack.certificate,
  env: { region: "ap-northeast-1", account },
  crossRegionReferences: true,
})
