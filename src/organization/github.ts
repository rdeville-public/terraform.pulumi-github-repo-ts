import * as github from "@pulumi/github";
// import type * as project from "../project";
import * as pulumi from "@pulumi/pulumi";

export interface IGithubOrganizationArgs {
    settings: github.OrganizationSettingsArgs;
}

export interface IGithubOrganization {
    name: string;
    settings: github.OrganizationSettings;
}

/**
 * Pulumi custom ComponentResource which deploy a github groups and associated
 * resources such as labels, hooks, etc.
 *
 * @augments pulumi.ComponentResource
 * @implements {IGithubOrganization} IGithubOrganization
 */
export class GithubOrganization extends pulumi.ComponentResource
    implements IGithubOrganization {

    public name: string;

    public settings: github.OrganizationSettings;

    /**
     * Constructor of the ComponentResource GithubOrganization
     *
     * @param {string} name - Name of the organization
     * @param {IGithubOrganizationArgs} args - This pulumi object arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     *      options
     */
    public constructor (
        name: string,
        args: IGithubOrganizationArgs,
        opts?: pulumi.ComponentResourceOptions
    ) {
        super(`github-repo:group:${name}`, name, args, opts);
        this.name = name;
        this.settings = new github.OrganizationSettings(
            name,
            args.settings,
            {
                ...opts,
                "parent": this
            }
        );
        this.registerOutputs();
    }

}
