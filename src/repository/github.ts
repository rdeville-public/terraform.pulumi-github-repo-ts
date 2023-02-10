/* eslint max-lines: 0 */
import * as github from "@pulumi/github";
import * as pulumi from "@pulumi/pulumi";
import * as utils from "../utils";
import type {
    ArgsDict
} from "./types";
import type {
    GithubProvider
} from "../provider";
import type {
    ProtectedData
} from "../utils";

interface IGithubRepositoryLabels {
    [key: string]: github.IssueLabel;
}

interface IGithubRepositorySecrets {
    [key: string]: github.ActionsSecret;
}

interface IGithubRepositoryBranches {
    [key: string]: github.Branch;
}

interface IGithubRepositoryProtectBranches {
    [key: string]: github.BranchProtection;
}

interface IGithubRepositoryProtectTags {
    [key: string]: github.RepositoryTagProtection;
}

interface IGithubRepositoryDeployKeys {
    [key: string]: github.RepositoryDeployKey;
}

export interface IGithubRepositoryArgs {
    repoConfig: github.RepositoryArgs;
    provider: GithubProvider;
    branches?: ArgsDict;
    deployKeys?: ArgsDict;
    labels?: ArgsDict;
    protectedBranches?: ArgsDict;
    protectedTags?: ArgsDict;
    secrets?: ArgsDict;
}

export interface IGithubRepository {
    name: string;
    repo: github.Repository;
    branches: IGithubRepositoryBranches;
    deployKeys: IGithubRepositoryDeployKeys;
    labels: IGithubRepositoryLabels;
    protectedBranches: IGithubRepositoryProtectBranches;
    protectedTags: IGithubRepositoryProtectTags;
    secrets: IGithubRepositorySecrets;
}

/**
 * Pulumi custom ComponentResource which deploy a github repos and associated
 * resources such as badges, hooks, etc.
 *
 * @augments pulumi.ComponentResource
 * @implements {IGithubRepository} IGithubRepository
 */
export class GithubRepository extends pulumi.ComponentResource
    implements IGithubRepository {

    public name: string;

    public repo: github.Repository;

    public labels: IGithubRepositoryLabels = {};

    public deployKeys: IGithubRepositoryDeployKeys = {};

    public branches: IGithubRepositoryBranches = {};

    public protectedBranches: IGithubRepositoryProtectBranches = {};

    public protectedTags: IGithubRepositoryProtectTags = {};

    public secrets: IGithubRepositorySecrets = {};

    /**
     * Constructor of the ComponentResource GithubRepository
     *
     * @param {string} name - Name of the repo
     * @param {github.RepositoryArgs} args - Github repo arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     *      options
     */
    public constructor (
        name: string,
        args: IGithubRepositoryArgs,
        opts?: pulumi.ComponentResourceOptions
    ) {
        super(`github-repo:repo:${name}`, name, args, opts);
        this.name = name;
        this.repo = new github.Repository(
            name,
            args.repoConfig,
            {
                ...opts,
                "parent": this
            }
        );
        this.addRepositoryResources(args, opts);
        this.registerOutputs();
    }


    /**
     * Process every possible repo related resources.
     *
     * @param {IGithubRepositoryArgs} args - GithubRepository arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addRepositoryResources (
        args: IGithubRepositoryArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
        this.addLabels(args, opts);
        this.addSecrets(args, opts);
        this.addDeployKeys(args, opts);
        this.addBranches(args, opts);
        this.addProtectedBranches(args, opts);
        this.addProtectedTags(args, opts);
    }

    /**
     * Add labels to the object and create parent relationship
     *
     * @param {IGithubRepositoryArgs} args - This pulumi object arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addLabels (
        args: IGithubRepositoryArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
        for (const iLabel in args.labels) {
            if ("color" in args.labels[iLabel]) {
                const labelName = `${utils.slugify(iLabel)}`;
                this.labels[iLabel] = new github.IssueLabel(
                    labelName,
                    {
                        ...args.labels[iLabel],
                        "repository": this.repo.id
                    } as github.IssueLabelArgs,
                    {
                        ...opts,
                        "parent": this.repo
                    }
                );
            }
        }
    }


    /**
     * Add secrets to the object and create parent relationship
     *
     * @param {IGithubRepositoryArgs} args - This pulumi object arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addSecrets (
        args: IGithubRepositoryArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
        for (const iSecret in args.secrets) {
            if ("value" in args.secrets[iSecret]) {
                const secretName =
                    `${utils.slugify(iSecret)}`;
                this.secrets[iSecret] = new github.ActionsSecret(
                    secretName,
                    {
                        ...args.secrets[iSecret],
                        "repository": this.repo.id,
                        "secretName": iSecret,
                        "value": utils.getValue(
                            "value",
                            // eslint-disable-next-line max-len
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            args.secrets[iSecret].value as ProtectedData
                        )
                    } as github.ActionsSecretArgs,
                    {
                        ...opts,
                        "parent": this.repo
                    }
                );
            }
        }
    }

    /**
     * Add deployKeys to the object and create parent relationship
     *
     * @param {IGithubRepositoryArgs} args - This pulumi object arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addDeployKeys (
        args: IGithubRepositoryArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
        for (const iDeployKey in args.deployKeys) {
            if ("title" in args.deployKeys[iDeployKey]) {
                const deployKeyName =
                    `${utils.slugify(iDeployKey)}`;
                this.deployKeys[iDeployKey] = new github.RepositoryDeployKey(
                    deployKeyName,
                    {
                        ...args.deployKeys[iDeployKey],
                        "repository": this.repo.id
                    } as github.RepositoryDeployKeyArgs,
                    {
                        ...opts,
                        "parent": this.repo
                    }
                );
            }
        }
    }

    /**
     * Add branches to the object and create parent relationship
     *
     * @param {string} name - Name of the default branch
     * @param {github.Branch} parent - Parent branch object
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addDefaultBranch (
        name: string,
        parent: github.Branch,
        opts?: pulumi.ComponentResourceOptions
    ): github.BranchDefault {
        const defaultBranch = new github.BranchDefault(
            name,
            {
                "branch": name,
                "repository": this.repo.id
            } as github.BranchDefaultArgs,
            {
                ...opts,
                parent
            }
        );
        return defaultBranch;
    }


    /**
     * Add branches to the object and create parent relationship
     *
     * @param {IGithubRepositoryArgs} args - This pulumi object arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addBranches (
        args: IGithubRepositoryArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
        let defaultBranch = false;
        for (const iBranch in args.branches) {
            if ("branch" in args.branches[iBranch]) {
                const branchName =
                    `${utils.slugify(iBranch)}`;
                this.branches[iBranch] = new github.Branch(
                    branchName,
                    {
                        ...args.branches[iBranch],
                        "repository": this.repo.id
                    } as github.BranchArgs,
                    {
                        ...opts,
                        "parent": this.repo
                    }
                );
            }
            if (
                "default" in args.branches[iBranch] &&
                !defaultBranch
            ) {
                this.addDefaultBranch(iBranch, this.branches[iBranch], opts);
                defaultBranch = true;
            }
        }
    }

    /**
     * Add protectedBranches to the object and create parent relationship
     *
     * @param {IGithubRepositoryArgs} args - This pulumi object arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addProtectedBranches (
        args: IGithubRepositoryArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
        for (const iProtectedBranch in args.protectedBranches) {
            if ("pattern" in args.protectedBranches[iProtectedBranch]) {
                const protectedBranchName =
                    `${utils.slugify(iProtectedBranch)}`;
                this.protectedBranches[iProtectedBranch] =
                    new github.BranchProtection(
                        protectedBranchName,
                        {
                            ...args.protectedBranches[iProtectedBranch],
                            "repositoryId": this.repo.id
                        } as github.BranchProtectionArgs,
                        {
                            ...opts,
                            "parent": this.repo
                        }
                    );
            }
        }
    }

    /**
     * Add protectedTags to the object and create parent relationship
     *
     * @param {IGithubRepositoryArgs} args - This pulumi object arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addProtectedTags (
        args: IGithubRepositoryArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
        for (const iProtectedTag in args.protectedTags) {
            if ("pattern" in args.protectedTags[iProtectedTag]) {
                const protectedTagName =
                    `${utils.slugify(iProtectedTag)}`;
                this.protectedTags[iProtectedTag] =
                    new github.RepositoryTagProtection(
                        protectedTagName,
                        {
                            ...args.protectedTags[iProtectedTag],
                            "repository": this.repo.id
                        } as github.RepositoryTagProtectionArgs,
                        {
                            ...opts,
                            "parent": this.repo
                        }
                    );
            }
        }
    }

}
