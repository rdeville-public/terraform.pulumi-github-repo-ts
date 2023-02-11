import * as github from "@pulumi/github";
import * as pulumi from "@pulumi/pulumi";
import * as utils from "../utils";
import type {
    ArgsDict
} from "./types";

export interface IGithubUser {
    name: string;
    sshKeys: IGithubUserSshKey;
    gpgKeys: IGithubUserGpgKey;
}

export interface IGithubUserArgs {
    userName: string;
    sshKeys?: ArgsDict;
    gpgKeys?: ArgsDict;
}

interface IGithubUserSshKey {
    [key: string]: github.UserSshKey;
}

interface IGithubUserGpgKey {
    [key: string]: github.UserGpgKey;
}

/**
 * Pulumi custom ComponentResource which deploy a github provider and its
 * associated API client.
 *
 * @augments pulumi.ComponentResource
 * @implements {IGithubUser} IGithubUser
 */
export class GithubUser extends pulumi.ComponentResource
    implements IGithubUser {

    public name = "";


    public sshKeys: IGithubUserSshKey = {};

    public gpgKeys: IGithubUserGpgKey = {};

    /**
     * Constructor of the ComponentResource GithubUser
     *
     * @param {string} name - Name of the user
     * @param {IGithubUserArgs} args - GithubUser arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     *      options
     */
    public constructor (
        name: string,
        args: IGithubUserArgs,
        opts?: pulumi.CustomResourceOptions
    ) {
        super(`github-repo:user:${name}`, name, args, opts);
        this.name = name;
        this.addGpgKey(args, opts);
        this.addSshKey(args, opts);
    }

    /**
     * Add ssh key to github user
     *
     * @param {IGithubUserArgs} args - GithubUser arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addSshKey (
        args: IGithubUserArgs,
        opts?: pulumi.CustomResourceOptions
    ): void {
        for (const iSshKey in args.sshKeys) {
            if ("key" in args.sshKeys[iSshKey]) {
                const sshKeyName = `${utils.slugify(iSshKey)}`;
                this.sshKeys[iSshKey] = new github.UserSshKey(
                    sshKeyName,
                    {
                        ...args.sshKeys[iSshKey],
                        "title": iSshKey
                    } as github.UserSshKeyArgs,
                    {
                        ...opts,
                        "parent": this
                    }
                );
            }
        }
    }

    /**
     * Add Gpg Key to github user
     *
     * @param {IGithubUserArgs} args - GithubUser arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addGpgKey (
        args: IGithubUserArgs,
        opts?: pulumi.CustomResourceOptions
    ): void {
        for (const iGpgKey in args.gpgKeys) {
            if ("armoredPublicKey" in args.gpgKeys[iGpgKey]) {
                const gpgKeyName = `${utils.slugify(iGpgKey)}`;
                this.gpgKeys[iGpgKey] = new github.UserGpgKey(
                    gpgKeyName,
                    {
                        ...args.gpgKeys[iGpgKey]
                    } as github.UserGpgKeyArgs,
                    {
                        ...opts,
                        "parent": this
                    }
                );
            }
        }
    }

}
