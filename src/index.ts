import * as provider from "./provider";
import * as pulumi from "@pulumi/pulumi";
import * as repository from "./repository";
import type {
    ProvidersDict,
    ProvidersPulumiConfig
} from "./provider";
import type {
    RepositoriesPulumiInfo,
    RepositoryPulumiConfig
} from "./repository";

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

    repository.initRepository(
        providers,
        config.getObject<RepositoriesPulumiInfo>("githubRepositories"),
        config.getObject<RepositoryPulumiConfig>("githubRepositoryConfigs")
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
