import type * as github from "@pulumi/github";
import type * as githubProvider from "./github";
import type * as pulumi from "@pulumi/pulumi";
import type {
    ProtectedData
} from "../utils";

// Interface
export interface ProviderData {
    args: ProviderConfigArgs;
    opts: pulumi.CustomResourceOptions;
}

export interface ProviderConfigArgs {
    username: string;
    url?: URL;
    config: github.ProviderArgs;
}

export interface ProviderConfig {
    baseUrl?: string;
    token: ProtectedData;
}

export interface ProviderPulumiConfig {
    username: string;
    config: ProviderConfig;
}

export interface ProvidersPulumiConfig {
    [key: string]: ProviderPulumiConfig;
}

export interface ProvidersDict {
    [key: string]: githubProvider.GithubProvider;
}
