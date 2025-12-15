import { minikitConfig } from '@/minikit.config';

export async function GET() {
    // Use 'frame' key to match working base-wrapped pattern
    const manifest = {
        accountAssociation: minikitConfig.accountAssociation,
        frame: minikitConfig.miniapp,
    };

    return Response.json(manifest);
}
