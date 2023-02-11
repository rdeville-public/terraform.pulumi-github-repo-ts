import type * as github from "../../src/user";
import * as provider from "../../src/provider";
import * as user from "../../src/user";
import test from "ava";

// FAKE PROVIDER CONFIG
const PROVIDER_TOKEN = "fakeToken";
const PROVIDER_NAME = {
    "fakegithub": 0
};
const [MAIN_PROVIDER] = "fakegithub";

const PROVIDER: provider.ProvidersPulumiConfig = {
    "fakegithub": {
        "config": {
            "token": PROVIDER_TOKEN
        },
        "username": "fakeUserName"
    }
};

const ENV: {[key: string]: string} = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "PULUMI_CONFIG": `{ "project:mainProvider": "${MAIN_PROVIDER}" }`
};

Object.entries(ENV).forEach(([key, val]) => {
    process.env[key] = val;
});


test("user with supported provider without user args", (currTest) => {
    const fakeUsers: github.UsersPulumiConfig = {
        "fakeUserName": {
            "providers": PROVIDER_NAME
        }
    };

    const providers = provider.initProvider(PROVIDER);
    user.initUser(
        providers,
        fakeUsers
    );

    currTest.is(
        providers.fakegithub.users.fakeUserName.name,
        "fakeusername"
    );
});
