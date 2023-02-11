import * as organization from "./organization";
import * as provider from "./provider";
import * as pulumi from "@pulumi/pulumi";
import * as repository from "./repository";
import * as user from "./user";
import type {
    OrganizationPulumiConfig,
    OrganizationsPulumiInfo
} from "./organization";
import type {
    ProvidersDict,
    ProvidersPulumiConfig
} from "./provider";
import type {
    RepositoriesPulumiInfo,
    RepositoryPulumiConfig
} from "./repository";
import type {
    UsersPulumiInfo
} from "./user";

/**
 * Function to deploy of every resources.
 *
 * @returns {ProvidersDict} Provider object with everything in it
 */
function deploy (): ProvidersDict {
    const config: pulumi.Config = new pulumi.Config();

    const providers = provider.initProvider(
        config.requireObject<ProvidersPulumiConfig>("githubProviders")
    );

    organization.initOrganization(
        providers,
        config.getObject<OrganizationsPulumiInfo>("githubOrganizations"),
        config.getObject<OrganizationPulumiConfig>("githubOrganizationConfigs")
    );

    repository.initRepository(
        providers,
        config.getObject<RepositoriesPulumiInfo>("githubRepositories"),
        config.getObject<RepositoryPulumiConfig>("githubRepositoryConfigs")
    );

    user.initUser(
        providers,
        config.getObject<UsersPulumiInfo>("githubUsers")
    );

    return providers;
}

/**
 * Main function of the program
 *
 * @returns {ProvidersDict} Provider object with everything in it
 */
function main (): ProvidersDict {
    return deploy();
}

export const output = main();
