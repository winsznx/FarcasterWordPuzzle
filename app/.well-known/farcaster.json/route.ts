import { minikitConfig } from '../../../minikit.config';

export async function GET() {
    // Official Farcaster Mini App Manifest Specification
    // See: https://docs.farcaster.xyz/developers/frames/v2/spec
    const manifest = {
        accountAssociation: minikitConfig.accountAssociation,
        miniapp: {
            version: minikitConfig.miniapp.version,
            name: minikitConfig.miniapp.name,
            iconUrl: minikitConfig.miniapp.iconUrl,
            homeUrl: minikitConfig.miniapp.homeUrl,
            imageUrl: minikitConfig.miniapp.imageUrl,
            buttonTitle: minikitConfig.miniapp.buttonTitle,
            splashImageUrl: minikitConfig.miniapp.splashImageUrl,
            splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
            webhookUrl: minikitConfig.miniapp.webhookUrl,
        },
    };

    return Response.json(manifest);
}
