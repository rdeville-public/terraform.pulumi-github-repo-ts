/* eslint max-lines: 0 */
import * as provider from "../../src/provider";
import * as user from "../../src/user";
import test from "ava";

// FAKE PROVIDER CONFIG
const MAIN_PROVIDER = "fakeGitlab";

const PROVIDER: provider.ProvidersPulumiConfig = {
    "fakeGitlab": {
        "config": {
            "baseUrl": "https://fake.gitlab.tld",
            "token": "token"
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
    const fakeUsers: user.UsersPulumiInfo = {
        "fakeUserName": {
            "providers": {
                "fakeGitlab": 0
            }
        }
    };

    const providers = provider.initProvider(PROVIDER);
    user.initUser(
        providers,
        fakeUsers
    );

    currTest.is(
        providers[MAIN_PROVIDER].users.fakeUserName.name,
        "fakeusername"
    );
});

test("user with supported provider with sshKey", (currTest) => {
    const fakeUsers: user.UsersPulumiInfo = {
        "fakeUserName": {
            "providers": {
                "fakeGitlab": 0
            },
            "sshKeys": {
                "sshKeyName": {
                    "key": "fakeSshKeyContent"
                }
            }
        }
    };

    const providers = provider.initProvider(PROVIDER);
    user.initUser(
        providers,
        fakeUsers
    );

    currTest.is(
        providers[MAIN_PROVIDER].users.fakeUserName.name,
        "fakeusername"
    );
    currTest.snapshot(
        providers[MAIN_PROVIDER].
            users.fakeUserName.
            sshKeys.sshKeyName.urn
    );
});

test("user with supported provider with gpgKey", (currTest) => {
    const fakeUsers: user.UsersPulumiInfo = {
        "fakeUserName": {
            "gpgKeys": {
                "gpgKeyName": {
                    "armoredPublicKey": "fakeGpgKeyContent"
                }
            },
            "providers": {
                "fakeGitlab": 0
            }
        }
    };

    const providers = provider.initProvider(PROVIDER);
    user.initUser(
        providers,
        fakeUsers
    );

    currTest.is(
        providers[MAIN_PROVIDER].users.fakeUserName.name,
        "fakeusername"
    );
    currTest.snapshot(
        providers[MAIN_PROVIDER].
            users.fakeUserName.
            gpgKeys.gpgKeyName.urn
    );
});
