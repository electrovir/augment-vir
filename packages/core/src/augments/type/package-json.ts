// cspell:words preuninstall postuninstall preversion postversion posttest prestop poststop prestart poststart prerestart postrestart libc opencollective
import {type JsonObject, type JsonValue} from '../json/json-value.js';
import {type LiteralUnion} from './literal-union.js';

type Person =
    | string
    | {
          name: string;
          url?: string;
          email?: string;
      };

type BugsLocation =
    | string
    | {
          url?: string;
          email?: string;
      };

type DirectoryLocations = {
    [directoryType: string]: JsonValue | undefined;
    bin?: string;
    doc?: string;
    example?: string;
    lib?: string;
    man?: string;
    test?: string;
};

type Scripts = {
    prepublish?: string;
    prepare?: string;
    prepublishOnly?: string;
    prepack?: string;
    postpack?: string;
    publish?: string;
    postpublish?: string;
    preinstall?: string;
    install?: string;
    postinstall?: string;
    preuninstall?: string;
    uninstall?: string;
    postuninstall?: string;
    preversion?: string;
    version?: string;
    postversion?: string;
    pretest?: string;
    test?: string;
    posttest?: string;
    prestop?: string;
    stop?: string;
    poststop?: string;
    prestart?: string;
    start?: string;
    poststart?: string;
    prerestart?: string;
    restart?: string;
    postrestart?: string;
} & Partial<Record<string, string>>;

type Dependency = Partial<Record<string, string>>;

type DependencyOverrides = {
    [packageName in string]: string | undefined | DependencyOverrides;
};

type DevEngineDependency = {
    name: string;
    version?: string;
    onFail?: 'ignore' | 'warn' | 'error' | 'download';
};

type ExportConditions = {
    [condition: string]: Exports;
};

type Exports = null | string | Array<string | ExportConditions> | ExportConditions;

type Imports = {
    [key: `#${string}`]: Exports;
};

type NonStandardEntryPoints = {
    module?: string;
    esnext?:
        | string
        | {
              [moduleName: string]: string | undefined;
              main?: string;
              browser?: string;
          };
    browser?: string | Partial<Record<string, string | false>>;
    sideEffects?: boolean | string[];
};

type TypeScriptConfiguration = {
    types?: string;
    typesVersions?: Partial<Record<string, Partial<Record<string, string[]>>>>;
    typings?: string;
};

type WorkspaceConfig = {
    packages?: string[];
    nohoist?: string[];
};

type YarnConfiguration = {
    flat?: boolean;
    resolutions?: Dependency;
};

type JSPMConfiguration = {
    jspm?: PackageJson;
};

type PublishConfig = {
    [additionalProperties: string]: JsonValue | undefined;
    access?: 'public' | 'restricted';
    registry?: string;
    tag?: string;
};

type NodeJsStandard = {
    packageManager?: string;
};

type PackageJsonStandard = {
    name?: string;
    version?: string;
    description?: string;
    keywords?: string[];
    homepage?: LiteralUnion<'.', string>;
    bugs?: BugsLocation;
    license?: string;
    licenses?: Array<{
        type?: string;
        url?: string;
    }>;
    author?: Person;
    contributors?: Person[];
    maintainers?: Person[];
    files?: string[];
    type?: 'module' | 'commonjs';
    main?: string;
    exports?: Exports;
    imports?: Imports;
    bin?: string | Partial<Record<string, string>>;
    man?: string | string[];
    directories?: DirectoryLocations;
    repository?:
        | string
        | {
              type: string;
              url: string;
              directory?: string;
          };
    scripts?: Scripts;
    config?: JsonObject;
    dependencies?: Dependency;
    devDependencies?: Dependency;
    optionalDependencies?: Dependency;
    peerDependencies?: Dependency;
    peerDependenciesMeta?: Partial<Record<string, {optional: true}>>;
    bundledDependencies?: string[];
    bundleDependencies?: string[];
    overrides?: DependencyOverrides;
    engines?: {
        [EngineName in LiteralUnion<'npm' | 'node', string>]?: string;
    };
    engineStrict?: boolean;
    os?: Array<
        LiteralUnion<
            | 'aix'
            | 'darwin'
            | 'freebsd'
            | 'linux'
            | 'openbsd'
            | 'sunos'
            | 'win32'
            | '!aix'
            | '!darwin'
            | '!freebsd'
            | '!linux'
            | '!openbsd'
            | '!sunos'
            | '!win32',
            string
        >
    >;
    cpu?: Array<
        LiteralUnion<
            | 'arm'
            | 'arm64'
            | 'ia32'
            | 'mips'
            | 'mipsel'
            | 'ppc'
            | 'ppc64'
            | 's390'
            | 's390x'
            | 'x32'
            | 'x64'
            | '!arm'
            | '!arm64'
            | '!ia32'
            | '!mips'
            | '!mipsel'
            | '!ppc'
            | '!ppc64'
            | '!s390'
            | '!s390x'
            | '!x32'
            | '!x64',
            string
        >
    >;
    devEngines?: {
        os?: DevEngineDependency | DevEngineDependency[];
        cpu?: DevEngineDependency | DevEngineDependency[];
        libc?: DevEngineDependency | DevEngineDependency[];
        runtime?: DevEngineDependency | DevEngineDependency[];
        packageManager?: DevEngineDependency | DevEngineDependency[];
    };
    preferGlobal?: boolean;
    private?: boolean;
    publishConfig?: PublishConfig;
    funding?:
        | string
        | {
              type?: LiteralUnion<
                  | 'github'
                  | 'opencollective'
                  | 'patreon'
                  | 'individual'
                  | 'foundation'
                  | 'corporation',
                  string
              >;
              url: string;
          };
    workspaces?: string[] | WorkspaceConfig;
};

/**
 * Type for [npm's `package.json` file](https://docs.npmjs.com/creating-a-package-json-file). Also
 * includes types for fields used by other popular projects, like TypeScript and Yarn.
 *
 * Copied from the `PackageJson` type in the `type-fest` package so that this package's public types
 * do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category File
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PackageJson = JsonObject &
    NodeJsStandard &
    PackageJsonStandard &
    NonStandardEntryPoints &
    TypeScriptConfiguration &
    YarnConfiguration &
    JSPMConfiguration;
