import * as organization from "../../src/organization";
import * as provider from "../../src/provider";
import test from "ava";

// FAKE PROVIDER CONFIG
const PROVIDER_CONFIG = {
    "config": {
        "baseUrl": "https://fake.github.tld",
        "token": "fakeToken"
    },
    "username": "fakeUserName"
};

const PROVIDER_NAME = [
    "fakeGithub1",
    "fakeGithub2"
];
const [MAIN_PROVIDER] = PROVIDER_NAME;

const PROVIDER: provider.ProvidersPulumiConfig = {
    "fakeGithub1": PROVIDER_CONFIG,
    "fakeGithub2": PROVIDER_CONFIG
};

const FAKE_EMAIL = "fakeName@fakeDomain.tld";

const ENV: {[key: string]: string} = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "PULUMI_CONFIG": `{ "project:githubMainProvider": "${MAIN_PROVIDER}" }`
};

Object.entries(ENV).forEach(([key, val]) => {
    process.env[key] = val;
});

test(
    "organization with supported provider with minimum organization args",
    (currTest) => {
        const fakeOrganizations: organization.OrganizationsPulumiInfo = {
            "fakeOrganizationName": {
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                "providers": [PROVIDER_NAME[0]],
                "settings": {
                    "billingEmail": FAKE_EMAIL
                }
            }
        };

        const providers = provider.initProvider(PROVIDER);
        organization.initOrganization(
            providers,
            fakeOrganizations
        );

        currTest.is(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].
                organizations.fakeOrganizationName.name,
            "fakeorganizationname"
        );
    }
);

test(
    "organization with supported provider with organization default config",
    (currTest) => {
        const fakeOrganizations: organization.OrganizationsPulumiInfo = {
            "fakeOrganizationName": {
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                "providers": [PROVIDER_NAME[0]],
                "settings": {
                    "billingEmail": FAKE_EMAIL
                }
            }
        };

        const fakeOrganizationConfig: organization.OrganizationPulumiConfig = {
            "default": {}
        };

        const providers = provider.initProvider(PROVIDER);
        organization.initOrganization(
            providers,
            fakeOrganizations,
            fakeOrganizationConfig
        );

        currTest.is(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].
                organizations.fakeOrganizationName.name,
            "fakeorganizationname"
        );
    }
);

test(
    "organization with supported provider with organization mirror config",
    (currTest) => {
        const fakeOrganizations: organization.OrganizationsPulumiInfo = {
            "fakeOrganizationName": {
                "config": "mirror",
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                "providers": [PROVIDER_NAME[0]],
                "settings": {
                    "billingEmail": FAKE_EMAIL
                }
            }
        };

        const fakeOrganizationConfig: organization.OrganizationPulumiConfig = {
            "default": {},
            "mirror": {}
        };

        const providers = provider.initProvider(PROVIDER);
        organization.initOrganization(
            providers,
            fakeOrganizations,
            fakeOrganizationConfig
        );

        currTest.is(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].
                organizations.fakeOrganizationName.name,
            "fakeorganizationname"
        );
    }
);
