/* eslint max-lines: 0 */
import type * as github from "@pulumi/github";
import * as pulumi from "@pulumi/pulumi";
import type {
    ArgsDict,
    RepositoriesPulumiInfo,
    RepositoryData,
    RepositoryInfo,
    RepositoryPulumiConfig
} from "./types";
import {
    GithubRepository
} from "./index";
import type {
    IGithubRepositoryArgs
} from "./github";
import type {
    ProvidersDict
} from "../provider";
import {
    slugify
} from "../utils";

interface IProviderStruct {
    name: string;
    providers: ProvidersDict;
}

interface IRepositoriesStruct {
    info: RepositoryInfo;
    name: string;
}

/**
 * Compute repository configuration depending on the type of repository
 *
 * @param {string} providerName - Name of the gitProvider
 * @param {RepositoryPulumiConfig} repositoriesConfig - Repository configuration
 *      from the stack
 * @param {string} [repositoryType] - Type of the repository (default:
 *      "default")
 * @returns {github.RepositoryArgs} Set of repository args corresponding to
 *      repository configuration
 */
function computeRepositoryConfig (
    providerName: string,
    repositoriesConfig?: RepositoryPulumiConfig,
    repositoryType = "default"
): github.RepositoryArgs {
    if (repositoriesConfig) {
        const config: pulumi.Config = new pulumi.Config();

        const providerRepositoryConfigs: RepositoryPulumiConfig =
            repositoriesConfig;

        if (
            typeof providerRepositoryConfigs !== "undefined" &&
            "default" in providerRepositoryConfigs
        ) {
            if (providerName === config.require("githubMainProvider")) {
                return providerRepositoryConfigs.default as
                    github.RepositoryArgs;
            }
            return {
                ...providerRepositoryConfigs.default,
                ...providerRepositoryConfigs[repositoryType]
            } as github.RepositoryArgs;
        }
    }
    return {} as github.RepositoryArgs;
}


/**
 * Compute GithubRepository arguments
 *
 * @param {IProviderStruct} provider - Provider information object with name
 *      and providers pulumi resource dictionary
 * @param {IRepositoriesStruct} repository - Repository information object with
 *      name and repository info from the stack
 * @param {RepositoryPulumiConfig} [repositoriesConfig] - repositoryConfigs set
 *      in the stack
 * @returns {IGithubRepositoryArgs} Set of compute GithubRepositoryArgs
 */
function computeRepositoryArgs (
    provider: IProviderStruct,
    repository: IRepositoriesStruct,
    repositoriesConfig?: RepositoryPulumiConfig
): IGithubRepositoryArgs {
    const repositoryData: IGithubRepositoryArgs = {
        "branches": repository.info.branches ?? {} as ArgsDict,
        "deployKeys": repository.info.deployKeys ?? {} as ArgsDict,
        "labels": repository.info.labels ?? {} as ArgsDict,
        "protectedBranches":
            repository.info.protectedBranches ?? {} as ArgsDict,
        "protectedTags": repository.info.protectedTags ?? {} as ArgsDict,
        "provider": provider.providers[provider.name],
        "repoConfig": {
            ...computeRepositoryConfig(
                provider.name,
                repositoriesConfig
            ),
            "description": repository.info.description,
            "homepageUrl": repository.info.homepageUrl ?? "",
            "name": repository.name,
            "topics": repository.info.topics ?? []
        } as github.RepositoryArgs,
        "secrets": repository.info.secrets ?? {} as ArgsDict
    };
    return repositoryData;
}

/**
 * Compute data, i.e. args and opts for the repository
 *
 * @param {IProviderStruct} provider - Provider information object with name
 *      and providers pulumi resource dictionary
 * @param {IRepositoriesStruct} repository - Repository information object with
 *      name and repository info from the stack
 * @param {RepositoryPulumiConfig} [repositoriesConfig] - repositoryConfigs set
 *      in the stack
 * @returns {IGithubRepositoryArgs} Set of compute GithubRepositoryArgs
 */
function computeRepositoryData (
    provider: IProviderStruct,
    repository: IRepositoriesStruct,
    repositoriesConfig?: RepositoryPulumiConfig
): RepositoryData {
    return {
        "args": computeRepositoryArgs(
            provider,
            repository,
            repositoriesConfig
        ),
        "opts": {
            "parent": provider.providers[provider.name],
            "provider": provider.providers[provider.name].provider
        }
    };
}

/**
 *
 * Create provider supported repository
 *
 * @param {IProviderStruct} provider - Provider information object with name
 *      and providers pulumi resource dictionary
 * @param {IRepositoriesStruct} repository - Repository information object with
 *      name and repository info from the stack
 * @param {RepositoryPulumiConfig} [repositoriesConfig] - repositoryConfigs set
 *      in the stack
 */
function createRepository (
    provider: IProviderStruct,
    repository: IRepositoriesStruct,
    repositoriesConfig?: RepositoryPulumiConfig
): void {
    const data = computeRepositoryData(
        provider,
        repository,
        repositoriesConfig
    );

    const repositoryNameSlug = slugify(`${repository.name}`);
    const currRepository = new GithubRepository(
        repositoryNameSlug,
        data.args,
        data.opts
    );


    provider.providers[provider.name].repositories[repository.name] =
        currRepository;
}

/**
 *
 * Process to the deployment of git repository for defined providers
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {IRepositoriesStruct} repository - Repository information object with
 *      name and repository info from the stack
 * @param {RepositoryPulumiConfig} [repositoriesConfig] - repositoryConfigs set
 *      in the stack
 */
function processRepositories (
    providers: ProvidersDict,
    repository: IRepositoriesStruct,
    repositoriesConfig?: RepositoryPulumiConfig
): void {
    for (const iProvider in providers) {
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (repository.info.providers?.includes(iProvider)) {
            createRepository(
                {
                    "name": iProvider,
                    providers
                },
                repository,
                repositoriesConfig
            );
        }
    }
}

/**
 * Initialize the processing of each repositories defined in the stack
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {RepositoriesPulumiInfo} [repositoriesInfo] - repositories entry set
 *      in the stack
 * @param {RepositoryPulumiConfig} [repositoriesConfig] - repositoryConfigs set
 *      in the stack
 */
export function initRepository (
    providers: ProvidersDict,
    repositoriesInfo?: RepositoriesPulumiInfo,
    repositoriesConfig?: RepositoryPulumiConfig
): void {
    if (repositoriesInfo) {
        for (const iRepository in repositoriesInfo) {
            if ("description" in repositoriesInfo[iRepository]) {
                processRepositories(
                    providers,
                    {
                        "info": repositoriesInfo[iRepository] as RepositoryInfo,
                        "name": iRepository
                    },
                    repositoriesConfig
                );
            }
        }
    }
}
