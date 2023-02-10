import * as github from "../../src/repository/github";
import type * as pulumi from "@pulumi/pulumi";
import {
    GithubProvider
} from "../../src/provider/";
import type {
    ProviderData
} from "../../src/provider/";
import test from "ava";

const FAKE_TOKEN = "fakeToken";
const FAKE_NAME = "fakeName";
const FAKE_ALIAS = "fakeAlias";


test("Create basic repository", (currTest) => {
    const data: ProviderData = {
        "args": {
            "config": {
                "owner": "fakeUserName",
                "token": FAKE_TOKEN
            }
        },
        "opts": {
            "aliases": [{"name": FAKE_ALIAS}]
        }
    };
    const githubProvider = new GithubProvider(
        FAKE_NAME,
        data.args,
        data.opts
    );

    const args: github.IGithubRepositoryArgs = {
        "provider": githubProvider,
        "repoConfig": {}
    };
    const opts: pulumi.CustomResourceOptions = {
        "aliases": [{"name": FAKE_ALIAS}]
    };
    const githubRepository = new github.GithubRepository(
        FAKE_NAME,
        args,
        opts
    );

    currTest.is(githubRepository.name, FAKE_NAME);
});
