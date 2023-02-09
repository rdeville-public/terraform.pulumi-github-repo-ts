import * as utils from "../utils";
import type {
    ProviderData,
    ProviderPulumiConfig,
    ProvidersDict,
    ProvidersPulumiConfig
} from "./index";
import {GithubProvider} from "./index";

/**
 * Create pulumi git provider corresponding to gitProvider in the stack
 *
 * @param {string} providerName - Name of the provider
 * @param {ProviderPulumiConfig} currProvider - Configuration of the provider
 * @returns {GithubProvider} Pulumi provider object
 */
function createProvider (
    providerName: string,
    currProvider: ProviderPulumiConfig
): GithubProvider {
    const token = utils.getValue(providerName, currProvider.config.token);
    const data: ProviderData = {
        "args": {
            "config": {
                ...currProvider.config,
                token
            }
        },
        "opts": {
            "aliases": [{"name": providerName}]
        }
    };
    return new GithubProvider(
        providerName,
        data.args,
        data.opts
    );
}

/**
 * Initialize the deployment of Providers
 *
 * @param {ProvidersPulumiConfig} providerConfig - Configuration of the
 *      providers
 * @returns {ProvidersDict} Set of Providers objects
 */
export function initProvider (
    providerConfig: ProvidersPulumiConfig
): ProvidersDict {
    const providers: ProvidersDict = {};

    for (const iProvider in providerConfig) {
        providers[iProvider] = createProvider(
            iProvider,
            providerConfig[iProvider]
        );
    }
    return providers;
}
