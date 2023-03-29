export type BedCreationParams = {
    Id: number,
    roomId: number,
    textQR: string
}

export type BedPatchParams = {
    Id?: number,
    roomId?: number,
    textQR?: string
}