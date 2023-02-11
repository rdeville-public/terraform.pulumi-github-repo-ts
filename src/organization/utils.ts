import type * as github from "@pulumi/github";
import * as pulumi from "@pulumi/pulumi";
import type {
    GithubProvider,
    ProvidersDict
} from "../provider";
import type {
    OrganizationData,
    OrganizationInfo,
    OrganizationPulumiConfig,
    OrganizationsPulumiInfo
} from "./types";
import {
    GithubOrganization
} from "./index";
import {
    slugify
} from "../utils";

/**
 * Compute organization configuration depending on the type of organization
 *
 * @param {string} providerName - Name of the gitProvider
 * @param {OrganizationPulumiConfig} organizationConfig - Organization
 *      configuration from the stack
 * @param {string} [organizationType] - Type of the organization (default:
 *      "default")
 * @returns {github.OrganizationArgs} Set of organization args corresponding to
 *      organization configuration
 */
function computeOrganizationConfig (
    providerName: string,
    organizationConfig?: OrganizationPulumiConfig,
    organizationType = "default"
): github.OrganizationSettingsArgs {
    if (organizationConfig) {
        const config: pulumi.Config = new pulumi.Config();

        if (
            typeof organizationConfig !== "undefined" &&
            "default" in organizationConfig
        ) {
            // eslint-disable-next-line max-len
            if (providerName === slugify(config.require("githubMainProvider")) &&
                organizationType === "default"
            ) {
                return organizationConfig.default as
                    github.OrganizationSettingsArgs;
            }
            return {
                ...organizationConfig.default,
                ...organizationConfig[organizationType]
            } as github.OrganizationSettingsArgs;
        }
    }

    return {} as github.OrganizationSettingsArgs;
}

/**
 * Compute data, i.e. args and opts for the organization
 *
 * @param {GithubProvider} provider - Provider object
 * @param {string} organizationName - Name of the organization
 * @param {OrganizationInfo} organizationInfo - Info of the organization
 *      organization configurations
 * @param {OrganizationPulumiConfig} [organizationsConfig] - Possible
 * @returns {OrganizationData} Object with args and data for Pulumi Organization
 *      object
 */
function computeOrganizationData (
    provider: GithubProvider,
    organizationName: string,
    organizationInfo?: OrganizationInfo,
    organizationsConfig?: OrganizationPulumiConfig
): OrganizationData {
    return {
        "args": {
            "settings": {
                ...computeOrganizationConfig(
                    provider.name,
                    organizationsConfig,
                    organizationInfo?.config
                ),
                ...organizationInfo?.settings,
                "name": organizationName
            } as github.OrganizationSettingsArgs
        },
        "opts": {
            "parent": provider.provider,
            "provider": provider.provider
        }
    };
}

/**
 * Create provider supported organization
 *
 * @param {GithubProvider} provider - Provider object
 * @param {string} organizationName - Name of the organization
 * @param {OrganizationInfo} organizationInfo - Info of the organization
 * @param {OrganizationPulumiConfig} [organizationsConfig] - Possible
 *      organization configurations
 * @returns {GithubOrganization} Pulumi organization object depending on
 *      provider
 */
function createOrganization (
    provider: GithubProvider,
    organizationName: string,
    organizationInfo: OrganizationInfo,
    organizationsConfig?: OrganizationPulumiConfig
): GithubOrganization {
    const data = computeOrganizationData(
        provider, organizationName, organizationInfo, organizationsConfig
    );
    const currOrganization = new GithubOrganization(
        `${slugify(organizationName)}`,
        data.args,
        data.opts
    );


    provider.organizations[organizationName] = currOrganization;
    return currOrganization;
}


/**
 * Process to the deployment of git organization for defined providers
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {string} organizationName - Name of the organization
 * @param {OrganizationInfo} organizationInfo - Information of the organization
 *      (such as desc, etc.)
 * @param {OrganizationPulumiConfig} [organizationsConfig] - organizationConfigs
 *      set in the
 */
function processOrganizations (
    providers: ProvidersDict,
    organizationName: string,
    organizationInfo: OrganizationInfo,
    organizationsConfig?: OrganizationPulumiConfig
): void {
    if (organizationInfo.providers) {
        for (const iProvider in providers) {
            if (organizationInfo.providers.includes(iProvider)) {
                createOrganization(
                    providers[iProvider],
                    organizationName,
                    organizationInfo,
                    organizationsConfig
                );
            }
        }
    }
}

/**
 * Initialize the processing of each organizations defined in the stack
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {OrganizationsPulumiInfo} [orgInfo] - organizations entries
 *      set in the stack
 * @param {OrganizationPulumiConfig} [orgConfig] - organizationsConfig
 *      set in the stack
 */
export function initOrganization (
    providers: ProvidersDict,
    orgInfo?: OrganizationsPulumiInfo,
    orgConfig?: OrganizationPulumiConfig
): void {
    if (orgInfo) {
        for (const iOrg in orgInfo) {
            if ("billingEmail" in orgInfo[iOrg].settings) {
                processOrganizations(
                    providers,
                    iOrg,
                    orgInfo[iOrg],
                    orgConfig
                );
            }
        }
    }
}
