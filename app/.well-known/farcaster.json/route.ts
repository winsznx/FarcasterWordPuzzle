import { minikitConfig } from '@/minikit.config';

export async function GET() {
    // Return the manifest with frame key (standard format)
    const manifest = {
        accountAssociation: minikitConfig.accountAssociation,
        frame: minikitConfig.miniapp,
    };

    return Response.json(manifest);
}

