#!/usr/bin/env node
import * as cdk from "aws-cdk-lib"
import "source-map-support/register"
import { GlobalStack } from "../lib/global-stack"
import { TokyoStack } from "../lib/tokyo-stack"

const app = new cdk.App()

const subDomain = "head-only-sg"
const domainName = "kiyoshiro.me"
const siteDomain = [subDomain, domainName].join(".")

const account = app.node.tryGetContext("accountId")

const tokyoStack = new TokyoStack(app, "HeadOnlySgTokyoStack", {
  siteDomain,
  env: { region: "ap-northeast-1", account },
  crossRegionReferences: true,
})

new GlobalStack(app, "HeadOnlySgGlobalStack", {
  domainName,
  siteDomain,
  siteBucket: tokyoStack.siteBucket,
  cloudfrontOAI: tokyoStack.cloudfrontOAI,
  env: { region: "us-east-1", account },
  crossRegionReferences: true,
})
