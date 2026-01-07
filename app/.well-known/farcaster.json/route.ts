import { minikitConfig } from '@/minikit.config';

export async function GET() {
    // Use 'miniapp' key as per official Farcaster spec
    // Also include 'frame' for backward compatibility
    const manifest = {
        accountAssociation: minikitConfig.accountAssociation,
        miniapp: minikitConfig.miniapp,
        // Backward compatibility
        frame: minikitConfig.miniapp,
    };

    return Response.json(manifest);
}
