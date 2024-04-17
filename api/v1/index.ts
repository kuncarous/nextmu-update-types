import { ObjectId } from "mongodb";
import { z } from "zod";

export enum OperatingSystems {
    Windows,
    Linux,
    MacOS,
    WindowsMobile,
    Android,
    iOS,
    Max = iOS,
};

export enum TextureFormat {
    eUncompressed,
    BC3,
    BC7,
    ETC2,
    ASTC,
    Max = ASTC,
}

export enum VersionType {
    Revision = 0,
    Minor = 1,
    Major = 2,
};

export enum VersionState {
    Pending = 0,
    Ready = 1,
};

export const VersionRegex = /^(\d){1,2}\.(\d){1,3}\.(\d){1,5}$/;

export const ZCreateVersionRequest = z.object(
    {
        type: z.coerce.number().int().min(VersionType.Revision).max(VersionType.Major),
        description: z.string().min(1).max(256),
    }
);
export type ICreateVersionRequest = z.infer<typeof ZCreateVersionRequest>;

export const ZCreateVersionResponse = z.object(
    {
        id: z.string().refine(value => ObjectId.isValid(value)),
        version: z.string().regex(VersionRegex),
    }
);
export type ICreateVersionResponse = z.infer<typeof ZCreateVersionResponse>;

export const ZEditVersionRequest = z.object(
    {
        id: z.string().refine(value => ObjectId.isValid(value)),
        description: z.string().min(1).max(256),
    }
);
export type IEditVersionRequest = z.infer<typeof ZEditVersionRequest>;

export const ZEditVersionResponse = z.object(
    {
        success: z.boolean(),
    }
);
export type IEditVersionResponse = z.infer<typeof ZEditVersionResponse>;

export const ZProcessVersionRequest = z.object(
    {
        id: z.string().refine(value => ObjectId.isValid(value)),
    }
);
export type IProcessVersionRequest = z.infer<typeof ZProcessVersionRequest>;

export const ZFetchVersionRequest = z.object(
    {
        id: z.string().refine(value => ObjectId.isValid(value)),
    }
);
export type IFetchVersionRequest = z.infer<typeof ZFetchVersionRequest>;

export const ZFetchVersionResponse = z.object(
    {
        id: z.string().refine(value => ObjectId.isValid(value)),
        version: z.string().regex(VersionRegex),
        description: z.string(),
        state: z.nativeEnum(VersionState),
        filesCount: z.coerce.number().int().min(0),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
    }
);
export type IFetchVersionResponse = z.infer<typeof ZFetchVersionResponse>;

export const ZListVersionsRequest = z.object(
    {
        page: z.number().int().min(0),
        size: z.coerce.number().int().min(4).max(50),
    }
);
export type IListVersionsRequest = z.infer<typeof ZListVersionsRequest>;

export const ZListVersionsResponse = z.object(
    {
        data: z.array(ZFetchVersionResponse),
        count: z.coerce.number().int().min(0),
    }
);
export type IListVersionsResponse = z.infer<typeof ZListVersionsResponse>;

export const ZRetrieveUpdateRequest = z.object(
    {
        version: z.string().regex(VersionRegex),
        os: z.coerce.number().int().min(0).max(OperatingSystems.Max),
        texture: z.coerce.number().int().min(0).max(TextureFormat.Max),
    }
);
export type IRetrieveUpdateRequest = z.infer<typeof ZRetrieveUpdateRequest>;

export const ZRetrieveUpdateResponse = z.object(
    {
        version: z.string().regex(VersionRegex),
        files: z.array(
            z.object(
                {
                    UrlPath: z.string(),
                    LocalPath: z.string(),
                    Filename: z.string(),
                    Extension: z.string(),
                    PackedSize: z.coerce.number().int().min(0),
                    OriginalSize: z.coerce.number().int().min(0),
                    CRC32: z.string(),
                }
            )
        )
    }
);
export type IRetrieveUpdateResponse = z.infer<typeof ZRetrieveUpdateResponse>;