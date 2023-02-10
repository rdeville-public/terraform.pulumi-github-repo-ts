import * as github from "@pulumi/github";
import type * as organization from "../organization";
import * as pulumi from "@pulumi/pulumi";
import type * as repositories from "../repository";
import * as utils from "../utils";
import type {
    ProviderConfigArgs
} from "./types";

export interface IGithubProvider {
    name: string;
    username: string;
    provider: github.Provider;
    organizations: organization.OrganizationsDict;
    repositories: repositories.RepositoriesDict;
}

/**
 * Pulumi custom ComponentResource which deploy a github provider and its
 * associated API client.
 *
 * @augments pulumi.ComponentResource
 * @implements {IGithubProvider} IGithubProvider
 */
export class GithubProvider extends pulumi.ComponentResource
    implements IGithubProvider {

    public name = "";

    public username = "";

    public provider: github.Provider;

    public organizations: organization.OrganizationsDict = {};

    public repositories: repositories.RepositoriesDict = {};

    /**
     * Constructor of the ComponentResource GithubProvider
     *
     * @param {string} name - Name of the provider
     * @param {github.ProviderArgs} args - Github provider arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     *      options
     */
    public constructor (
        name: string,
        args: ProviderConfigArgs,
        opts?: pulumi.CustomResourceOptions
    ) {
        super(`github-repo:provider:${name}`, name, args, opts);
        this.name = `${utils.slugify(name)}`;
        this.provider = new github.Provider(
            name,
            args.config,
            {
                ...opts,
                "parent": this
            }
        );
    }

}
