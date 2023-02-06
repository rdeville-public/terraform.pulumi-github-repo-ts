import * as github from "@pulumi/github";
import * as pulumi from "@pulumi/pulumi";
import * as utils from "../utils";
import type {
    ProviderConfigArgs
} from "./types";

export interface IGithubProvider {
    name: string;
    url: URL;
    username: string;
    provider: github.Provider;
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

    public url: URL;

    public provider: github.Provider;

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
        this.url = args.url ?? new URL("https://api.github.com");
        this.username = args.username;
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
