/* eslint max-lines: 0 */
import * as provider from "../../src/provider";
import * as repository from "../../src/repository";
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


const REPOSITORY_DESC = "Fake Repository Description";

const ENV: {[key: string]: string} = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "PULUMI_CONFIG": `{ "project:githubMainProvider": "${MAIN_PROVIDER}" }`
};

Object.entries(ENV).forEach(([key, val]) => {
    process.env[key] = val;
});

test("repository with supported provider without repository args",
    (currTest) => {
        const fakeRepositories: repository.RepositoriesPulumiInfo = {
            "fakeRepositoryName": {
                "description": REPOSITORY_DESC,
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                "providers": [PROVIDER_NAME[0]]
            }
        };

        const providers = provider.initProvider(PROVIDER);
        repository.initRepository(
            providers,
            fakeRepositories
        );

        currTest.is(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].
                repositories.fakeRepositoryName.name,
            "fakerepositoryname"
        );
    });

test(
    "repository with supported provider with default repository args",
    (currTest) => {
        const fakeRepositories: repository.RepositoriesPulumiInfo = {
            "fakeRepositoryName": {
                "description": REPOSITORY_DESC,
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                "providers": [PROVIDER_NAME[0]]
            }
        };

        const fakeRepositoryConfigs: repository.RepositoryPulumiConfig = {
            "default": {}
        };

        const providers = provider.initProvider(PROVIDER);
        repository.initRepository(
            providers,
            fakeRepositories,
            fakeRepositoryConfigs
        );

        currTest.is(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].
                repositories.fakeRepositoryName.name,
            "fakerepositoryname"
        );
    }
);

test("repository with supported provider mirror repositories args",
    (currTest) => {
        const fakeRepositories: repository.RepositoriesPulumiInfo = {
            "fakeRepositoryName": {
                "description": REPOSITORY_DESC,
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                "providers": [PROVIDER_NAME[0], PROVIDER_NAME[1]]
            }
        };

        const fakeRepositoryConfigs: repository.RepositoryPulumiConfig = {
            "default": {},
            "mirror": {}
        };

        const providers = provider.initProvider(PROVIDER);
        repository.initRepository(
            providers,
            fakeRepositories,
            fakeRepositoryConfigs
        );

        currTest.is(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].
                repositories.fakeRepositoryName.name,
            "fakerepositoryname"
        );
        currTest.is(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[1]].
                repositories.fakeRepositoryName.name,
            "fakerepositoryname"
        );
    });

test("repository with supported provider with labels", (currTest) => {
    const fakeRepositories: repository.RepositoriesPulumiInfo = {
        "fakeRepositoryName": {
            "description": REPOSITORY_DESC,
            "labels": {
                "fakeLabelName": {
                    // Left empty as it should be handled by utils
                    "color": "#00FF00"
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const providers = provider.initProvider(PROVIDER);
    repository.initRepository(
        providers,
        fakeRepositories
    );

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            repositories.fakeRepositoryName.name,
        "fakerepositoryname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            repositories.fakeRepositoryName.
            labels.fakeLabelName.urn
    );
});


test("repository with supported provider with secrets", (currTest) => {
    const fakeRepositories: repository.RepositoriesPulumiInfo = {
        "fakeRepositoryName": {
            "description": REPOSITORY_DESC,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]],
            "secrets": {
                "fakeSecretName": {
                    "value": "fakeValue"
                }
            }
        }
    };

    const providers = provider.initProvider(PROVIDER);
    repository.initRepository(
        providers,
        fakeRepositories
    );

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].repositories.fakeRepositoryName.name,
        "fakerepositoryname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            repositories.fakeRepositoryName.
            secrets.fakeSecretName.urn
    );
});

test("repository with supported provider with deployKeys", (currTest) => {
    const fakeRepositories: repository.RepositoriesPulumiInfo = {
        "fakeRepositoryName": {
            "deployKeys": {
                "fakeDeployKeyName": {
                    "key": "fakeSSHDeployKey",
                    "title": "fakeTitle"
                }
            },
            "description": REPOSITORY_DESC,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const providers = provider.initProvider(PROVIDER);
    repository.initRepository(
        providers,
        fakeRepositories
    );

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].repositories.fakeRepositoryName.name,
        "fakerepositoryname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            repositories.fakeRepositoryName.
            deployKeys.fakeDeployKeyName.urn
    );
});


test("repository with supported provider with branches", (currTest) => {
    const fakeRepositories: repository.RepositoriesPulumiInfo = {
        "fakeRepositoryName": {
            "branches": {
                "fakeBranchName": {
                    "branch": "main"
                }
            },
            "description": REPOSITORY_DESC,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const providers = provider.initProvider(PROVIDER);
    repository.initRepository(
        providers,
        fakeRepositories
    );

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].repositories.fakeRepositoryName.name,
        "fakerepositoryname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            repositories.fakeRepositoryName.
            branches.fakeBranchName.urn
    );
});

test(
    "repository with supported provider with default branch",
    (currTest) => {
        const fakeRepositories: repository.RepositoriesPulumiInfo = {
            "fakeRepositoryName": {
                "branches": {
                    "fakeBranchName": {
                        "branch": "main",
                        "default": true
                    }
                },
                "description": REPOSITORY_DESC,
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                "providers": [PROVIDER_NAME[0]]
            }
        };

        const providers = provider.initProvider(PROVIDER);
        repository.initRepository(
            providers,
            fakeRepositories
        );

        currTest.is(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].repositories.fakeRepositoryName.name,
            "fakerepositoryname"
        );
        currTest.snapshot(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].
                repositories.fakeRepositoryName.
                branches.fakeBranchName.urn
        );
    }
);

test(
    "repository with supported provider with protected branch",
    (currTest) => {
        const fakeRepositories: repository.RepositoriesPulumiInfo = {
            "fakeRepositoryName": {
                "description": REPOSITORY_DESC,
                "protectedBranches": {
                    "fakeBranchName": {
                        "pattern": "main"
                    }
                },
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                "providers": [PROVIDER_NAME[0]]
            }
        };

        const providers = provider.initProvider(PROVIDER);
        repository.initRepository(
            providers,
            fakeRepositories
        );

        currTest.is(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].repositories.fakeRepositoryName.name,
            "fakerepositoryname"
        );
        currTest.snapshot(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].
                repositories.fakeRepositoryName.
                protectedBranches.fakeBranchName.urn
        );
    }
);

test("repository with supported provider with protectedTags", (currTest) => {
    const fakeRepositories: repository.RepositoriesPulumiInfo = {
        "fakeRepositoryName": {
            "description": REPOSITORY_DESC,
            "protectedTags": {
                "fakeTagName": {
                    "pattern": "*.*.*"
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const providers = provider.initProvider(PROVIDER);
    repository.initRepository(
        providers,
        fakeRepositories
    );

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].repositories.fakeRepositoryName.name,
        "fakerepositoryname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            repositories.fakeRepositoryName.
            protectedTags.fakeTagName.urn
    );
});
