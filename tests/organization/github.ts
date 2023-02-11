import * as github from "../../src/organization/github";
import type * as pulumi from "@pulumi/pulumi";
import test from "ava";

const FAKE_NAME = "fakeName";
const FAKE_EMAIL = "fakeName@fakeDomain.tld";

test("Config organization", (currTest) => {
    const args: github.IGithubOrganizationArgs = {
        "settings": {
            "billingEmail": FAKE_EMAIL
        }
    };
    const opts: pulumi.CustomResourceOptions = {
        "aliases": [{"name": FAKE_NAME}]
    };
    const githubOrganization = new github.GithubOrganization(
        FAKE_NAME,
        args,
        opts
    );

    currTest.is(githubOrganization.name, FAKE_NAME);
});
