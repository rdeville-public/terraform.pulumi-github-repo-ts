import * as github from "../../src/provider/github";
import type {ProviderData} from "../../src/provider/types";
import test from "ava";

const FAKE_BASEURL = "https://fake.github.tld";
const FAKE_TOKEN = "fakeToken";
const FAKE_NAME = "fakeName";
const FAKE_ALIAS = "fakeAlias";

test("githubProvider with default baseUrl", (currTest) => {
    const data: ProviderData = {
        "args": {
            "config": {
                "token": FAKE_TOKEN
            },
            "username": "fakeUserName"
        },
        "opts": {
            "aliases": [{"name": FAKE_ALIAS}]
        }
    };
    const githubProvider = new github.GithubProvider(
        FAKE_NAME,
        data.args,
        data.opts
    );

    currTest.is(githubProvider.name, "fakename");
});

test("githubProvider with fake baseUrl", (currTest) => {
    const data: ProviderData = {
        "args": {
            "config": {
                "baseUrl": FAKE_BASEURL,
                "token": FAKE_TOKEN
            },
            "username": "fakeUserName"
        },
        "opts": {
            "aliases": [{"name": FAKE_ALIAS}]
        }
    };
    const githubProvider = new github.GithubProvider(
        FAKE_NAME,
        data.args,
        data.opts
    );

    currTest.is(githubProvider.name, "fakename");
});
