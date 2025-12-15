import { minikitConfig } from '@/minikit.config';

export async function GET() {
    // Return the manifest with miniapp key (per latest spec)
    const manifest = {
        accountAssociation: minikitConfig.accountAssociation,
        miniapp: minikitConfig.miniapp,
    };

    return Response.json(manifest);
}
