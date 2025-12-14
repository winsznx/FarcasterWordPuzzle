import { minikitConfig } from '@/minikit.config';

export async function GET() {
    // Return the manifest with all fields populated
    const manifest = {
        accountAssociation: minikitConfig.accountAssociation,
        miniapp: minikitConfig.miniapp,
        // For backward compatibility
        frame: minikitConfig.miniapp,
    };

    return Response.json(manifest);
}
